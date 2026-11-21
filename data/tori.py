"""The tori near :math:`L_5`, written as Fourier coefficients for the drawing ``tori``.

In the bicircular problem, the small periodic orbit near the Earth-Moon :math:`L_5` has a family of
unstable 2-tori along its vertical direction (Figs. 8 and 9 of Simó et al. 1995). DyLAN computed
ten of them, with the vertical amplitude :math:`\\alpha` from 0.02 to 0.20, as one orbit on each
torus. The file tori.npz holds every 40th sample of these orbits, the rotation number of each
torus, and the periodic orbit.

On a torus, the orbit is :math:`x(\\theta_1, \\theta_2)` with :math:`\\theta_1 = 2\\pi t / T_S`,
the phase of the Sun, and :math:`\\theta_2 = (2\\pi + \\rho) t / T_S`, the phase of the vertical
oscillation, where :math:`\\rho` is the rotation number. Function ``torus_map`` fits this map as a
Fourier series in the two angles. A torus is mirrored in the plane of the primaries by half a turn
of :math:`\\theta_2`. The series of :math:`x` and :math:`y` thus have only even harmonics of
:math:`\\theta_2`, and the series of :math:`z` has only odd ones. Only the harmonics :math:`(j, k)`
with :math:`k \\ge 0` are written, since the others are their complex conjugates.

In the browser, demos/families/families.js winds one orbit on a torus from these coefficients, and
it draws the tori between the ten computed ones from coefficients interpolated in :math:`\\alpha`.

Run it with a Python that has numpy: ``python data/tori.py`` writes demos/families/tori.js.
"""

import json
import math
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
DATA = HERE / "tori.npz"
OUT = HERE.parent / "demos" / "families" / "tori.js"
# the frequency of the Sun in the synodic frame of the bicircular problem of Simó et al. 1995
SUN_FREQUENCY = 0.925195985520347
MASS_RATIO = 0.012150582
L5 = np.array([0.5 - MASS_RATIO, -math.sqrt(3) / 2, 0.0])
HARMONICS = 5
MODES = [(j, k) for j in range(-HARMONICS, HARMONICS + 1) for k in range(-HARMONICS, HARMONICS + 1)]
# the drawing is in units of 1e-4 of the Earth-Moon distance from L5
UNIT = 1e-4
DIGITS = 3


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


def from_l5(coefficients):
    """Returns the coefficients of x, y, and z from :math:`L_5`, in the units of the drawing, as a
    list of ``[j, k, Re x, Im x, Re y, Im y, Re z, Im z]`` over the harmonics with :math:`k \\ge 0`."""
    rows = []
    for (j, k), row in zip(MODES, coefficients / UNIT):
        if k < 0:
            continue
        if (j, k) == (0, 0):
            row = row - L5 / UNIT
        values = [round(float(v), DIGITS) or 0 for c in row for v in (c.real, c.imag)]
        if any(values):
            rows.append([j, k] + values)
    return rows


def tori():
    data = np.load(DATA)
    family = []
    for alpha, rotation, dots in zip(data["alpha"], data["rotation"], data["dots"]):
        coefficients, residual = torus_map(dots.astype(float), float(rotation), float(data["time_step"]))
        # the largest coefficient that the mirror symmetry sets to zero
        unmirrored = max(abs(c) for (j, k), row in zip(MODES, coefficients) for c in (row[:2] if k % 2 else row[2:]))
        print(f"alpha = {alpha:.2f}: rotation number {rotation:.6f}, largest residual of the fit {residual:.1e}, "
              f"largest coefficient against the mirror symmetry {unmirrored:.1e}")
        family.append({"alpha": round(float(alpha), 2), "rotation": round(float(rotation), 6), "modes": from_l5(coefficients)})
    orbit = (data["orbit"].astype(float) - L5)[:, :2] / UNIT
    return {"unit": UNIT, "tori": family, "orbit": [[round(float(x), 1), round(float(y), 1)] for x, y in orbit]}


if __name__ == "__main__":
    OUT.parent.mkdir(parents=True, exist_ok=True)
    text = "(window.FamiliesData ??= {}).tori = " + json.dumps(tori(), separators=(",", ":")) + ";\n"
    OUT.write_text(text)
    print(f"{OUT.name}: {len(text)} bytes")
