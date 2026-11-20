// the steps of a slide with data-morph, drawn as the scenes of a manim video. the scene of the slide is
// the count of the indices of its shown fragments, i.e. 0 before the first step and n at the step
// n of the editor. an element of the slide is shown in the scenes that its fragment gives it, as
// reveal.js and the editor show it: from its step on, or at its step only with current-visible, or
// up to its step with fade-out. a display that changes at each step is thus written once per step,
// with current-visible, and each copy is edited in the tab of its step in the editor. a group of a
// display in \class{m-dim}{...} is dimmed. the scene is written in data-scene of the slide.
//
// at a step, each piece of an element that is shown anew is moved from the piece with the same key
// among the elements shown before, as with TransformMatchingTex of manim. a key is a class k-name,
// written in TeX as \class{k-name}{...}, and a piece may be given several keys. a piece is moved from
// a piece of an element that is hidden at the step, or else from a copy of a piece that stays. pieces
// drawn with other glyphs are cross-faded during the move, and the old pieces of every key of a new
// piece are moved into it, which is how two terms are joined. a keyed piece inside a moved piece
// takes on its new opacity during the move, e.g. when it is dimmed. the rest of a new element is
// faded in after the moves, and an element hidden at the step is faded out. the steps are drawn at
// once in the print view, under ?still, and under reduced motion. the editor shows the steps of the
// slide one range at a time, in its tabs, and this file is not run there.
(() => {
  if (/[?&]edit\b/.test(location.search)) return;
  const deck = window.Reveal;
  // the duration of a move and of a fade, and the delay of the fade of new pieces, in ms
  const MOVE = 900;
  const FADE = 350;
  const LATE = 550;
  const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
  const CSS = `
[data-morph][data-scene] .m-off { opacity: 0; visibility: hidden; }
.reveal .slides section[data-morph] .fragment { transition: none; }
[data-morph] .math g { transform-box: view-box; transform-origin: 0 0; }
[data-morph][data-scene] .m-dim { opacity: 0.25; }
`;

  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-still')
    || /[?&]still\b/.test(location.search) || /print-pdf/.test(location.search) || !!deck.isPrintView?.();
  const typeset = () => window.MathJax?.startup?.promise ?? Promise.resolve();

  const hasContent = (el) => el.children.length > 0 || el.textContent.trim() !== '';
  const items = (slide) => [...slide.querySelectorAll('.fragment')].filter(hasContent);
  // the scenes of an element, from the index of its fragment, which reveal.js numbers from 0
  const scenes = (item) => {
    const i = Number(item.dataset.fragmentIndex) + 1;
    if (item.classList.contains('current-visible')) return [i, i];
    if (item.classList.contains('fade-out')) return [0, i - 1];
    return [i, Infinity];
  };
  const shownAt = (item, scene) => {
    const [a, b] = scenes(item);
    return scene >= a && scene <= b;
  };
  const sceneOf = (slide) => new Set([...slide.querySelectorAll('.fragment.visible')].map((f) => f.dataset.fragmentIndex)).size;

  /** Shows the elements of the slide for the scene, at once. */
  function set(slide, scene) {
    slide.dataset.scene = String(scene);
    for (const item of items(slide)) item.classList.toggle('m-off', !shownAt(item, scene));
  }

  const keysOf = (el) => [...el.classList].filter((c) => c.startsWith('k-'));
  const keyed = (item) => [item, ...item.querySelectorAll('[class*="k-"]')].filter((el) => keysOf(el).length && !el.closest('.m-off'));
  const opacity = (el, item) => {
    let o = 1;
    for (let n = el; n && n !== item; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  };
  // the glyphs of a piece, which tell a move from a cross-fade
  const drawn = (el) => [...el.querySelectorAll('use, path, rect, text')]
    .map((n) => n.getAttribute('href') ?? n.getAttribute('xlink:href') ?? n.getAttribute('d') ?? `${n.getAttribute('width')}x${n.getAttribute('height')}`).join(' ');

  // the scale of the slide on the screen
  const zoom = (el) => {
    const slide = el.closest('section');
    return slide.getBoundingClientRect().width / slide.offsetWidth;
  };
  const local = (el) => {
    const t = el.transform?.baseVal?.consolidate?.();
    return t ? ` matrix(${t.matrix.a}, ${t.matrix.b}, ${t.matrix.c}, ${t.matrix.d}, ${t.matrix.e}, ${t.matrix.f})` : '';
  };

  // the first and last keyframe of a transform with which el, laid out in the box at, is drawn over
  // the box over. a piece of a display is an SVG group, and its CSS transform is applied in the
  // coordinates of its parent group. these coordinates are mapped to the screen by the CTM of the
  // parent, scaled by the slide, from the corner of the SVG. the keyframes end with the transform
  // attribute of the group, since the CSS transform takes its place
  function onto(el, at, over) {
    const area = (r) => r.width * r.height;
    let k = area(at) > 0 && area(over) > 0 ? Math.sqrt(area(over) / area(at)) : (over.width || over.height) / (at.width || at.height || 1);
    k = Math.min(5, Math.max(0.2, k || 1));
    const c0 = [over.x + over.width / 2, over.y + over.height / 2];
    const c1 = [at.x + at.width / 2, at.y + at.height / 2];
    const s = zoom(el);
    if (el instanceof SVGGraphicsElement && !(el instanceof SVGSVGElement)) {
      const p = el.parentNode.getCTM();
      const box = el.ownerSVGElement.getBoundingClientRect();
      const [a, b, c, d] = [p.a * s, p.b * s, p.c * s, p.d * s];
      const [ox, oy] = [box.x + p.e * s, box.y + p.f * s];
      const vx = c0[0] - k * c1[0] + (k - 1) * ox, vy = c0[1] - k * c1[1] + (k - 1) * oy;
      const det = a * d - b * c;
      return [`matrix(${k}, 0, 0, ${k}, ${(d * vx - c * vy) / det}, ${(-b * vx + a * vy) / det})${local(el)}`, `matrix(1, 0, 0, 1, 0, 0)${local(el)}`];
    }
    return [`translate(${(c0[0] - c1[0]) / s}px, ${(c0[1] - c1[1]) / s}px) scale(${k})`, 'translate(0px, 0px) scale(1)'];
  }

  const running = new WeakMap();
  function play(slide, el, frames, options) {
    const a = el.animate(frames, { easing: EASE, ...options });
    running.get(slide).push(a);
    return a;
  }

  // fades in every part of node without a moved piece in it
  function fadeRest(slide, node, moved) {
    if (moved.has(node)) return;
    if (![...moved].some((m) => node.contains(m))) {
      play(slide, node, [{ opacity: 0 }, { opacity: 1 }], { duration: FADE, delay: LATE, fill: 'backwards', easing: 'ease-out' });
      return;
    }
    for (const child of node.children) fadeRest(slide, child, moved);
  }

  /** Goes from one scene to another, with the moves of the pieces and the fades of the rest. */
  function morph(slide, from, to) {
    for (const a of running.get(slide) ?? []) a.cancel();
    running.set(slide, []);
    const all = items(slide);
    const was = all.filter((i) => shownAt(i, from));
    const now = new Set(all.filter((i) => shownAt(i, to)));
    const leaving = was.filter((i) => !now.has(i));
    const staying = was.filter((i) => now.has(i));
    const sources = new Map();
    for (const [list, leaves] of [[leaving, true], [staying, false]]) {
      for (const item of list) {
        for (const el of keyed(item)) {
          const rect = el.getBoundingClientRect();
          if (!rect.width && !rect.height) continue;
          const source = { el, rect, leaves, opacity: opacity(el, item), own: Number(getComputedStyle(el).opacity), drawn: drawn(el) };
          for (const k of keysOf(el)) if (!sources.has(k)) sources.set(k, source);
        }
      }
    }
    set(slide, to);
    const coming = [...now].filter((i) => !was.includes(i));
    const hidden = new Set();
    const ghosts = new Set();
    for (const item of coming) {
      const moved = new Set();
      for (const el of keyed(item)) {
        const key = keysOf(el).find((k) => sources.has(k));
        if ([...moved].some((m) => m.contains(el))) {
          const own = Number(getComputedStyle(el).opacity);
          if (key && sources.get(key).own !== own) play(slide, el, [{ opacity: sources.get(key).own }, { opacity: own }], { duration: MOVE });
          continue;
        }
        if (!key) continue;
        const source = sources.get(key);
        const rect = el.getBoundingClientRect();
        const same = source.drawn === drawn(el);
        const [start, end] = onto(el, rect, source.rect);
        const target = Number(getComputedStyle(el).opacity);
        play(slide, el, [{ transform: start, opacity: same ? source.opacity : 0 }, { transform: end, opacity: target }], { duration: MOVE });
        moved.add(el);
        if (same && source.leaves) hidden.add(source.el);
        for (const k of keysOf(el)) {
          const other = sources.get(k);
          if (!other || !other.leaves || hidden.has(other.el) || ghosts.has(other.el)) continue;
          ghosts.add(other.el);
          const [a, b] = onto(other.el, other.rect, rect);
          play(slide, other.el, [{ transform: b }, { transform: a }], { duration: MOVE });
        }
      }
      fadeRest(slide, item, moved);
    }
    for (const el of hidden) if (!ghosts.has(el)) play(slide, el, [{ opacity: 0 }, { opacity: 0 }], { duration: FADE });
    for (const item of leaving) play(slide, item, [{ opacity: 1, visibility: 'visible' }, { opacity: 0, visibility: 'visible' }], { duration: FADE, easing: 'ease-in' });
  }

  const morphing = (slide) => slide?.hasAttribute('data-morph');
  const last = new WeakMap();

  function show(slide, animate) {
    if (!morphing(slide)) return;
    const to = sceneOf(slide);
    const from = last.get(slide);
    last.set(slide, to);
    slide.toggleAttribute('data-stepping', animate);
    if (animate && from !== undefined && from !== to && !still()) morph(slide, from, to);
    else {
      for (const a of running.get(slide) ?? []) a.cancel();
      set(slide, to);
    }
  }

  function all() {
    for (const slide of document.querySelectorAll('.reveal .slides section[data-morph]')) {
      last.delete(slide);
      show(slide, false);
    }
  }

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.append(style);
  const step = () => show(deck.getCurrentSlide(), true);
  deck.on('fragmentshown', step);
  deck.on('fragmenthidden', step);
  deck.on('slidechanged', (ev) => show(ev.currentSlide, false));
  deck.on('ready', () => typeset().then(all));
  deck.on('pdf-ready', () => typeset().then(all));
  if (deck.isReady()) typeset().then(all);
})();
