// Interactive degree slider for the Legendre expansion convergence plot (#legendre-conv).
// Starts at data-deg each time the slide is entered and lets the speaker drag freely
// across all precomputed degrees (2 to 20) in any browser, on desktops and phones, and in PDF export.
(() => {
  const CSS = `
.reveal .slides section.leg-exp .leg-plot [data-plot-id^="deg-"] { display: none; }
.reveal .slides section.leg-exp .leg-plot [data-plot-id^="deg-"].deg-on { display: inline; }
.reveal .slides section.leg-exp .leg-plot:not(:has(.deg-on)) :is([data-plot-id="deg-2"], [data-plot-id="deg-2-err"]) { display: inline; }
.reveal .slides section.leg-exp .leg-slider {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 6px;
  padding: 0 22px 0 28px;
  height: 54px;
  user-select: none;
}
.reveal .slides section.leg-exp .leg-slider .leg-sl-lbl {
  flex: none;
  font-size: 21px;
  font-style: italic;
  color: var(--subtle);
}
.reveal .slides section.leg-exp .leg-slider .leg-sl-track {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 54px;
}
.reveal .slides section.leg-exp .leg-slider input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  margin: 0;
  background: transparent;
  cursor: pointer;
  touch-action: none;
}
.reveal .slides section.leg-exp .leg-slider input[type="range"]:focus { outline: none; }
.reveal .slides section.leg-exp .leg-slider input[type="range"]::-webkit-slider-runnable-track {
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(to right, var(--blue) 0%, var(--blue) var(--pct, 0%), var(--stroke) var(--pct, 0%), var(--stroke) 100%);
}
.reveal .slides section.leg-exp .leg-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  margin-top: -7.5px;
  border-radius: 50%;
  background: var(--blue);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 1.5px var(--blue);
}
.reveal .slides section.leg-exp .leg-slider input[type="range"]::-moz-range-track {
  height: 3px;
  border-radius: 2px;
  background: var(--stroke);
}
.reveal .slides section.leg-exp .leg-slider input[type="range"]::-moz-range-progress {
  height: 3px;
  border-radius: 2px;
  background: var(--blue);
}
.reveal .slides section.leg-exp .leg-slider input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--blue);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 1.5px var(--blue);
}
.reveal .slides section.leg-exp .leg-slider .leg-sl-ticks {
  position: relative;
  height: 18px;
  margin-top: -2px;
  pointer-events: none;
}
.reveal .slides section.leg-exp .leg-slider .leg-sl-ticks span {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-size: 16px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.reveal .slides section.leg-exp .leg-slider .leg-sl-val {
  flex: none;
  min-width: 96px;
  text-align: right;
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  color: var(--blue);
  white-space: nowrap;
}
`;

  function addStyle() {
    if (document.getElementById('legendre-slider-style')) return;
    const s = document.createElement('style');
    s.id = 'legendre-slider-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  const made = new WeakMap();

  class LegendreSlider {
    constructor(host) {
      this.host = host;
      this.slide = host.closest('section');
      this.plotId = host.dataset.legendreSlider || 'legendre-conv';
      this.min = Number(host.dataset.min || 2);
      this.max = Number(host.dataset.max || 20);
      this.base = Number(host.dataset.deg || this.min);
      this.deg = this.base;
      this.build();
      const plotEl = this.plotEl();
      if (plotEl) {
        plotEl.addEventListener('beeson:plot-drawn', () => this.applyCurve());
      }
    }

    plotEl() {
      return this.slide?.querySelector(`.plot[data-plot="${this.plotId}"]`) || null;
    }

    build() {
      this.host.replaceChildren();
      const lbl = document.createElement('span');
      lbl.className = 'leg-sl-lbl';
      lbl.textContent = 'Degree';

      const track = document.createElement('div');
      track.className = 'leg-sl-track';

      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(this.min);
      input.max = String(this.max);
      input.step = '1';
      input.value = String(this.deg);
      input.setAttribute('aria-label', 'Legendre expansion degree N');
      input.setAttribute('data-prevent-swipe', '');
      input.addEventListener('input', () => this.set(Number(input.value)));
      input.addEventListener('pointerup', () => input.blur());
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
          ev.stopPropagation();
        }
      });

      const ticks = document.createElement('div');
      ticks.className = 'leg-sl-ticks';
      for (const n of [2, 6, 10, 16, 20]) {
        if (n < this.min || n > this.max) continue;
        const t = document.createElement('span');
        t.textContent = String(n);
        t.style.left = `${((n - this.min) / (this.max - this.min)) * 100}%`;
        ticks.appendChild(t);
      }

      track.append(input, ticks);

      const val = document.createElement('span');
      val.className = 'leg-sl-val';

      this.input = input;
      this.val = val;
      this.host.append(lbl, track, val);
    }

    set(n) {
      const clamped = Math.max(this.min, Math.min(this.max, Math.round(n)));
      this.deg = clamped;
      this.input.value = String(clamped);
      const pct = ((clamped - this.min) / (this.max - this.min)) * 100;
      this.input.style.setProperty('--pct', `${pct}%`);
      this.val.innerHTML = `<i>N</i> = ${clamped}`;
      this.applyCurve();
    }

    applyCurve() {
      const plotEl = this.plotEl();
      if (!plotEl) return;
      const nodes = plotEl.querySelectorAll('[data-plot-id^="deg-"]');
      const on = [`deg-${this.deg}`, `deg-${this.deg}-err`];
      for (const el of nodes) {
        el.classList.toggle('deg-on', on.includes(el.getAttribute('data-plot-id')));
      }
    }

    reset() {
      this.set(this.base);
    }
  }

  function initAll(scope = document) {
    addStyle();
    for (const host of scope.querySelectorAll('[data-legendre-slider]')) {
      let ctrl = made.get(host);
      if (!ctrl) {
        ctrl = new LegendreSlider(host);
        made.set(host, ctrl);
      }
      ctrl.reset();
    }
  }

  function resetSlide(slide) {
    if (!slide) return;
    for (const host of slide.querySelectorAll('[data-legendre-slider]')) {
      let ctrl = made.get(host);
      if (!ctrl) {
        ctrl = new LegendreSlider(host);
        made.set(host, ctrl);
      }
      ctrl.reset();
    }
  }

  const deck = window.Reveal;
  if (deck) {
    deck.on('ready', () => {
      if (deck.isPrintView?.()) return;
      initAll(document);
    });
    deck.on('slidechanged', (ev) => resetSlide(ev.currentSlide));
    deck.on('pdf-ready', () => {
      addStyle();
      for (const host of document.querySelectorAll('[data-legendre-slider]')) {
        const ctrl = new LegendreSlider(host);
        made.set(host, ctrl);
        ctrl.reset();
      }
    });
    if (deck.isReady()) initAll(document);
  }
})();
