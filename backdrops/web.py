"""The backdrop web: the action-angle coordinates of the pendulum, drawn as a web.

The pendulum is :math:`H = p^2/2 - \\cos q`. Inside the separatrix :math:`p = \\pm 2 \\cos(q/2)`,
each level curve of :math:`H` through :math:`(q_0, 0)`, where :math:`q_0` is the amplitude in rad,
is a curve of constant action :math:`I`. Its period is :math:`T = 4 K(m)`, where
:math:`m = \\sin^2(q_0/2)` and :math:`K` is the complete elliptic integral of the first kind,
computed with the arithmetic-geometric mean as in ``data/pendulum.py``. The angle
:math:`\\varphi = 2 \\pi t / T` is measured from :math:`(q_0, 0)`, where :math:`t` is the time along
the level curve. The drawing is made of a few curves of constant :math:`I`, the curves of
constant :math:`\\varphi` that join the points at the same fraction of the period on each level
curve, the separatrix, and a few rotation curves outside the separatrix. Near the equilibrium the
web is a polar grid. Toward the separatrix the curves of constant :math:`\\varphi` bend into the
saddle points at :math:`q = \\pm \\pi`, since the period diverges there.

Run it with a Python that has numpy: ``python backdrops/web.py``. It writes ``backdrops/web.js``,
whose clock is in seconds.
"""

import json
import math
from pathlib import Path

import numpy as np

OUT = Path(__file__).resolve().with_suffix(".js")
RINGS = [0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.08]
SPOKES = 24
SAMPLES = 192
STEPS_PER_SAMPLE = 64
ROTATION_ENERGIES = [1.2, 1.8, 2.8]
REACH = 0.6


def pendulum_field(state):
    q, p = state
    return np.array([p, -np.sin(q)])


def complete_elliptic_k(m):
    a, b = 1.0, math.sqrt(1 - m)
    while abs(a - b) > 1e-15:
        a, b = (a + b) / 2, math.sqrt(a * b)
    return math.pi / (2 * a)


def level_curves(amplitudes):
    """Returns the level curves of :math:`H` through :math:`(q_0, 0)`, where :math:`q_0` is each
    of ``amplitudes``, with SAMPLES + 1 points at equal fractions of the period, in an array of
    shape (point, axis, curve)."""
    periods = np.array([4 * complete_elliptic_k(math.sin(a / 2) ** 2) for a in amplitudes])
    step = periods / (SAMPLES * STEPS_PER_SAMPLE)
    state = np.array([amplitudes, np.zeros_like(amplitudes)])
    path = [state]
    for k in range(SAMPLES * STEPS_PER_SAMPLE):
        k1 = pendulum_field(state)
        k2 = pendulum_field(state + 0.5 * step * k1)
        k3 = pendulum_field(state + 0.5 * step * k2)
        k4 = pendulum_field(state + step * k3)
        state = state + step * (k1 + 2 * k2 + 2 * k3 + k4) / 6
        if (k + 1) % STEPS_PER_SAMPLE == 0:
            path.append(state)
    return np.array(path)


def spoke_amplitudes():
    """Returns the amplitudes along each curve of constant angle, dense toward the separatrix, where
    :math:`1 - m` falls to :math:`10^{-7}`."""
    inner = np.linspace(0.0, 2.6, 27)[1:]
    gap = np.logspace(math.log10(math.cos(1.3) ** 2), -7, 40)[1:]
    return np.concatenate([inner, 2 * np.arcsin(np.sqrt(1 - gap))])


def rounded(points):
    return [[round(float(x), 4), round(float(y), 4)] for x, y in points]


def timed(points, clock, start, alpha, tone, weight=1.0):
    return {"points": rounded(points), "t": [round(float(c), 3) for c in clock], "start": start,
            "tone": tone, "alpha": alpha, "weight": weight}


def energy_curve(energy, q):
    """Returns the upper branch :math:`p = \\sqrt{2 (E + \\cos q)}` of the level curve of energy
    :math:`E`, signed by :math:`\\cos(q/2)` on the separatrix, :math:`E = 1`, so that its branches
    cross at the saddle points."""
    if energy == 1:
        return np.stack([q, 2 * np.cos(q / 2)], axis=1)
    return np.stack([q, np.sqrt(2 * (energy + np.cos(q)))], axis=1)


def main():
    rings = level_curves(np.array(RINGS))
    spokes = level_curves(spoke_amplitudes())
    origin = np.zeros((1, 2))

    trajectories = []
    q = np.linspace(-math.pi - REACH, math.pi + REACH, 49)
    for energy in [1] + ROTATION_ENERGIES:
        upper = energy_curve(energy, q)
        alpha = 0.4 if energy == 1 else 0.18
        for branch in (upper, -upper[::-1]):
            trajectories.append(timed(branch, np.linspace(0, 2.0, len(q)), 0.0 if energy == 1 else 8.0,
                                      alpha, "text"))
    for i in range(0, SAMPLES, SAMPLES // SPOKES):
        spoke = np.concatenate([origin, spokes[i].T])
        reach = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(spoke, axis=0).T))])
        trajectories.append(timed(spoke, 2.6 * reach / reach[-1], 0.8, 0.6, "orange"))
    for j in range(len(RINGS)):
        clock = np.linspace(0, 3.6, SAMPLES + 1)
        trajectories.append(timed(rings[:, :, j], clock, 3.8 + 0.12 * j, 0.8, "violet"))

    text = json.dumps({"families": trajectories}, separators=(",", ":"))
    OUT.write_text("Beeson.trajectories(" + text + ");\n")
    points = sum(len(t["points"]) for t in trajectories)
    print(f"{len(trajectories)} trajectories, {points} points, {OUT.stat().st_size} bytes")

    for name, curves, amplitudes in (("ring", rings, np.array(RINGS)), ("spoke", spokes, spoke_amplitudes())):
        energy = curves[:, 1] ** 2 / 2 - np.cos(curves[:, 0])
        closure = np.hypot(*(curves[-1] - curves[0]))
        quarter = curves[SAMPLES // 4]
        print(f"{name}s: largest closure error {closure.max():.1e}, energy drift {np.ptp(energy, axis=0).max():.1e}, "
              f"largest |q| at a quarter period {np.abs(quarter[0]).max():.1e}, "
              f"outermost 1 - m {math.cos(amplitudes[-1] / 2) ** 2:.1e}")


if __name__ == "__main__":
    main()
