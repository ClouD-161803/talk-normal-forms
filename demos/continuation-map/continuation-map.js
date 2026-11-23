(() => {
  const DATA = window.CONTINUATION_MAP, FRAME = window.Cr3bpFrame, deck = window.Reveal;
  if (!DATA || !FRAME || !deck) return;

  const NS = 'http://www.w3.org/2000/svg';
  const TAU = 2 * Math.PI;
  const POINTS = 90, TRACED = 3, STILL_PERIODS = 40;
  const POINT = 4.5, TIP = 5, SMALL = 3, CROSS = 7, FLASH = 2.4, SETTLE = 0.12;
  const MOON = 0.00452;
  const LABEL = [26, 40];
  const INSET = { x: 0.925, y: 0, zoom: 6, half: [0.0026, 0.0078] };
  const MAP = { right: 28, top: 58, width: 170, height: 124, half: [0.026, 0.052], point: 3.5, ring: 7, label: 26, axis: [14, 22] };

  const CSS = `
.reveal .slides section .continuation-map { position: relative; pointer-events: none; }
.reveal .continuation-map > svg, .reveal .cr3bp-frame > svg.continuation-overlay { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.reveal .continuation-map > svg { overflow: hidden; }
.reveal .cr3bp-frame > svg.continuation-overlay { overflow: visible; }
.continuation-map svg path, .continuation-map svg polyline, .continuation-map svg line, .continuation-map svg rect, .continuation-overlay path, .continuation-overlay rect { fill: none; vector-effect: non-scaling-stroke; stroke-linejoin: round; stroke-linecap: round; }
.continuation-map svg .border, .continuation-overlay .border { stroke: var(--subtle); stroke-width: 1.5px; }
.continuation-map svg .leader { stroke: var(--subtle); stroke-width: 1px; stroke-opacity: 0.7; }
.continuation-map svg .moon { fill: var(--subtle); }
.continuation-map svg .reference, .continuation-overlay .reference { stroke: var(--text); stroke-width: 2px; }
.continuation-overlay .reference { stroke-width: 1px; }
.continuation-map svg .lpoint { stroke: var(--accent); stroke-width: 3px; }
.continuation-map svg .forced, .continuation-overlay .forced { stroke: var(--yellow); stroke-width: 2px; }
.continuation-overlay .forced { stroke-width: 1.5px; }
.continuation-map svg .trace { stroke: var(--yellow); stroke-width: 1.5px; }
.continuation-map svg .tip, .continuation-map svg .point { fill: var(--yellow); }
.continuation-map svg .fixed { fill: none; stroke: var(--yellow); stroke-width: 2px; }
.continuation-map svg .zoom { fill: var(--muted); font-size: 28px; }
.reveal .continuation-map .label { position: absolute; left: 0; top: 0; white-space: nowrap; line-height: 1; font-size: 36px; color: var(--accent); translate: -50% -50%; filter: drop-shadow(0 0 3px var(--bg)) drop-shadow(0 0 1px var(--bg)); }
.reveal .continuation-map .label[data-lab="m2"] { color: var(--text); }
.reveal .continuation-map .label:is([data-lab="map-x"], [data-lab="map-v"]) { font-size: 28px; color: var(--subtle); }
.reveal .continuation-map .label[data-lab="map"] { font-size: 28px; color: var(--muted); translate: -100% -50%; }
`;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => {
    const q = location.search;
    return reduced.matches || document.documentElement.hasAttribute('data-still')
      || /[?&]still\b/.test(q) || /print-pdf/.test(q) || !!deck.isPrintView?.();
  };

  function node(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    parent?.append(e);
    return e;
  }

  function cross(g, x, y, h) {
    node('line', { class: 'lpoint', x1: x - h, y1: y - h, x2: x + h, y2: y + h }, g);
    node('line', { class: 'lpoint', x1: x - h, y1: y + h, x2: x + h, y2: y - h }, g);
  }

  function decode(text, unit = DATA.unit, center = [0, 0]) {
    const bytes = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
    return Float64Array.from(new Int16Array(bytes.buffer), (v, i) => center[i % 2] + v * unit);
  }

  function member(fam, u) {
    const { all, values, n } = fam, last = values.length - 1;
    let i = 0;
    while (i < last - 1 && values[i + 1] < u) i += 1;
    const w = Math.min(1, Math.max(0, (u - values[i]) / (values[i + 1] - values[i] || 1)));
    const out = new Float64Array(2 * n), a = 2 * n * i, b = a + 2 * n;
    for (let k = 0; k < 2 * n; k += 1) out[k] = all[a + k] + (all[b + k] - all[a + k]) * w;
    return out;
  }

  const closed = (c) => {
    let d = '';
    for (let k = 0; k < c.length; k += 2) d += `${k ? 'L' : 'M'}${c[k].toFixed(6)} ${c[k + 1].toFixed(6)}`;
    return `${d}Z`;
  };

  function along(c, s) {
    const n = c.length / 2, at = (((s % 1) + 1) % 1) * n, i = Math.floor(at) % n, j = (i + 1) % n, w = at - Math.floor(at);
    return [c[2 * i] + (c[2 * j] - c[2 * i]) * w, c[2 * i + 1] + (c[2 * j + 1] - c[2 * i + 1]) * w];
  }

  function value(v, s) {
    const n = v.length, at = (((s % 1) + 1) % 1) * n, i = Math.floor(at) % n, j = (i + 1) % n, w = at - Math.floor(at);
    return v[i] + (v[j] - v[i]) * w;
  }

  function prepare(m) {
    const model = {
      turn: m.rotation / TAU,
      curves: { all: decode(m.curves), values: m.values.map((v) => v / m.values[m.values.length - 1]), n: m.nodes },
      torus: decode(m.torus),
      rates: decode(m.rates),
      nodes: m.nodes,
      samples: m.samples,
      substitutes: (m.substitutes ?? []).map((s) => ({ all: decode(s.loops, s.unit, s.center), values: s.values, n: s.samples })),
      flown: new Map(),
    };
    model.curve = member(model.curves, 1);
    return model;
  }

  function flown(model, k) {
    let out = model.flown.get(k);
    if (out) return out;
    const { nodes: n, samples: m, torus } = model;
    const start = (((k * model.turn) % 1) + 1) % 1, at = start * n, i = Math.floor(at) % n, j = (i + 1) % n, w = at - Math.floor(at);
    out = new Float64Array(2 * (m + 1));
    for (let q = 0; q < 2 * m; q += 1) out[q] = torus[2 * m * i + q] + (torus[2 * m * j + q] - torus[2 * m * i + q]) * w;
    [out[2 * m], out[2 * m + 1]] = along(model.curve, start + model.turn);
    for (const old of model.flown.keys()) if (old < k - TRACED) model.flown.delete(old);
    model.flown.set(k, out);
    return out;
  }

  const made = new WeakMap();

  class Panel {
    constructor(el) {
      this.el = el;
      this.frame = el.closest('section')?.querySelector('.cr3bp-frame') ?? null;
      const [x, y, width] = (el.dataset.view ?? '1 0 0.5').trim().split(/\s+/).map(Number);
      this.view = { x, y, width };
      for (const old of el.querySelectorAll(':scope > svg')) old.remove();
      for (const old of this.frame?.querySelectorAll(':scope > svg.continuation-overlay') ?? []) old.remove();
      for (const label of el.querySelectorAll('.label')) if (label.textContent.includes('\\(')) window.Beeson?.typesetLabel?.(label);
      this.models = { e: prepare(DATA.er3bp), s: prepare(DATA.bcr4bp) };
      this.build();
    }

    build() {
      const css = getComputedStyle(this.el), { x, y, width } = this.view;
      const W = this.el.offsetWidth || parseFloat(css.width) || 700, H = this.el.offsetHeight || parseFloat(css.height) || 460;
      const S = W / width, height = H / S;
      this.S = S;
      this.origin = [W / 2 - S * x, H / 2 + S * y];
      const svg = node('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
      this.svg = svg;
      this.el.prepend(svg);
      const root = node('g', { transform: `translate(${this.origin[0]} ${this.origin[1]}) scale(${S} ${-S})` }, svg);
      node('circle', { class: 'moon', cx: 1 - DATA.mu, cy: 0, r: MOON }, root);
      const orbit = closed(decode(DATA.orbit));
      node('path', { class: 'reference', d: orbit }, root);
      for (const label of this.el.querySelectorAll('.label[data-lab]')) {
        const moon = label.dataset.lab === 'm2', [px, py] = moon ? [1 - DATA.mu, 0] : DATA.points[label.dataset.lab] ?? [];
        if (px === undefined) continue;
        if (!moon) cross(root, px, py, CROSS / S);
        label.style.transform = `translate(${(this.origin[0] + S * px + LABEL[0]).toFixed(1)}px, ${(this.origin[1] - S * py + LABEL[1]).toFixed(1)}px)`;
      }
      if (this.frame) {
        const over = node('svg', { class: 'continuation-overlay', viewBox: `0 0 ${this.frame.offsetWidth || 600} ${this.frame.offsetHeight || 800}`, 'aria-hidden': 'true' });
        this.frame.append(over);
        this.over = node('g', {}, over);
        node('rect', { class: 'border', x: x - width / 2, y: y - height / 2, width, height }, this.over);
        node('path', { class: 'reference', d: orbit }, this.over);
      }
      const left = W - MAP.right - MAP.width, [lx] = DATA.points.L1;
      this.phase = (px, pv) => [left + MAP.width * (0.5 + (px - lx) / (2 * MAP.half[0])), MAP.top + MAP.height * (0.5 - pv / (2 * MAP.half[1]))];
      this.map = node('g', { opacity: 0 }, svg);
      node('rect', { class: 'border', x: left, y: MAP.top, width: MAP.width, height: MAP.height }, this.map);
      const at = { map: [W - MAP.right, MAP.top - MAP.label], 'map-x': [W - MAP.right + MAP.axis[0], MAP.top + MAP.height], 'map-v': [left - MAP.axis[0], MAP.top + MAP.axis[1]] };
      this.mapLabels = Object.entries(at).flatMap(([name, [ax, ay]]) => {
        const label = this.el.querySelector(`.label[data-lab="${name}"]`);
        if (!label) return [];
        label.style.transform = `translate(${ax}px, ${ay}px)`;
        label.style.opacity = '0';
        return [label];
      });
      this.mapShown = 0;
      this.parts = {};
      for (const [name, model] of Object.entries(this.models)) {
        const g = node('g', { opacity: 0 }, root), og = this.over ? node('g', { opacity: 0 }, this.over) : null;
        const both = () => [node('path', { class: 'forced' }, g), og ? node('path', { class: 'forced' }, og) : null];
        const traces = Array.from({ length: TRACED }, () => node('polyline', { class: 'trace' }, g));
        const curve = both();
        const insets = model.substitutes.map((fam) => this.inset(g, fam.all[0], fam.all[1]));
        const twice = (cls, small, large) => insets.map(([inset]) => [node('circle', { class: cls, r: small / S }, g), node('circle', { class: cls, r: large / (S * INSET.zoom) }, inset)]);
        const points = node('g', {}, g);
        const plane = node('g', { opacity: 0 }, this.map);
        const rings = model.substitutes.map(() => node('circle', { class: 'fixed', cy: this.phase(lx, 0)[1], r: MAP.ring }, plane));
        if (!rings.length) cross(plane, ...this.phase(lx, 0), CROSS);
        this.parts[name] = {
          g, og, plane, rings, traces, curve, points,
          notes: insets.map(([, note]) => note),
          loops: insets.map(([inset]) => [...both(), node('path', { class: 'forced' }, inset)]),
          dots: [node('circle', { class: 'point', r: POINT / S }, points)],
          marks: [],
          fixed: twice('point', SMALL, POINT),
          tips: twice('tip', SMALL, TIP),
          tip: node('circle', { class: 'tip', r: TIP / S }, g),
          key: '', shown: 0, strength: -1, shape: null, orbits: [], count: 0, marked: 0, newest: -1, traced: traces.map(() => -1),
        };
      }
      node('rect', { class: 'border', x: 0.75, y: 0.75, width: W - 1.5, height: H - 1.5 }, svg);
    }

    inset(g, px, py) {
      const { x, y, zoom, half: [hx, hy] } = INSET;
      node('rect', { class: 'leader', x: px - hx, y: py - hy, width: 2 * hx, height: 2 * hy }, g);
      for (const side of [-1, 1]) node('line', { class: 'leader', x1: px + hx, y1: py + side * hy, x2: x - zoom * hx, y2: y + side * zoom * hy }, g);
      node('rect', { class: 'border', x: x - zoom * hx, y: y - zoom * hy, width: 2 * zoom * hx, height: 2 * zoom * hy }, g);
      const inset = node('g', { transform: `translate(${x} ${y}) scale(${zoom}) translate(${-px} ${-py})` }, g);
      cross(inset, px, py, CROSS / (this.S * zoom));
      const note = node('text', { class: 'zoom', x: (this.origin[0] + this.S * (x + zoom * hx) + 10).toFixed(1), y: (this.origin[1] - this.S * (y + zoom * hy) + 24).toFixed(1), opacity: 0 }, this.svg);
      note.textContent = `${zoom}×`;
      return [inset, note];
    }

    render() {
      const d = this.frame && FRAME.diagram(this.frame);
      if (!d) return;
      if (this.over && Number.isFinite(d.ox)) this.over.setAttribute('transform', `translate(${d.ox.toFixed(2)} ${d.oy.toFixed(2)}) scale(${d.s.toFixed(3)} ${(-d.s).toFixed(3)})`);
      const extra = still() ? STILL_PERIODS : 0;
      this.model('e', d.force.e, d.f / TAU + extra);
      this.model('s', d.force.s, (Math.PI - d.sun) / TAU + extra);
      const shown = Math.max(this.parts.e.shown, this.parts.s.shown);
      if (shown !== this.mapShown) {
        this.mapShown = shown;
        this.map.setAttribute('opacity', shown.toFixed(3));
        for (const label of this.mapLabels) label.style.opacity = shown.toFixed(3);
      }
    }

    model(name, strength, time) {
      const model = this.models[name], part = this.parts[name];
      const shown = Math.min(1, strength * 8), full = strength > 1 - 1e-6;
      const periods = full ? Math.max(0, time) : 0;
      const key = [strength.toFixed(4), periods.toFixed(5)].join();
      if (key === part.key) return;
      part.key = key;
      part.shown = shown;
      for (const g of [part.g, part.og, part.plane, ...part.notes]) g?.setAttribute('opacity', shown.toFixed(3));
      if (shown <= 0) return;
      const k = Math.floor(periods), s = periods - k, r = POINT / this.S;
      const place = (dots, [px, py]) => {
        for (const dot of dots) {
          dot.setAttribute('cx', px.toFixed(6));
          dot.setAttribute('cy', py.toFixed(6));
        }
      };
      if (strength !== part.strength) {
        part.strength = strength;
        part.shape = full ? model.curve : member(model.curves, strength);
        const set = (paths, c) => {
          const d = closed(c);
          for (const path of paths) path?.setAttribute('d', d);
        };
        set(part.curve, part.shape);
        part.orbits = model.substitutes.map((fam, i) => {
          const loop = member(fam, strength);
          set(part.loops[i], loop);
          place(part.fixed[i], along(loop, 0));
          part.rings[i].setAttribute('cx', this.phase(loop[0], 0)[0].toFixed(1));
          return loop;
        });
        place([part.dots[0]], along(part.shape, 0));
      }
      part.orbits.forEach((loop, i) => place(part.tips[i], along(loop, s)));
      const count = full ? Math.min(POINTS, k + 1) : 1, marked = full ? count : 0;
      if (count !== part.count) {
        while (part.dots.length < count) {
          const [px, py] = along(model.curve, part.dots.length * model.turn);
          part.dots.push(node('circle', { class: 'point', cx: px.toFixed(6), cy: py.toFixed(6), r }, part.points));
        }
        part.dots.forEach((dot, i) => dot.setAttribute('visibility', i < count ? 'visible' : 'hidden'));
        part.count = count;
      }
      if (marked !== part.marked) {
        while (part.marks.length < marked) {
          const at = part.marks.length * model.turn, [mx, my] = this.phase(along(model.curve, at)[0], value(model.rates, at));
          part.marks.push(node('circle', { class: 'point', cx: mx.toFixed(1), cy: my.toFixed(1), r: MAP.point }, part.plane));
        }
        part.marks.forEach((mark, i) => mark.setAttribute('visibility', i < marked ? 'visible' : 'hidden'));
        part.marked = marked;
      }
      const newest = full && k > 0 && k < POINTS && s < SETTLE ? k : -1;
      if (part.newest >= 0 && part.newest !== newest) {
        part.dots[part.newest]?.setAttribute('r', r);
        part.marks[part.newest]?.setAttribute('r', MAP.point);
      }
      if (newest >= 0) {
        const grown = 1 + (FLASH - 1) * (1 - s / SETTLE);
        part.dots[newest].setAttribute('r', (r * grown).toFixed(6));
        part.marks[newest]?.setAttribute('r', (MAP.point * grown).toFixed(2));
      }
      part.newest = newest;
      let tip = along(part.shape, 0);
      part.traces.forEach((trace, back) => {
        const q = full ? k - back : -1;
        if (q < 0) {
          if (part.traced[back] !== -1) trace.setAttribute('points', '');
          part.traced[back] = -1;
          return;
        }
        const path = flown(model, q), m = model.samples;
        if (!back || part.traced[back] !== q) {
          const upto = back ? m : s * m, whole = Math.floor(upto);
          let points = '';
          for (let i = 0; i <= whole; i += 1) points += `${path[2 * i].toFixed(5)},${path[2 * i + 1].toFixed(5)} `;
          if (!back) {
            const w = upto - whole, j = Math.min(m, whole + 1);
            tip = [path[2 * whole] + (path[2 * j] - path[2 * whole]) * w, path[2 * whole + 1] + (path[2 * j + 1] - path[2 * whole + 1]) * w];
            points += `${tip[0].toFixed(5)},${tip[1].toFixed(5)}`;
          }
          trace.setAttribute('points', points);
          part.traced[back] = back ? q : -2;
        }
        trace.setAttribute('stroke-opacity', (0.55 * (1 - (back + (back ? s : 0)) / TRACED)).toFixed(3));
      });
      place([part.tip], tip);
    }
  }

  const panel = (el) => {
    let p = made.get(el);
    if (!p) made.set(el, (p = new Panel(el)));
    return p;
  };
  const within = (slide) => (slide ? [...slide.querySelectorAll('.continuation-map')].map(panel) : []);

  function addStyle() {
    if (document.getElementById('continuation-map-style')) return;
    const style = document.createElement('style');
    style.id = 'continuation-map-style';
    style.textContent = CSS;
    document.head.append(style);
  }

  let shown = [], raf = 0;
  function show(slide) {
    cancelAnimationFrame(raf);
    raf = 0;
    shown = within(slide);
    for (const p of shown) p.render();
    if (!shown.length || still()) return;
    const frame = () => {
      for (const p of shown) p.render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  function ready(slide) {
    if (deck.isPrintView?.()) return;
    addStyle();
    for (const el of document.querySelectorAll('.continuation-map')) panel(el).render();
    show(slide);
  }

  deck.on('ready', (ev) => ready(ev.currentSlide));
  deck.on('slidechanged', (ev) => show(ev.currentSlide));
  const step = () => {
    for (const p of shown) p.render();
  };
  deck.on('fragmentshown', step);
  deck.on('fragmenthidden', step);
  deck.on('pdf-ready', () => {
    addStyle();
    for (const el of document.querySelectorAll('.continuation-map')) {
      const p = new Panel(el);
      made.set(el, p);
      p.render();
    }
  });
  if (deck.isReady()) ready(deck.getCurrentSlide());
})();
