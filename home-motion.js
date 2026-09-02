(function () {
  const items = [...document.querySelectorAll('.home-reveal')];
  if (!items.length) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || typeof IntersectionObserver === 'undefined' || items.some((item) => typeof item.animate !== 'function')) return;

  const pending = new Set();
  const running = new Map();
  let observer;

  function finish(item) {
    pending.delete(item);
    item.classList.remove('is-pending');
    observer?.unobserve(item);
    const animation = running.get(item);
    running.delete(item);
    if (animation) {
      animation.onfinish = null;
      animation.oncancel = null;
      animation.cancel();
    }
  }

  function showAll() {
    items.forEach(finish);
    observer?.disconnect();
  }

  function showAnchor() {
    let target;
    try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
    catch { return; }
    if (target) items.filter((item) => item.contains(target) || target.contains(item)).forEach(finish);
  }

  function enter(item, delay) {
    pending.delete(item);
    observer.unobserve(item);
    try {
      const animation = item.animate(
        [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 720, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
      );
      running.set(item, animation);
      item.classList.remove('is-pending');
      animation.onfinish = () => finish(item);
      animation.oncancel = () => finish(item);
    } catch { finish(item); }
  }

  try {
    observer = new IntersectionObserver((entries) => {
      if (motion.matches) { showAll(); return; }
      // Stagger cards sharing a visual row, not vertically stacked mobile cards.
      const rows = new Map();
      entries.filter((entry) => entry.isIntersecting && pending.has(entry.target)).forEach(({ target }) => {
        const top = target.getBoundingClientRect().top;
        const previous = rows.get(target.parentElement);
        const index = previous && Math.abs(previous.top - top) < 24 ? previous.index + 1 : 0;
        rows.set(target.parentElement, { top, index });
        enter(target, Math.min(index, 2) * 90);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

    items.forEach((item) => {
      // Do not hide sections already passed when restoring a scrolled page.
      if (item.getBoundingClientRect().bottom <= 0 || item.contains(document.activeElement)) return;
      observer.observe(item);
      pending.add(item);
      item.classList.add('is-pending');
    });
    showAnchor();
    document.addEventListener('focusin', (event) => {
      const item = event.target.closest('.home-reveal');
      if (item) finish(item);
    });
    motion.addEventListener('change', (event) => { if (event.matches) showAll(); });
    window.addEventListener('beforeprint', showAll);
    window.addEventListener('hashchange', showAnchor);
    window.addEventListener('pageshow', (event) => { if (event.persisted) showAll(); });
  } catch {
    // A failed enhancement must not hide the portfolio or contact form.
    showAll();
  }
})();
