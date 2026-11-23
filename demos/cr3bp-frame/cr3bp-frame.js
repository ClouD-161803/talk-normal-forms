(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const TAU = 2 * Math.PI;
  const STAGES = { units: 1, rotating: 2, body: 3, mark: 4, forced: 5, elliptic: 6, bicircular: 7 };
  const TURN = 1.5;
  const TURN_RATE = 1.5;
  const FADE = 0.13;
  const STILL_ANGLE = Math.PI / 6;
  const SCALE = 250;
  const CENTER = [0.5, 0.52];
  const AXIS = 1.05;
  const R1 = 0.054, R2 = 0.03, RB = 0.026;
  const DIM = 0.14;
  const BODY = { x: 0.38, y: 0.6, ax: 0.05, ay: 0.035, period: 12 };
  const OPACITY = {
    inertial: [1, 1, 0.3, 0.3, 0.3, 0, 0, 0],
    paths: [1, 1, 0.5, 0.5, 0.5, 0, 0, 0],
    rotating: [0, 1, 1, 1, 1, 1, 1, 1],
    unit: [0, 1, 0, 0, 0, 0, 0, 0],
    coords: [0, 0, 1, 1, 1, 0, 0, 0],
    body: [0, 0, 0, 1, 1, 0, 0, 0],
    structures: [0, 0, 0, 0, 0, 1, 1, 1],
    anomaly: [0, 0, 0, 0, 0, 0, 1, 0],
    sun: [0, 0, 0, 0, 0, 0, 0, 1],
  };
  const ZOOM = 0.75;
  const STRUCTURES = { mu: 0.01215, C: 3.17236, L: [[0.8369, 0], [1.1557, 0], [-1.0051, 0], [0.4879, 0.866], [0.4879, -0.866]] };
  const L_LABELS = [[0.78, -0.14], [1.25, -0.13], [-1.0, 0.14], [0.61, 0.9], [0.61, -0.9]];
  const HATCH = 0.09;
  const ECCENTRICITY = 0.0549;
  const SUN = { mass: 328900.54, distance: 388.81, rate: -0.9252, drawn: 3 };
  const FORCE_TIME = 0.35;
  const FAST = { after: 3, over: 1, speed: 3 };
  const START = { f: 1.5 * Math.PI, sun: 0.955 };
  const STILL = { f: (2 * Math.PI) / 3, sun: Math.PI / 9 };
  const RAMP_START = { f: 0, sun: Math.PI };
  const CELLS = 240, EXTENT = 1.5;
  const DIAL = { x: 1.2, y: -1.62, a: 0.62, mu: 0.3, e: 0.5, arc: 0.13, label: [0.3, 0.42] };
  const SUN_DIAL = { x: -0.19, r: 0.38, m1: -0.05, m2: 0.13, arc: 0.22, note: 0.1 };
  const SUN_R = 0.075;
  const SUNWARD = [1.36, 1.6];

  const CSS = `
.reveal .cr3bp-frame { pointer-events: none; }
.reveal .slides section .figure-box.cr3bp-frame > svg { overflow: visible; }
.reveal .cr3bp-frame .label { position: absolute; left: 0; top: 0; white-space: nowrap; line-height: 1; font-size: 36px; color: var(--text); opacity: 0; filter: drop-shadow(0 0 3px var(--bg)) drop-shadow(0 0 1px var(--bg)); }
.reveal .cr3bp-frame .label[data-lab="X"], .reveal .cr3bp-frame .label[data-lab="Y"] { color: var(--subtle); }
.reveal .cr3bp-frame .label[data-lab="one"] { color: var(--violet); }
.cr3bp-frame svg .axis-i { stroke: var(--subtle); fill: var(--subtle); }
.cr3bp-frame svg .axis-r { stroke: var(--text); fill: var(--text); }
.cr3bp-frame svg .path { stroke: var(--stroke); fill: none; }
.cr3bp-frame svg .m1 { fill: var(--data-2); }
.cr3bp-frame svg .m2 { fill: var(--subtle); }
.cr3bp-frame svg .unit { stroke: var(--violet); fill: var(--violet); }
.cr3bp-frame svg .leader { stroke: var(--subtle); }
.cr3bp-frame svg .seg { stroke: var(--text); }
.cr3bp-frame svg .body { fill: var(--text); transition: fill 400ms ease-out; }
.cr3bp-frame.marked svg .body { fill: var(--violet); }
.cr3bp-frame svg line, .cr3bp-frame svg circle.path { stroke-width: 1.5px; vector-effect: non-scaling-stroke; }
.cr3bp-frame svg polygon { stroke: none; }
.reveal .cr3bp-frame .label[data-lab^="L"] { color: var(--accent); }
.reveal .cr3bp-frame .label[data-lab="L4"], .reveal .cr3bp-frame .label[data-lab="L5"] { color: var(--violet); }
.cr3bp-frame svg .lpoint { stroke: var(--accent); stroke-width: 3px; }
.cr3bp-frame svg .triangular .lpoint { stroke: var(--violet); }
.cr3bp-frame svg path { stroke-width: 1.5px; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
.cr3bp-frame svg .realm { fill: var(--blue); fill-opacity: 0.15; stroke: none; }
.cr3bp-frame svg .forbidden { fill-rule: evenodd; stroke: none; }
.cr3bp-frame svg .ring { fill: none; stroke: var(--subtle); stroke-width: 3px; }
.cr3bp-frame svg .hatch { stroke: var(--subtle); stroke-opacity: 0.8; stroke-width: 0.008px; vector-effect: none; }
.cr3bp-frame svg .edge { fill: none; stroke: var(--yellow); stroke-width: 2px; }
.cr3bp-frame svg .dial ellipse { fill: none; stroke: var(--subtle); stroke-width: 1.5px; vector-effect: non-scaling-stroke; }
.cr3bp-frame svg ellipse.path-m1 { stroke: var(--data-2); }
.cr3bp-frame svg ellipse.path-m2 { stroke: var(--subtle); }
.cr3bp-frame svg .dial .arc { fill: none; stroke: var(--yellow); stroke-width: 2px; }
.cr3bp-frame svg .dial .barycenter { fill: var(--text); }
.cr3bp-frame svg .dial .sun { fill: var(--yellow); }
.cr3bp-frame svg .sunward { stroke: var(--yellow); fill: var(--yellow); }
.cr3bp-frame svg .sunward line { stroke-width: 3px; }
.reveal .cr3bp-frame .label:is([data-lab="theta"], [data-lab="thetaS"], [data-lab="sun"]) { color: var(--yellow); }
.reveal .cr3bp-frame .label:is([data-lab="drawn"], [data-lab="drawn-e"]) { font-size: 32px; line-height: 1.2; text-align: center; color: var(--muted); }
`;

  const num = (v, d) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? d : Number(v));
  const deg = (a) => (a * 180) / Math.PI;
  const ease = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
  const rot = (a, x, y) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  const still = () => {
    const q = location.search;
    return matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-still')
      || /[?&]still\b/.test(q) || /print-pdf/.test(q) || !!window.Reveal?.isPrintView?.();
  };

  function addStyle() {
    if (document.getElementById('cr3bp-frame-style')) return;
    const style = document.createElement('style');
    style.id = 'cr3bp-frame-style';
    style.textContent = CSS;
    document.head.append(style);
  }

  function node(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    parent?.append(e);
    return e;
  }

  function head(parent, x, y, a, len = 0.045, half = 0.018) {
    const [bx, by] = [x - len * Math.cos(a), y - len * Math.sin(a)];
    const [nx, ny] = [-Math.sin(a) * half, Math.cos(a) * half];
    return node('polygon', { points: `${x},${y} ${bx + nx},${by + ny} ${bx - nx},${by - ny}` }, parent);
  }

  function axes(parent, cls) {
    const g = node('g', { class: cls }, parent);
    node('line', { x1: -AXIS, y1: 0, x2: AXIS - 0.03, y2: 0 }, g);
    node('line', { x1: 0, y1: -AXIS, x2: 0, y2: AXIS - 0.03 }, g);
    head(g, AXIS, 0, 0);
    head(g, 0, AXIS, Math.PI / 2);
    return g;
  }

  const potential = (mu, x, y) => x * x + y * y + (2 * (1 - mu)) / Math.hypot(x + mu, y) + (2 * mu) / Math.hypot(x - 1 + mu, y);

  const solar = (x, y, cos, sin) => {
    const { mass, distance: d } = SUN;
    const u = x * cos + y * sin, r2 = x * x + y * y, rho = Math.sqrt(d * d - 2 * d * u + r2);
    return mass * (u / (d * d) - (2 * d * u - r2) / (rho * d * (rho + d)));
  };

  let grid = null;
  function gridOf(mu) {
    if (grid?.mu === mu) return grid;
    const n = CELLS + 1, h = (2 * EXTENT) / CELLS;
    const x0 = STRUCTURES.L[1][0] - h * Math.round((STRUCTURES.L[1][0] + EXTENT) / h), y0 = -EXTENT;
    const w = new Float64Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) w[j * n + i] = potential(mu, x0 + i * h, y0 + j * h);
    grid = { mu, n, h, x0, y0, w, g: new Float64Array(n * n), px: new Float64Array(2 * n * n), py: new Float64Array(2 * n * n),
      la: new Int32Array(2 * n * n).fill(-1), lb: new Int32Array(2 * n * n).fill(-1) };
    return grid;
  }

  function region(mu, C, e, f, s, a) {
    const { n, h, x0, y0, w, g, px, py, la, lb } = gridOf(mu);
    const ec = ECCENTRICITY * Math.cos(f), k = 1 - (e * ec) / (1 + ec), cos = Math.cos(a), sin = Math.sin(a);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const q = j * n + i;
        g[q] = w[q] * k - C - (s ? 2 * s * SUN.drawn * solar(x0 + i * h, y0 + j * h, cos, sin) : 0);
      }
    }
    const ids = [];
    const cross = (id, q1, q2, x1, y1, dx, dy) => {
      if (la[id] < 0 && lb[id] < 0) {
        const t = g[q1] / (g[q1] - g[q2]);
        px[id] = x1 + t * dx;
        py[id] = y1 + t * dy;
        ids.push(id);
      }
      return id;
    };
    const join = (p, q) => {
      if (la[p] < 0) la[p] = q; else lb[p] = q;
      if (la[q] < 0) la[q] = p; else lb[q] = p;
    };
    for (let j = 0; j < n - 1; j++) {
      for (let i = 0; i < n - 1; i++) {
        const q = j * n + i, A = g[q], B = g[q + 1], Cn = g[q + n + 1], D = g[q + n];
        const kind = (A < 0 ? 1 : 0) | (B < 0 ? 2 : 0) | (Cn < 0 ? 4 : 0) | (D < 0 ? 8 : 0);
        if (kind === 0 || kind === 15) continue;
        const x = x0 + i * h, y = y0 + j * h;
        const bottom = () => cross(q, q, q + 1, x, y, h, 0), top = () => cross(q + n, q + n, q + n + 1, x, y + h, h, 0);
        const left = () => cross(n * n + q, q, q + n, x, y, 0, h), right = () => cross(n * n + q + 1, q + 1, q + n + 1, x + h, y, 0, h);
        const inside = A + B + Cn + D < 0;
        switch (kind) {
          case 1: case 14: join(left(), bottom()); break;
          case 2: case 13: join(bottom(), right()); break;
          case 4: case 11: join(right(), top()); break;
          case 8: case 7: join(left(), top()); break;
          case 3: case 12: join(left(), right()); break;
          case 6: case 9: join(bottom(), top()); break;
          default:
            if ((kind === 5) === inside) { join(left(), top()); join(bottom(), right()); }
            else { join(left(), bottom()); join(right(), top()); }
        }
      }
    }
    const loops = [];
    for (const start of ids) {
      if (la[start] < 0) continue;
      const loop = [];
      let cur = start, prev = -1;
      do {
        loop.push(px[cur], py[cur]);
        const next = la[cur] !== prev ? la[cur] : lb[cur];
        la[cur] = lb[cur] = -1;
        prev = cur;
        cur = next;
      } while (cur >= 0 && la[cur] >= 0);
      loops.push(loop);
    }
    for (const id of ids) la[id] = lb[id] = -1;
    return loops;
  }

  const pathOf = (loops) => loops.map((l) => `M${l.map((v) => v.toFixed(4)).join(' ')}Z`).join('');
  const reach = (loop) => Math.max(...loop.map(Math.abs));
  let rings = null;
  const ringsOf = () => (rings ??= region(STRUCTURES.mu, STRUCTURES.C, 0, 0, 0, 0).sort((a, b) => reach(a) - reach(b)).map((l) => pathOf([l])));

  let hatches = 0;

  class Diagram {
    constructor(el) {
      this.el = el;
      this.mu = num(el.dataset.mu, 0.2);
      this.scale = num(el.dataset.scale, SCALE);
      this.omega = TAU / num(el.dataset.turn, 10);
      this.ramp = num(el.dataset.ramp, 0);
      const [dx, dy, dk] = (el.dataset.dial ?? '').trim().split(/\s+/).map(Number);
      this.dial = Number.isFinite(dk) ? { x: dx, y: dy, k: dk } : { x: DIAL.x, y: DIAL.y, k: 1 };
      this.structures = Math.abs(this.mu - STRUCTURES.mu) < 1e-9;
      for (const old of el.querySelectorAll(':scope > svg.cr3bp-svg')) old.remove();
      this.labels = {};
      for (const l of el.querySelectorAll('.label[data-lab]')) this.labels[l.dataset.lab] = l;
      for (const l of Object.values(this.labels)) if (l.textContent.includes('\\(')) window.Beeson?.typesetLabel?.(l);
      this.build();
      this.clock = 0;
      this.phi = STILL_ANGLE;
      this.bodyTime = 0;
      this.view = { kind: 'inertial', psi: 0 };
      this.stage = -1;
      this.op = Object.fromEntries(Object.keys(OPACITY).map((k) => [k, 0]));
      this.zoom = 1;
      this.force = { e: 0, s: 0 };
      this.f = this.f0 = STILL.f;
      this.sun = this.sun0 = STILL.sun;
      this.raf = 0;
    }

    build() {
      const size = (v, d) => this.el[v === 'width' ? 'offsetWidth' : 'offsetHeight'] || parseFloat(getComputedStyle(this.el)[v]) || d;
      const W = size('width', 600), H = size('height', 800);
      this.cx = W * CENTER[0];
      this.cy = H * CENTER[1];
      const mu = this.mu;
      const svg = node('svg', { class: 'cr3bp-svg', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
      this.el.prepend(svg);
      this.root = node('g', {}, svg);
      const group = () => node('g', {}, this.root);
      this.g = {};
      if (this.structures) this.g.hill = group();
      for (const name of ['paths', 'inertial', 'rotating', 'coords', 'body', 'masses']) this.g[name] = group();
      this.fades = [['paths', 'paths'], ['inertial', 'inertial'], ['rotating', 'rotating'], ['coords', 'coords'], ['body', 'body']];
      node('circle', { class: 'path', cx: 0, cy: 0, r: mu }, this.g.paths);
      node('circle', { class: 'path', cx: 0, cy: 0, r: 1 - mu }, this.g.paths);
      this.inertialAxes = axes(this.g.inertial, 'axis-i');
      this.rotatingAxes = axes(this.g.rotating, 'axis-r');
      this.leader = node('line', { class: 'leader' }, this.g.coords);
      this.seg1 = node('line', { class: 'seg' }, this.g.body);
      this.seg2 = node('line', { class: 'seg' }, this.g.body);
      this.body = node('circle', { class: 'body', r: RB }, this.g.body);
      this.line = node('g', {}, this.g.masses);
      this.g.unit = node('g', { class: 'unit' }, this.line);
      this.fades.push(['unit', 'unit']);
      const [a, b] = [-mu, 1 - mu];
      node('line', { x1: a, y1: R1 + 0.03, x2: a, y2: DIM + 0.04 }, this.g.unit);
      node('line', { x1: b, y1: R1 + 0.03, x2: b, y2: DIM + 0.04 }, this.g.unit);
      node('line', { x1: a + 0.04, y1: DIM, x2: b - 0.04, y2: DIM }, this.g.unit);
      head(this.g.unit, a, DIM, Math.PI);
      head(this.g.unit, b, DIM, 0);
      node('circle', { class: 'm1', cx: a, cy: 0, r: R1 }, this.line);
      node('circle', { class: 'm2', cx: b, cy: 0, r: R2 }, this.line);
      if (this.structures) this.buildForced(svg);
    }

    buildForced(svg) {
      this.g.equilibria = node('g', {}, this.root);
      this.g.sun = node('g', {}, this.root);
      this.g.anomaly = node('g', { class: 'dial', transform: `translate(${this.dial.x} ${this.dial.y}) scale(${this.dial.k})` }, this.root);
      this.fades.push(['hill', 'structures'], ['equilibria', 'structures'], ['sun', 'sun'], ['anomaly', 'anomaly']);
      const id = `cr3bp-hatch-${++hatches}`;
      const pattern = node('pattern', { id, patternUnits: 'userSpaceOnUse', width: HATCH, height: HATCH, patternTransform: 'rotate(45)' }, node('defs', {}, svg));
      node('path', { class: 'hatch', d: `M0 0V${HATCH}` }, pattern);
      const [inner, outer] = ringsOf();
      this.cr3bpRegion = inner + outer;
      this.realm = node('path', { class: 'realm', d: inner }, this.g.hill);
      this.hatching = node('path', { class: 'forbidden', d: this.cr3bpRegion, fill: `url(#${id})` }, this.g.hill);
      for (const d of [inner, outer]) node('path', { class: 'ring', d }, this.g.hill);
      this.edge = node('path', { class: 'edge' }, this.g.hill);
      this.drawn = '';
      const h = 0.028;
      const triangular = node('g', { class: 'triangular' }, this.g.equilibria);
      STRUCTURES.L.forEach(([px, py], i) => {
        const g = node('g', { transform: `translate(${px} ${py})` }, i < 3 ? this.g.equilibria : triangular);
        node('line', { class: 'lpoint', x1: -h, y1: -h, x2: h, y2: h }, g);
        node('line', { class: 'lpoint', x1: -h, y1: h, x2: h, y2: -h }, g);
      });
      const k = this.dial.k;
      this.ellipses = [node('ellipse', { class: 'path-m2', cy: 0 }, this.g.anomaly), node('ellipse', { class: 'path-m1', cy: 0 }, this.g.anomaly)];
      this.periapsis = node('line', { class: 'leader', x1: 0, y1: 0, y2: 0 }, this.g.anomaly);
      this.hand = node('line', { class: 'seg' }, this.g.anomaly);
      this.arc = node('path', { class: 'arc' }, this.g.anomaly);
      node('circle', { class: 'barycenter', r: 0.012 }, this.g.anomaly);
      this.earth = node('circle', { class: 'm1', r: R1 / k }, this.g.anomaly);
      this.moon = node('circle', { class: 'm2', r: R2 / k }, this.g.anomaly);
      this.eccentricity = -1;
      const { x: sx, r: sr, m1: s1, m2: s2 } = SUN_DIAL;
      const solarDial = node('g', { class: 'dial', transform: `translate(${this.dial.x + sx * k} ${this.dial.y}) scale(${k})` }, this.g.sun);
      node('ellipse', { cx: 0, cy: 0, rx: sr, ry: sr }, solarDial);
      node('line', { class: 'leader', x1: 0, y1: 0, x2: sr, y2: 0 }, solarDial);
      this.sunHand = node('line', { class: 'seg', x1: 0, y1: 0 }, solarDial);
      this.sunArc = node('path', { class: 'arc' }, solarDial);
      node('circle', { class: 'barycenter', r: 0.012 }, solarDial);
      node('circle', { class: 'm1', cx: s1, cy: 0, r: R1 / k }, solarDial);
      node('circle', { class: 'm2', cx: s2, cy: 0, r: R2 / k }, solarDial);
      this.sunDisc = node('circle', { class: 'sun', r: 0 }, solarDial);
      this.sunward = node('g', { class: 'sunward' }, this.g.sun);
      node('line', { x1: SUNWARD[0], y1: 0, x2: SUNWARD[1] - 0.06, y2: 0 }, this.sunward);
      head(this.sunward, SUNWARD[1], 0, 0, 0.09, 0.036);
    }

    target() {
      let best = null;
      for (const f of this.el.closest('section')?.querySelectorAll('.fragment.visible[data-cr3bp-stage]') ?? []) {
        if (!best || num(f.dataset.fragmentIndex, 0) >= num(best.dataset.fragmentIndex, 0)) best = f;
      }
      return STAGES[best ? best.dataset.cr3bpStage : this.el.dataset.stage] ?? 0;
    }

    psi() {
      const v = this.view;
      if (v.kind === 'inertial') return [v.psi, 0];
      if (v.kind === 'rotating') return [this.phi - v.target, this.omega];
      const s = Math.min(1, (this.clock - v.t0) / v.T);
      if (s >= 1) {
        this.view = v.then;
        return this.psi();
      }
      const s2 = s * s, s3 = s2 * s;
      const p = (2 * s3 - 3 * s2 + 1) * v.p0 + (s3 - 2 * s2 + s) * v.T * v.m0 + (-2 * s3 + 3 * s2) * v.p1 + (s3 - s2) * v.T * v.m1;
      const dp = ((6 * s2 - 6 * s) * v.p0 + (3 * s2 - 4 * s + 1) * v.T * v.m0 + (-6 * s2 + 6 * s) * v.p1 + (3 * s2 - 2 * s) * v.T * v.m1) / v.T;
      return [p, dp];
    }

    rotating() {
      return this.view.kind === 'rotating' || (this.view.kind === 'turn' && this.view.then.kind === 'rotating');
    }

    turn(toRotating) {
      const [p0, m0] = this.psi();
      const end = toRotating
        ? TAU * Math.round((this.phi - p0 + ((this.omega - m0) * TURN) / 2) / TAU)
        : TAU * Math.round((p0 + (m0 * TURN) / 2) / TAU);
      const at = (T) => (toRotating ? this.phi + this.omega * T - end : end);
      const T = Math.max(TURN, Math.abs(at(TURN) - p0) / TURN_RATE);
      const then = toRotating ? { kind: 'rotating', target: end } : { kind: 'inertial', psi: end };
      this.view = { kind: 'turn', t0: this.clock, T, p0, m0, p1: at(T), m1: toRotating ? this.omega : 0, then };
    }

    opacityTarget(name) {
      if (name === 'coords' && this.view.kind === 'turn') return 0;
      return OPACITY[name][Math.max(0, this.stage)];
    }

    forceTarget() {
      return { e: this.stage === STAGES.elliptic ? 1 : 0, s: this.stage === STAGES.bicircular ? 1 : 0 };
    }

    sync(animate) {
      const stage = this.target();
      if (stage === this.stage) return;
      const first = this.stage < 0;
      this.stage = stage;
      this.el.classList.toggle('marked', stage === STAGES.mark);
      this.zoom = this.structures && stage >= STAGES.forced ? ZOOM : 1;
      const want = stage >= STAGES.rotating;
      const from = this.ramp ? RAMP_START : START;
      if (stage === STAGES.elliptic && this.force.e < 0.01) this.f = this.f0 = from.f;
      if (stage === STAGES.bicircular && this.force.s < 0.01) this.sun = this.sun0 = from.sun;
      if (!animate || first) {
        this.force = this.forceTarget();
        if (!animate) [this.f, this.sun, this.f0, this.sun0] = [STILL.f, STILL.sun, STILL.f, STILL.sun];
        this.view = want ? { kind: 'rotating', target: TAU * Math.round(this.phi / TAU) } : { kind: 'inertial', psi: 0 };
        for (const k of Object.keys(this.op)) this.op[k] = this.opacityTarget(k);
      } else if (want !== this.rotating()) this.turn(want);
      this.render();
    }

    still() {
      this.stop();
      this.phi = STILL_ANGLE;
      this.bodyTime = 0;
      this.stage = -1;
      this.sync(false);
    }

    tick(dt) {
      this.clock += dt;
      this.phi += this.omega * dt;
      this.bodyTime += dt;
      this.psi();
      const k = 1 - Math.exp(-dt / FADE);
      for (const name of Object.keys(this.op)) this.op[name] += (this.opacityTarget(name) - this.op[name]) * k;
      if (this.structures) {
        const kf = 1 - Math.exp(-dt / FORCE_TIME), force = this.forceTarget();
        for (const name of ['e', 's']) {
          const gap = force[name] - this.force[name];
          this.force[name] += this.ramp && gap > 0 ? Math.min(gap, dt / this.ramp) : gap * kf;
        }
        const on = this.ramp ? 1 - 1e-9 : 1e-3;
        const pace = (turned) => 1 + (FAST.speed - 1) * ease((Math.abs(turned) / TAU - FAST.after) / FAST.over);
        if (this.force.e > on) this.f += this.omega * pace(this.f - this.f0) * dt;
        if (this.force.s > on) this.sun += SUN.rate * this.omega * pace(this.sun - this.sun0) * dt;
      }
      this.render();
    }

    start() {
      if (this.raf) return;
      let last = null;
      const frame = (now) => {
        const dt = last === null ? 0 : Math.min(0.1, (now - last) / 1000);
        last = now;
        this.tick(dt);
        this.raf = requestAnimationFrame(frame);
      };
      this.raf = requestAnimationFrame(frame);
    }

    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (this.view.kind === 'turn') this.view = this.view.then;
      if (this.view.kind === 'inertial') this.view.psi = 0;
      for (const k of Object.keys(this.op)) this.op[k] = this.opacityTarget(k);
      this.force = this.forceTarget();
      this.f0 = this.f;
      this.sun0 = this.sun;
      this.render();
    }

    place(name, x, y, opacity, anchor = 'center') {
      const l = this.labels[name];
      if (!l) return;
      const shift = { right: '-100%, -50%', top: '-50%, 0' }[anchor] ?? '-50%, -50%';
      l.style.transform = `translate(${(this.ox + this.s * x).toFixed(1)}px, ${(this.oy - this.s * y).toFixed(1)}px) translate(${shift})`;
      l.style.opacity = opacity.toFixed(3);
    }

    render() {
      const mu = this.mu, op = this.op;
      const [psi] = this.psi();
      const alpha = this.phi - psi;
      this.s = this.scale * this.zoom;
      this.ox = this.cx;
      this.oy = this.cy;
      this.root.setAttribute('transform', `translate(${this.ox} ${this.oy}) scale(${this.s} ${-this.s})`);
      for (const [name, key] of this.fades) this.g[name].setAttribute('opacity', op[key].toFixed(3));
      const k = 1 / this.zoom;
      this.inertialAxes.setAttribute('transform', `rotate(${deg(-psi).toFixed(3)}) scale(${k.toFixed(4)})`);
      this.line.setAttribute('transform', `rotate(${deg(alpha).toFixed(3)})`);
      this.rotatingAxes.setAttribute('transform', `rotate(${deg(alpha).toFixed(3)}) scale(${k.toFixed(4)})`);

      const m1 = rot(alpha, -mu, 0), m2 = rot(alpha, 1 - mu, 0);
      this.place('m1', ...rot(alpha, -mu - 0.15, 0.1), 1);
      this.place('m2', ...rot(alpha, 1 - mu + 0.12, 0.11), 1);
      const [ix, iy] = rot(-psi, k * (AXIS + 0.1), 0), [jx, jy] = rot(-psi, 0, k * (AXIS + 0.1));
      this.place('X', ix, iy, op.inertial);
      this.place('Y', jx, jy, op.inertial);
      this.place('x', ...rot(alpha, k * (AXIS + 0.09), 0), op.rotating);
      this.place('y', ...rot(alpha, 0, k * (AXIS + 0.09)), op.rotating);
      const [ux, uy] = rot(alpha, 0.5 - mu, DIM + 0.1);
      this.place('one', ux, uy, op.unit);

      const c1 = [m1[0] - 0.13, m1[1] - 0.17];
      this.place('c1', c1[0], c1[1], op.coords, 'right');
      this.leader.setAttribute('x1', m1[0] - R1 * 0.75);
      this.leader.setAttribute('y1', m1[1] - R1 * 0.75);
      this.leader.setAttribute('x2', c1[0] + 0.005);
      this.leader.setAttribute('y2', c1[1] + 0.03);
      this.place('c2', m2[0], m2[1] - 0.17, op.coords);

      const w = (TAU * this.bodyTime) / BODY.period;
      const b = [BODY.x + BODY.ax * Math.sin(w), BODY.y + (BODY.ay * Math.sin(2 * w)) / 2 + (BODY.ay * (1 - Math.cos(w))) / 2];
      this.body.setAttribute('cx', b[0]);
      this.body.setAttribute('cy', b[1]);
      const centroid = [(m1[0] + m2[0] + b[0]) / 3, (m1[1] + m2[1] + b[1]) / 3];
      for (const [seg, m, r, name] of [[this.seg1, m1, R1, 'rho1'], [this.seg2, m2, R2, 'rho2']]) {
        const len = Math.hypot(b[0] - m[0], b[1] - m[1]);
        const [ex2, ey2] = [(b[0] - m[0]) / len, (b[1] - m[1]) / len];
        seg.setAttribute('x1', m[0] + ex2 * (r + 0.012));
        seg.setAttribute('y1', m[1] + ey2 * (r + 0.012));
        seg.setAttribute('x2', b[0] - ex2 * (RB + 0.012));
        seg.setAttribute('y2', b[1] - ey2 * (RB + 0.012));
        const mid = [(m[0] + b[0]) / 2, (m[1] + b[1]) / 2];
        let [nx, ny] = [-ey2, ex2];
        if (nx * (centroid[0] - mid[0]) + ny * (centroid[1] - mid[1]) < 0) [nx, ny] = [-nx, -ny];
        this.place(name, mid[0] + 0.08 * nx, mid[1] + 0.08 * ny, op.body);
      }
      this.place('m', b[0], b[1] + 0.1, op.body);
      if (this.structures) this.forcing(alpha);
    }

    forcing(alpha) {
      for (const name of ['equilibria', 'hill']) this.g[name].setAttribute('transform', `rotate(${deg(alpha).toFixed(3)})`);
      STRUCTURES.L.forEach((_, i) => this.place(`L${i + 1}`, ...rot(alpha, ...L_LABELS[i]), this.op.structures));
      const f = ((this.f % TAU) + TAU) % TAU, { a, mu: dm, arc } = DIAL, { x: dx, y: dy, k } = this.dial;
      const de = DIAL.e * Math.min(1, this.force.e);
      if (de !== this.eccentricity) {
        this.eccentricity = de;
        const flat = Math.sqrt(1 - de * de);
        [[1 - dm, -1], [dm, 1]].forEach(([m, side], i) => {
          for (const [name, v] of [['cx', side * m * a * de], ['rx', m * a], ['ry', m * a * flat]]) this.ellipses[i].setAttribute(name, v.toFixed(4));
        });
        this.periapsis.setAttribute('x2', ((1 - dm) * a * (1 - de)).toFixed(4));
      }
      const r = (a * (1 - de * de)) / (1 + de * Math.cos(f));
      const [mx, my] = rot(f, (1 - dm) * r, 0), [ex, ey] = rot(f, -dm * r, 0), [ax, ay] = rot(f, arc, 0);
      for (const [name, v] of [['x1', ex], ['y1', ey], ['x2', mx], ['y2', my]]) this.hand.setAttribute(name, v.toFixed(4));
      for (const [body, x, y] of [[this.earth, ex, ey], [this.moon, mx, my]]) {
        body.setAttribute('cx', x.toFixed(4));
        body.setAttribute('cy', y.toFixed(4));
      }
      this.arc.setAttribute('d', `M${arc} 0A${arc} ${arc} 0 ${f > Math.PI ? 1 : 0} 1 ${ax.toFixed(4)} ${ay.toFixed(4)}`);
      const ts = ((this.sun % TAU) + TAU) % TAU, { r: sr, arc: sa } = SUN_DIAL;
      this.sunDisc.setAttribute('r', ((SUN_R / k) * Math.min(1, this.force.s)).toFixed(4));
      const [ux, uy] = rot(ts, sr, 0), [vx, vy] = rot(ts, sa, 0);
      this.sunHand.setAttribute('x2', ux.toFixed(4));
      this.sunHand.setAttribute('y2', uy.toFixed(4));
      this.sunDisc.setAttribute('cx', ux.toFixed(4));
      this.sunDisc.setAttribute('cy', uy.toFixed(4));
      this.sunArc.setAttribute('d', `M${sa} 0A${sa} ${sa} 0 ${ts > Math.PI ? 1 : 0} 1 ${vx.toFixed(4)} ${vy.toFixed(4)}`);
      const [lx, ly] = DIAL.label;
      this.place('theta', dx + lx * k, dy + ly * k, this.op.anomaly);
      this.place('thetaS', dx + lx * k, dy + ly * k, this.op.sun);
      this.place('drawn', dx + SUN_DIAL.x * k, dy - (sr + SUN_DIAL.note) * k, this.op.sun, 'top');
      this.place('drawn-e', dx + SUN_DIAL.x * k, dy - (sr + SUN_DIAL.note) * k, this.op.anomaly, 'top');
      const to = alpha + this.sun;
      this.sunward.setAttribute('transform', `rotate(${deg(to).toFixed(3)})`);
      this.place('sun', ...rot(to, (SUNWARD[0] + SUNWARD[1]) / 2, 0.19), this.op.sun);
      const { e, s } = this.force, strength = Math.min(1, e + s), on = strength > 1e-3;
      this.realm.setAttribute('opacity', (1 - strength).toFixed(3));
      this.edge.setAttribute('opacity', strength.toFixed(3));
      const key = on ? [e, this.f, s, this.sun].join() : '';
      if (key === this.drawn) return;
      this.drawn = key;
      const d = on ? pathOf(region(STRUCTURES.mu, STRUCTURES.C, e, this.f, s, this.sun)) : this.cr3bpRegion;
      this.hatching.setAttribute('d', d);
      this.edge.setAttribute('d', on ? d : '');
    }
  }

  const made = new WeakMap();
  const diagram = (el) => {
    let d = made.get(el);
    if (!d) made.set(el, (d = new Diagram(el)));
    return d;
  };
  const within = (slide) => (slide ? [...slide.querySelectorAll('.cr3bp-frame')].map(diagram) : []);

  function show(slide) {
    for (const d of within(slide)) {
      if (still()) d.still();
      else {
        d.sync(false);
        d.start();
      }
    }
  }

  function ready(slide) {
    if (window.Reveal.isPrintView?.()) return;
    addStyle();
    for (const el of document.querySelectorAll('.cr3bp-frame')) diagram(el).still();
    show(slide);
  }

  const deck = window.Reveal;
  deck.on('ready', (ev) => ready(ev.currentSlide));
  deck.on('slidechanged', (ev) => {
    for (const d of within(ev.previousSlide)) d.stop();
    show(ev.currentSlide);
  });
  const step = () => {
    for (const d of within(deck.getCurrentSlide())) d.sync(!still());
  };
  deck.on('fragmentshown', step);
  deck.on('fragmenthidden', step);
  deck.on('pdf-ready', () => {
    addStyle();
    for (const el of document.querySelectorAll('.cr3bp-frame')) {
      const d = new Diagram(el);
      made.set(el, d);
      d.still();
    }
  });
  if (deck.isReady()) ready(deck.getCurrentSlide());

  window.Cr3bpFrame = { diagram };
})();
