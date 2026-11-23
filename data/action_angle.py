import math

from pendulum import DECK, write_script

TRACE_SECONDS = 3.0
RING, TUBE, TILT = 1.0, 0.40, 0.70
TUBE_TURNS_PER_RING_TURN, PHASE = 2.5, 0.6
RING_TURNS = 2
TAU = 2 * math.pi


def r3(v):
    return round(v, 3)


def pts(points):
    return [[r3(x), r3(y)] for x, y in points]


def head(tip, direction, size):
    dx, dy = direction
    n = math.hypot(dx, dy) or 1.0
    ux, uy = dx / n, dy / n
    px, py = -uy, ux
    x, y = tip
    base = (x - ux * size, y - uy * size)
    return pts([(x, y), (base[0] + px * 0.42 * size, base[1] + py * 0.42 * size),
                (base[0] - px * 0.42 * size, base[1] - py * 0.42 * size)])


def tag(plot, ident):
    for panel in plot["panels"]:
        for key in ("regions", "curves", "labels"):
            for item in panel.get(key, []):
                item["id"] = ident
    return {**plot, "marks": [], "tabs": [{"name": "still", "values": [0], "data": {}}]}


def solid(points, tone, **extra):
    return {"points": points, "tone": tone, "opacity": 1, **extra}


def circle_plot():
    radius, phi = 1.0, 0.72
    ring = [(radius * math.cos(-TAU * k / 240), radius * math.sin(-TAU * k / 240)) for k in range(241)]
    regions = [
        {"points": pts(ring), "tone": "blue", "opacity": 0.12, "iris": 0.8},
        solid(head((1.5, 0), (1, 0), 0.11), "muted"),
        solid(head((0, 1.5), (0, 1), 0.11), "muted"),
    ]
    for a in (math.pi / 2, math.pi * 7 / 6, math.pi * 11 / 6):
        tip = (radius * math.cos(a), radius * math.sin(a))
        regions.append(solid(head(tip, (math.sin(a), -math.cos(a)), 0.14), "blue", delay=1.2))
    end = (radius * math.cos(phi), -radius * math.sin(phi))
    dot = [(end[0] + 0.045 * math.cos(TAU * k / 24), end[1] + 0.045 * math.sin(TAU * k / 24)) for k in range(25)]
    regions.append(solid(pts(dot), "text", delay=1.2))
    arc = [(0.3 * math.cos(-phi * k / 30), 0.3 * math.sin(-phi * k / 30)) for k in range(31)]
    curves = [
        {"points": [[-1.5, 0], [1.42, 0]], "tone": "muted", "width": 1.5},
        {"points": [[0, -1.5], [0, 1.42]], "tone": "muted", "width": 1.5},
        {"points": pts(ring), "tone": "blue", "width": 3, "wipe": 1.2},
        {"points": pts([(0, 0), end]), "tone": "text", "width": 2, "delay": 1.2},
        {"points": pts(arc), "tone": "text", "width": 1.5, "delay": 1.2},
    ]
    labels = [
        {"at": [1.5, 0], "text": "$x_j$", "anchor": "end", "dy": -18, "tone": "subtle"},
        {"at": [0, 1.5], "text": "$y_j$", "anchor": "start", "dx": 12, "dy": 10, "tone": "subtle"},
        {"at": [-0.5, 0.32], "text": "$2\\pi I_j$", "anchor": "middle", "tone": "blue"},
        {"at": [0.42, -0.22], "text": "$\\varphi_j$", "anchor": "start", "tone": "text"},
        {"at": [r3(end[0]), r3(end[1])], "text": "$\\sqrt{2I_j}$", "anchor": "start", "dx": 10, "dy": 16, "tone": "text"},
    ]
    return {"panels": [{"id": "aa-circ", "equal": True, "axes": False, "margin": [4, 4, 4, 4],
                        "x": {"range": [-1.55, 1.55]}, "y": {"range": [-1.55, 1.6]},
                        "regions": regions, "curves": curves, "labels": labels}]}


def torus_point(psi, theta):
    c, s = math.cos(TILT), math.sin(TILT)
    x = (RING + TUBE * math.cos(theta)) * math.cos(psi)
    y = (RING + TUBE * math.cos(theta)) * math.sin(psi)
    z = TUBE * math.sin(theta)
    return x, y * s + z * c


def faces_viewer(psi, theta):
    return math.cos(theta) * math.sin(psi) * math.cos(TILT) - math.sin(theta) * math.sin(TILT) < 0


def orbit_theta(psi):
    return TUBE_TURNS_PER_RING_TURN * psi + PHASE


def torus_plot():
    n = 360
    outer, inner = [], []
    for k in range(n + 1):
        psi = TAU * k / n
        edge = math.atan2(math.sin(psi) * math.cos(TILT), math.sin(TILT))
        outer.append(torus_point(psi, edge))
        inner.append(torus_point(psi, edge + math.pi))
    glass = outer + inner[::-1]
    regions = [{"points": pts(glass), "tone": "blue", "opacity": 0.08}]
    curves = [
        {"points": pts(outer), "tone": "subtle", "width": 1.5},
        {"points": pts(inner), "tone": "subtle", "width": 1.5},
    ]
    span = RING_TURNS * TAU
    samples = 1600
    pieces, current, front = [], [], None
    for k in range(samples + 1):
        psi = span * k / samples
        theta = orbit_theta(psi)
        f = faces_viewer(psi, theta)
        p = torus_point(psi, theta)
        if front is None or f == front:
            current.append((psi, p))
        else:
            current.append((psi, p))
            pieces.append((front, current))
            current = [(psi, p)]
        front = f
    pieces.append((front, current))
    for f, piece in pieces:
        start, stop = piece[0][0], piece[-1][0]
        curve = {"points": pts([p for _, p in piece]), "tone": "blue",
                 "width": 3 if f else 1.4, "delay": r3(TRACE_SECONDS * start / span),
                 "wipe": max(0.01, r3(TRACE_SECONDS * (stop - start) / span))}
        if not f:
            curve["dash"] = [5, 6]
        curves.append(curve)
    for psi in (0.55, 2.2, 3.85, 5.5, 7.15, 8.8, 10.45, 12.1):
        theta = orbit_theta(psi)
        if not faces_viewer(psi, theta):
            continue
        a, b = torus_point(psi, theta), torus_point(psi + 0.01, orbit_theta(psi + 0.01))
        regions.append(solid(head(a, (b[0] - a[0], b[1] - a[1]), 0.13), "blue",
                             delay=r3(TRACE_SECONDS * psi / span)))
    labels = [{"at": [-1.42, -1.0], "text": "$\\mathbb{T}^2$", "anchor": "start", "tone": "subtle"}]
    return {"panels": [{"id": "aa-torus", "equal": True, "axes": False, "margin": [4, 4, 4, 4],
                        "x": {"range": [-1.45, 1.45]}, "y": {"range": [-1.08, 1.08]},
                        "regions": regions, "curves": curves, "labels": labels}]}


def square_plot():
    span = RING_TURNS * TAU
    k = TUBE_TURNS_PER_RING_TURN
    border = [[0, 0], [TAU, 0], [TAU, TAU], [0, TAU], [0, 0]]
    regions = [{"points": pts(border[:4]), "tone": "blue", "opacity": 0.06}]
    curves = [{"points": pts(border), "tone": "subtle", "width": 1.5}]
    psi, u, v = 0.0, 0.0, PHASE
    while psi < span - 1e-9:
        step = min(TAU - u, (TAU - v) / k, span - psi)
        a, b = (u, v), (u + step, v + k * step)
        curves.append({"points": pts([a, b]), "tone": "blue", "width": 2.5,
                       "delay": r3(TRACE_SECONDS * psi / span),
                       "wipe": max(0.01, r3(TRACE_SECONDS * step / span))})
        if step > 0.6:
            mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            regions.append(solid(head(mid, (1, k), 0.32), "blue",
                                 delay=r3(TRACE_SECONDS * (psi + step / 2) / span)))
        psi += step
        u, v = (u + step) % TAU, (v + k * step) % TAU
    for y in (0, TAU):
        regions.append(solid(head((TAU / 2 + 0.2, y), (1, 0), 0.4), "subtle"))
    for x in (0, TAU):
        regions.append(solid(head((x, TAU / 2 + 0.05), (0, 1), 0.4), "subtle"))
        regions.append(solid(head((x, TAU / 2 + 0.45), (0, 1), 0.4), "subtle"))
    labels = [
        {"at": [r3(TAU / 2), 0], "text": "$\\varphi_1$", "anchor": "middle", "dy": 30, "tone": "text"},
        {"at": [0, r3(TAU / 2)], "text": "$\\varphi_2$", "anchor": "end", "dx": -16, "dy": 8, "tone": "text"},
        {"at": [0, 0], "text": "$0$", "anchor": "middle", "dy": 30, "tone": "subtle"},
        {"at": [r3(TAU), 0], "text": "$2\\pi$", "anchor": "middle", "dy": 30, "tone": "subtle"},
    ]
    return {"panels": [{"id": "aa-square", "equal": True, "axes": False, "margin": [6, 6, 36, 40],
                        "x": {"range": [-0.1, r3(TAU + 0.1)]}, "y": {"range": [-0.1, r3(TAU + 0.1)]},
                        "regions": regions, "curves": curves, "labels": labels}]}


def saddle_plot():
    reach = 1.0
    curves = []
    for level in (0.06, 0.22):
        for sx in (1, -1):
            for sy in (1, -1):
                lo = level / reach
                branch = [(sx * lo * (reach / lo) ** (i / 40), sy * level / (lo * (reach / lo) ** (i / 40)))
                          for i in range(41)]
                curves.append({"points": pts(branch), "tone": "muted", "width": 1.2})
    curves += [
        {"points": [[-reach, 0], [reach, 0]], "tone": "accent", "width": 2.2},
        {"points": [[0, -reach], [0, reach]], "tone": "violet", "width": 2.2},
    ]
    regions = []
    for s in (1, -1):
        regions.append(solid(head((s * 0.62, 0), (s, 0), 0.16), "accent"))
        regions.append(solid(head((s * 0.78, 0), (s, 0), 0.16), "accent"))
        regions.append(solid(head((0, s * 0.62), (0, -s), 0.16), "violet"))
        regions.append(solid(head((0, s * 0.46), (0, -s), 0.16), "violet"))
    return {"panels": [{"id": "aa-saddle", "equal": True, "axes": False, "margin": [2, 2, 2, 2],
                        "x": {"range": [-1.02, 1.02]}, "y": {"range": [-1.02, 1.02]},
                        "regions": regions, "curves": curves}]}


if __name__ == "__main__":
    page = DECK.read_text()
    page = write_script(page, "aa-circle", tag(circle_plot(), "aa-c"))
    page = write_script(page, "aa-torus", tag(torus_plot(), "aa-t"))
    page = write_script(page, "aa-square", tag(square_plot(), "aa-t"))
    page = write_script(page, "aa-saddle", tag(saddle_plot(), "aa-s"))
    DECK.write_text(page)
