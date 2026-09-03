(function () {
  const items = [...document.querySelectorAll('.home-reveal')];
  if (!items.length || !window.matchMedia || !window.requestAnimationFrame) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const backdrop = document.querySelector('.hero-backdrop');
  const records = items.map((item) => ({ item, frame: item.querySelector('.home-media-frame') }));
  let frameId = null;
  let dirty = true;
  let printing = false;
  let failed = false;
  let viewport = 1;
  let maxScroll = 0;
  let compact = false;
  let heroTop = 0;
  let heroHeight = 1;
  let anchor = null;

  const clamp = (value) => Math.max(0, Math.min(1, value));
  const smooth = (value) => value * value * (3 - 2 * value);
  const enabled = () => !preference.matches && !printing && !failed;

  // offsetTop is unaffected by our transforms. Measuring animated rectangles
  // would feed their movement back into the next scroll calculation.
  function layoutTop(element) {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  }

  function measure() {
    viewport = Math.max(window.innerHeight, 1);
    compact = window.innerWidth <= 980;
    maxScroll = Math.max(0, root.scrollHeight - viewport);
    const rows = new Map();
    records.forEach((record) => {
      const { item, frame } = record;
      record.top = layoutTop(item);
      record.height = item.offsetHeight;
      record.heading = item.classList.contains('section-head');
      const previous = rows.get(item.parentElement);
      record.column = !compact && previous && Math.abs(previous.top - record.top) < 24 ? previous.column + 1 : 0;
      rows.set(item.parentElement, record);
      const stagger = Math.min(record.column, 2) * 26;
      // Short pages and the final section must still reach their finished state.
      record.end = Math.min(record.top - viewport * 0.52 + stagger, maxScroll);
      record.start = Math.min(record.top - viewport * 1.02 + stagger, record.end - viewport * 0.5);
      if (frame) {
        record.mediaTop = layoutTop(frame);
        record.mediaHeight = frame.offsetHeight;
      }
    });
    if (hero) {
      heroTop = layoutTop(hero);
      heroHeight = Math.max(hero.offsetHeight, 1);
    }
    dirty = false;
  }

  function reset() {
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null;
    root.classList.remove('home-scroll-active');
    records.forEach(({ item }) => item.classList.remove('home-in-motion'));
  }

  function render() {
    frameId = null;
    if (!enabled()) { reset(); return; }
    try {
      if (dirty) measure();
      const scroll = Math.max(0, Math.min(window.scrollY, maxScroll));
      records.forEach((record) => {
        const { item, frame, top, height, heading, start, end } = record;
        const protectedContent = item.contains(document.activeElement) || (anchor && (anchor.contains(item) || item.contains(anchor)));
        const entry = protectedContent || maxScroll === 0 ? 1 : clamp((scroll - start) / (end - start));
        const remaining = 1 - smooth(entry);
        // Fully opaque before the reading zone; only a small lift on departure.
        const departure = protectedContent ? 0 : smooth(clamp((scroll - top + viewport * 0.08) / Math.max(height, 1)));
        const travel = heading ? 28 : compact ? 42 : 64;
        item.style.setProperty('--home-y', `${(remaining * travel - departure * (compact ? 8 : 16)).toFixed(2)}px`);
        item.style.setProperty('--home-opacity', (0.12 + 0.88 * smooth(clamp(entry / 0.78))).toFixed(3));
        item.style.setProperty('--home-scale', (1 - remaining * (heading ? 0 : 0.025)).toFixed(4));
        item.classList.toggle('home-in-motion', top - scroll < viewport + 80 && top + height - scroll > -80);
        if (frame) {
          const passage = clamp((scroll + viewport - record.mediaTop) / (viewport + record.mediaHeight));
          item.style.setProperty('--home-image-y', `${((0.5 - passage) * (compact ? 3 : 5.6)).toFixed(3)}%`);
          item.style.setProperty('--home-image-scale', (1.09 - passage * 0.025).toFixed(4));
        }
      });
      if (backdrop) {
        const progress = clamp((scroll - heroTop) / heroHeight);
        backdrop.style.setProperty('--home-hero-y', `${(progress * (compact ? 2 : 4)).toFixed(3)}%`);
        backdrop.style.setProperty('--home-hero-scale', (1.02 + progress * (compact ? 0.035 : 0.07)).toFixed(4));
      }
      root.classList.add('home-scroll-active');
    } catch {
      // Motion is optional: a failed enhancement must never obscure content.
      failed = true;
      reset();
    }
  }

  function schedule() {
    if (enabled() && frameId === null) frameId = window.requestAnimationFrame(render);
  }

  function refresh() { dirty = true; schedule(); }

  function readAnchor() {
    try { anchor = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
    catch { anchor = null; }
    schedule();
  }

  // Scroll distance, not elapsed time, owns every frame. No scroll interception,
  // one-shot observers, or perpetual animation loop when the page is idle.
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('load', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('hashchange', readAnchor);
  window.addEventListener('beforeprint', () => { printing = true; reset(); });
  window.addEventListener('afterprint', () => { printing = false; refresh(); });
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  const changePreference = () => { if (preference.matches) reset(); else refresh(); };
  if (preference.addEventListener) preference.addEventListener('change', changePreference);
  else preference.addListener?.(changePreference);
  if (typeof ResizeObserver !== 'undefined') {
    const sizes = new ResizeObserver(refresh);
    sizes.observe(document.body);
    records.forEach(({ item }) => sizes.observe(item));
  }
  document.fonts?.ready.then(refresh).catch(() => {});
  readAnchor();
})();
