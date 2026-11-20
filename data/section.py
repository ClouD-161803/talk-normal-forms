"""The section of the center manifold at a ladder of energies, written for the drawing ``section``.

The center manifold of the Earth-Moon :math:`L_2` is cut by :math:`q_3 = 0` with :math:`p_3 > 0`
on a level :math:`h` of its Hamiltonian (Fig. 6 of Jorba and Masdemont 1999). DyLAN reduced the
Hamiltonian to the center manifold at degree 20 and computed the section at a ladder of energies
from 0.2 to 1.0. The file sections.npz holds, at each energy, the boundary of the section, the
vertical Lyapunov orbit, the halo orbits, and 80 crossings of the orbits about the vertical
Lyapunov orbit and about each halo orbit. The orbits start at fixed fractions of the way from
their fixed point to the boundary. The file was written by
``_support/_python/center-manifold-section-ladder.py`` in the vault.

The crossings of an orbit lie on a closed curve around its fixed point. Function ``closed_curve``
returns this curve as a polygon, and function ``evenly_spaced`` returns points at even steps of its
length. Each curve has the same number of points at every energy. In the browser,
demos/families/families.js thus draws the section between two energies of the ladder from points
interpolated in :math:`h`, and it colors each curve by its rotation number, as the figure of the
DyLAN demonstration does.

Run it with a Python that has numpy: ``python data/section.py`` writes demos/families/section.js.
"""

import base64
import json
import math
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
DATA = HERE / "sections.npz"
OUT = HERE.parent / "demos" / "families" / "section.js"
FIRST_ENERGY = 0.2
POLYGON = 720
# the Fourier series of a closed curve, and the weight of the penalty on its second derivative
HARMONICS = 24
STIFFNESS = 2e-7
BOUNDARY_POINTS = 240
# the points of all curves at the last energy, shared in proportion to the lengths of the curves
POINTS = 3000
FEWEST_POINTS = 28
# the largest coordinate is stored as this 16-bit integer
LARGEST = 30000
DOWN, RIGHT, MIRROR = np.array([0.0, -1.0]), np.array([1.0, 0.0]), np.array([-1.0, 1.0])


def closed_curve(points, center, start, mirrored=False):
    """Returns the closed curve through the crossings of an orbit around a fixed point as a
    polygon, counterclockwise from its point on the ray from the fixed point along ``start``.

    The curve is written in the polar angle about the fixed point, in the coordinates in which the
    second moments of the crossings about it are the identity. In these coordinates the curve is
    close to a circle. The distance from the fixed point is fitted to the crossings as a Fourier
    series of the angle by least squares, with a penalty on its second derivative. An orbit close to
    a resonance leaves gaps between its crossings, and the series thus closes them with a smooth
    arc. A curve around the vertical Lyapunov orbit is its own mirror image in the first
    coordinate, and with ``mirrored`` the mirror images of its crossings are fitted as well."""
    offsets = points - center
    if mirrored:
        offsets = np.vstack([offsets, offsets * MIRROR])
    values, vectors = np.linalg.eigh(offsets.T @ offsets / len(offsets))
    whiten = vectors @ np.diag(values**-0.5) @ vectors.T
    white = offsets @ whiten
    angle, radius = np.arctan2(white[:, 1], white[:, 0]), np.hypot(white[:, 0], white[:, 1])
    orders = np.arange(1, HARMONICS + 1)

    def series(at):
        return np.hstack([np.ones((len(at), 1)), np.cos(np.outer(at, orders)), np.sin(np.outer(at, orders))])

    design = series(angle)
    penalty = STIFFNESS * len(angle) * np.diag(np.concatenate([[0.0], orders**4.0, orders**4.0]))
    coefficients = np.linalg.solve(design.T @ design + penalty, design.T @ radius)
    first = start @ whiten
    grid = math.atan2(first[1], first[0]) + 2 * math.pi * np.arange(POLYGON) / POLYGON
    radius = series(grid) @ coefficients
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


def rotation_number(points, center):
    """Returns the mean angle in turns per return that carries the crossings of an orbit about its
    fixed point, as in the DyLAN demonstration."""
    angles = np.unwrap(np.arctan2(points[:, 1] - center[1], points[:, 0] - center[0]))
    return abs(angles[-1] - angles[0]) / (2 * math.pi * (len(points) - 1))


def section():
    data = np.load(DATA)
    keep = np.flatnonzero(data["energies"] > FIRST_ENERGY - 1e-9)
    energies = data["energies"][keep]
    born = np.isfinite(data["halos"][keep]).all(axis=(1, 2))
    first_born = int(np.argmax(born))
    polar = 2 * math.pi * np.arange(BOUNDARY_POINTS) / BOUNDARY_POINTS

    def curves(index):
        """Returns the polygon and the rotation number of each curve at one energy, first those
        about the vertical Lyapunov orbit and then those about the halo orbits. The curves about
        the two halo orbits start at mirrored points. Before the halo orbits are born, their curves
        are those of the first energy with them, where the drawing fades them in."""
        frame = keep[index]
        out = []
        for points in data["central"][frame]:
            points = points[np.isfinite(points).all(axis=1)].astype(float)
            out.append((closed_curve(points, data["center"][frame], DOWN, True), rotation_number(points, data["center"][frame])))
        frame = keep[max(index, first_born)]
        for side, mirror in enumerate((1.0, MIRROR)):
            for points in data["islands"][frame][side]:
                points = points[np.isfinite(points).all(axis=1)].astype(float)
                halo = data["halos"][frame][side]
                out.append((closed_curve(points * mirror, halo * mirror, RIGHT) * mirror, rotation_number(points, halo)))
        return out

    last = curves(len(keep) - 1)
    perimeters = np.array([lengths(polygon)[1][-1] for polygon, _ in last])
    counts = np.maximum(FEWEST_POINTS, np.round(POINTS * perimeters / perimeters.sum())).astype(int)
    central = len(data["central"][keep[0]])

    frames, rotations, vertical, halos = [], [], [], []
    for index, frame in enumerate(keep):
        radius = np.interp(polar, data["boundary_angles"], data["boundary_radii"][frame])
        rows = [np.column_stack([radius * np.cos(polar), radius * np.sin(polar)])]
        both = curves(index)
        rows += [evenly_spaced(polygon, count) for (polygon, _), count in zip(both, counts)]
        frames.append(np.vstack(rows))
        rotations.append([round(float(rotation), 5) for _, rotation in both])
        vertical.append(data["center"][frame])
        halos.append(data["halos"][keep[max(index, first_born)]].ravel())
    frames = np.array(frames)
    unit = float(np.abs(frames).max()) / LARGEST
    values = [r for row, alive in zip(rotations, born) for r in (row if alive else row[:central])]
    print(f"{len(keep)} energies from {energies[0]:.3f} to {energies[-1]:.3f}, halo orbits from {energies[first_born]:.3f}, "
          f"{central} + {len(counts) - central} curves of {counts.min()} to {counts.max()} points, {frames.shape[1]} points per energy, "
          f"rotation numbers {min(values):.4f} to {max(values):.4f}")
    integers = lambda rows: [[int(round(float(v) / unit)) for v in row] for row in rows]
    return {
        "unit": unit,
        "energies": [round(float(e), 4) for e in energies],
        "born": first_born,
        "boundary": BOUNDARY_POINTS,
        "central": central,
        "counts": [int(c) for c in counts],
        "rotation": rotations,
        "range": [min(values), max(values)],
        "vertical": integers(vertical),
        "halos": integers(halos),
        "points": base64.b64encode(np.round(frames / unit).astype("<i2").tobytes()).decode(),
    }


if __name__ == "__main__":
    OUT.parent.mkdir(parents=True, exist_ok=True)
    text = "(window.FamiliesData ??= {}).section = " + json.dumps(section(), separators=(",", ":")) + ";\n"
    OUT.write_text(text)
    print(f"{OUT.name}: {len(text)} bytes")
