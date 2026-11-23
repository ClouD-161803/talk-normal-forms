(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 880;
  const H = 840;
  const BX = 160;
  const BY = 110;
  const BW = 646;
  const BH = 646;
  const LIM = 1.5;
  const SCALE = BW / (2 * LIM);
  const CX = BX + BW / 2;
  const CY = BY + BH / 2;
  const C = 1.5;
  const LONGEST = 0.172;
  const Q_HEAD = 0.05;
  const Q_HALF = 0.019;
  const E_HEAD = 0.1;
  const E_HALF = 0.042;
  const E_GAP = 0.068;
  const E_INNER = 0.56;
  const RIPPLE = 1.05;
  const SHAFT_WIPE = 0.25;
  const LINE_WIPE = 0.8;
  const MORPH_DUR = 1.25;
  const RES_DUR = 0.85;
  const FADE_DUR = 0.35;
  const PASS = 6.0;
  const HOLD = 1.4;
  const LOOP_FADE = 0.4;
  const STILL_FRAC = 0.86;
  const CURVE_N = 80;
  const TRACE_N = 80;

  const CSS = `
.reveal section.nf-example .nf-example-plot { pointer-events: none; font-size: 28px; line-height: 1.2; color: var(--subtle); }
.reveal section.nf-example .nf-example-plot > svg,
.reveal section.nf-example .nf-example-plot > .nf-ticks { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; }
.reveal section.nf-example .nf-example-plot .nf-tick { position: absolute; height: 1em; white-space: nowrap; line-height: 1; color: var(--muted); }
.reveal section.nf-example .nf-example-plot .nf-axes path { fill: none; stroke: var(--muted); stroke-width: 2; }
.reveal section.nf-example .nf-example-plot .nf-grid path { fill: none; stroke: var(--muted); stroke-width: 1; opacity: 0.12; }
.reveal section.nf-example .nf-example-plot .nf-q-shaft { fill: none; stroke: var(--muted); stroke-width: 1.5; stroke-linecap: round; }
.reveal section.nf-example .nf-example-plot .nf-q-head { fill: var(--muted); stroke: none; }
.reveal section.nf-example .nf-example-plot .nf-curve { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.reveal section.nf-example .nf-example-plot .nf-ref { fill: none; stroke: var(--muted); stroke-width: 1.8; stroke-dasharray: 8 8; stroke-linecap: round; opacity: 0.42; }
.reveal section.nf-example .nf-example-plot .nf-head { fill: currentColor; stroke: none; }
.reveal section.nf-example .nf-example-plot .nf-ghost { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; opacity: 0.22; }
.reveal section.nf-example .nf-example-plot .nf-trace { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.reveal section.nf-example .nf-example-plot .nf-dot { fill: currentColor; stroke: none; }
.reveal section.nf-example .nf-example-plot .nf-origin { fill: var(--bg); stroke: var(--text); stroke-width: 3; }
`;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (t) => {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
  };
  const easeInOut = (t) => {
    const x = clamp(t, 0, 1);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };
  const X = (u) => CX + u * SCALE;
  const Y = (v) => CY - v * SCALE;

  const still = () => {
    const q = location.search;
    return matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-still')
      || /[?&](?:still|edit)\b/.test(q) || /print-pdf/.test(q) || !!window.Reveal?.isPrintView?.();
  };

  function addStyle() {
    if (document.getElementById('nf-example-style')) return;
    const style = document.createElement('style');
    style.id = 'nf-example-style';
    style.textContent = CSS;
    document.head.append(style);
  }

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    parent?.append(e);
    return e;
  }

  function triPath(tx, ty, dx, dy, len, half) {
    const bx = tx - len * dx;
    const by = ty - len * dy;
    const nx = -dy * half;
    const ny = dx * half;
    return `M${X(tx).toFixed(1)} ${Y(ty).toFixed(1)}L${X(bx + nx).toFixed(1)} ${Y(by + ny).toFixed(1)}L${X(bx - nx).toFixed(1)} ${Y(by - ny).toFixed(1)}Z`;
  }

  function polyPath(pts, limit) {
    const n = limit === undefined ? pts.length : Math.min(pts.length, limit);
    let d = '';
    for (let i = 0; i < n; i++) d += `${i ? 'L' : 'M'}${X(pts[i][0]).toFixed(1)} ${Y(pts[i][1]).toFixed(1)}`;
    return d;
  }

  function tracePartial(pts, frac) {
    const maxI = pts.length - 1;
    const u = clamp(frac, 0, 1) * maxI;
    const k = Math.floor(u);
    const f = u - k;
    let d = polyPath(pts, k + 1);
    let hx = pts[k][0];
    let hy = pts[k][1];
    if (f > 0 && k < maxI) {
      hx += f * (pts[k + 1][0] - pts[k][0]);
      hy += f * (pts[k + 1][1] - pts[k][1]);
      d += `L${X(hx).toFixed(1)} ${Y(hy).toFixed(1)}`;
    }
    return { d, hx, hy };
  }

  const GRID_PTS = (() => {
    const coords = [-1.35, -1.05, -0.75, -0.45, -0.15, 0.15, 0.45, 0.75, 1.05, 1.35];
    const pts = [];
    for (const x of coords) for (const y of coords) pts.push({ x, y, r: Math.hypot(x, y) });
    pts.sort((a, b) => a.r - b.r);
    const rMax = pts[pts.length - 1].r;
    return pts.map((p) => ({ ...p, delay: (RIPPLE * p.r) / rMax }));
  })();

  const SADDLE_TRACES = (() => {
    const specs = [];
    for (const s of [1, -1]) specs.push({ tone: 'var(--violet)', kind: 'in', s });
    for (const s of [1, -1]) specs.push({ tone: 'var(--accent)', kind: 'out', s });
    for (const [x0, y0, T] of [[0.1, 1.6, 2.77], [0.35, 1.6, 1.52]]) {
      for (const sx of [1, -1]) for (const sy of [1, -1]) specs.push({ tone: 'var(--text)', kind: 'hyp', sx, sy, x0, y0, T });
    }
    return specs.map((sp) => {
      const base = [];
      for (let i = 0; i <= TRACE_N; i++) {
        const u = i / TRACE_N;
        if (sp.kind === 'in') {
          base.push([0, sp.s * 1.48 * Math.exp(-2.65 * u)]);
        } else if (sp.kind === 'out') {
          base.push([sp.s * 0.1 * Math.exp(2.7 * u), 0]);
        } else {
          const t = sp.T * u;
          base.push([sp.sx * sp.x0 * Math.exp(t), sp.sy * sp.y0 * Math.exp(-t)]);
        }
      }
      return { tone: sp.tone, base };
    });
  })();

  const RES_TRACES = (() => {
    const out = [];
    for (const s of [1, -1]) {
      const pts = [];
      for (let i = 0; i <= TRACE_N; i++) pts.push([0, s * 0.1 * Math.exp(2.74 * (i / TRACE_N))]);
      out.push({ tone: 'var(--accent)', pts });
    }
    const families = [
      { c0: 2.4, xMax: 0.88 },
      { c0: 0.75, xMax: 1.24 },
      { c0: 0, xMax: 1.55, tone: 'var(--accent)' },
      { c0: -1.4, xMax: 1.36 },
    ];
    for (const fam of families) {
      const x0 = 0.12;
      const T = Math.log(fam.xMax / x0);
      for (const sx of [1, -1]) {
        const pts = [];
        for (let i = 0; i <= TRACE_N; i++) {
          const x = x0 * Math.exp(T * (i / TRACE_N));
          const y = x * x * (fam.c0 + C * Math.log(x));
          pts.push([sx * x, y]);
        }
        out.push({ tone: fam.tone ?? 'var(--text)', pts });
      }
    }
    return out;
  })();

  const weakY = (x) => (x === 0 ? 0 : C * x * x * Math.log(Math.abs(x)));

  const RES_WEAK = (() => {
    const pts = [];
    for (let i = 0; i <= 2 * CURVE_N; i++) {
      const x = -1.55 + (3.1 * i) / (2 * CURVE_N);
      pts.push([x, weakY(x)]);
    }
    let x = 0;
    let arc = 0;
    const target = E_INNER + E_HEAD;
    while (arc < target) {
      const nx = x + 0.002;
      arc += Math.hypot(nx - x, weakY(nx) - weakY(x));
      x = nx;
    }
    const slope = C * x * (2 * Math.log(x) + 1);
    const n = Math.hypot(1, slope);
    const heads = [1, -1].map((side) => ({ x: side * x, y: weakY(x), dx: side / n, dy: slope / n }));
    return { pts, heads };
  })();

  const RES_REFS = [-1.0, 0.0, 1.0].map((k) => {
    const pts = [];
    for (let i = 0; i <= CURVE_N; i++) {
      const x = -1.55 + (3.1 * i) / CURVE_N;
      pts.push([x, k * x * x]);
    }
    return pts;
  });

  let serial = 0;

  class NfPlot {
    constructor(el) {
      this.el = el;
      this.slide = el.closest('section');
      this.uid = ++serial;
      this.stage = 0;
      this.raf = 0;
      this.qAge = 0;
      this.qShown = false;
      this.wsProg = 0;
      this.wuProg = 0;
      this.headsOp = 0;
      this.tracesOp = 0;
      this.traceClock = 0;
      this.resClock = 0;
      this.s = 0;
      this.sAnim = null;
      this.res = 0;
      this.resAnim = null;
      this.build();
    }

    build() {
      this.el.replaceChildren();
      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, this.el);
      const defs = svgEl('defs', {}, svg);
      const c1 = svgEl('clipPath', { id: `nf-clip-${this.uid}` }, defs);
      svgEl('rect', { x: BX, y: BY, width: BW, height: BH }, c1);
      const c2 = svgEl('clipPath', { id: `nf-marks-${this.uid}` }, defs);
      svgEl('rect', { x: BX - 14, y: BY - 14, width: BW + 28, height: BH + 28 }, c2);

      const clipped = svgEl('g', { 'clip-path': `url(#nf-clip-${this.uid})` }, svg);
      const grid = svgEl('g', { class: 'nf-grid' }, clipped);
      for (const v of [-1, -0.5, 0, 0.5, 1]) {
        svgEl('path', { d: `M${X(v).toFixed(1)} ${BY}V${BY + BH}` }, grid);
        svgEl('path', { d: `M${BX} ${Y(v).toFixed(1)}H${BX + BW}` }, grid);
      }

      this.qGroup = svgEl('g', {}, clipped);
      this.qArrows = GRID_PTS.map(() => ({
        shaft: svgEl('path', { class: 'nf-q-shaft' }, this.qGroup),
        head: svgEl('path', { class: 'nf-q-head' }, this.qGroup),
      }));

      this.saddleG = svgEl('g', {}, clipped);
      this.wsLine = svgEl('path', {
        class: 'nf-curve',
        d: `M${X(0).toFixed(1)} ${Y(-1.55).toFixed(1)}L${X(0).toFixed(1)} ${Y(1.55).toFixed(1)}`,
        pathLength: '1',
      }, this.saddleG);
      this.wsLine.style.color = 'var(--violet)';

      this.wuLine = svgEl('path', { class: 'nf-curve', pathLength: '1' }, this.saddleG);
      this.wuLine.style.color = 'var(--accent)';

      this.saddleHeadsG = svgEl('g', {}, this.saddleG);
      this.wsHeads = [1, -1].flatMap((side) =>
        [0, 1].map((k) => {
          const tipY = side * (E_INNER + k * E_GAP);
          const p = svgEl('path', { class: 'nf-head', d: triPath(0, tipY, 0, -side, E_HEAD, E_HALF) }, this.saddleHeadsG);
          p.style.color = 'var(--violet)';
          return p;
        })
      );
      this.wuHeads = [1, -1].flatMap(() =>
        [0, 1].map(() => {
          const p = svgEl('path', { class: 'nf-head' }, this.saddleHeadsG);
          p.style.color = 'var(--accent)';
          return p;
        })
      );

      this.resG = svgEl('g', {}, clipped);
      for (const pts of RES_REFS) svgEl('path', { class: 'nf-ref', d: polyPath(pts) }, this.resG);
      const resAxis = svgEl('path', {
        class: 'nf-curve',
        d: `M${X(0).toFixed(1)} ${Y(-1.55).toFixed(1)}L${X(0).toFixed(1)} ${Y(1.55).toFixed(1)}`,
      }, this.resG);
      resAxis.style.color = 'var(--accent)';
      const weak = svgEl('path', { class: 'nf-curve', d: polyPath(RES_WEAK.pts) }, this.resG);
      weak.style.color = 'var(--accent)';
      for (const h of RES_WEAK.heads) {
        const p = svgEl('path', { class: 'nf-head', d: triPath(h.x, h.y, h.dx, h.dy, E_HEAD, E_HALF) }, this.resG);
        p.style.color = 'var(--accent)';
      }
      for (const side of [1, -1]) {
        for (const k of [0, 1]) {
          const tipY = side * (E_INNER + E_HEAD + k * E_GAP);
          const p = svgEl('path', { class: 'nf-head', d: triPath(0, tipY, 0, side, E_HEAD, E_HALF) }, this.resG);
          p.style.color = 'var(--accent)';
        }
      }

      const axes = svgEl('g', { class: 'nf-axes' }, svg);
      svgEl('path', { d: `M${BX} ${BY}V${BY + BH}H${BX + BW}` }, axes);
      const ticks = document.createElement('div');
      ticks.className = 'nf-ticks';
      for (const t of [-1, 0, 1]) {
        const label = t < 0 ? `−${-t}` : String(t);
        svgEl('path', { d: `M${X(t).toFixed(1)} ${BY + BH}v10` }, axes);
        const lx = document.createElement('div');
        lx.className = 'nf-tick';
        lx.textContent = label;
        lx.style.left = `${X(t).toFixed(1)}px`;
        lx.style.top = `${BY + BH + 32}px`;
        lx.style.transform = 'translate(-50%, -50%)';
        ticks.append(lx);

        svgEl('path', { d: `M${BX} ${Y(t).toFixed(1)}h-10` }, axes);
        const ly = document.createElement('div');
        ly.className = 'nf-tick';
        ly.textContent = label;
        ly.style.left = `${BX - 18}px`;
        ly.style.top = `${Y(t).toFixed(1)}px`;
        ly.style.transform = 'translate(-100%, -50%)';
        ticks.append(ly);
      }
      this.el.append(ticks);

      const marks = svgEl('g', { 'clip-path': `url(#nf-marks-${this.uid})` }, svg);
      this.saddleTracesG = svgEl('g', {}, marks);
      this.saddleTraceNodes = SADDLE_TRACES.map((tr) => {
        const g = svgEl('g', {}, this.saddleTracesG);
        g.style.color = tr.tone;
        const ghost = svgEl('path', { class: 'nf-ghost' }, g);
        const active = svgEl('path', { class: 'nf-trace' }, g);
        const dot = svgEl('circle', { class: 'nf-dot', r: '6' }, g);
        return { base: tr.base, ghost, active, dot };
      });

      this.resTracesG = svgEl('g', {}, marks);
      this.resTraceNodes = RES_TRACES.map((tr) => {
        const g = svgEl('g', {}, this.resTracesG);
        g.style.color = tr.tone;
        svgEl('path', { class: 'nf-ghost', d: polyPath(tr.pts) }, g);
        const active = svgEl('path', { class: 'nf-trace' }, g);
        const dot = svgEl('circle', { class: 'nf-dot', r: '6' }, g);
        return { pts: tr.pts, active, dot };
      });

      svgEl('circle', { class: 'nf-origin', cx: X(0).toFixed(1), cy: Y(0).toFixed(1), r: '11' }, marks);
    }

    readStage() {
      if (!this.slide) return 0;
      let max = 0;
      for (const f of this.slide.querySelectorAll('.fragment.visible[data-nf-stage]')) {
        const v = Number(f.dataset.nfStage);
        if (v > max) max = v;
      }
      return max;
    }

    applySlideAttrs(stage) {
      if (!this.slide) return;
      this.slide.dataset.nfStage = String(stage);
      const mode = stage >= 7 ? 'resonant' : stage === 6 ? 'after' : 'before';
      this.slide.dataset.nfMode = mode;
    }

    sync(animate) {
      const prev = this.stage;
      const next = this.readStage();
      this.stage = next;
      this.applySlideAttrs(next);

      if (!animate) {
        this.qShown = next >= 1;
        this.qAge = next >= 1 ? RIPPLE + SHAFT_WIPE + 0.1 : 0;
        this.wsProg = next >= 2 ? 1 : 0;
        this.wuProg = next >= 3 ? 1 : 0;
        this.headsOp = next >= 4 ? 1 : 0;
        this.tracesOp = next >= 5 ? 1 : 0;
        this.s = next === 6 ? 1 : 0;
        this.sAnim = null;
        this.res = next >= 7 ? 1 : 0;
        this.resAnim = null;
        this.render(STILL_FRAC, STILL_FRAC);
        return;
      }

      if (next >= 1 && !this.qShown) {
        this.qShown = true;
        this.qAge = 0;
      } else if (next < 1) {
        this.qShown = false;
        this.qAge = 0;
      }

      if (next < 2) this.wsProg = 0;
      if (next < 3) this.wuProg = 0;

      if (next >= 5 && prev < 5) this.traceClock = 0;

      const sTarget = next === 6 ? 1 : 0;
      if (Math.abs(sTarget - this.s) > 1e-4 && (!this.sAnim || this.sAnim.to !== sTarget)) {
        this.sAnim = { from: this.s, to: sTarget, t: 0, dur: MORPH_DUR };
      }

      const resTarget = next >= 7 ? 1 : 0;
      if (Math.abs(resTarget - this.res) > 1e-4 && (!this.resAnim || this.resAnim.to !== resTarget)) {
        this.resAnim = { from: this.res, to: resTarget, t: 0, dur: RES_DUR };
        if (resTarget === 1) this.resClock = 0;
      }
    }

    still() {
      this.stop(false);
      this.sync(false);
    }

    loopFrac(clock) {
      const period = PASS + HOLD;
      const tau = clock % period;
      const pass = Math.floor(clock / period);
      const frac = clamp(tau / PASS, 0, 1);
      const fade = pass > 0 && tau < LOOP_FADE ? smooth(tau / LOOP_FADE) : 1;
      return { frac, fade };
    }

    tick(dt) {
      if (this.qShown && this.qAge < RIPPLE + SHAFT_WIPE + 0.1) this.qAge += dt;

      if (this.stage >= 2 && this.wsProg < 1) this.wsProg = Math.min(1, this.wsProg + dt / LINE_WIPE);
      if (this.stage >= 3 && this.wuProg < 1) this.wuProg = Math.min(1, this.wuProg + dt / LINE_WIPE);

      const hTarget = this.stage >= 4 ? 1 : 0;
      this.headsOp += (hTarget - this.headsOp) * (1 - Math.exp(-dt / (FADE_DUR * 0.4)));
      if (Math.abs(hTarget - this.headsOp) < 0.004) this.headsOp = hTarget;

      const tTarget = this.stage >= 5 ? 1 : 0;
      this.tracesOp += (tTarget - this.tracesOp) * (1 - Math.exp(-dt / (FADE_DUR * 0.4)));
      if (Math.abs(tTarget - this.tracesOp) < 0.004) this.tracesOp = tTarget;

      if (this.sAnim) {
        this.sAnim.t += dt;
        const u = clamp(this.sAnim.t / this.sAnim.dur, 0, 1);
        this.s = this.sAnim.from + (this.sAnim.to - this.sAnim.from) * easeInOut(u);
        if (u >= 1) {
          this.s = this.sAnim.to;
          this.sAnim = null;
        }
      }

      if (this.resAnim) {
        this.resAnim.t += dt;
        const u = clamp(this.resAnim.t / this.resAnim.dur, 0, 1);
        this.res = this.resAnim.from + (this.resAnim.to - this.resAnim.from) * easeInOut(u);
        if (u >= 1) {
          this.res = this.resAnim.to;
          this.resAnim = null;
        }
      }

      if (this.stage >= 5 && this.res < 0.99) this.traceClock += dt;
      if (this.stage >= 7 || this.res > 0.01) this.resClock += dt;

      const sf = this.loopFrac(this.traceClock);
      const rf = this.loopFrac(this.resClock);
      this.render(sf.frac, rf.frac, sf.fade, rf.fade);
    }

    render(saddleFrac, resFrac, saddleFade = 1, resFade = 1) {
      const alpha = (1 - this.s) * (C / 3);
      const lam2 = -1 + 3 * this.res;
      const ceff = (1 - this.res) * (1 - this.s) * C + this.res * C;

      if (!this.qShown) {
        this.qGroup.setAttribute('opacity', '0');
      } else {
        this.qGroup.setAttribute('opacity', '1');
        let fastest = 0;
        const vels = new Array(GRID_PTS.length);
        for (let i = 0; i < GRID_PTS.length; i++) {
          const p = GRID_PTS[i];
          const vx = p.x;
          const vy = lam2 * p.y + ceff * p.x * p.x;
          const sp = Math.hypot(vx, vy);
          if (sp > fastest) fastest = sp;
          vels[i] = [vx, vy, sp];
        }
        for (let i = 0; i < GRID_PTS.length; i++) {
          const p = GRID_PTS[i];
          const [vx, vy, sp] = vels[i];
          const node = this.qArrows[i];
          const w = smooth((this.qAge - p.delay) / SHAFT_WIPE);
          if (w <= 0 || sp < 1e-9) {
            node.shaft.setAttribute('opacity', '0');
            node.head.setAttribute('opacity', '0');
            continue;
          }
          const dx = vx / sp;
          const dy = vy / sp;
          const len = LONGEST * Math.max(0.45, Math.sqrt(sp / fastest));
          const tailX = p.x - 0.5 * len * dx;
          const tailY = p.y - 0.5 * len * dy;
          const tipX = p.x + 0.5 * len * dx;
          const tipY = p.y + 0.5 * len * dy;
          const endX = tipX - 0.5 * Q_HEAD * dx;
          const endY = tipY - 0.5 * Q_HEAD * dy;
          const curX = tailX + w * (endX - tailX);
          const curY = tailY + w * (endY - tailY);
          node.shaft.setAttribute('opacity', '1');
          node.shaft.setAttribute('d', `M${X(tailX).toFixed(1)} ${Y(tailY).toFixed(1)}L${X(curX).toFixed(1)} ${Y(curY).toFixed(1)}`);
          const headOn = this.qAge >= p.delay + 0.8 * SHAFT_WIPE;
          node.head.setAttribute('opacity', headOn ? '1' : '0');
          if (headOn) node.head.setAttribute('d', triPath(tipX, tipY, dx, dy, Q_HEAD, Q_HALF));
        }
      }

      const saddleVis = 1 - this.res;
      this.saddleG.setAttribute('opacity', saddleVis.toFixed(3));
      this.resG.setAttribute('opacity', this.res.toFixed(3));

      if (saddleVis > 0.002) {
        if (this.wsProg <= 0) {
          this.wsLine.setAttribute('opacity', '0');
        } else if (this.wsProg >= 1) {
          this.wsLine.setAttribute('opacity', '1');
          this.wsLine.removeAttribute('stroke-dasharray');
          this.wsLine.removeAttribute('stroke-dashoffset');
        } else {
          const w = easeInOut(this.wsProg);
          this.wsLine.setAttribute('opacity', '1');
          this.wsLine.setAttribute('stroke-dasharray', '1 1');
          this.wsLine.setAttribute('stroke-dashoffset', (1 - w).toFixed(4));
        }

        if (this.wuProg <= 0) {
          this.wuLine.setAttribute('opacity', '0');
        } else {
          const wuPts = [];
          for (let i = 0; i <= CURVE_N; i++) {
            const x = -1.55 + (3.1 * i) / CURVE_N;
            wuPts.push([x, alpha * x * x]);
          }
          this.wuLine.setAttribute('d', polyPath(wuPts));
          this.wuLine.setAttribute('opacity', '1');
          if (this.wuProg >= 1) {
            this.wuLine.removeAttribute('stroke-dasharray');
            this.wuLine.removeAttribute('stroke-dashoffset');
          } else {
            const w = easeInOut(this.wuProg);
            this.wuLine.setAttribute('stroke-dasharray', '1 1');
            this.wuLine.setAttribute('stroke-dashoffset', (1 - w).toFixed(4));
          }
        }

        this.saddleHeadsG.setAttribute('opacity', this.headsOp.toFixed(3));
        if (this.headsOp > 0.002) {
          const arcTargets = [E_INNER + E_HEAD, E_INNER + E_HEAD + E_GAP];
          const samples = 60;
          const xs = new Array(samples + 1);
          const arcs = new Array(samples + 1);
          xs[0] = 0;
          arcs[0] = 0;
          for (let i = 1; i <= samples; i++) {
            const x = (1.3 * i) / samples;
            const prevX = xs[i - 1];
            xs[i] = x;
            arcs[i] = arcs[i - 1] + Math.hypot(x - prevX, alpha * (x * x - prevX * prevX));
          }
          const xAtArc = (target) => {
            for (let i = 1; i <= samples; i++) {
              if (arcs[i] >= target) {
                const f = (target - arcs[i - 1]) / (arcs[i] - arcs[i - 1] || 1);
                return xs[i - 1] + f * (xs[i] - xs[i - 1]);
              }
            }
            return xs[samples];
          };
          let idx = 0;
          for (const side of [1, -1]) {
            for (const target of arcTargets) {
              const ax = xAtArc(target);
              const px = side * ax;
              const py = alpha * ax * ax;
              const tx = side;
              const ty = 2 * alpha * ax;
              const nrm = Math.hypot(tx, ty);
              this.wuHeads[idx++].setAttribute('d', triPath(px, py, tx / nrm, ty / nrm, E_HEAD, E_HALF));
            }
          }
        }
      }

      const sTraceOp = saddleVis * this.tracesOp;
      this.saddleTracesG.setAttribute('opacity', sTraceOp.toFixed(3));
      if (sTraceOp > 0.002) {
        for (const tr of this.saddleTraceNodes) {
          const pts = tr.base.map(([y1, y2]) => [y1, y2 + alpha * y1 * y1]);
          tr.ghost.setAttribute('d', polyPath(pts));
          const cur = tracePartial(pts, saddleFrac);
          tr.active.setAttribute('d', cur.d);
          tr.active.setAttribute('opacity', saddleFade.toFixed(3));
          tr.dot.setAttribute('cx', X(cur.hx).toFixed(1));
          tr.dot.setAttribute('cy', Y(cur.hy).toFixed(1));
          tr.dot.setAttribute('opacity', saddleFade.toFixed(3));
        }
      }

      this.resTracesG.setAttribute('opacity', this.res.toFixed(3));
      if (this.res > 0.002) {
        for (const tr of this.resTraceNodes) {
          const cur = tracePartial(tr.pts, resFrac);
          tr.active.setAttribute('d', cur.d);
          tr.active.setAttribute('opacity', resFade.toFixed(3));
          tr.dot.setAttribute('cx', X(cur.hx).toFixed(1));
          tr.dot.setAttribute('cy', Y(cur.hy).toFixed(1));
          tr.dot.setAttribute('opacity', resFade.toFixed(3));
        }
      }
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

    stop(settle = true) {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (settle) this.sync(false);
    }
  }

  const SEL = 'section.nf-example .nf-example-plot';
  const made = new WeakMap();
  const plotOf = (el) => {
    let p = made.get(el);
    if (!p) made.set(el, (p = new NfPlot(el)));
    return p;
  };
  const within = (slide) => (slide?.matches?.('section.nf-example') ? [...slide.querySelectorAll('.nf-example-plot')].map(plotOf) : []);

  function show(slide) {
    for (const p of within(slide)) {
      if (still()) p.still();
      else {
        p.sync(false);
        p.start();
      }
    }
  }

  function ready(slide) {
    if (window.Reveal.isPrintView?.()) return;
    addStyle();
    for (const el of document.querySelectorAll(SEL)) plotOf(el).still();
    show(slide);
  }

  const deck = window.Reveal;
  deck.on('ready', (ev) => ready(ev.currentSlide));
  deck.on('slidechanged', (ev) => {
    for (const p of within(ev.previousSlide)) p.stop(true);
    show(ev.currentSlide);
  });
  const step = () => {
    for (const p of within(deck.getCurrentSlide())) p.sync(!still());
  };
  deck.on('fragmentshown', step);
  deck.on('fragmenthidden', step);
  deck.on('pdf-ready', () => {
    addStyle();
    for (const el of document.querySelectorAll(SEL)) {
      const p = new NfPlot(el);
      made.set(el, p);
      p.still();
    }
  });
  if (deck.isReady()) ready(deck.getCurrentSlide());
})();
