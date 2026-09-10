// About-style entrances, replayed when content returns to view.
(() => {
  if (!window.IntersectionObserver || !Element.prototype.animate) return;
  const items = [...document.querySelectorAll('.home-reveal')];
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  const inside = new Set();
  let printing = false;
  const cancel = item => { active.get(item)?.cancel(); active.delete(item); };
  const stop = () => items.forEach(cancel);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target: item, isIntersecting }) => {
      if (!isIntersecting) { inside.delete(item); cancel(item); return; }
      if (inside.has(item)) return;
      inside.add(item);
      if (preference.matches || printing || item.contains(document.activeElement)) return;
      const animation = item.animate([
        { opacity: 0, filter: 'blur(5px)', translate: '0 30px', scale: '0.985' },
        { opacity: 1, filter: 'blur(0px)', translate: '0 0', scale: '1' }
      ], { duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      active.set(item, animation);
      animation.onfinish = () => active.delete(item);
    });
  }, { threshold: 0, rootMargin: '0px 0px -48px 0px' });
  items.forEach(item => observer.observe(item));
  preference.addEventListener('change', stop);
  document.addEventListener('focusin', event => items.filter(item => item.contains(event.target)).forEach(cancel));
  window.addEventListener('beforeprint', () => { printing = true; stop(); });
  window.addEventListener('afterprint', () => { printing = false; });
  window.addEventListener('pagehide', stop);
})();
