"""The backdrop tori.js: invariant tori around a periodic orbit, from its normal form.

Near an elliptic periodic orbit of an autonomous Hamiltonian, the normal form is
:math:`H = \\nu I_\\Theta + \\omega I_2 + \\tfrac12 \\beta I_2^2`, where :math:`\\theta` is the angle
along the orbit and :math:`\\varphi` the angle of the oscillation transverse to it. The flow is
:math:`\\dot\\theta = \\nu` and :math:`\\dot\\varphi = \\omega + \\beta I_2`, hence each level of
:math:`I_2` is an invariant torus on which :math:`\\varphi` turns
:math:`\\rho = (\\omega + \\beta I_2) / \\nu` times per turn of :math:`\\theta`. The twist
:math:`\\beta` makes :math:`\\rho` differ from torus to torus. The rotation numbers are the
quadratic irrationals :math:`\\sqrt5 - 2`, :math:`2 - \\phi`, and :math:`\\phi - 1`, where
:math:`\\phi` is the golden ratio, and the actions :math:`I_2` are solved from them. A normal frame
that turns :math:`k` times along the orbit adds :math:`k` to :math:`\\rho`, hence only
:math:`\\rho` modulo 1 is set by the torus.

The orbit is the closed curve :math:`\\gamma(\\theta) = (\\cos\\theta, 0.75 \\sin\\theta,
0.18 \\cos 2\\theta)`, a saddle-shaped loop. A point of a torus is
:math:`\\gamma(\\theta) + \\kappa \\sqrt{2 I_2} (\\cos\\varphi\\, n_1 + \\sin\\varphi\\, n_2)`,
where :math:`n_1` and :math:`n_2` are a periodic frame normal to the orbit. Each torus is drawn by
one solution of the flow over 9 to 13 turns of :math:`\\theta`, and the space is drawn in an
oblique projection.

Run it with a Python that has numpy: ``python backdrops/tori.py``.
"""

import json
import math
from fractions import Fraction
from pathlib import Path

import numpy as np

OUT = Path(__file__).resolve().with_suffix(".js")
NU, OMEGA, BETA = 1.0, 0.18, 0.09
GOLDEN = (1 + math.sqrt(5)) / 2
ROTATION_NUMBERS = [math.sqrt(5) - 2, 2 - GOLDEN, GOLDEN - 1]
ACTIONS = [(NU * rho - OMEGA) / BETA for rho in ROTATION_NUMBERS]
KAPPA = 0.1
TURNS = [9, 11, 13]
ALPHAS = [0.7, 0.45, 0.26]
STARTS = [2.2, 3.0, 3.8]
POINTS_PER_TURN = 48
SECONDS_PER_TURN = 0.5
AZIMUTH, ELEVATION, SCREEN_TURN = math.radians(-20), math.radians(42), math.radians(62)


def orbit(theta):
    return np.stack([np.cos(theta), 0.75 * np.sin(theta), 0.18 * np.cos(2 * theta)], axis=-1)


def tangent(theta):
    return np.stack([-np.sin(theta), 0.75 * np.cos(theta), -0.36 * np.sin(2 * theta)], axis=-1)


def normal_frame(theta):
    """Returns the frame :math:`n_1`, horizontal and normal to the orbit, and
    :math:`n_2 = n_1 \\times T`, both periodic in :math:`\\theta`."""
    t = tangent(theta)
    t = t / np.linalg.norm(t, axis=-1, keepdims=True)
    n1 = np.cross(t, [0.0, 0.0, 1.0])
    n1 /= np.linalg.norm(n1, axis=-1, keepdims=True)
    return n1, np.cross(n1, t)


def projected(points):
    ca, sa = math.cos(AZIMUTH), math.sin(AZIMUTH)
    x = ca * points[..., 0] - sa * points[..., 1]
    y = sa * points[..., 0] + ca * points[..., 1]
    up = points[..., 2] * math.cos(ELEVATION) + y * math.sin(ELEVATION)
    cs, ss = math.cos(SCREEN_TURN), math.sin(SCREEN_TURN)
    return np.stack([cs * x - ss * up, ss * x + cs * up], axis=-1)


def rotation_number(action):
    return (OMEGA + BETA * action) / NU


def winding(action, turns, phase):
    """Returns the times and the points of the solution on the torus of :math:`I_2` = action, over
    the given number of turns of :math:`\\theta`."""
    times = np.linspace(0, 2 * math.pi * turns / NU, POINTS_PER_TURN * turns + 1)
    theta = NU * times
    phi = (OMEGA + BETA * action) * times + phase
    n1, n2 = normal_frame(theta)
    radius = KAPPA * math.sqrt(2 * action)
    space = orbit(theta) + radius * (np.cos(phi)[:, None] * n1 + np.sin(phi)[:, None] * n2)
    return times, projected(space)


def rounded(points, digits=4):
    return [[round(float(x), digits), round(float(y), digits)] for x, y in points]


def nearest_fraction(value, largest_denominator=12):
    fraction = Fraction(value).limit_denominator(largest_denominator)
    return fraction, abs(value - float(fraction))


def backdrop():
    families = []
    theta = np.linspace(0, 2 * math.pi, 73)
    families.append({"name": "orbit", "tone": "orange", "alpha": 0.9, "weight": 2.2,
                     "points": rounded(projected(orbit(theta))),
                     "t": [round(float(v), 3) for v in np.linspace(0, 2.4, len(theta))]})
    for index, (action, turns, alpha, start) in enumerate(zip(ACTIONS, TURNS, ALPHAS, STARTS)):
        times, points = winding(action, turns, phase=1.7 * index)
        clock = times * NU / (2 * math.pi) * SECONDS_PER_TURN
        families.append({"name": f"torus-{index}", "action": action, "tone": "violet",
                         "alpha": alpha, "weight": 1, "start": start,
                         "points": rounded(points), "t": [round(float(v), 3) for v in clock]})
    return {"families": families}


if __name__ == "__main__":
    data = backdrop()
    text = "Beeson.trajectories(" + json.dumps(data, separators=(",", ":")) + ");\n"
    OUT.write_text(text)
    for action in ACTIONS:
        rho = rotation_number(action)
        fraction, gap = nearest_fraction(rho)
        print(f"I2 = {action:.4f}: rotation number {rho:.6f}, nearest fraction with denominator "
              f"<= 12 is {fraction}, {gap:.4f} away")
    every = np.concatenate([np.array(f["points"]) for f in data["families"]])
    ends = max(f.get("start", 0) + f["t"][-1] for f in data["families"])
    print(f"{len(data['families'])} trajectories, {len(every)} points, {len(text)} bytes, "
          f"x {every[:, 0].min():.3f} to {every[:, 0].max():.3f}, "
          f"y {every[:, 1].min():.3f} to {every[:, 1].max():.3f}, trace ends at {ends:.2f} s")
