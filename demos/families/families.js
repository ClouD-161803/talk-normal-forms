// the drawings of families of invariant objects, each drawn on a canvas in a div.family and named
// in its data-family: section, tori, or normal-form. load this file after theme/beeson.js, and the
// data of each drawing of the deck in a script of its own, e.g. demos/families/section.js. a data
// file is written by the script of the same name in data/.
//
// a drawing is run over and over while its slide is shown, from its start each time the slide is
// shown. it is drawn complete in the print view, under ?still, and under reduced motion. the colors
// are taken from a colormap of matplotlib, as in the figures of DyLAN. on a dark ground, the dark end
// of a colormap is moved toward the other end until its color has a contrast of 3:1 against the ground,
// or of 1.6:1 where the colormap is used whole.
//
// section: the section q3 = 0 of the center manifold of the Earth-Moon L2 (Fig. 6 of Jorba and
// Masdemont 1999). the energy h rises from 0.2 to 1.0. each orbit is drawn as the dots of its
// crossings, colored by its rotation number in plasma, and the dots are carried around the curve of
// the orbit while its rotation number changes. the boundary of the section, the planar Lyapunov orbit,
// is not drawn, and the halo orbits are born at it.
//
// tori: the unstable 2-tori near L5 in the bicircular problem (Figs. 8 and 9 of Simó et al. 1995), in
// the plane of the primaries. on each of the ten computed tori, orbits that start on its invariant
// curve are wound along it, first on the smallest torus and then on each larger one in turn. the tori
// are colored by the vertical amplitude alpha in magma, the smaller ones over the larger ones.
//
// normal-form: the orbits near a saddle, drawn in standard coordinates and carried into the
// coordinates of the normal form and back.
(() => {
  const DATA = (window.FamiliesData ??= {});
  const TAU = 2 * Math.PI;
  // 17 stops of each colormap, sampled from matplotlib at even steps
  const MAPS = {
    plasma: '0d0887 310597 4c02a1 6600a7 7e03a8 9511a1 aa2395 bc3587 cc4778 da5a6a e66c5c f0804e f89540 fdac33 fdc527 f8df25 f0f921',
    magma: '000004 0a0822 1d1147 36106b 51127c 6a1c81 832681 9c2e7f b73779 d0416f e75263 f56b5c fc8961 fea772 fec488 fde2a3 fcfdbf',
    viridis: '440154 48186a 472d7b 424086 3b528b 33638d 2c728e 26828e 21918c 1fa088 28ae80 3fbc73 5ec962 84d44b addc30 d8e219 fde725',
  };
  // the least seconds between two frames, so that a slow machine draws at most 30 frames per second
  const FRAME = 1 / 31;
  // the least contrast of the ends of a colormap with the ground, and the same for a colormap used whole
  const CONTRAST = 3;
  const FAINT = 1.6;

  const still = () => {
    const q = location.search;
    return matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-still')
      || /[?&]still\b/.test(q) || /print-pdf/.test(q) || !!window.Reveal?.isPrintView?.();
  };

  const rgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const STOPS = Object.fromEntries(Object.entries(MAPS).map(([name, stops]) => [name, stops.split(' ').map(rgb)]));
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const smooth = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };

  function sample(name, v) {
    const stops = STOPS[name];
    const x = clamp(v) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(x));
    return stops[i].map((c, k) => c + (stops[i + 1][k] - c) * (x - i));
  }

  const luminance = (c) => {
    const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  // the ends of a colormap on a ground, each moved toward the other until its color is told from the ground
  function ends(name, ground, least) {
    let [lo, hi] = [0, 1];
    while (lo < hi - 0.3 && contrast(sample(name, lo), ground) < least) lo += 0.01;
    while (hi > lo + 0.3 && contrast(sample(name, hi), ground) < least) hi -= 0.01;
    return [lo, hi];
  }

  // the colors of the mode of the deck: the tones of the theme, and each colormap between its ends
  function palette(el) {
    const css = getComputedStyle(el);
    const tone = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
    const bg = tone('--bg', '#050505');
    const ground = /^#[0-9a-f]{6}$/i.test(bg) ? rgb(bg.slice(1)) : [5, 5, 5];
    const ranges = (least) => Object.fromEntries(Object.keys(STOPS).map((name) => [name, ends(name, ground, least)]));
    const [range, wide] = [ranges(CONTRAST), ranges(FAINT)];
    const dark = luminance(ground) < 0.2;
    return {
      dark,
      text: tone('--text', '#f2f2ef'),
      violet: tone('--violet', '#c94fe6'),
      accent: tone('--accent', '#f08050'),
      vermilion: tone('--data-6', '#d55e00'),
      purple: tone('--data-7', '#cc79a7'),
      ground: bg,
      // the color of a colormap at v, from 0 at its lower end to 1 at its upper end. with whole, the
      // colormap is not cut short on a light ground, as in a figure of DyLAN on white, and on a dark
      // ground it loses only the colors that are lost in the ground
      map(name, v, alpha = 1, whole = false) {
        const [lo, hi] = !whole ? range[name] : dark ? wide[name] : [0, 1];
        const [r, g, b] = sample(name, lo + (hi - lo) * clamp(v));
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
      },
    };
  }

  // the view of a window [x0, x1, y0, y1] of the data, held in the box of the drawing with a margin, y up
  function view(d, [x0, x1, y0, y1], margin) {
    const s = Math.min((d.w - 2 * margin) / (x1 - x0), (d.h - 2 * margin) / (y1 - y0));
    return { s, x: d.w / 2 - s * (x0 + x1) / 2, y: d.h / 2 + s * (y0 + y1) / 2 };
  }

  function decode(text) {
    const binary = atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Int16Array(bytes.buffer);
  }

  const KINDS = {};

  // ---- section -------------------------------------------------------------------------------------------
  // the seconds of the rise of the energy, of the rest at the last energy, and of the fade at each end.
  // an orbit is drawn as dots of radius dot, about spacing apart at the last energy. where the rotation
  // number of an orbit changes fast, the orbit has fewer dots, so that no dot moves faster than speed
  // per second
  const SECTION = { rise: 13, rest: 3, fade: 0.7, spacing: 7, speed: 330, dot: 1.4 };
  KINDS.section = {
    seconds: SECTION.rise + SECTION.rest + SECTION.fade,
    prepare(data) {
      const points = decode(data.points);
      const frames = data.energies.length;
      const perFrame = points.length / frames;
      const offsets = [];
      let at = 2 * data.boundary;
      for (const n of data.counts) { offsets.push(at); at += 2 * n; }
      let [x0, x1, y0, y1] = [0, 0, 0, 0];
      const last = (frames - 1) * perFrame;
      for (let i = 0; i < data.boundary; i++) {
        x0 = Math.min(x0, points[last + 2 * i]); x1 = Math.max(x1, points[last + 2 * i]);
        y0 = Math.min(y0, points[last + 2 * i + 1]); y1 = Math.max(y1, points[last + 2 * i + 1]);
      }
      // the length of each curve at the last energy, and the mean change of its rotation number per second
      const lengths = data.counts.map((n, c) => {
        const o = last + offsets[c];
        let sum = 0;
        for (let i = 0; i < n; i++) {
          const k = (i + 1) % n;
          sum += Math.hypot(points[o + 2 * k] - points[o + 2 * i], points[o + 2 * k + 1] - points[o + 2 * i + 1]);
        }
        return sum;
      });
      const rates = data.counts.map((n, c) => {
        const first = c < data.central ? 0 : Math.max(0, data.born - 1);
        let sum = 0;
        for (let f = first; f < frames - 1; f++) sum += Math.abs(data.rotation[f + 1][c] - data.rotation[f][c]);
        return sum / ((SECTION.rise * (frames - 1 - first)) / (frames - 1));
      });
      return { points, perFrame, offsets, lengths, rates, window: [x0, x1, y0, y1], now: new Float32Array(perFrame), key: '' };
    },
    draw(d, t) {
      const { g, data, state, colors } = d;
      const e = data.energies;
      const done = !Number.isFinite(t);
      const u = done ? 1 : clamp(t / SECTION.rise);
      const h = e[0] + (e[e.length - 1] - e[0]) * u;
      let f = 0;
      while (f < e.length - 2 && e[f + 1] <= h) f++;
      const w = clamp((h - e[f]) / (e[f + 1] - e[f]));
      const a = state.points.subarray(f * state.perFrame, (f + 1) * state.perFrame);
      const b = state.points.subarray((f + 1) * state.perFrame, (f + 2) * state.perFrame);
      const p = state.now;
      for (let i = 0; i < p.length; i++) p[i] = a[i] + (b[i] - a[i]) * w;
      const at = (rows) => rows[f].map((value, i) => value + (rows[f + 1][i] - value) * w);
      // the curves about the halo orbits are faded in between the last energy without them and the first with them
      const born = f + 1 < data.born ? 0 : f + 1 === data.born ? w : 1;
      d.canvas.style.opacity = done ? 1 : Math.min(smooth(t / SECTION.fade), smooth((this.seconds - t) / SECTION.fade));

      const v = view(d, state.window, 14);
      if (state.key !== `${d.w}x${d.h}`) {
        state.key = `${d.w}x${d.h}`;
        // half the number of dots of each orbit
        state.half = state.lengths.map((length, c) => {
          const px = length * v.s;
          return Math.max(4, Math.round(Math.min(px / SECTION.spacing, (2 * SECTION.speed) / (state.rates[c] * px)) / 2));
        });
      }
      // the dots of an orbit are its crossings j returns before and after its first point. on its curve,
      // the crossing j is j times the rotation number of a turn away from the first point, measured in
      // the length of the curve, so the dots are carried around the curve while the energy rises
      const [lo, hi] = data.range;
      const rotation = at(data.rotation);
      const r = SECTION.dot;
      data.counts.forEach((n, c) => {
        const island = c >= data.central;
        if (island && !born) return;
        const o = state.offsets[c];
        g.globalAlpha = island ? born : 1;
        g.fillStyle = colors.map('plasma', (rotation[c] - lo) / (hi - lo), 1, true);
        g.beginPath();
        for (let j = -state.half[c]; j < state.half[c]; j++) {
          const turn = j * rotation[c];
          const along = (turn - Math.floor(turn)) * n;
          const i = Math.floor(along) % n;
          const k = (i + 1) % n;
          const part = along - Math.floor(along);
          const x = v.x + v.s * (p[o + 2 * i] + (p[o + 2 * k] - p[o + 2 * i]) * part);
          const y = v.y - v.s * (p[o + 2 * i + 1] + (p[o + 2 * k + 1] - p[o + 2 * i + 1]) * part);
          g.moveTo(x + r, y);
          g.arc(x, y, r, 0, TAU);
        }
        g.fill();
      });
      // the vertical Lyapunov orbit as a disk and the halo orbits as diamonds, as in the figure of DyLAN
      const mark = (x, y, color, diamond) => {
        const [cx, cy, size] = [v.x + v.s * x, v.y - v.s * y, 5.5];
        g.beginPath();
        if (diamond) { g.moveTo(cx, cy - size * 1.25); g.lineTo(cx + size * 1.25, cy); g.lineTo(cx, cy + size * 1.25); g.lineTo(cx - size * 1.25, cy); g.closePath(); }
        else g.arc(cx, cy, size, 0, TAU);
        g.fillStyle = color;
        g.fill();
        g.lineWidth = 1.5;
        g.strokeStyle = colors.ground;
        g.stroke();
      };
      g.globalAlpha = born;
      const halos = at(data.halos);
      if (born) for (const i of [0, 2]) mark(halos[i], halos[i + 1], colors.purple, true);
      g.globalAlpha = 1;
      mark(...at(data.vertical), colors.vermilion, false);
    },
  };

  // ---- tori ----------------------------------------------------------------------------------------------
  // the seconds of the trace of the periodic orbit, of the time between the starts of the first and the
  // last torus, of the winding of one torus, of the rest, and of the fade. on a torus, streams orbits
  // start at the same phase of the Sun and at even steps of the vertical phase, and each is wound over
  // loops periods of the Sun, and over more periods on each larger torus, with steps points per period
  const TORI = { orbit: 1.2, spread: 9.9, wind: 2.2, rest: 4, fade: 0.8, streams: 96, heads: 4, loops: 1.8, more: 0.23, steps: 48, harmonics: 5 };
  KINDS.tori = {
    seconds: TORI.orbit + TORI.spread + TORI.wind + TORI.rest + TORI.fade,
    prepare(data) {
      const { harmonics: J, steps: M, streams: R } = TORI;
      const tori = data.tori.map((torus, n) => {
        // the coefficients as a table over k from 0 and j from -J, four numbers per harmonic
        const c = new Float64Array((J + 1) * (2 * J + 1) * 4);
        for (const [j, k, ...values] of torus.modes) c.set(values, (k * (2 * J + 1) + j + J) * 4);
        // the sums over the harmonics of the phase of the Sun, at each of its M phases
        const sums = new Float64Array((J + 1) * M * 4);
        for (let k = 0; k <= J; k++) {
          for (let m = 0; m < M; m++) {
            let [xr, xi, yr, yi] = [0, 0, 0, 0];
            for (let j = -J; j <= J; j++) {
              const o = (k * (2 * J + 1) + j + J) * 4;
              const angle = (TAU * j * m) / M;
              const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
              xr += c[o] * cos - c[o + 1] * sin; xi += c[o] * sin + c[o + 1] * cos;
              yr += c[o + 2] * cos - c[o + 3] * sin; yi += c[o + 2] * sin + c[o + 3] * cos;
            }
            sums.set([xr, xi, yr, yi], (k * M + m) * 4);
          }
        }
        return { alpha: torus.alpha, rotation: torus.rotation, sums, full: Math.round((TORI.loops + TORI.more * n) * M), drawn: 0 };
      });
      const canvas = () => document.createElement('canvas');
      const state = { tori, top: canvas(), under: canvas(), base: 0, time: -1, at: new Float64Array(2) };
      let [x0, x1, y0, y1] = [Infinity, -Infinity, Infinity, -Infinity];
      for (let r = 0; r < R; r++) {
        for (let n = 0; n < M; n++) {
          const [x, y] = this.spot(state, tori[tori.length - 1], n, r);
          x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        }
      }
      state.window = [x0, x1, y0, y1];
      return state;
    },
    // the point of the orbit r of a torus after n steps. in the plane of the primaries a torus is
    // covered twice by its vertical phase, so the orbits start within half a turn of it
    spot(state, torus, n, r) {
      const { harmonics: J, steps: M, streams: R } = TORI;
      const m = n % M;
      const phase = (Math.PI * r) / R + ((TAU + torus.rotation) * n) / M;
      const s = torus.sums;
      let [x, y] = [s[m * 4], s[m * 4 + 2]];
      for (let k = 1; k <= J; k++) {
        const o = (k * M + m) * 4;
        const [cos, sin] = [Math.cos(k * phase), Math.sin(k * phase)];
        x += 2 * (s[o] * cos - s[o + 1] * sin);
        y += 2 * (s[o + 2] * cos - s[o + 3] * sin);
      }
      state.at[0] = x;
      state.at[1] = y;
      return state.at;
    },
    // the orbits of a torus from the step from to the step to. each period of the Sun of each orbit is
    // drawn as a line of its own, so that the lines add up where the orbits are dense
    trail(k, v, state, torus, from, to) {
      for (let r = 0; r < TORI.streams; r++) {
        for (let a = from; a < to; ) {
          const b = Math.min(to, (Math.floor(a / TORI.steps) + 1) * TORI.steps);
          k.beginPath();
          for (let n = a; n <= b; n++) {
            const [x, y] = this.spot(state, torus, n, r);
            k[n > a ? 'lineTo' : 'moveTo'](v.x + v.s * x, v.y - v.s * y);
          }
          k.stroke();
          a = b;
        }
      }
    },
    draw(d, t) {
      const { g, data, state, colors } = d;
      const { tori, top, under } = state;
      const done = !Number.isFinite(t);
      const last = tori.length - 1;
      const gap = TORI.spread / last;
      const wind = Math.min(TORI.wind, 2 * gap);
      // the part of the winding of the torus n that is done, and its steps
      const part = (n) => (done ? 1 : clamp((t - TORI.orbit - n * gap) / wind));
      const steps = (n) => Math.round(tori[n].full * part(n));
      const v = view(d, state.window, 16);
      const [lo, hi] = [tori[0].alpha, tori[last].alpha];
      // on a dark ground the colormap is turned around, so that the largest torus is the closest to the ground in both modes
      const color = (alpha, opacity) => {
        const value = (alpha - lo) / (hi - lo);
        return colors.map('magma', colors.dark ? 1 - value : value, opacity, !colors.dark);
      };
      d.canvas.style.opacity = done ? 1 : smooth((this.seconds - t) / TORI.fade);

      // the lines are kept on two canvases. a line is drawn under the lines before it, so the smaller tori
      // are over the larger ones. at most two tori are wound at a time: the smaller on the canvas top, with
      // the finished ones, and the larger on the canvas under, which is put under top when the smaller is done
      if (d.changed || top.width !== d.canvas.width || top.height !== d.canvas.height || t < state.time) {
        for (const canvas of [top, under]) { canvas.width = d.canvas.width; canvas.height = d.canvas.height; }
        for (const torus of tori) torus.drawn = 0;
        state.base = 0;
      }
      state.time = t;
      const pen = (canvas, torus) => {
        const k = canvas.getContext('2d');
        k.setTransform(d.k, 0, 0, d.k, 0, 0);
        k.globalCompositeOperation = 'destination-over';
        k.lineWidth = 0.8;
        k.lineJoin = 'round';
        k.strokeStyle = color(torus.alpha, 0.6);
        return k;
      };
      const wound = (canvas, n) => {
        const to = steps(n);
        if (to > tori[n].drawn) this.trail(pen(canvas, tori[n]), v, state, tori[n], tori[n].drawn, to);
        tori[n].drawn = to;
      };
      while (state.base <= last) {
        wound(top, state.base);
        if (tori[state.base].drawn < tori[state.base].full) {
          if (state.base < last) wound(under, state.base + 1);
          break;
        }
        const k = top.getContext('2d');
        k.setTransform(1, 0, 0, 1, 0, 0);
        k.globalCompositeOperation = 'destination-over';
        k.drawImage(under, 0, 0);
        under.width = d.canvas.width;
        state.base += 1;
      }
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(under, 0, 0);
      g.drawImage(top, 0, 0);
      g.restore();
      // the periodic orbit, traced first, and the point L5 as a cross
      const orbit = data.orbit;
      const traced = done ? 1 : smooth(t / TORI.orbit);
      g.strokeStyle = colors.text;
      g.lineWidth = 1.6;
      g.lineJoin = 'round';
      g.beginPath();
      const shown = Math.round(traced * orbit.length);
      for (let n = 0; n <= shown; n++) {
        const [x, y] = orbit[n % orbit.length];
        g[n ? 'lineTo' : 'moveTo'](v.x + v.s * x, v.y - v.s * y);
      }
      g.stroke();
      g.globalAlpha = traced;
      g.beginPath();
      for (const s of [1, -1]) { g.moveTo(v.x - 7, v.y - 7 * s); g.lineTo(v.x + 7, v.y + 7 * s); }
      g.stroke();
      // the head of every fourth orbit that is being wound, as a dot with an edge in the color of the ground
      g.fillStyle = colors.text;
      g.strokeStyle = colors.ground;
      g.lineWidth = 1;
      tori.forEach((torus, n) => {
        const u = part(n);
        if (u <= 0 || u >= 1) return;
        g.globalAlpha = 0.85 * Math.min(1, 8 * u, 5 * (1 - u));
        const at = torus.full * u;
        const from = Math.floor(at);
        g.beginPath();
        for (let r = 0; r < TORI.streams; r += TORI.heads) {
          const [ax, ay] = this.spot(state, torus, from, r);
          const [bx, by] = this.spot(state, torus, from + 1, r);
          const x = v.x + v.s * (ax + (bx - ax) * (at - from));
          const y = v.y - v.s * (ay + (by - ay) * (at - from));
          g.moveTo(x + 2, y);
          g.arc(x, y, 2, 0, TAU);
        }
        g.fill();
        g.stroke();
      });
      g.globalAlpha = 1;
    },
  };

  // ---- normal-form ---------------------------------------------------------------------------------------
  // the seconds of the trace of the orbits, of the wait in standard coordinates, of the change of
  // coordinates, and of the rest in the coordinates of the normal form. there are levels orbits in each
  // of the four sectors of the saddle, of points points each, and the change is drawn from frames stages
  const NORMAL = { trace: 3.4, wait: 1.4, morph: 4.5, rest: 3.5, levels: 16, points: 96, frames: 8, reach: 1.3, far: 1.2, grid: 0.2, glow: [[24, 0.06], [13, 0.11], [6.5, 0.2]] };
  // the generating function of the change of coordinates, a sum of c x^a y^b written as [c, a, b]. it is
  // chosen for the look and is not the one of a model. it is multiplied by exp(-(x^2 + y^2) / far^2), so
  // that no point is thrown out of the picture. the change is the flow of this product over the time 1,
  // a canonical change close to the identity, as in the Lie series method
  const GENERATOR = [
    [0.4, 3, 0], [-0.34, 1, 2], [0.26, 2, 1], [0.18, 0, 3],
    [0.2, 4, 0], [-0.28, 2, 2], [0.14, 1, 3], [-0.12, 0, 4],
    [-0.08, 5, 0], [0.2, 3, 2], [0.12, 2, 3], [-0.14, 1, 4],
    [0.04, 6, 0], [-0.14, 4, 2], [0.12, 2, 4],
  ];
  KINDS['normal-form'] = {
    computed: true,
    prepare: () => ({ key: '' }),
    // the points of a line at the frames + 1 stages of the flow of the generating function over a time
    // of size 1 in the direction sign, by the classical Runge-Kutta method
    carry(points, sign) {
      const stages = [points];
      const h = sign / (2 * NORMAL.frames);
      const field = (x, y) => {
        let [G, Gx, Gy] = [0, 0, 0];
        for (const [c, a, b] of GENERATOR) {
          G += c * x ** a * y ** b;
          if (a) Gx += c * a * x ** (a - 1) * y ** b;
          if (b) Gy += c * b * x ** a * y ** (b - 1);
        }
        const E = Math.exp(-(x * x + y * y) / NORMAL.far ** 2);
        return [(Gy - (2 * y * G) / NORMAL.far ** 2) * E, -(Gx - (2 * x * G) / NORMAL.far ** 2) * E];
      };
      for (let k = 0; k < NORMAL.frames; k++) {
        const next = Float32Array.from(stages[k]);
        for (let i = 0; i < next.length; i += 2) {
          let [x, y] = [next[i], next[i + 1]];
          for (let step = 0; step < 2; step++) {
            const [ax, ay] = field(x, y);
            const [bx, by] = field(x + (h / 2) * ax, y + (h / 2) * ay);
            const [cx, cy] = field(x + (h / 2) * bx, y + (h / 2) * by);
            const [ex, ey] = field(x + h * cx, y + h * cy);
            x += (h / 6) * (ax + 2 * bx + 2 * cx + ex);
            y += (h / 6) * (ay + 2 * by + 2 * cy + ey);
          }
          next[i] = x;
          next[i + 1] = y;
        }
        stages.push(next);
      }
      return stages;
    },
    // the lines of the drawing in a box of half sides ax and ay, each with its stages from the coordinates
    // of the normal form (the first) to the standard coordinates (the last). the saddle pair (q, p) of the
    // normal form is drawn along the diagonals, as the saddle of a natural Hamiltonian is in (x, p_x)
    lines(ax, ay) {
      const { levels, points: N, reach: R } = NORMAL;
      const lines = [];
      const turned = (q, p) => [(q - p) / Math.SQRT2, (q + p) / Math.SQRT2];
      const orbit = (c, sq, sp) => {
        const points = new Float32Array(2 * N);
        const span = Math.log(R / Math.sqrt(c));
        for (let i = 0; i < N; i++) {
          const e = Math.exp(span * ((2 * i) / (N - 1) - 1));
          points.set(turned(sq * Math.sqrt(c) * e, (sp * Math.sqrt(c)) / e), 2 * i);
        }
        return points;
      };
      for (const [sq, sp] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        for (let k = 1; k <= levels; k++) {
          lines.push({ kind: 'orbit', level: k / levels, stages: this.carry(orbit(0.5 * (k / levels) ** 2, sq, sp), 1) });
        }
      }
      // the stable manifold is traced toward the saddle and the unstable one away from it
      for (const [kind, sq, sp] of [['stable', 0, 1], ['stable', 0, -1], ['unstable', 1, 0], ['unstable', -1, 0]]) {
        const points = new Float32Array(2 * N);
        for (let i = 0; i < N; i++) {
          const r = (R * (kind === 'stable' ? N - 1 - i : i)) / (N - 1);
          points.set(turned(sq * r, sp * r), 2 * i);
        }
        lines.push({ kind, level: 0, stages: this.carry(points, 1) });
      }
      // the grid is straight in standard coordinates, and it is carried the other way
      for (const [bx, by] of [[1, 0], [0, 1]]) {
        const half = Math.ceil((bx ? ax : ay) / NORMAL.grid);
        for (let k = -half; k <= half; k++) {
          const points = new Float32Array(2 * N);
          for (let i = 0; i < N; i++) {
            const along = R * ((2 * i) / (N - 1) - 1);
            points.set(bx ? [k * NORMAL.grid, along] : [along, k * NORMAL.grid], 2 * i);
          }
          lines.push({ kind: 'grid', level: 0, stages: this.carry(points, -1).reverse() });
        }
      }
      return lines;
    },
    draw(d, t) {
      const { g, state, colors } = d;
      const { trace, wait, morph, rest, frames, points: N } = NORMAL;
      const S = Math.max(d.w, d.h) / 2;
      if (state.key !== `${d.w}x${d.h}`) {
        state.key = `${d.w}x${d.h}`;
        state.lines = this.lines(d.w / (2 * S), d.h / (2 * S));
      }
      // s is 1 in standard coordinates and 0 in the coordinates of the normal form
      const done = !Number.isFinite(t);
      let s = 0;
      if (!done) {
        const u = (Math.max(0, t - trace)) % (wait + 2 * morph + rest);
        s = u < wait ? 1 : u < wait + morph ? 1 - smooth((u - wait) / morph)
          : u < wait + morph + rest ? 0 : smooth((u - wait - morph - rest) / morph);
      }
      const f = Math.min(frames - 1, Math.floor(s * frames));
      const w = s * frames - f;
      const traced = done ? 1 : t / trace;
      g.lineJoin = 'round';
      g.lineCap = 'round';
      for (const line of state.lines) {
        // the orbits close to the saddle are traced first, and the two manifolds one after the other
        const part = line.kind === 'orbit' ? smooth(1.4 * traced - 0.4 * line.level) : line.kind === 'stable' ? smooth(2 * traced)
          : line.kind === 'unstable' ? smooth(2 * traced - 1) : 1;
        const n = Math.round(part * N);
        if (n < 2) continue;
        const [a, b] = [line.stages[f], line.stages[f + 1]];
        const X = (i) => d.w / 2 + S * (a[2 * i] + (b[2 * i] - a[2 * i]) * w);
        const Y = (i) => d.h / 2 - S * (a[2 * i + 1] + (b[2 * i + 1] - a[2 * i + 1]) * w);
        g.beginPath();
        g.moveTo(X(0), Y(0));
        for (let i = 1; i < n - 1; i++) g.quadraticCurveTo(X(i), Y(i), (X(i) + X(i + 1)) / 2, (Y(i) + Y(i + 1)) / 2);
        g.lineTo(X(n - 1), Y(n - 1));
        g.strokeStyle = line.kind === 'orbit' ? colors.map('viridis', 1 - line.level) : line.kind === 'grid' ? colors.text
          : line.kind === 'stable' ? colors.violet : colors.accent;
        // the two manifolds glow: each is drawn wide and faint under its line
        if (line.kind === 'stable' || line.kind === 'unstable') {
          // with round ends, the four wide lines would add up to a disk at the saddle
          g.lineCap = 'butt';
          for (const [width, alpha] of NORMAL.glow) {
            g.globalAlpha = alpha;
            g.lineWidth = width;
            g.stroke();
          }
          g.lineCap = 'round';
        }
        g.globalAlpha = line.kind === 'grid' ? 0.2 * smooth(traced * 3) : 1;
        g.lineWidth = line.kind === 'orbit' ? 1.4 : line.kind === 'grid' ? 1 : 2.8;
        g.stroke();
      }
      // the drawing is faded toward the sides of its box
      g.globalAlpha = 1;
      g.save();
      g.globalCompositeOperation = 'destination-in';
      g.translate(d.w / 2, d.h / 2);
      g.scale(d.w / 2, d.h / 2);
      const fade = g.createRadialGradient(0, 0, 0.72, 0, 0, 1);
      fade.addColorStop(0, 'rgba(0, 0, 0, 1)');
      fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
      g.fillStyle = fade;
      g.fillRect(-1, -1, 2, 2);
      g.restore();
    },
  };

  // ---- the drawings of the deck --------------------------------------------------------------------------
  const CSS = `
.reveal .slides section .family { pointer-events: none; }
.reveal .slides section .family > canvas { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.reveal .slides section.section .figure-box.family { left: 1040px; top: 0; width: 880px; height: 1080px; }
.reveal .slides section:is(.title, .closing) .figure-box.family { left: 960px; top: 0; width: 960px; height: 1080px; }
`;

  class Drawing {
    constructor(el) {
      this.el = el;
      this.kind = KINDS[el.dataset.family];
      this.data = DATA[el.dataset.family];
      // a drawing cloned with its slide, as in the print view, carries the canvas of its original
      for (const old of el.querySelectorAll(':scope > canvas')) old.remove();
      this.canvas = document.createElement('canvas');
      el.append(this.canvas);
      this.g = this.canvas.getContext('2d');
      // the drawing normal-form is computed here and has no data
      this.ok = !!(this.kind && (this.data || this.kind.computed));
      if (!this.ok) console.warn(`families: no drawing or no data for data-family="${el.dataset.family}"`);
      else this.state = this.kind.prepare(this.data);
      this.raf = 0;
      this.mode = null;
    }

    // sizes the canvas to the pixels of its box on the screen, and reads the colors of the mode
    fit() {
      const [w, h] = [this.el.offsetWidth, this.el.offsetHeight];
      if (!w || !h) return false;
      const zoom = this.el.getBoundingClientRect().width / w || 1;
      const k = clamp(zoom * Math.min(window.devicePixelRatio || 1, 2), still() ? 2 : 0.5, 3);
      const [W, H] = [Math.round(w * k), Math.round(h * k)];
      this.changed = this.canvas.width !== W || this.canvas.height !== H;
      if (this.changed) { this.canvas.width = W; this.canvas.height = H; }
      const mode = document.documentElement.dataset.theme ?? '';
      if (mode !== this.mode) {
        this.mode = mode;
        this.colors = palette(this.el);
        this.changed = true;
      }
      Object.assign(this, { w, h, k });
      return true;
    }

    // draws the drawing t seconds after its start, or complete at an infinite t
    draw(t) {
      if (!this.ok || !this.fit()) return;
      this.g.setTransform(this.k, 0, 0, this.k, 0, 0);
      this.g.clearRect(0, 0, this.w, this.h);
      this.kind.draw(this, Number.isFinite(t) && this.kind.seconds ? t % this.kind.seconds : t);
    }

    start() {
      this.stop();
      let first = 0;
      let last = -1;
      const frame = (now) => {
        this.raf = requestAnimationFrame(frame);
        first ||= now;
        const t = (now - first) / 1000;
        if (t - last < FRAME) return;
        last = t;
        this.draw(t);
      };
      this.raf = requestAnimationFrame(frame);
    }

    stop() {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }

    still() {
      this.stop();
      this.draw(Infinity);
    }
  }

  const made = new WeakMap();
  const drawing = (el) => {
    let d = made.get(el);
    if (!d) made.set(el, (d = new Drawing(el)));
    return d;
  };
  const within = (slide) => (slide ? [...slide.querySelectorAll('.family')].map(drawing) : []);
  const all = () => [...document.querySelectorAll('.family')];

  function addStyle() {
    if (document.getElementById('families-style')) return;
    const style = document.createElement('style');
    style.id = 'families-style';
    style.textContent = CSS;
    document.head.append(style);
  }

  function show(slide) {
    for (const d of within(slide)) {
      if (still()) d.still();
      else d.start();
    }
  }

  function ready(slide) {
    if (window.Reveal.isPrintView?.()) return;
    addStyle();
    // every drawing is drawn complete, so that a slide is not empty in the overview of reveal.js
    for (const el of all()) drawing(el).still();
    show(slide);
  }

  const deck = window.Reveal;
  deck.on('ready', (ev) => ready(ev.currentSlide));
  deck.on('slidechanged', (ev) => {
    for (const d of within(ev.previousSlide)) d.still();
    show(ev.currentSlide);
  });
  deck.on('resize', () => {
    for (const d of within(deck.getCurrentSlide())) if (!d.raf) d.still();
  });
  // in the print view, reveal.js clones a slide for each of its steps, and each clone is drawn complete
  deck.on('pdf-ready', () => {
    addStyle();
    for (const el of all()) {
      const d = new Drawing(el);
      made.set(el, d);
      d.still();
    }
  });
  new MutationObserver(() => {
    for (const d of within(deck.getCurrentSlide?.())) if (!d.raf) d.still();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (deck.isReady()) ready(deck.getCurrentSlide());

  // read by a script that takes pictures of a drawing at chosen times
  window.Families = { drawing };
})();
