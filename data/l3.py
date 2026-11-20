"""The plot of the slide on the manifolds of :math:`L_3`, written into the JSON script of index.html.

In the planar circular restricted three-body problem, :math:`L_3` is a saddle times a center. Each
branch of its unstable manifold is integrated from the point along the unstable eigenvector, for
the Sun and Jupiter and for the Earth and the Moon. The stable manifold is the mirror image of the
unstable one in the :math:`x` axis.

Run it with a Python that has numpy: ``python data/l3.py``.
"""

import math

import numpy as np

from pendulum import DECK, write_script

MASS_RATIOS = {"sj": 9.5388e-4, "em": 0.012150582}
NAMES = {"sj": ("Sun", "Jupiter"), "em": ("Earth", "Moon")}
LIMIT = 1.3
DISPLACEMENT = 1e-6
TOLERANCE = 1e-11
POINTS_PER_BRANCH = 300

# the Dormand-Prince pair of orders 5 and 4
STAGES = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9],
          [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
          [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
          [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]]
ORDER_5 = np.array([35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0])
ORDER_4 = np.array([5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40])


def abscissa_of_l3(mu):
    """Returns the :math:`x` coordinate of :math:`L_3`, with the primaries at :math:`-\\mu` and
    :math:`1 - \\mu`."""
    def force(x):
        return x + (1 - mu) / (x + mu) ** 2 + mu / (x - 1 + mu) ** 2

    low, high = -2.0, -0.5
    for _ in range(200):
        middle = (low + high) / 2
        if force(low) * force(middle) <= 0:
            high = middle
        else:
            low = middle
    return (low + high) / 2


def unstable_direction(mu, x):
    """Returns the rate :math:`\\lambda` of the saddle of :math:`L_3` and the unit eigenvector of
    :math:`+\\lambda` in :math:`(x, y, \\dot x, \\dot y)`."""
    c = (1 - mu) / abs(x + mu) ** 3 + mu / abs(x - 1 + mu) ** 3
    rate = math.sqrt((c - 2 + math.sqrt(9 * c * c - 8 * c)) / 2)
    slope = (rate * rate - 1 - 2 * c) / (2 * rate)
    vector = np.array([1.0, slope, rate, rate * slope])
    return rate, vector / np.linalg.norm(vector)


def field(state, mu):
    x, y, vx, vy = state
    r1 = math.hypot(x + mu, y)
    r2 = math.hypot(x - 1 + mu, y)
    ax = x - (1 - mu) * (x + mu) / r1**3 - mu * (x - 1 + mu) / r2**3 + 2 * vy
    ay = y - (1 - mu) * y / r1**3 - mu * y / r2**3 - 2 * vx
    return np.array([vx, vy, ax, ay])


def unstable_branch(mu, sign):
    """Returns the points :math:`(x, y)` of one branch of the unstable manifold of :math:`L_3`,
    from the point until the branch is back at the :math:`x` axis on the side of :math:`L_3`, or
    out of the frame of the plot."""
    x3 = abscissa_of_l3(mu)
    rate, direction = unstable_direction(mu, x3)
    state = np.array([x3, 0.0, 0.0, 0.0]) + sign * DISPLACEMENT * direction
    time, step, points = 0.0, 1e-3, [state[:2].copy()]
    while time < 14 / rate + 400:
        slopes = []
        for row in STAGES:
            slopes.append(field(state + step * sum(a * k for a, k in zip(row, slopes)) if row else state, mu))
        slopes = np.array(slopes)
        error = np.max(np.abs(step * ((ORDER_5 - ORDER_4) @ slopes)))
        if error <= TOLERANCE:
            before = state
            state = state + step * (ORDER_5 @ slopes)
            time += step
            if max(abs(state[0]), abs(state[1])) > LIMIT:
                break
            points.append(state[:2].copy())
            if time > 5 / rate and state[0] < 0 and before[1] * state[1] < 0:
                break
        step = min(0.05, step * min(4.0, max(0.2, 0.9 * (TOLERANCE / max(error, 1e-300)) ** 0.2)))
    return np.array(points)


def thinned(points, mirror=False):
    kept = points[:: max(1, len(points) // POINTS_PER_BRANCH)]
    if not np.array_equal(kept[-1], points[-1]):
        kept = np.vstack([kept, points[-1]])
    return [[round(float(x), 3), round(float(-y if mirror else y), 3)] for x, y in kept]


def l3_plot():
    curves = [{"id": "orbit", "circle": [0, 0, 1], "tone": "subtle", "width": 1.5, "dash": [4, 8]}]
    marks, data = [], {}
    for key, mu in MASS_RATIOS.items():
        branches = [unstable_branch(mu, sign) for sign in (1, -1)]
        for index, branch in enumerate(branches):
            curves.append({"id": f"{key}-s-{index}", "points": thinned(branch, mirror=True),
                           "tone": "violet", "width": 3, "wipe": 1.6})
        for index, branch in enumerate(branches):
            curves.append({"id": f"{key}-u-{index}", "points": thinned(branch),
                           "tone": "accent", "width": 3, "dash": [14, 10], "wipe": 1.6})
        marks.append({"id": f"{key}-bodies", "panel": "frame", "kind": "points", "tone": "text", "size": 11})
        data[f"{key}-bodies"] = [[-mu, 0, 1 - mu, 0]]
        rate, _ = unstable_direction(mu, abscissa_of_l3(mu))
        closest = min(float(np.min(np.hypot(b[:, 0] - 1 + mu, b[:, 1]))) for b in branches)
        ends = ", ".join(f"({b[-1, 0]:.4f}, {b[-1, 1]:.4f})" for b in branches)
        print(f"{' and '.join(NAMES[key])}: L3 at x = {abscissa_of_l3(mu):.6f}, rate {rate:.5f}, "
              f"closest to the secondary {closest:.4f}, branches end at {ends}")
    mu = MASS_RATIOS["sj"]
    x3 = abscissa_of_l3(mu)
    marks.append({"id": "points", "panel": "frame", "kind": "points", "tone": "text", "size": 7, "hollow": True})
    data["points"] = [[x3, 0, 0.5 - mu, math.sqrt(3) / 2, 0.5 - mu, -math.sqrt(3) / 2]]
    labels = [
        {"id": "l3-name", "text": "$\\mathcal{L}_3$", "at": [x3, 0], "anchor": "end", "dx": -18, "dy": 10, "tone": "text"},
        {"id": "l4-name", "text": "$\\mathcal{L}_4$", "at": [0.5, math.sqrt(3) / 2], "anchor": "end", "dx": -56, "dy": 66, "tone": "text"},
        {"id": "l5-name", "text": "$\\mathcal{L}_5$", "at": [0.5, -math.sqrt(3) / 2], "anchor": "end", "dx": -56, "dy": -74, "tone": "text"},
        {"id": "sj-big", "text": NAMES["sj"][0], "at": [0, 0], "anchor": "middle", "dy": 48, "tone": "muted"},
        {"id": "sj-small", "text": NAMES["sj"][1], "at": [1, 0], "anchor": "start", "dx": 20, "dy": 10, "tone": "muted"},
        {"id": "em-big", "text": NAMES["em"][0], "at": [0, 0], "anchor": "middle", "dy": 100, "tone": "muted"},
        {"id": "em-small", "text": NAMES["em"][1], "at": [1, 0], "anchor": "start", "dx": 20, "dy": 10, "tone": "muted"},
        {"id": "u-name", "text": "unstable manifold of $\\mathcal{L}_3$", "at": [LIMIT, LIMIT], "anchor": "end", "dy": -64, "tone": "accent"},
        {"id": "s-name", "text": "stable manifold of $\\mathcal{L}_3$", "at": [LIMIT, LIMIT], "anchor": "end", "dy": -22, "tone": "violet"},
    ]
    return {
        "parameter": {"label": "$t$", "digits": 0},
        "panels": [{"id": "frame", "equal": True, "axes": False, "margin": [110, 10, 10, 10],
                    "x": {"range": [-LIMIT, LIMIT], "ticks": []}, "y": {"range": [-LIMIT, LIMIT], "ticks": []},
                    "curves": curves, "labels": labels}],
        "marks": marks,
        "tabs": [{"name": "still", "label": "still", "values": [0], "data": data}],
    }


if __name__ == "__main__":
    DECK.write_text(write_script(DECK.read_text(), "l3", l3_plot()))
