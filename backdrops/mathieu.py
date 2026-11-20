"""The backdrop mathieu.js: Floquet's theorem on the Mathieu equation.

The Mathieu equation :math:`\\ddot x + (\\delta + \\varepsilon \\cos t) x = 0` is a linear system
:math:`\\dot u = A(t) u` in :math:`u = (x, \\dot x)`, with :math:`A` periodic of period
:math:`2\\pi`. Its monodromy matrix is :math:`M = \\Phi(2\\pi)`, where :math:`\\Phi` is the
fundamental matrix with :math:`\\Phi(0) = I`. For the chosen :math:`\\delta` and
:math:`\\varepsilon`, the eigenvalues of :math:`M` are :math:`e^{\\pm i \\theta}` on the unit
circle, hence the solutions are stable. With the eigenvector :math:`a + i b` of
:math:`e^{i\\theta}` and :math:`S = (a\\ b)`, scaled to :math:`\\det S = 1`, the real matrix
:math:`B = S \\Lambda S^{-1}`, where :math:`\\Lambda = ((0, \\sigma), (-\\sigma, 0))` and
:math:`2\\pi\\sigma = \\theta + 2\\pi k`, satisfies :math:`e^{2\\pi B} = M`. The Floquet exponent
:math:`\\sigma` is taken on the branch :math:`k` closest to the mean frequency of the solutions.

By Floquet's theorem, :math:`P(t) = \\Phi(t) e^{-B t}` is periodic of period :math:`2\\pi`, and the
change :math:`u = P(t) S w` turns each solution into :math:`w(t) = e^{\\Lambda t} w(0)`, a pure
rotation at the frequency :math:`\\sigma`. The backdrop draws, against the time, the solutions
from :math:`w(0) = (\\cos p, \\sin p)` for five phases :math:`p` over a quarter turn. Their
:math:`x(t)` is drawn in the upper band, and their first Floquet coordinate
:math:`w_1(t) = \\cos(\\sigma t - p)` in the lower band. The solutions are integrated with a step
other than that of :math:`\\Phi`, hence the departure of :math:`w_1` from the sinusoid tests the
theorem as well as the integration.

Run it with a Python that has numpy: ``python backdrops/mathieu.py``.
"""

import json
import math
from pathlib import Path

import numpy as np

OUT = Path(__file__).resolve().with_suffix(".js")
DELTA, EPSILON = 0.6, 0.8
PERIODS = 8
STEPS_PER_PERIOD = 4000
SOLUTION_STEPS_PER_PERIOD = 3000
CHECKS_PER_PERIOD = 1000
SOLUTIONS = 5
PHASE_SPREAD = math.pi / 2
POINTS_PER_PERIOD = 25
HEIGHT, GAP = 0.75, 1.25
SECONDS = 9.0
DELAY = 0.6


def system(t):
    return np.array([[0.0, 1.0], [-(DELTA + EPSILON * math.cos(t)), 0.0]])


def rk4(state, t, step):
    k1 = system(t) @ state
    k2 = system(t + step / 2) @ (state + step / 2 * k1)
    k3 = system(t + step / 2) @ (state + step / 2 * k2)
    k4 = system(t + step) @ (state + step * k3)
    return state + step * (k1 + 2 * k2 + 2 * k3 + k4) / 6


def integrate(state, periods, steps_per_period):
    """Returns the states at the given number of steps per period of :math:`2\\pi`, from
    :math:`t = 0`, for a state that is a vector or a matrix of columns."""
    step = 2 * math.pi / steps_per_period
    out = [state]
    for n in range(periods * steps_per_period):
        state = rk4(state, n * step, step)
        out.append(state)
    return np.array(out)


def floquet():
    """Returns the fundamental matrices over one period, :math:`M`, :math:`S`, and
    :math:`\\theta`."""
    fundamental = integrate(np.eye(2), 1, STEPS_PER_PERIOD)
    monodromy = fundamental[-1]
    values, vectors = np.linalg.eig(monodromy)
    index = int(np.argmax(values.imag))
    theta = math.atan2(values[index].imag, values[index].real)
    s = np.column_stack([vectors[:, index].real, vectors[:, index].imag])
    s /= math.sqrt(abs(np.linalg.det(s)))
    if np.linalg.det(s) < 0:
        s[:, 1] *= -1
        theta = -theta
    return fundamental, monodromy, s, theta


def zero_crossings(values):
    return int(np.sum(values[:-1] * values[1:] < 0))


def exp_of(generator, t):
    """Returns :math:`e^{B t}` for a real :math:`2 \\times 2` matrix :math:`B` with eigenvalues
    :math:`\\pm i \\sigma`, where :math:`\\sigma^2 = \\det B`."""
    sigma = math.sqrt(np.linalg.det(generator))
    return math.cos(sigma * t) * np.eye(2) + math.sin(sigma * t) / sigma * generator


def rounded(points, digits=4):
    return [[round(float(x), digits), round(float(y), digits)] for x, y in points]


def backdrop():
    fundamental, monodromy, s, theta = floquet()
    phases = PHASE_SPREAD * np.arange(SOLUTIONS) / (SOLUTIONS - 1)
    starts = [s @ np.array([math.cos(p), math.sin(p)]) for p in phases]
    fine = integrate(np.column_stack(starts), PERIODS, SOLUTION_STEPS_PER_PERIOD)
    solutions = fine[:: SOLUTION_STEPS_PER_PERIOD // CHECKS_PER_PERIOD]
    times = 2 * math.pi * np.arange(len(solutions)) / CHECKS_PER_PERIOD

    frequency = math.pi * zero_crossings(solutions[:, 0, 0]) / times[-1]
    branch = round(frequency - theta / (2 * math.pi))
    sigma = theta / (2 * math.pi) + branch
    generator = s @ np.array([[0.0, sigma], [-sigma, 0.0]]) @ np.linalg.inv(s)
    print(f"delta {DELTA}, epsilon {EPSILON}: trace of M {np.trace(monodromy):.10f}, "
          f"det of M {np.linalg.det(monodromy):.12f}, theta {theta:.10f}")
    print(f"mean frequency from the zero crossings {frequency:.4f}, Floquet exponent sigma "
          f"{sigma:.10f} on branch {branch}")
    print(f"|exp(2 pi B) - M| = {np.max(np.abs(exp_of(generator, 2 * math.pi) - monodromy)):.2e}")
    periodic = [fundamental[n] @ exp_of(generator, -2 * math.pi * n / STEPS_PER_PERIOD)
                for n in range(STEPS_PER_PERIOD + 1)]
    print(f"|P(2 pi) - P(0)| = {np.max(np.abs(periodic[-1] - periodic[0])):.2e}")

    inverse_s = np.linalg.inv(s)
    ratio = STEPS_PER_PERIOD // CHECKS_PER_PERIOD
    floquet_coordinates = np.array([
        inverse_s @ np.linalg.solve(periodic[(n * ratio) % STEPS_PER_PERIOD], u)
        for n, u in enumerate(solutions)])
    sinusoids = np.array([np.cos(sigma * times - p) for p in phases]).T
    print(f"largest departure of w_1 from cos(sigma t - phase) over {PERIODS} periods: "
          f"{np.max(np.abs(floquet_coordinates[:, 0, :] - sinusoids)):.2e}")

    every = slice(None, None, CHECKS_PER_PERIOD // POINTS_PER_PERIOD)
    abscissa = times[every] / (2 * math.pi)
    clock = [round(float(v), 3) for v in SECONDS * abscissa / PERIODS]
    scale = HEIGHT / np.max(np.abs(solutions[:, 0, :]))
    families = []
    for k in range(SOLUTIONS):
        upper = np.column_stack([abscissa, GAP + scale * solutions[every][:, 0, k]])
        lower = np.column_stack([abscissa, -GAP + HEIGHT * floquet_coordinates[every][:, 0, k]])
        families.append({"name": "solution", "phase": round(float(phases[k]), 4), "tone": "violet",
                         "alpha": 0.6, "weight": 1, "points": rounded(upper), "t": clock})
        families.append({"name": "floquet", "phase": round(float(phases[k]), 4), "tone": "orange",
                         "alpha": 0.6, "weight": 1, "start": DELAY, "points": rounded(lower),
                         "t": clock})
    return {"families": families}


if __name__ == "__main__":
    data = backdrop()
    text = "Beeson.trajectories(" + json.dumps(data, separators=(",", ":")) + ");\n"
    OUT.write_text(text)
    every = np.concatenate([np.array(f["points"]) for f in data["families"]])
    ends = max(f.get("start", 0) + f["t"][-1] for f in data["families"])
    print(f"{len(data['families'])} trajectories, {len(every)} points, {len(text)} bytes, "
          f"x {every[:, 0].min():.3f} to {every[:, 0].max():.3f}, "
          f"y {every[:, 1].min():.3f} to {every[:, 1].max():.3f}, trace ends at {ends:.2f} s")
