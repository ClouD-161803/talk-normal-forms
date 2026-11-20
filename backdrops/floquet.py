"""The backdrop floquet.js: the Floquet frame of a planar Lyapunov orbit of :math:`\\mathcal{L}_1`.

In the planar circular restricted three-body problem of the Earth and the Moon, with the mass ratio
:math:`\\mu` and the primaries at :math:`(-\\mu, 0)` and :math:`(1 - \\mu, 0)`, the equations of
motion are :math:`\\ddot x - 2 \\dot y = \\Omega_x` and :math:`\\ddot y + 2 \\dot x = \\Omega_y`,
where :math:`\\Omega = (x^2 + y^2)/2 + (1 - \\mu)/\\rho_1 + \\mu/\\rho_2`. A Lyapunov orbit of
:math:`\\mathcal{L}_1` is corrected from the linear guess, as a symmetric orbit that crosses the
:math:`x` axis at right angles, and continued in its amplitude up to an :math:`x` that reaches
0.025 to the left of the point. Its monodromy matrix :math:`M = \\Phi(T, 0)` is integrated with the
variational equations, and the multipliers :math:`e^{\\pm\\alpha T}` of :math:`M` have the
eigenvectors :math:`v_u` and :math:`v_s`.

The Floquet directions :math:`e_u(t) = \\Phi(t, 0) v_u e^{-\\alpha t}` and
:math:`e_s(t) = \\Phi(t, 0) v_s e^{\\alpha t}` are periodic in :math:`t`. In the Floquet frame,
whose first vectors are these two, the linear part of the flow along the orbit becomes constant,
which is the first step of a normal form at a periodic orbit. The backdrop draws the orbit, a rung
along the position part of :math:`\\pm e_u(t)` and :math:`\\pm e_s(t)` at each of a set of phases,
scaled by its norm, and the curves traced by the ends of the rungs.

Run it with a Python that has numpy: ``python backdrops/floquet.py``.
"""

import json
import math
from pathlib import Path

import numpy as np

OUT = Path(__file__).resolve().with_suffix(".js")
MU = 0.012150582
AMPLITUDE = 0.025
CONTINUATION_STEPS = 10
TOLERANCE = 1e-13
PHASES = 72
ORBIT_POINTS = 121
RUNG = 0.05
ORBIT_SECONDS = 2.6
SWEEP_SECONDS = 6.4
GROWTH_SECONDS = 0.5

# the Dormand-Prince pair of orders 5 and 4
STAGES = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9],
          [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
          [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
          [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]]
ORDER_5 = np.array([35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0])
ORDER_4 = np.array([5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40])


def abscissa_of_l1():
    def force(x):
        return x - (1 - MU) / (x + MU) ** 2 + MU / (x - 1 + MU) ** 2

    low, high = 0.5, 1 - MU - 1e-3
    for _ in range(200):
        middle = (low + high) / 2
        if force(low) * force(middle) <= 0:
            high = middle
        else:
            low = middle
    return (low + high) / 2


def field(u):
    """Returns the derivative of the state :math:`(x, y, \\dot x, \\dot y)` followed by the 16
    entries of the state transition matrix :math:`\\Phi`, row by row."""
    x, y, vx, vy = u[:4]
    dx1, dx2 = x + MU, x - 1 + MU
    r1, r2 = math.hypot(dx1, y), math.hypot(dx2, y)
    a1, a2 = (1 - MU) / r1**3, MU / r2**3
    b1, b2 = 3 * (1 - MU) / r1**5, 3 * MU / r2**5
    oxx = 1 - a1 - a2 + b1 * dx1**2 + b2 * dx2**2
    oyy = 1 - a1 - a2 + (b1 + b2) * y**2
    oxy = (b1 * dx1 + b2 * dx2) * y
    jacobian = np.array([[0, 0, 1, 0], [0, 0, 0, 1], [oxx, oxy, 0, 2], [oxy, oyy, -2, 0]])
    phi = u[4:].reshape(4, 4)
    return np.concatenate([[vx, vy, x - a1 * dx1 - a2 * dx2 + 2 * vy, y - (a1 + a2) * y - 2 * vx],
                           (jacobian @ phi).ravel()])


def dormand_prince(u, step):
    slopes = []
    for row in STAGES:
        slopes.append(field(u + step * sum(a * k for a, k in zip(row, slopes)) if row else u))
    slopes = np.array(slopes)
    return u + step * (ORDER_5 @ slopes), np.max(np.abs(step * ((ORDER_5 - ORDER_4) @ slopes)[:4]))


def propagate(u, duration, step=1e-3):
    """Returns the state after the given time, with the step set to keep the local error of the
    position and velocity under TOLERANCE, and the last step accepted."""
    time = 0.0
    while time < duration:
        step = min(step, duration - time)
        trial, error = dormand_prince(u, step)
        if error <= TOLERANCE:
            u, time = trial, time + step
        step = min(0.05, step * min(4.0, max(0.2, 0.9 * (TOLERANCE / max(error, 1e-300)) ** 0.2)))
    return u


def with_identity(state):
    return np.concatenate([state, np.eye(4).ravel()])


def half_period(state):
    """Returns the time and the augmented state at the next crossing of :math:`y = 0`, found with
    Newton steps on the time once the sign of :math:`y` changes."""
    u, time, step = with_identity(state), 0.0, 1e-3
    while True:
        trial, error = dormand_prince(u, step)
        if error <= TOLERANCE:
            if time > 0.5 and trial[1] * u[1] < 0:
                break
            u, time = trial, time + step
        step = min(0.05, step * min(4.0, max(0.2, 0.9 * (TOLERANCE / max(error, 1e-300)) ** 0.2)))
    for _ in range(8):
        delta = -u[1] / u[3]
        u, _ = dormand_prince(u, delta)
        time += delta
    return time, u


def corrected(state):
    """Returns the state with its :math:`\\dot y` corrected so that the orbit crosses the
    :math:`x` axis at right angles after half a period, and the period."""
    for _ in range(30):
        time, u = half_period(state)
        phi = u[4:].reshape(4, 4)
        derivative = field(u)
        correction = -u[2] / (phi[2, 3] - derivative[2] * phi[1, 3] / u[3])
        state[3] += correction
        if abs(correction) < 1e-15:
            break
    return state, 2 * time


def lyapunov_orbit():
    """Returns the initial state on the :math:`x` axis and the period of the Lyapunov orbit of
    :math:`\\mathcal{L}_1` whose :math:`x` reaches AMPLITUDE to the left of the point. The first
    orbit is corrected from the linear guess at a tenth of AMPLITUDE, and the family is continued
    in nine steps of the amplitude, since a corrector started from the linear guess at AMPLITUDE
    may converge to another orbit."""
    x1 = abscissa_of_l1()
    c2 = (1 - MU) / (x1 + MU) ** 3 + MU / (1 - MU - x1) ** 3
    nu = math.sqrt((2 - c2 + math.sqrt(9 * c2 * c2 - 8 * c2)) / 2)
    amplitude = AMPLITUDE / CONTINUATION_STEPS
    state = np.array([x1 - amplitude, 0.0, 0.0, amplitude * (nu * nu + 1 + 2 * c2) / 2])
    for step in range(1, CONTINUATION_STEPS + 1):
        state[3] *= step / max(1, step - 1)
        state[0] = x1 - step * amplitude
        state, period = corrected(state)
    return state, period


def samples(state, period, count):
    """Returns the augmented states at count + 1 times equally spaced over one period."""
    u, out = with_identity(state), [with_identity(state)]
    for _ in range(count):
        u = propagate(u, period / count)
        out.append(u)
    return np.array(out)


def rounded(points, digits=4):
    return [[round(float(x), digits), round(float(y), digits)] for x, y in points]


def clock(values):
    return [round(float(v), 3) for v in values]


def backdrop():
    state, period = lyapunov_orbit()
    fine = samples(state, period, PHASES)
    monodromy = fine[-1, 4:].reshape(4, 4)
    values, vectors = np.linalg.eig(monodromy)
    order = np.argsort(np.abs(values))
    unstable, stable = values[order[-1]].real, values[order[0]].real
    v_u, v_s = vectors[:, order[-1]].real, vectors[:, order[0]].real
    alpha = math.log(unstable) / period
    times = np.linspace(0, period, PHASES + 1)
    matrices = fine[:, 4:].reshape(-1, 4, 4)
    e_u = np.einsum("tij,j->ti", matrices, v_u) * np.exp(-alpha * times)[:, None]
    e_s = np.einsum("tij,j->ti", matrices, v_s) * np.exp(alpha * times)[:, None]
    e_u *= RUNG / np.max(np.linalg.norm(e_u[:, :2], axis=1))
    e_s *= RUNG / np.max(np.linalg.norm(e_s[:, :2], axis=1))
    closure = np.max(np.abs(fine[-1, :4] - state))
    print(f"L1 at x = {abscissa_of_l1():.10f}, period {period:.10f}, initial ydot {state[3]:.12f}")
    print(f"closure of the orbit after one period {closure:.2e}")
    print(f"multipliers {unstable:.6f} and {stable:.3e}, product {unstable * stable:.12f}, "
          f"alpha {alpha:.6f}, other two {values[order[1]]:.8f} and {values[order[2]]:.8f}")
    print(f"|e_u(T) - e_u(0)| = {np.max(np.abs(e_u[-1] - e_u[0])) / RUNG:.2e} and "
          f"|e_s(T) - e_s(0)| = {np.max(np.abs(e_s[-1] - e_s[0])) / RUNG:.2e}, relative to the "
          f"largest position part")

    orbit = samples(state, period, ORBIT_POINTS - 1)[:, :2]
    sweep = ORBIT_SECONDS + SWEEP_SECONDS * times / period
    families = [{"name": "orbit", "tone": "text", "alpha": 0.85, "weight": 1.4,
                 "points": rounded(orbit),
                 "t": clock(np.linspace(0, ORBIT_SECONDS, ORBIT_POINTS))}]
    centers = fine[:, :2]
    for name, tone, direction in (("unstable", "orange", e_u), ("stable", "violet", e_s)):
        for sign in (1, -1):
            edge = centers + sign * direction[:, :2]
            families.append({"name": f"{name}-edge", "tone": tone, "alpha": 0.75, "weight": 1,
                             "start": ORBIT_SECONDS + GROWTH_SECONDS, "points": rounded(edge),
                             "t": clock(sweep - ORBIT_SECONDS)})
    for k in range(PHASES):
        for name, tone, direction in (("unstable", "orange", e_u), ("stable", "violet", e_s)):
            for sign in (1, -1):
                tip = centers[k] + sign * direction[k, :2]
                families.append({"name": f"{name}-rung", "tone": tone, "alpha": 0.28, "weight": 1,
                                 "start": round(float(sweep[k]), 3),
                                 "points": rounded([centers[k], tip]), "t": [0, GROWTH_SECONDS]})
    return {"families": families}


if __name__ == "__main__":
    data = backdrop()
    text = "Beeson.trajectories(" + json.dumps(data, separators=(",", ":")) + ");\n"
    OUT.write_text(text)
    every = np.concatenate([np.array(f["points"]) for f in data["families"]])
    ends = max(f.get("start", 0) + f["t"][-1] for f in data["families"])
    print(f"{len(data['families'])} trajectories, {len(every)} points, {len(text)} bytes, "
          f"x {every[:, 0].min():.4f} to {every[:, 0].max():.4f}, "
          f"y {every[:, 1].min():.4f} to {every[:, 1].max():.4f}, trace ends at {ends:.2f} s")
