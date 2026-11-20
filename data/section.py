"""The plot of the section of the center manifold, written into the JSON script of a deck.

The center manifold of the Earth-Moon :math:`L_2` is cut by :math:`q_3 = 0` with :math:`p_3 > 0`
on a level :math:`h` of its Hamiltonian (Fig. 6 of Jorba and Masdemont 1999). DyLAN reduced the
Hamiltonian to the center manifold at degree 20 and computed the section at 39 energies from 0.05
to 1.0. The file sections.npz holds, at each energy, the boundary of the section, the vertical
Lyapunov orbit, the halo orbits, and 80 crossings of twelve orbits about the vertical Lyapunov
orbit and of four orbits about each halo orbit. The orbits start at fixed fractions of the way
from their fixed point to the boundary.

The crossings of an orbit lie on a closed curve around its fixed point. Function ``closed_curve``
returns this curve as a polygon, and function ``evenly_spaced`` returns dots at even steps of its
length. A frame of the plot is one energy. Between two frames, each dot thus moves to the same
fraction of the length of its curve, and the curves are deformed with the energy.

Run it with a Python that has numpy: ``python data/section.py``, or with the path of another deck.
"""

import math
import sys
from pathlib import Path

import numpy as np

from pendulum import DECK, write_script

DATA = Path(__file__).resolve().with_name("sections.npz")
# the plot is drawn in units of 1e-3 of the coordinates of the center manifold
UNIT = 1e-3
FIRST_ENERGY = 0.2
ENERGY_STEP = 0.05
CENTRAL_CURVES = slice(1, None, 2)
ISLAND_CURVES = slice(1, None, 2)
DOTS = 520
POLYGON = 720
SECONDS = 12
DOWN, RIGHT, MIRROR = np.array([0.0, -1.0]), np.array([1.0, 0.0]), np.array([-1.0, 1.0])


def closed_curve(points, center, start):
    """Returns the closed curve through the crossings of an orbit around a fixed point as a
    polygon, counterclockwise from its point on the ray from the fixed point along ``start``.

    The crossings are ordered by their polar angle about the fixed point, in the coordinates in
    which their second moments about it are the identity. In these coordinates the curve is close
    to a circle, and the distance from the fixed point is interpolated linearly in the angle."""
    offsets = points - center
    values, vectors = np.linalg.eigh(offsets.T @ offsets / len(offsets))
    whiten = vectors @ np.diag(values**-0.5) @ vectors.T
    white = offsets @ whiten
    angle, radius = np.arctan2(white[:, 1], white[:, 0]), np.hypot(white[:, 0], white[:, 1])
    order = np.argsort(angle)
    first = start @ whiten
    grid = math.atan2(first[1], first[0]) + 2 * math.pi * np.arange(POLYGON) / POLYGON
    radius = np.interp(grid, angle[order], radius[order], period=2 * math.pi)
    return center + (radius[:, None] * np.column_stack([np.cos(grid), np.sin(grid)])) @ np.linalg.inv(whiten)


def lengths(polygon):
    """Returns the closed polygon and the length along it up to each of its points."""
    closed = np.vstack([polygon, polygon[:1]])
    return closed, np.concatenate([[0.0], np.cumsum(np.hypot(*np.diff(closed, axis=0).T))])


def evenly_spaced(polygon, count):
    """Returns ``count`` points at even steps of the length of a closed polygon, from its first
    point."""
    closed, length = lengths(polygon)
    at = length[-1] * np.arange(count) / count
    return np.column_stack([np.interp(at, length, closed[:, 0]), np.interp(at, length, closed[:, 1])])


def flat(points):
    return [int(round(float(value) / UNIT)) for value in np.asarray(points).ravel()]


def section_plot():
    data = np.load(DATA)
    energies = data["energies"]
    born = np.isfinite(data["halos"]).all(axis=(1, 2))
    steps = (energies - FIRST_ENERGY) / ENERGY_STEP
    # the energies of the frames, and the first energy at which the halo orbits were computed
    keep = np.flatnonzero((steps > -1e-6) & ((np.abs(steps - np.round(steps)) < 1e-6) | (np.arange(len(energies)) == np.argmax(born))))
    directions = 2 * math.pi * np.arange(len(data["boundary_angles"]) - 1) / (len(data["boundary_angles"]) - 1)

    def curves(frame):
        """Returns the boundary, the curves about the vertical orbit, and the curves about the
        halo orbits at one energy, as polygons that start at mirrored points."""
        radius = data["boundary_radii"][frame][:-1]
        boundary = np.roll(np.column_stack([radius * np.cos(directions), radius * np.sin(directions)]), -3 * len(radius) // 4, axis=0)
        central = [closed_curve(points.astype(float), data["center"][frame], DOWN) for points in data["central"][frame][CENTRAL_CURVES]]
        islands = []
        if born[frame]:
            for side, mirror in enumerate((1.0, MIRROR)):
                for points in data["islands"][frame][side][ISLAND_CURVES]:
                    islands.append(closed_curve(points * mirror, data["halos"][frame][side] * mirror, RIGHT) * mirror)
        return [boundary], central, islands

    last = curves(keep[-1])
    perimeters = [[lengths(polygon)[1][-1] for polygon in group] for group in last]
    per_length = DOTS / sum(sum(group) for group in perimeters)
    counts = [[max(8, round(per_length * perimeter)) for perimeter in group] for group in perimeters]
    print(f"{len(keep)} energies from {energies[keep[0]]:.3f} to {energies[keep[-1]]:.3f}, "
          f"dots on the boundary {counts[0]}, about the vertical orbit {counts[1]}, about the halo orbits {counts[2]}")

    dots = {"boundary": [], "central": [], "islands": [], "vertical": [], "halos": []}
    for frame in keep:
        groups = curves(frame)
        for name, group, count in zip(("boundary", "central", "islands"), groups, counts):
            dots[name].append([value for polygon, n in zip(group, count) for value in flat(evenly_spaced(polygon, n))])
        dots["vertical"].append(flat(data["center"][frame]))
        dots["halos"].append(flat(data["halos"][frame]) if born[frame] else [])

    edge = last[0][0] / UNIT
    pad = 40
    x_range = [math.floor(edge[:, 0].min()) - pad, math.ceil(edge[:, 0].max()) + pad]
    y_range = [math.floor(edge[:, 1].min()) - pad, math.ceil(edge[:, 1].max()) + pad]
    shown = energies[keep]
    return {
        "parameter": {"label": "$h$", "digits": 2},
        "hold": 1.2,
        "fade": 0.6,
        "panels": [{"id": "section", "equal": True, "axes": False, "margin": [8, 8, 8, 8],
                    "x": {"range": x_range, "ticks": []}, "y": {"range": y_range, "ticks": []}}],
        "marks": [
            {"id": "boundary", "panel": "section", "kind": "points", "tone": "muted", "size": 3},
            {"id": "central", "panel": "section", "kind": "points", "tone": "violet", "size": 4},
            {"id": "islands", "panel": "section", "kind": "points", "tone": "accent", "size": 4},
            {"id": "vertical", "panel": "section", "kind": "points", "tone": "violet", "size": 9, "hollow": True},
            {"id": "halos", "panel": "section", "kind": "points", "tone": "accent", "size": 9, "hollow": True},
            {"id": "energy", "panel": "section", "kind": "label", "tone": "muted", "anchor": "start", "dy": -16},
        ],
        "tabs": [{"name": "energy", "label": "energy", "values": [round(float(e), 3) for e in shown],
                  "times": [round(float(SECONDS * (e - shown[0]) / (shown[-1] - shown[0])), 3) for e in shown],
                  "data": {**dots, "energy": {"at": [x_range[0], y_range[0]], "text": [f"$h = {e:.2f}$" for e in shown]}}}],
    }


if __name__ == "__main__":
    deck = Path(sys.argv[1]) if len(sys.argv) > 1 else DECK
    deck.write_text(write_script(deck.read_text(), "section", section_plot()))
