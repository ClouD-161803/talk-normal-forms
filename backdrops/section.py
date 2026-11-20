"""The backdrop section: the surface of section of the Henon-Heiles Hamiltonian at the energy 1/12.

The Hamiltonian is :math:`H = (p_x^2 + p_y^2 + x^2 + y^2)/2 + x^2 y - y^3/3`. At
:math:`H = E = 1/12`, the orbits cross the plane :math:`(y, p_y)` at :math:`x = 0` with
:math:`p_x > 0`, inside the boundary :math:`p_y^2/2 + y^2/2 - y^3/3 = E`.
`Gustavson 1966 <https://doi.org/10.1086/110172>`_ compared this section with the level curves of
the formal integral of a normal form of :math:`H` at the origin. Each orbit is integrated with RK4
at a fixed step, and each crossing is located on :math:`x = 0` with the method of
`Henon 1982 <https://doi.org/10.1016/0167-2789(82)90034-3>`_, i.e. one RK4 step with :math:`x` as
the independent variable. The crossings of a regular orbit lie on a closed curve but arrive out of
order. They are ordered as the shortest closed polyline found from a chain of nearest neighbors
improved with 2-opt moves. An orbit is dropped when this polyline turns sharply or has a long
gap, e.g. a chaotic orbit or a chain of islands.

Run it with a Python that has numpy: ``python backdrops/section.py``. It writes
``backdrops/section.js``, whose clock is in seconds.
"""

import json
import math
from pathlib import Path

import numpy as np

OUT = Path(__file__).resolve().with_suffix(".js")
ENERGY = 1 / 12
STEP = 0.01
CROSSINGS = 240


def field(state):
    x, y, px, py = state
    return np.array([px, py, -x - 2 * x * y, -y - x**2 + y**2])


def field_in_x(state):
    """The field of the orbits with :math:`x` as the independent variable, valid where
    :math:`p_x \\neq 0`."""
    return field(state) / state[2]


def rk4(f, state, step):
    k1 = f(state)
    k2 = f(state + 0.5 * step * k1)
    k3 = f(state + 0.5 * step * k2)
    k4 = f(state + step * k3)
    return state + step * (k1 + 2 * k2 + 2 * k3 + k4) / 6


def energy(state):
    x, y, px, py = state
    return (px**2 + py**2 + x**2 + y**2) / 2 + x**2 * y - y**3 / 3


def crossings(y, py):
    """Returns the crossings of the orbits from :math:`(0, y, p_x, p_y)` with the section, in an
    array of shape (crossing, axis, orbit) of the axes :math:`y` and :math:`p_y`, and the largest
    error of the energy at a crossing."""
    px = np.sqrt(2 * ENERGY - py**2 - y**2 + 2 * y**3 / 3)
    state = np.array([np.zeros_like(y), y, px, py])
    found = [[s] for s in state[[1, 3]].T]
    largest_error = 0.0
    while min(len(f) for f in found) < CROSSINGS:
        new = rk4(field, state, STEP)
        crossed = (state[0] < 0) & (new[0] >= 0)
        if crossed.any():
            onto = rk4(field_in_x, new[:, crossed], -new[0, crossed])
            largest_error = max(largest_error, np.abs(energy(onto) - ENERGY).max())
            for k, s in zip(np.flatnonzero(crossed), onto[[1, 3]].T):
                found[k].append(s)
        state = new
    return np.array([f[:CROSSINGS] for f in found]).transpose(1, 2, 0), largest_error


def by_nearest(points):
    left, chain = list(range(1, len(points))), [0]
    while left:
        gaps = np.hypot(*(points[left] - points[chain[-1]]).T)
        chain.append(left.pop(int(np.argmin(gaps))))
    return np.array(chain)


def two_opt(points, tour):
    """Returns the closed tour ``tour`` of ``points`` after 2-opt moves, i.e. reversals of a
    stretch of the tour, until no reversal shortens it."""
    improved = True
    while improved:
        improved = False
        for i in range(len(tour) - 2):
            a, b = points[tour[i]], points[tour[i + 1]]
            c, d = points[tour[i + 2:]], points[np.roll(tour, -1)[i + 2:]]
            gain = (np.hypot(*(a - b)) + np.hypot(*(c - d).T)
                    - np.hypot(*(a - c).T) - np.hypot(*(b - d).T))
            j = int(np.argmax(gain))
            if gain[j] > 1e-12:
                tour[i + 1:i + 3 + j] = tour[i + 1:i + 3 + j][::-1].copy()
                improved = True
    return tour


def curve(points):
    """Returns the crossings ``points`` of one orbit as one closed polyline, or None when the
    polyline is not a clean closed curve, i.e. when it turns by more than 45 degrees at a point or
    has a step longer than 6 percent of its length."""
    ordered = points[two_opt(points, by_nearest(points))]
    ordered = np.concatenate([ordered, ordered[:1]])
    step = np.diff(ordered, axis=0)
    length = np.hypot(*step.T)
    after = np.roll(step, -1, axis=0)
    turn = np.arccos(np.clip((step * after).sum(axis=1) / (length * np.roll(length, -1)), -1, 1))
    if turn.max() > math.radians(45) or length.max() > 0.06 * length.sum():
        return None
    return ordered


def seeds():
    """Returns the starting points :math:`(y, p_y)` of the orbits, on one side of the center of
    each of the four islands, at about :math:`(-0.3045, 0)`, :math:`(0.2548, 0)`, and
    :math:`(0, \\pm 0.204)`, and whether each orbit is about the island at :math:`(0.2548, 0)`."""
    left = np.linspace(-0.294, -0.13, 12)
    right = np.linspace(0.268, 0.472, 14)
    up = np.linspace(0.214, 0.266, 5)
    y = np.concatenate([left, right, np.zeros(2 * len(up))])
    py = np.concatenate([np.zeros(len(left) + len(right)), up, -up])
    return y, py, (y > 0.2)


def boundary():
    """Returns the boundary :math:`p_y^2/2 + y^2/2 - y^3/3 = E` of the section as a closed
    polyline, between its ends at :math:`y = (1 - \\sqrt 3)/2` and :math:`y = 1/2` on the axis
    :math:`p_y = 0`."""
    angle = np.linspace(0, math.pi, 61)
    low, high = (1 - math.sqrt(3)) / 2, 0.5
    y = (low + high) / 2 - (high - low) / 2 * np.cos(angle)
    py = np.sqrt(np.maximum(2 * ENERGY - y**2 + 2 * y**3 / 3, 0))
    upper = np.stack([y, py], axis=1)
    return np.concatenate([upper, (upper * [1, -1])[-2::-1]])


def thinned(points, spacing):
    """Returns the points of the closed polyline ``points`` that are at least ``spacing`` apart
    along it, with the first and last point kept."""
    along = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(points, axis=0).T))])
    keep = np.flatnonzero(np.diff(np.floor(along / spacing), prepend=-1) > 0)
    return points[np.union1d(keep, [len(points) - 1])]


def rounded(points):
    return [[round(float(x), 4), round(float(y), 4)] for x, y in points]


def timed(points, start, duration, alpha, tone, weight=1.0):
    clock = np.linspace(0, duration, len(points))
    return {"points": rounded(points), "t": [round(float(c), 3) for c in clock], "start": start,
            "tone": tone, "alpha": alpha, "weight": weight}


def main():
    y, py, right = seeds()
    points, largest_error = crossings(y, py)
    curves = [curve(points[:, :, k]) for k in range(points.shape[2])]
    kept = [k for k, c in enumerate(curves) if c is not None]
    length = {k: np.hypot(*np.diff(curves[k], axis=0).T).sum() for k in kept}
    kept.sort(key=length.get)

    trajectories = [timed(boundary(), 0.0, 2.5, 0.45, "text")]
    for n, k in enumerate(kept):
        drawn = thinned(curves[k], max(length[k] / 160, 0.003))
        tone, alpha = ("orange", 0.85) if right[k] else ("violet", 0.65)
        trajectories.append(timed(drawn, 1.0 + 5.0 * n / len(kept), 2.5, alpha, tone))

    text = json.dumps({"families": trajectories}, separators=(",", ":"))
    OUT.write_text("Beeson.trajectories(" + text + ");\n")
    count = sum(len(t["points"]) for t in trajectories)
    print(f"{len(trajectories)} trajectories, {count} points, {OUT.stat().st_size} bytes")
    print(f"{len(kept)} of {len(curves)} orbits kept, dropped from (y, p_y) "
          + ", ".join(f"({y[k]:.3f}, {py[k]:.3f})" for k, c in enumerate(curves) if c is None))
    print(f"largest energy error at a crossing {largest_error:.1e}")


if __name__ == "__main__":
    main()
