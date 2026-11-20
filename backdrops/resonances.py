"""The backdrop resonances: the web of resonances in the plane of the frequencies at the triangular
libration points.

At :math:`\\mathcal{L}_4` the quadratic part of the Hamiltonian is
:math:`H_2 = \\omega_1 I_1 - \\omega_2 I_2 + I_3`, where :math:`I_1`, :math:`I_2`, and :math:`I_3` are
the actions of the long-period, the short-period, and the vertical oscillation. The two planar
frequencies satisfy :math:`\\omega_1^2 + \\omega_2^2 = 1` and
:math:`\\omega_1^2 \\omega_2^2 = 27 \\mu (1 - \\mu) / 4`, where :math:`\\mu` is the mass ratio. As
:math:`\\mu` grows from 0 to Routh's value :math:`\\mu_R = (1 - \\sqrt{23/27})/2`, the point
:math:`(\\omega_1, \\omega_2)` runs along the unit circle from :math:`(1, 0)` to
:math:`(1/\\sqrt{2}, 1/\\sqrt{2})`. A normal form divides by :math:`k \\cdot \\omega` for each term
:math:`k`, hence a term cannot be removed on the resonance line
:math:`k_1 \\omega_1 + k_2 \\omega_2 + k_3 = 0`.

The drawing is made of the resonance lines of the coprime integer vectors :math:`k` with
:math:`1 \\le |k_1| + |k_2| + |k_3| \\le N`, fainter as the order :math:`|k_1| + |k_2| + |k_3|` grows,
each traced from its point nearest CENTER outward. A line is cut into pieces at the radii of BANDS
around CENTER, and each piece is drawn at the opacity of its band, hence the web fades out at the
circle of radius RADIUS. The key fade of the file format is not used, since straight trajectories
with a fade are drawn nearly blank by the theme.
The arc of the frequencies, the lines :math:`\\omega_1 = 2 \\omega_2` and :math:`\\omega_1 = 3 \\omega_2`
at which the instability of :math:`\\mathcal{L}_4` is proved, and the points of the Sun–Jupiter and the
Earth–Moon systems are drawn over them. The clock of the file is in seconds of the trace.

Run it with a Python that has numpy: ``python backdrops/resonances.py``.
"""

import json
import math
from itertools import product
from pathlib import Path

import numpy as np

OUT = Path(__file__).with_suffix(".js")
N = 6
CENTER = np.array([0.86, 0.36])
RADIUS = 0.54
# outer radius and opacity of each band of the web around CENTER. the opacity is ((1 - r) / 0.4)^2
# at the middle radius r of each band beyond 0.6, in units of RADIUS
BANDS = [(r * RADIUS, o) for r, o in [(0.6, 1.0), (0.68, 0.81), (0.76, 0.49), (0.84, 0.25), (0.92, 0.09), (1.0, 0.02)]]
MU_ROUTH = (1 - math.sqrt(23 / 27)) / 2
SYSTEMS = {"Sun–Jupiter": (9.5388e-4, (0.99676, 0.08046)), "Earth–Moon": (0.0121506, (0.95450, 0.29821))}
UNSTABLE = {(1, -2, 0): 0.0242939, (1, -3, 0): 0.0135160}
MARK = 0.011


def frequencies(mu):
    product_of_squares = 27 * mu * (1 - mu) / 4
    short = (1 - np.sqrt(np.maximum(1 - 4 * product_of_squares, 0))) / 2
    return np.sqrt(1 - short), np.sqrt(short)


def mass_ratio(k):
    """Returns the mass ratio at which the arc of the frequencies crosses the line
    :math:`k_1 \\omega_1 + k_2 \\omega_2 = 0`."""
    ratio = -k[1] / k[0]
    short = 1 / (1 + ratio**2)
    return (1 - math.sqrt(1 - 4 * 4 * (1 - short) * short / 27)) / 2


def resonances():
    seen = set()
    for k in product(range(-N, N + 1), repeat=3):
        order = sum(map(abs, k))
        if not 1 <= order <= N or k[:2] == (0, 0) or math.gcd(*k) != 1:
            continue
        first = next(c for c in k if c)
        k = tuple(c if first > 0 else -c for c in k)
        if k not in seen:
            seen.add(k)
            yield k, order


def rounded(points):
    return np.round(np.asarray(points), 4).tolist()


def halves(k, start, duration, look):
    """Returns the pieces of the two halves of the chord of line k in the circle around CENTER, each
    half from the point of line k nearest CENTER outward, or nothing when line k misses the circle."""
    normal = np.array(k[:2], dtype=float)
    norm = np.linalg.norm(normal)
    distance = (normal @ CENTER + k[2]) / norm
    if abs(distance) >= RADIUS * 0.98:
        return []
    foot = CENTER - distance * normal / norm
    along = np.array([-normal[1], normal[0]]) / norm
    reach = math.sqrt(RADIUS**2 - distance**2)
    cuts = [0.0] + [math.sqrt(max(r**2 - distance**2, 0)) for r, _ in BANDS if r > abs(distance)]
    opacities = [o for r, o in BANDS if r > abs(distance)]
    out = []
    for side in (1, -1):
        for (a, b), opacity in zip(zip(cuts, cuts[1:]), opacities):
            if b - a < 1e-4:
                continue
            ends = foot + side * np.outer([a, b], along)
            out.append({"points": rounded(ends), "t": [0, round(duration * (b - a) / reach, 3)],
                        "start": round(start + duration * a / reach, 3), "k": list(k),
                        **look, "alpha": round(look["alpha"] * opacity, 3)})
    return out


def families():
    out = []
    mu = MU_ROUTH * np.linspace(0, 1, 121) ** 2
    arc = np.column_stack(frequencies(mu))
    length = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(arc, axis=0).T))])
    out.append({"points": rounded(arc), "t": np.round(2.4 * length / length[-1], 3).tolist(), "start": 0,
                "kind": "frequencies", "tone": "orange", "alpha": 0.95, "weight": 2})
    for k, order in sorted(resonances(), key=lambda item: item[1]):
        if k in UNSTABLE:
            continue
        look = {"kind": "resonance", "order": order, "tone": "text",
                "alpha": round(0.55 * (2 / max(order, 2)) ** 1.1, 3), "weight": 1.3 if order <= 3 else 1}
        out += halves(k, 2.0 + 0.75 * (order - 1), 1.3, look)
    for i, k in enumerate(UNSTABLE):
        out += halves(k, 7.4 + 0.5 * i, 1.6, {"kind": "unstable", "tone": "violet", "alpha": 0.9, "weight": 1.8})
    angles = np.linspace(0, 2 * np.pi, 25)
    for i, (name, (mu, _)) in enumerate(SYSTEMS.items()):
        centre = np.array(frequencies(mu))
        ring = centre + MARK * np.column_stack([np.cos(angles), np.sin(angles)])
        out.append({"points": rounded(ring), "t": np.round(np.linspace(0, 0.6, 25), 3).tolist(),
                    "start": 9.4 + 0.5 * i, "kind": "system", "system": name, "mu": mu, "tone": "text",
                    "alpha": 0.95, "weight": 1.3})
    return out


def check():
    """Checks Routh's value, the frequencies of the two systems, and the mass ratios of the two lines
    of instability against the values quoted in SYSTEMS and UNSTABLE."""
    assert abs(MU_ROUTH - 0.0385209) < 5e-8
    assert np.allclose(frequencies(MU_ROUTH), (1 / math.sqrt(2), 1 / math.sqrt(2)), atol=1e-6)
    for mu, quoted in SYSTEMS.values():
        assert np.allclose(frequencies(mu), quoted, atol=5e-6), (frequencies(mu), quoted)
    for k, quoted in UNSTABLE.items():
        mu = mass_ratio(k)
        w1, w2 = frequencies(mu)
        assert abs(mu - quoted) < 5e-8 and abs(k[0] * w1 + k[1] * w2) < 1e-9, (mu, quoted)
        print(f"line {k}: mu = {mu:.7f}, omega = ({w1:.5f}, {w2:.5f})")


if __name__ == "__main__":
    check()
    trajectories = families()
    text = "Beeson.trajectories(" + json.dumps({"families": trajectories}, separators=(",", ":"),
                                                ensure_ascii=False) + ");\n"
    OUT.write_text(text)
    points = sum(len(r["points"]) for r in trajectories)
    last = max(r["start"] + r["t"][-1] for r in trajectories)
    lines = len({tuple(r["k"]) for r in trajectories if r["kind"] == "resonance"})
    print(f"{len(trajectories)} trajectories ({lines} resonance lines), {points} points, "
          f"{len(text.encode())} bytes, last time {last:.2f} s")
