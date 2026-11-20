"""The backdrop saddle: the flow near a collinear libration point in the normal form, i.e. the tubes
of the backdrop tubes made straight.

The quadratic part of the normal form at a collinear point is
:math:`H_2 = \\lambda q_1 p_1 + \\omega (q_2^2 + p_2^2)/2`, with :math:`\\lambda = 2.9321` and
:math:`\\omega = 2.3344` at the Earth–Moon :math:`\\mathcal{L}_1`. Its flow is
:math:`q_1 = q_1(0) e^{\\lambda t}`, :math:`p_1 = p_1(0) e^{-\\lambda t}`, and
:math:`q_2 + i p_2 = (q_2(0) + i p_2(0)) e^{-i \\omega t}`. Every orbit of the drawing has the energy
:math:`h = \\omega r^2/2` of the periodic orbit :math:`q_1 = p_1 = 0`, where :math:`r` is the radius
of the periodic orbit in the center plane. An orbit on the hyperbola :math:`q_1 p_1 = c` therefore
turns in the center plane at the radius :math:`\\rho = \\sqrt{r^2 - 2 \\lambda c / \\omega}`. With
:math:`c > 0` the orbit is inside the tubes and is a transit orbit, and with :math:`c < 0` it is
outside them and is a non-transit orbit.

The point :math:`(q_1, p_1, q_2, p_2)` is drawn at :math:`q_1 A + p_1 B + q_2 C + p_2 D`, an oblique
view in which the periodic orbit is seen as a ring, and the unstable manifold :math:`p_1 = 0` and the
stable manifold :math:`q_1 = 0` as two cylinders that cross at the ring. The clock of the file is in
seconds of the trace.

Run it with a Python that has numpy: ``python backdrops/saddle.py``.
"""

import json
from pathlib import Path

import numpy as np

OUT = Path(__file__).with_suffix(".js")
LAMBDA, OMEGA = 2.9321, 2.3344
RADIUS = 1.0
FAR, NEAR = 3.6, 0.03
A, B = np.array([1.0, 0.42]), np.array([-1.0, 0.42])
C, D = np.array([0.0, 1.0]), np.array([0.34, 0.12])
PHASES = 18
SECONDS_PER_UNIT = 1.9
STEP = 0.035
# radius in the center plane, phase, side, and kind of the orbits that pass by the ring
PASSES = [(0.35, 0.2, 1, "transit"), (0.62, 2.3, 1, "transit"), (0.8, 4.2, 1, "transit"),
          (1.3, 1.1, 1, "non-transit"), (1.5, 3.6, -1, "non-transit")]
# upper end, in units of FAR, and opacity of each band of the distance max(|q1|, |p1|) from the ring.
# the opacity is ((1 - r) / 0.45)^2 at the middle r of each band beyond 0.55
BANDS = [(0.55, 1.0), (0.65, 0.79), (0.75, 0.44), (0.85, 0.2), (0.93, 0.06), (1.01, 0.01)]


def drawn(q1, p1, q2, p2):
    return np.outer(q1, A) + np.outer(p1, B) + np.outer(q2, C) + np.outer(p2, D)


def flow(state, times):
    q1, p1, q2, p2 = state
    turn = OMEGA * times
    return (q1 * np.exp(LAMBDA * times), p1 * np.exp(-LAMBDA * times),
            q2 * np.cos(turn) + p2 * np.sin(turn), p2 * np.cos(turn) - q2 * np.sin(turn))


def trajectory(state, duration, start, **look):
    """Returns the pieces of the orbit from state over duration, cut where it crosses from one band of
    BANDS to the next, each at the opacity of its band."""
    times = np.linspace(0, duration, max(8, int(duration / STEP) + 1))
    q1, p1, q2, p2 = flow(state, times)
    points, seconds = np.round(drawn(q1, p1, q2, p2), 4), times * SECONDS_PER_UNIT
    distance = np.maximum(np.abs(q1), np.abs(p1)) / FAR
    bands = np.searchsorted([r for r, _ in BANDS], (distance[1:] + distance[:-1]) / 2)
    cuts = [0] + [i + 1 for i in range(len(bands) - 1) if bands[i + 1] != bands[i]] + [len(bands)]
    return [{"points": points[a:b + 1].tolist(), "t": np.round(seconds[a:b + 1] - seconds[a], 3).tolist(),
             "start": round(start + seconds[a], 3), **look, "alpha": round(look["alpha"] * BANDS[bands[a]][1], 3)}
            for a, b in zip(cuts, cuts[1:])]


def families():
    out = trajectory((0, 0, RADIUS, 0), 2 * np.pi / OMEGA, 0.0, kind="orbit", tone="text", alpha=0.9, weight=1.5)
    approach = np.log(FAR / NEAR) / LAMBDA
    stable_start = 0.9
    unstable_start = stable_start + approach * SECONDS_PER_UNIT
    for k in range(PHASES):
        phase = 2 * np.pi * (k + 0.5) / PHASES
        for side in (1, -1):
            end = flow((0, side * NEAR, RADIUS * np.cos(phase), -RADIUS * np.sin(phase)), np.array(-approach))
            out += trajectory(end, approach, stable_start, kind="stable", tone="violet", alpha=0.3)
            begin = (side * NEAR, 0, RADIUS * np.cos(phase + 0.3), -RADIUS * np.sin(phase + 0.3))
            out += trajectory(begin, approach, unstable_start, kind="unstable", tone="orange", alpha=0.3)
    passes_start = unstable_start + approach * SECONDS_PER_UNIT - 0.6
    for i, (rho, phase, side, kind) in enumerate(PASSES):
        c = OMEGA * (RADIUS**2 - rho**2) / (2 * LAMBDA)
        root = np.sqrt(abs(c))
        half = np.log(FAR / root) / LAMBDA
        q1, p1 = side * root * np.exp(-LAMBDA * half), np.sign(c) * side * root * np.exp(LAMBDA * half)
        transit = kind == "transit"
        out += trajectory((q1, p1, rho * np.cos(phase), rho * np.sin(phase)), 2 * half, passes_start + 0.35 * i,
                          kind=kind, c=round(float(c), 4), tone="text", alpha=0.7 if transit else 0.45,
                          weight=1.2 if transit else 1)
    return out


def check():
    """Checks that flow solves the equations of motion of :math:`H_2` and keeps the energy of the ring
    on the orbits of PASSES."""
    t, h = 0.3, 1e-6
    state = np.array(flow((0.2, 0.5, 0.3, -0.4), np.array(t)))
    numeric = (np.array(flow((0.2, 0.5, 0.3, -0.4), np.array(t + h))) - state) / h
    q1, p1, q2, p2 = state
    assert np.allclose(numeric, [LAMBDA * q1, -LAMBDA * p1, OMEGA * p2, -OMEGA * q2], atol=1e-4)
    for rho, phase, side, _ in PASSES:
        c = OMEGA * (RADIUS**2 - rho**2) / (2 * LAMBDA)
        root = np.sqrt(abs(c))
        q1, p1, q2, p2 = flow((side * root, np.sign(c) * side * root, rho * np.cos(phase), rho * np.sin(phase)),
                              np.linspace(-1, 1, 9))
        assert np.allclose(LAMBDA * q1 * p1 + OMEGA * (q2**2 + p2**2) / 2, OMEGA * RADIUS**2 / 2)


if __name__ == "__main__":
    check()
    trajectories = families()
    text = "Beeson.trajectories(" + json.dumps({"families": trajectories}, separators=(",", ":")) + ");\n"
    OUT.write_text(text)
    points = sum(len(r["points"]) for r in trajectories)
    last = max(r["start"] + r["t"][-1] for r in trajectories)
    print(f"{len(trajectories)} trajectories, {points} points, {len(text)} bytes, last time {last:.2f} s")
