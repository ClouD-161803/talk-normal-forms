"""The backdrop flow: the change to the normal form of the pendulum, drawn as a flow.

The pendulum is :math:`H = p^2/2 - \\cos q`. Its normal form up to degree 4 is reached with the
generating function :math:`G_4 = q p (5 q^2 + 3 p^2) / 192`, as in ``data/pendulum.py``. The flow
of :math:`G_4` for the time :math:`-1` maps :math:`(q, p)` to the normal-form coordinates, in
which the level curves of :math:`\\bar H = I - I^2/16` are circles. The drawing is made of the
level curves of :math:`H` at amplitudes from 0.4 to 2.6 rad, the separatrix
:math:`p = \\pm 2 \\cos(q/2)`, the image of each level curve in the normal form, and the flow lines
of :math:`G_4` from a subset of the points of each level curve to their images. The images of the
large level curves are not circles, since the normal form is valid only near the equilibrium.

Run it with a Python that has numpy: ``python backdrops/flow.py``. It writes ``backdrops/flow.js``,
whose clock is in seconds.
"""

import json
import math
from pathlib import Path

import numpy as np

OUT = Path(__file__).resolve().with_suffix(".js")
AMPLITUDES = [0.5, 1.0, 1.5, 2.0, 2.3, 2.6]
REACH = 0.6
SAMPLES = 96
FLOW_LINE_EVERY = 3


def pendulum_field(state):
    q, p = state
    return np.array([p, -np.sin(q)])


def generating_field(state):
    q, p = state
    return np.array([q * (5 * q**2 + 9 * p**2) / 192, -p * (15 * q**2 + 3 * p**2) / 192])


def rk4_path(field, state, step, steps):
    """Returns the states after each of ``steps`` steps of RK4, with ``state`` first. The
    ``step`` may be an array, with one step per column of ``state``."""
    path = [state]
    for _ in range(steps):
        k1 = field(state)
        k2 = field(state + 0.5 * step * k1)
        k3 = field(state + 0.5 * step * k2)
        k4 = field(state + step * k3)
        state = state + step * (k1 + 2 * k2 + 2 * k3 + k4) / 6
        path.append(state)
    return np.array(path)


def complete_elliptic_k(m):
    a, b = 1.0, math.sqrt(1 - m)
    while abs(a - b) > 1e-15:
        a, b = (a + b) / 2, math.sqrt(a * b)
    return math.pi / (2 * a)


def level_curves():
    """Returns the level curves of :math:`H` through :math:`(q_0, 0)`, where :math:`q_0` is each
    of the amplitudes, with SAMPLES + 1 points at equal times over one period, in an array of
    shape (point, axis, curve)."""
    amplitudes = np.array(AMPLITUDES)
    periods = np.array([4 * complete_elliptic_k(math.sin(a / 2) ** 2) for a in amplitudes])
    substeps = 8
    start = np.array([amplitudes, np.zeros_like(amplitudes)])
    path = rk4_path(pendulum_field, start, periods / (SAMPLES * substeps), SAMPLES * substeps)
    return path[::substeps]


def rounded(points):
    return [[round(float(x), 4), round(float(y), 4)] for x, y in points]


def timed(points, start, duration, alpha, tone, weight=1.0):
    clock = np.linspace(0, duration, len(points))
    return {"points": rounded(points), "t": [round(float(c), 3) for c in clock], "start": start,
            "tone": tone, "alpha": alpha, "weight": weight}


def separatrix():
    """Returns the two branches :math:`p = \\pm 2 \\cos(q/2)` of the separatrix, continued by
    REACH past the saddle points, where they cross."""
    q = np.linspace(-math.pi - REACH, math.pi + REACH, 49)
    upper = np.stack([q, 2 * np.cos(q / 2)], axis=1)
    return upper, -upper[::-1]


def main():
    curves = level_curves()
    flow = rk4_path(generating_field, curves.transpose(1, 0, 2).reshape(2, -1), -1.0 / 64, 64)
    flow = flow.reshape(65, 2, SAMPLES + 1, len(AMPLITUDES))
    images = flow[-1]

    trajectories = []
    for branch in separatrix():
        trajectories.append(timed(branch, 0.0, 2.0, 0.35, "text"))
    for j in range(len(AMPLITUDES)):
        trajectories.append(timed(curves[:, :, j], 0.6 + 0.35 * j, 2.4, 0.65, "violet"))
    for j in range(len(AMPLITUDES)):
        for i in range(0, SAMPLES, FLOW_LINE_EVERY):
            line = flow[::8, :, i, j]
            if np.hypot(*(line[-1] - line[0])) < 0.02:
                continue
            trajectories.append(timed(line, 4.4 + 0.25 * j, 1.4, 0.55, "text"))
    for j in range(len(AMPLITUDES)):
        trajectories.append(timed(images[:, :, j].T, 7.0 + 0.35 * j, 2.4, 0.9, "orange", 1.4))

    text = json.dumps({"families": trajectories}, separators=(",", ":"))
    OUT.write_text("Beeson.trajectories(" + text + ");\n")

    points = sum(len(t["points"]) for t in trajectories)
    print(f"{len(trajectories)} trajectories, {points} points, {OUT.stat().st_size} bytes")
    for j, amplitude in enumerate(AMPLITUDES):
        radius = np.hypot(*images[:, :, j])
        before = np.hypot(*curves[:, :, j].T)
        energy = curves[:, 1, j] ** 2 / 2 - np.cos(curves[:, 0, j])
        closure = np.hypot(*(curves[-1, :, j] - curves[0, :, j]))
        print(f"amplitude {amplitude}: closure {closure:.1e}, energy drift {np.ptp(energy):.1e}, "
              f"radius in (q, p) {before.mean():.4f} +- {before.std():.4f}, "
              f"in the normal form {radius.mean():.4f} +- {radius.std():.4f}")


if __name__ == "__main__":
    main()
