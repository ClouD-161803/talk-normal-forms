"""The backdrop cloud: a Gaussian carried by the flow in the saddle plane of a normal form.

In the normal form at a hyperbolic equilibrium point or periodic orbit, the saddle pair moves as
:math:`q_1(t) = q_1(0) e^{\\Lambda t}` and :math:`p_1(t) = p_1(0) e^{-\\Lambda t}`, where
:math:`\\Lambda = \\lambda + a I_1` depends on the saddle action :math:`I_1 = q_1 p_1`, which is
conserved. This is the flow of :math:`H = \\lambda I_1 + a I_1^2 / 2`. The drawing shows, in the plane
:math:`(q_1, p_1)`, the hyperbolas :math:`q_1 p_1 = c`, the unstable manifold :math:`p_1 = 0` and the
stable manifold :math:`q_1 = 0`, and the images at equally spaced times of the :math:`1\\sigma` and
:math:`2\\sigma` contours of a Gaussian that starts as circles around CENTER. With :math:`a = 0` each
image is an ellipse. With :math:`a \\ne 0` the points of larger :math:`I_1` run faster, hence each
image bends. The paths of a dozen members drawn from the Gaussian follow their hyperbolas.

LAMBDA, CURVATURE, CENTER, and SIGMA are chosen for the drawing, not taken from a model. The plane
is turned by 45 degrees, hence the unstable manifold runs to the upper right. The clock of the file
is in seconds of the trace.

Run it with a Python that has numpy: ``python backdrops/cloud.py``.
"""

import json
from pathlib import Path

import numpy as np

OUT = Path(__file__).with_suffix(".js")
LAMBDA, CURVATURE = 1.0, 0.4
CENTER, SIGMA = np.array([0.5, 1.1]), 0.2
END, IMAGES = 1.05, 6
REACH = 3.4
LEVELS = [0.1, 0.4, 0.9, 1.6, 2.5]
MEMBERS, SEED = 12, 7
SECONDS_PER_UNIT = 7.5
# outer radius, in units of REACH, and opacity of each band of the hyperbolas and the axes around the
# origin. the opacity is ((1 - r) / 0.4)^2 at the middle radius r of each band beyond 0.6
BANDS = [(0.6, 1.0), (0.68, 0.81), (0.76, 0.49), (0.84, 0.25), (0.92, 0.09), (1.0, 0.02)]
FLOW_START = 2.6


def turned(q1, p1):
    return np.column_stack([(q1 - p1) / np.sqrt(2), (q1 + p1) / np.sqrt(2)])


def flow(q1, p1, t, curvature=CURVATURE):
    rate = LAMBDA + curvature * q1 * p1
    return q1 * np.exp(rate * t), p1 * np.exp(-rate * t)


def rounded(points):
    return np.round(np.asarray(points), 4).tolist()


def hyperbola(c, quadrant):
    """Returns the branch of :math:`q_1 p_1 = c` in the quadrant with the signs quadrant, cut at the
    radius REACH and ordered along the flow."""
    root = np.sqrt(abs(c))
    edge = np.arccosh(max(REACH**2 / (2 * abs(c)), 1)) / 2
    s = np.linspace(-edge, edge, 81)
    return turned(quadrant[0] * root * np.exp(s), quadrant[1] * root * np.exp(-s))


def banded(points, start, duration, look):
    """Returns the pieces of the polyline points, cut where its segments cross from one band of
    BANDS to the next, each at the opacity of its band, and traced in duration seconds from start."""
    middles = np.hypot(*((points[1:] + points[:-1]) / 2).T) / REACH
    bands = np.searchsorted([r for r, _ in BANDS], np.minimum(middles, 1))
    cuts = [0] + [i + 1 for i in range(len(bands) - 1) if bands[i + 1] != bands[i]] + [len(bands)]
    out = []
    for a, b in zip(cuts, cuts[1:]):
        out.append({"points": rounded(points[a:b + 1]),
                    "t": np.round(np.linspace(0, duration * (b - a) / len(bands), b - a + 1), 3).tolist(),
                    "start": round(start + duration * a / len(bands), 3),
                    **look, "alpha": round(look["alpha"] * BANDS[bands[a]][1], 3)})
    return out


def contour(level, t):
    angles = np.linspace(0, 2 * np.pi, 241)
    q1, p1 = CENTER[0] + level * SIGMA * np.cos(angles), CENTER[1] + level * SIGMA * np.sin(angles)
    return turned(*flow(q1, p1, t))


def families():
    out = []
    for i, c in enumerate(LEVELS):
        for j, quadrant in enumerate([(1, 1), (-1, -1), (1, -1), (-1, 1)]):
            out += banded(hyperbola(c, quadrant), 0.15 * i + 0.05 * j, 1.4,
                          {"kind": "level", "c": c * quadrant[0] * quadrant[1], "tone": "text", "alpha": 0.24})
    ray = np.linspace(0, REACH, 33)
    for sign in (1, -1):
        out += banded(turned(0 * ray, sign * ray[::-1]), 1.0, 1.2,
                      {"kind": "stable", "tone": "violet", "alpha": 0.75, "weight": 1.2})
        out += banded(turned(sign * ray, 0 * ray), 1.2, 1.2,
                      {"kind": "unstable", "tone": "orange", "alpha": 0.75, "weight": 1.2})
    for k, t in enumerate(np.linspace(0, END, IMAGES)):
        for level, alpha, weight in [(1, 0.9, 1.3), (2, 0.5, 1)]:
            points = contour(level, t)
            out.append({"points": rounded(points), "t": np.round(np.linspace(0, 0.7, len(points)), 3).tolist(),
                        "start": round(FLOW_START + t * SECONDS_PER_UNIT, 3), "kind": "contour", "sigma": level,
                        "time": round(float(t), 4), "tone": "text", "alpha": alpha, "weight": weight})
    rng = np.random.default_rng(SEED)
    times = np.linspace(0, END, 61)
    for q1, p1 in CENTER + SIGMA * rng.standard_normal((MEMBERS, 2)):
        points = turned(*flow(q1, p1, times))
        out.append({"points": rounded(points), "t": np.round(times * SECONDS_PER_UNIT, 3).tolist(),
                    "start": FLOW_START, "kind": "member", "tone": "orange", "alpha": 0.6, "head": 1.6})
    return out


def check():
    """Checks that flow keeps the saddle action, solves the equations of motion of
    :math:`H = \\lambda I_1 + a I_1^2 / 2`, and maps the contours to ellipses when the curvature is
    zero, and that the hyperbolas end at the radius REACH."""
    q1, p1 = np.array([0.3, -0.2, 0.5]), np.array([0.7, 0.4, -0.1])
    q, p = flow(q1, p1, 0.8)
    assert np.allclose(q * p, q1 * p1)
    h = 1e-6
    dq, dp = (np.array(flow(q, p, h)) - np.array([q, p])) / h
    rate = LAMBDA + CURVATURE * q * p
    assert np.allclose(dq, rate * q, atol=1e-4) and np.allclose(dp, -rate * p, atol=1e-4)
    for c in LEVELS:
        assert abs(np.hypot(*hyperbola(c, (1, 1))[-1]) - REACH) < 1e-6
    q, p = flow(CENTER[0] + SIGMA * np.cos(np.arange(5.0)), CENTER[1] + SIGMA * np.sin(np.arange(5.0)), END, 0.0)
    centre = CENTER * np.exp([LAMBDA * END, -LAMBDA * END])
    axes = SIGMA * np.exp([LAMBDA * END, -LAMBDA * END])
    assert np.allclose(((q - centre[0]) / axes[0]) ** 2 + ((p - centre[1]) / axes[1]) ** 2, 1)


if __name__ == "__main__":
    check()
    trajectories = families()
    text = "Beeson.trajectories(" + json.dumps({"families": trajectories}, separators=(",", ":")) + ");\n"
    OUT.write_text(text)
    points = sum(len(r["points"]) for r in trajectories)
    last = max(r["start"] + r["t"][-1] for r in trajectories)
    print(f"{len(trajectories)} trajectories, {points} points, {len(text)} bytes, last time {last:.2f} s")
