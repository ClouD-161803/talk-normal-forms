"""The plots of the pendulum slides, written into the JSON scripts of index.html.

The pendulum is :math:`H = p^2/2 - \\cos q`. Its normal form up to degree 4 is
:math:`\\bar H = I - I^2/16`, where :math:`I` is the action of the linear part, and it is reached
with the generating function :math:`G_4 = q p (5 q^2 + 3 p^2) / 192`.

Run it with a Python that has numpy: ``python data/pendulum.py``.
"""

import json
import math
import re
from pathlib import Path

import numpy as np

DECK = Path(__file__).resolve().parent.parent / "index.html"
AMPLITUDES = [0.5, 1.0, 1.5, 2.0]
TONES = ["data-1", "data-2", "data-3", "data-4"]
FRAMES = 161
END_TIME = 4 * math.pi
ACTION_OF_SEPARATRIX = 8 / math.pi


def pendulum_field(state):
    q, p = state
    return np.array([p, -math.sin(q)])


def generating_field(state):
    """The Hamiltonian field of :math:`G_4`, whose time-one flow maps the normal-form
    coordinates to :math:`(q, p)`."""
    q, p = state
    return np.array([q * (5 * q**2 + 9 * p**2) / 192, -p * (15 * q**2 + 3 * p**2) / 192])


def rk4(field, state, duration, steps):
    step = duration / steps
    for _ in range(steps):
        k1 = field(state)
        k2 = field(state + 0.5 * step * k1)
        k3 = field(state + 0.5 * step * k2)
        k4 = field(state + step * k3)
        state = state + step * (k1 + 2 * k2 + 2 * k3 + k4) / 6
    return state


def to_normal_form(state):
    return rk4(generating_field, np.array(state, dtype=float), -1.0, 40)


def complete_elliptic(m):
    """Returns the complete elliptic integrals :math:`K(m)` and :math:`E(m)` of the parameter
    :math:`m`, computed with the arithmetic-geometric mean."""
    a, b, total, power = 1.0, math.sqrt(1 - m), m / 2, 0.5
    while abs(a - b) > 1e-15:
        a, b, c = (a + b) / 2, math.sqrt(a * b), (a - b) / 2
        power *= 2
        total += power * c**2
    k = math.pi / (2 * a)
    return k, k * (1 - total)


def exact_action_and_frequency(m):
    """Returns the action and the frequency of the libration with :math:`m = \\sin^2(q_0/2)`,
    where :math:`q_0` is the amplitude in rad."""
    k, e = complete_elliptic(m)
    return 8 / math.pi * (e - (1 - m) * k), math.pi / (2 * k)


def orbit(amplitude, times):
    states, state, now = [], np.array([amplitude, 0.0]), 0.0
    for t in times:
        state = rk4(pendulum_field, state, t - now, max(1, int((t - now) / 0.005)))
        now = t
        states.append(state.copy())
    return np.array(states)


def rounded(points, digits=3):
    return [[round(float(x), digits), round(float(y), digits)] for x, y in points]


def pendulum_plot():
    times = np.linspace(0, END_TIME, FRAMES)
    curves_phase, curves_normal, marks, data = [], [], [], {}
    for index, (amplitude, tone) in enumerate(zip(AMPLITUDES, TONES)):
        period = 4 * complete_elliptic(math.sin(amplitude / 2) ** 2)[0]
        closed = orbit(amplitude, np.linspace(0, period, 121))
        moving = orbit(amplitude, times)
        closed_normal = np.array([to_normal_form(s) for s in closed])
        moving_normal = np.array([to_normal_form(s) for s in moving])
        curves_phase.append({"id": f"level-{index}", "points": rounded(closed), "tone": "muted", "width": 2})
        curves_normal.append({"id": f"oval-{index}", "points": rounded(closed), "tone": "subtle", "width": 2, "dash": [8, 8]})
        curves_normal.append({"id": f"circle-{index}", "points": rounded(closed_normal), "tone": "muted", "width": 2.5})
        marks.append({"id": f"bob-{index}", "panel": "phase", "kind": "points", "tone": tone, "size": 9})
        marks.append({"id": f"turn-{index}", "panel": "normal", "kind": "points", "tone": tone, "size": 9})
        data[f"bob-{index}"] = [[round(float(q), 3), round(float(p), 3)] for q, p in moving]
        data[f"turn-{index}"] = [[round(float(q), 3), round(float(p), 3)] for q, p in moving_normal]
        radius = np.hypot(closed_normal[:, 0], closed_normal[:, 1])
        print(f"amplitude {amplitude}: period {period:.4f}, radius in the normal form "
              f"{radius.mean():.4f} +- {radius.std():.4f}, in (q, p) "
              f"+- {np.hypot(closed[:, 0], closed[:, 1]).std():.4f}")
    separatrix = [[q, 2 * math.cos(q / 2)] for q in np.linspace(-math.pi, math.pi, 81)]
    separatrix += [[q, -2 * math.cos(q / 2)] for q in np.linspace(math.pi, -math.pi, 81)]
    curves_phase.append({"id": "separatrix", "points": rounded(separatrix), "tone": "subtle", "width": 2, "dash": [8, 8]})
    frame = {"equal": True, "margin": [110, 20, 84, 100],
             "x": {"range": [-3.4, 3.4], "ticks": [-2, 0, 2], "title": "$q$"},
             "y": {"range": [-2.3, 2.3], "ticks": [-2, 0, 2], "title": "$p$"}}
    top_of_circle = float(np.hypot(closed_normal[:, 0], closed_normal[:, 1]).max())
    return {
        "parameter": {"label": "$t$", "digits": 1},
        "duration": 14,
        "hold": 1,
        "panels": [
            {"id": "phase", **frame, "curves": curves_phase,
             "labels": [{"id": "separatrix-name", "text": "separatrix", "at": [0, 2.0], "anchor": "middle", "dy": -14, "tone": "subtle"}]},
            {"id": "normal", **frame, "curves": curves_normal,
             "labels": [
                 {"id": "before-name", "text": "in $(q, p)$", "at": [AMPLITUDES[-1], 0], "anchor": "start", "dx": 16, "tone": "subtle"},
                 {"id": "after-name", "text": "in the normal form, $N = 4$", "at": [0, top_of_circle], "anchor": "middle", "dy": -16, "tone": "muted"},
             ]},
        ],
        "marks": marks,
        "tabs": [{"name": "flow", "label": "flow", "values": [round(float(t), 3) for t in times], "data": data}],
    }


def frequency_plot():
    actions, exact = [], []
    for m in np.concatenate([np.linspace(1e-6, 0.99, 100), 1 - np.logspace(-2, -12, 60)]):
        action, frequency = exact_action_and_frequency(float(m))
        actions.append(action)
        exact.append(frequency)
    actions.append(ACTION_OF_SEPARATRIX)
    exact.append(0.0)
    grid = np.linspace(0, ACTION_OF_SEPARATRIX, 81)
    degree_4 = 1 - grid / 8
    degree_6 = degree_4 - 3 * grid**2 / 256
    degree_8 = degree_6 - 5 * grid**3 / 2048

    def at_end(series):
        return [ACTION_OF_SEPARATRIX, float(series[-1])]

    return {
        "parameter": {"label": "$I$", "digits": 2},
        "panels": [{
            "id": "frequency", "margin": [110, 150, 96, 120],
            "x": {"range": [0, 2.7], "ticks": [0, 1, 2, {"at": ACTION_OF_SEPARATRIX, "text": "$8/\\pi$"}], "title": "action $I$"},
            "y": {"range": [0, 1.05], "ticks": [0, 0.5, 1], "title": "frequency $\\omega$"},
            "curves": [
                {"id": "edge", "points": [[ACTION_OF_SEPARATRIX, 0], [ACTION_OF_SEPARATRIX, 1.05]], "tone": "subtle", "width": 2, "dash": [8, 8]},
                {"id": "exact", "points": rounded(zip(actions, exact), 4), "tone": "text", "width": 3.5},
                {"id": "n4", "points": rounded(zip(grid, degree_4), 4), "tone": "accent", "width": 3, "wipe": 0.8},
                {"id": "n6", "points": rounded(zip(grid, degree_6), 4), "tone": "violet", "width": 3, "wipe": 0.8},
                {"id": "n8", "points": rounded(zip(grid, degree_8), 4), "tone": "data-3", "width": 3, "wipe": 0.8},
            ],
            "labels": [
                {"id": "exact-name", "text": "exact", "at": [2.2, float(np.interp(2.2, actions, exact))], "anchor": "end", "dx": -16, "dy": 30, "tone": "text"},
                {"id": "n4-name", "text": "$N = 4$", "at": at_end(degree_4), "anchor": "start", "dx": 12, "dy": 0, "tone": "accent"},
                {"id": "n6-name", "text": "$N = 6$", "at": at_end(degree_6), "anchor": "start", "dx": 12, "dy": 8, "tone": "violet"},
                {"id": "n8-name", "text": "$N = 8$", "at": at_end(degree_8), "anchor": "start", "dx": 12, "dy": 16, "tone": "data-3"},
                {"id": "edge-name", "text": "separatrix", "at": [ACTION_OF_SEPARATRIX, 0.2], "anchor": "end", "dx": -12, "tone": "subtle"},
            ],
        }],
        "marks": [],
        "tabs": [{"name": "still", "label": "still", "values": [0], "data": {}}],
    }


def write_script(page, name, plot):
    block = re.compile(r'(<script type="application/json" id="%s">).*?(</script>)' % name, re.S)
    if not block.search(page):
        raise SystemExit(f"index.html does not have a JSON script with the id {name}")
    text = json.dumps(plot, separators=(",", ":"))
    return block.sub(lambda match: match.group(1) + text + match.group(2), page)


if __name__ == "__main__":
    page = DECK.read_text()
    page = write_script(page, "pendulum", pendulum_plot())
    page = write_script(page, "frequency", frequency_plot())
    DECK.write_text(page)
    for amplitude in AMPLITUDES:
        action, frequency = exact_action_and_frequency(math.sin(amplitude / 2) ** 2)
        print(f"amplitude {amplitude}: action {action:.4f}, exact frequency {frequency:.4f}, "
              f"1 - I/8 = {1 - action / 8:.4f}")
