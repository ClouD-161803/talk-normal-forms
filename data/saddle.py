"""The plot of the slide on the linear flow at :math:`\\mathcal{L}_1`, written into the JSON script of index.html.

The plot is the planar linear flow at :math:`\\mathcal{L}_1` of the Earth–Moon circular restricted
three-body problem, in km from :math:`\\mathcal{L}_1`. The saddle plane and the center plane of the
flow each project one to one onto the plane of positions, hence the field of each plane is drawn
there as arrows. The labels of the plot are typeset by MathJax in the deck and laid over the plot.

Run it with a Python that has numpy: ``python data/saddle.py``.
"""

import math

import numpy as np

from pendulum import DECK, write_script

MASS_RATIO = 0.012150582
X_RANGE, Y_RANGE = 4200, 3400
SPACING = 700
LONGEST_ARROW = 0.55 * SPACING
HEAD, HEAD_HALF_WIDTH = 120, 46
EIGEN_HEAD, EIGEN_HEAD_HALF_WIDTH, EIGEN_HEAD_GAP = 240, 100, 160
EIGEN_HEAD_CLEARANCE = 250
EIGEN_HEAD_DELAY = 0.4
RIPPLE = 1.2
SHAFT_WIPE = 0.25
GRID = 1000
END_TIME, FRAMES = 1.4, 141
START = 4600
SADDLE_STARTS = [(START, 300), (START, 1100)]
OUT_START = 75
CENTER_AMPLITUDE = 850


def collinear_l1(mu):
    gamma = (mu / 3) ** (1 / 3)
    for _ in range(50):
        f = gamma ** 5 - (3 - mu) * gamma ** 4 + (3 - 2 * mu) * gamma ** 3 - mu * gamma ** 2 + 2 * mu * gamma - mu
        df = 5 * gamma ** 4 - 4 * (3 - mu) * gamma ** 3 + 3 * (3 - 2 * mu) * gamma ** 2 - 2 * mu * gamma + 2 * mu
        gamma -= f / df
    return gamma


def linear_flow():
    gamma = collinear_l1(MASS_RATIO)
    c2 = MASS_RATIO / gamma ** 3 + (1 - MASS_RATIO) / (1 - gamma) ** 3
    uxx = 1 + 2 * c2
    root = math.sqrt(9 * c2 ** 2 - 8 * c2)
    lam = math.sqrt((c2 - 2 + root) / 2)
    omega = math.sqrt((2 - c2 + root) / 2)
    slope = (lam ** 2 - uxx) / (2 * lam)
    stretch = (omega ** 2 + uxx) / (2 * omega)
    unstable = np.array([1.0, slope]) / math.hypot(1, slope)
    stable = np.array([1.0, -slope]) / math.hypot(1, slope)
    return lam, omega, stable, unstable, stretch


def head(tip, direction, length, half_width):
    """Returns the filled triangle of an arrowhead with its tip at ``tip``, pointing along ``direction``."""
    base = tip - length * direction
    normal = np.array([-direction[1], direction[0]])
    return rounded([tip, base + half_width * normal, base - half_width * normal])


def arrow(tail, velocity, length, ident, tone, delay):
    """Returns the shaft of an arrow as a curve and its filled head as a region of the plot."""
    direction = velocity / np.linalg.norm(velocity)
    tip = tail + length * direction
    shaft = {"id": ident, "points": rounded([tail, tip - 0.5 * HEAD * direction]), "tone": tone, "width": 1.5,
             "delay": delay, "wipe": SHAFT_WIPE}
    tip = {"id": ident, "points": head(tip, direction, HEAD, HEAD_HALF_WIDTH), "tone": tone, "opacity": 1,
           "delay": round(delay + 0.8 * SHAFT_WIPE, 2)}
    return shaft, tip


def double_heads(direction, radius, outward, ident, tone):
    """Returns the two double arrowheads on an eigenline, past ``radius`` on both sides of the origin."""
    regions = []
    for side in (1, -1):
        along = side * direction
        pointing = along if outward else -along
        inner = radius + EIGEN_HEAD_CLEARANCE
        tips = [inner + EIGEN_HEAD + k * EIGEN_HEAD_GAP if outward else inner + k * EIGEN_HEAD_GAP for k in (0, 1)]
        regions += [{"id": ident, "points": head(t * along, pointing, EIGEN_HEAD, EIGEN_HEAD_HALF_WIDTH),
                     "tone": tone, "opacity": 1, "delay": EIGEN_HEAD_DELAY} for t in tips]
    return regions


def on_ellipse(direction, stretch):
    """Returns the distance from the origin along ``direction`` to the dashed ellipse of the center."""
    return CENTER_AMPLITUDE / math.hypot(direction[0], direction[1] / stretch)


def quiver(field, ident, tone):
    """Returns the arrows of a field on a grid without a point at the origin, as curves of the plot.

    Each arrow is centered on its grid point, and its length grows as the square root of the speed.
    The arrows are shown in a ripple out of the origin, over ``RIPPLE`` seconds.
    """
    xs = np.arange(SPACING / 2, X_RANGE, SPACING)
    ys = np.arange(SPACING / 2, Y_RANGE, SPACING)
    points = [np.array([sx * x, sy * y]) for x in xs for y in ys for sx in (-1, 1) for sy in (-1, 1)]
    speeds = [np.linalg.norm(field(p)) for p in points]
    fastest = max(speeds)
    farthest = max(np.hypot(*p) for p in points)
    arrows = []
    for p, speed in sorted(zip(points, speeds), key=lambda e: np.hypot(*e[0])):
        length = LONGEST_ARROW * max(0.45, math.sqrt(speed / fastest))
        tail = p - 0.5 * length * field(p) / speed
        arrows.append(arrow(tail, field(p), length, ident, tone, round(RIPPLE * float(np.hypot(*p)) / farthest, 2)))
    return arrows


def rounded(points):
    return [[round(float(x)), round(float(y))] for x, y in points]


def saddle_plot():
    lam, omega, stable, unstable, stretch = linear_flow()
    basis = np.column_stack([stable, unstable])
    saddle = basis @ np.diag([-lam, lam]) @ np.linalg.inv(basis)
    center = np.array([[0, omega / stretch], [-stretch * omega, 0]])
    times = np.linspace(0, END_TIME, FRAMES)

    def on_saddle(a, b):
        return rounded(np.outer(a * np.exp(-lam * times), stable) + np.outer(b * np.exp(lam * times), unstable))

    data, marks = {}, []
    # a deviation on an eigenvector is traced in the tone of its line, which it is drawn over
    traces = [("in", "violet", [(s * START, 0) for s in (1, -1)]), ("out", "accent", [(0, s * OUT_START) for s in (1, -1)])]
    traces += [(f"hyp{k}", "text", [(sa * a, sb * b) for sa in (1, -1) for sb in (1, -1)]) for k, (a, b) in enumerate(SADDLE_STARTS)]
    for name, tone, starts in traces:
        for k, (a, b) in enumerate(starts):
            ident = f"{name}-{k}"
            data[ident] = on_saddle(a, b)
            marks.append({"id": ident, "panel": "phase", "kind": "trace", "tone": tone, "width": 3, "size": 12})
    # the orbit of the center is a tab of its own, over one period
    period = np.linspace(0, 2 * math.pi / omega, FRAMES)
    orbit = {"center": rounded(np.column_stack([CENTER_AMPLITUDE * np.cos(omega * period),
                                                -stretch * CENTER_AMPLITUDE * np.sin(omega * period)]))}
    marks.append({"id": "center", "panel": "phase", "kind": "trace", "tone": "blue", "width": 3, "size": 12})
    # the libration point is the last mark, hence it is drawn over the heads of the traces
    data["l1"] = orbit["l1"] = [[0, 0]]
    marks.append({"id": "l1", "panel": "phase", "kind": "points", "tone": "text", "size": 22, "width": 3, "hollow": True})

    reach = 1.1 * X_RANGE / stable[0]
    ring = np.linspace(0, 2 * math.pi, 121)
    arrows = quiver(lambda p: saddle @ p, "quiver-saddle", "muted")
    arrows += quiver(lambda p: center @ p, "quiver-center", "blue")
    grid = [{"id": "grid", "class": "grid", "points": [[x, -Y_RANGE], [x, Y_RANGE]], "tone": "muted", "width": 1}
            for x in range(-(X_RANGE // GRID) * GRID, X_RANGE + 1, GRID)]
    grid += [{"id": "grid", "class": "grid", "points": [[-X_RANGE, y], [X_RANGE, y]], "tone": "muted", "width": 1}
             for y in range(-(Y_RANGE // GRID) * GRID, Y_RANGE + 1, GRID)]
    curves = grid + [shaft for shaft, _ in arrows]
    regions = [tip for _, tip in arrows]
    regions += double_heads(stable, on_ellipse(stable, stretch), False, "stable-heads", "violet")
    regions += double_heads(unstable, on_ellipse(unstable, stretch), True, "unstable-heads", "accent")
    curves += [
        {"id": "stable-line", "points": rounded([-reach * stable, reach * stable]), "tone": "violet", "width": 3, "wipe": 0.8},
        {"id": "unstable-line", "points": rounded([-reach * unstable, reach * unstable]), "tone": "accent", "width": 3, "wipe": 0.8},
        {"id": "center-ring", "points": rounded(np.column_stack([CENTER_AMPLITUDE * np.cos(ring), stretch * CENTER_AMPLITUDE * np.sin(ring)])),
         "tone": "blue", "width": 2, "dash": [8, 8], "wipe": 0.8},
    ]
    print(f"lambda {lam:.4f}, omega {omega:.4f}, unstable slope {unstable[1] / unstable[0]:.4f}, "
          f"ellipse {stretch:.4f} times taller than wide, growth over the pass {math.exp(lam * END_TIME):.1f}, "
          f"top of the ellipse {stretch * CENTER_AMPLITUDE:.0f} km")
    return {
        "parameter": {"label": "$t$", "digits": 2},
        "duration": 7,
        "hold": 1.5,
        "panels": [{"id": "phase", "equal": True, "margin": [130, 16, 84, 110],
                    "x": {"range": [-X_RANGE, X_RANGE], "ticks": [-4000, -2000, 0, 2000, 4000]},
                    "y": {"range": [-Y_RANGE, Y_RANGE], "ticks": [-2000, 0, 2000]},
                    "regions": regions, "curves": curves}],
        "marks": marks,
        "tabs": [{"name": "flow", "label": "flow", "values": [round(float(t), 3) for t in times], "data": data},
                 {"name": "orbit", "label": "orbit", "values": [round(float(t), 3) for t in period], "data": orbit}],
    }


if __name__ == "__main__":
    DECK.write_text(write_script(DECK.read_text(), "saddle", saddle_plot()))
