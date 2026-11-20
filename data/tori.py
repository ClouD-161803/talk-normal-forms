"""The plot and the backdrop of the tori near :math:`L_5`.

In the bicircular problem, the small periodic orbit near the Earth-Moon :math:`L_5` has a family of
unstable 2-tori along its vertical direction (Figs. 8 and 9 of Simó et al. 1995). DyLAN computed
ten of them, with the vertical amplitude :math:`\\alpha` from 0.02 to 0.20, as one orbit on each
torus. The file tori.npz holds every 40th sample of these orbits, the rotation number of each
torus, and the periodic orbit.

On a torus, the orbit is :math:`x(\\theta_1, \\theta_2)` with :math:`\\theta_1 = 2\\pi t / T_S`,
the phase of the Sun, and :math:`\\theta_2 = (2\\pi + \\rho) t / T_S`, the phase of the vertical
oscillation, where :math:`\\rho` is the rotation number. Function ``torus_map`` fits this map as a
Fourier series in the two angles. Both drawings show the tori in the plane of the primaries.

A frame of the plot is one torus, drawn as its curves of constant :math:`\\theta_1`, i.e. the
invariant curve of the map over one period of the Sun, seen at several phases of the Sun. Each
curve is a row of dots at fixed values of :math:`\\theta_2`. Between two frames, each dot thus
moves from its place on a torus to the same angles on the next one.

In the backdrop, one orbit is wound on each of two tori, as in the figures of the paper.

Run it with a Python that has numpy. ``python data/tori.py`` writes the plot into the JSON script
of index.html, or of the deck given, and ``python data/tori.py --backdrop FILE`` writes the
backdrop.
"""

import json
import math
import sys
from pathlib import Path

import numpy as np

from pendulum import DECK, write_script

DATA = Path(__file__).resolve().with_name("tori.npz")
# the frequency of the Sun in the synodic frame of the bicircular problem of Simó et al. 1995
SUN_FREQUENCY = 0.925195985520347
MASS_RATIO = 0.012150582
L5 = np.array([0.5 - MASS_RATIO, -math.sqrt(3) / 2])
HARMONICS = 5
MODES = [(j, k) for j in range(-HARMONICS, HARMONICS + 1) for k in range(-HARMONICS, HARMONICS + 1)]
# both drawings are in units of 1e-4 of the Earth-Moon distance from L5
UNIT = 1e-4
SUN_PHASES = 16
DOTS_PER_CURVE = 24
POINTS_PER_PERIOD = 36
# the amplitude, the opacity, and the seconds of the trace of each torus of the backdrop
WOUND = ((0.10, 0.9, 4.0), (0.18, 0.6, 6.0))


def basis(sun_phase, vertical_phase):
    return np.stack([np.exp(1j * (j * sun_phase + k * vertical_phase)) for j, k in MODES], axis=-1)


def torus_map(dots, rotation, time_step):
    """Returns the Fourier coefficients of the map :math:`(\\theta_1, \\theta_2) \\mapsto (x, y, z)`
    of one torus, fitted by least squares to an orbit on it, and the largest residual of the fit."""
    time = time_step * np.arange(len(dots))
    period = 2 * math.pi / SUN_FREQUENCY
    design = basis(2 * math.pi * time / period, (2 * math.pi + rotation) * time / period)
    coefficients = np.linalg.lstsq(design, dots.astype(complex), rcond=None)[0]
    return coefficients, float(np.max(np.abs(design @ coefficients - dots)))


def in_plane(coefficients, sun_phase, vertical_phase):
    """Returns the points of a torus in the plane of the primaries, from :math:`L_5`."""
    return (np.real(basis(sun_phase, vertical_phase) @ coefficients)[..., :2] - L5) / UNIT


def tori():
    """Yields the amplitude, the rotation number, and the map of each torus."""
    data = np.load(DATA)
    for alpha, rotation, dots in zip(data["alpha"], data["rotation"], data["dots"]):
        coefficients, residual = torus_map(dots.astype(float), float(rotation), float(data["time_step"]))
        print(f"alpha = {alpha:.2f}: rotation number {rotation:.6f}, largest residual of the fit {residual:.1e}")
        yield round(float(alpha), 2), float(rotation), coefficients


def periodic_orbit():
    orbit = (np.load(DATA)["orbit"].astype(float)[:, :2] - L5) / UNIT
    return [[round(float(x)), round(float(y))] for x, y in np.vstack([orbit[::2], orbit[:1]])]


def tori_plot():
    # a torus is mirrored in the plane z = 0 by half a turn of the vertical phase, hence half
    # a turn covers its projection onto the plane
    grid = np.meshgrid(2 * math.pi * np.arange(SUN_PHASES) / SUN_PHASES, math.pi * np.arange(DOTS_PER_CURVE) / DOTS_PER_CURVE)
    alphas, dots = [], []
    for alpha, _, coefficients in tori():
        alphas.append(alpha)
        dots.append([int(round(float(value))) for value in in_plane(coefficients, *grid).ravel()])
    x_range, y_range = [-540, 500], [-330, 600]
    return {
        "parameter": {"label": "$\\alpha$", "digits": 2},
        "duration": 9,
        "hold": 1.2,
        "fade": 0.6,
        "panels": [{"id": "plane", "axes": False, "equal": True, "margin": [8, 8, 8, 8],
                    "x": {"range": x_range, "ticks": []}, "y": {"range": y_range, "ticks": []},
                    "curves": [{"id": "orbit", "points": periodic_orbit(), "tone": "accent", "width": 3}]}],
        "marks": [
            {"id": "dots", "panel": "plane", "kind": "points", "tone": "violet", "size": 4},
            {"id": "l5", "panel": "plane", "kind": "points", "tone": "text", "size": 9, "hollow": True},
            {"id": "amplitude", "panel": "plane", "kind": "label", "tone": "muted", "anchor": "start", "dy": 24},
        ],
        "tabs": [{"name": "family", "label": "family", "values": alphas,
                  "data": {"dots": dots, "l5": [[0, 0]],
                           "amplitude": {"at": [x_range[0], y_range[1]], "text": [f"$\\alpha = {alpha:.2f}$" for alpha in alphas]}}}],
    }


def wound_orbit(coefficients, rotation):
    """Returns the points of an orbit on a torus in the plane of the primaries.

    Seen in the plane, the orbit is shifted by :math:`\\rho / \\pi` of the width of the torus after
    each period of the Sun. The orbit covers the number of periods, between 30 and 45, after which
    its turns are spread most evenly over the torus."""
    def largest_gap(periods):
        turns = np.sort(np.arange(periods) * rotation / math.pi % 1)
        return periods * np.max(np.diff(np.concatenate([turns, [turns[0] + 1]])))

    periods = min(range(30, 46), key=largest_gap)
    sun_phase = np.linspace(0, 2 * math.pi * periods, periods * POINTS_PER_PERIOD + 1)
    return in_plane(coefficients, sun_phase, (1 + rotation / (2 * math.pi)) * sun_phase)


def tori_backdrop():
    """Returns the periodic orbit and one orbit wound on each torus of ``WOUND``, traced one after
    the other on a clock in seconds."""
    def clock(count, seconds):
        return [round(seconds * index / (count - 1), 2) for index in range(count)]

    orbit = periodic_orbit()
    families = []
    start = 1.0
    maps = {alpha: (rotation, coefficients) for alpha, rotation, coefficients in tori()}
    for amplitude, opacity, seconds in WOUND:
        points = wound_orbit(maps[amplitude][1], maps[amplitude][0])
        families.append({"name": "torus", "amplitude": amplitude, "tone": "violet", "alpha": opacity, "weight": 1, "start": start,
                         "points": [[round(float(x), 1), round(float(y), 1)] for x, y in points], "t": clock(len(points), seconds)})
        start += seconds
    # the periodic orbit is the last trajectory of the file, hence it is drawn over the tori
    families.append({"name": "orbit", "tone": "orange", "weight": 3, "points": orbit, "t": clock(len(orbit), 1.2)})
    return {"families": families}


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--backdrop":
        Path(sys.argv[2]).write_text("Beeson.trajectories(" + json.dumps(tori_backdrop(), separators=(",", ":")) + ");\n")
    else:
        deck = Path(sys.argv[1]) if len(sys.argv) > 1 else DECK
        deck.write_text(write_script(deck.read_text(), "tori", tori_plot()))
