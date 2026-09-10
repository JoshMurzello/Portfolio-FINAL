// Optional, repeatable entrance motion. Content stays visible without JavaScript.
(() => {
  function init() {
    if (!window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const selectors = '.reveal, .section-head, .card, .metric-card, .photo-journal-card, .featured-card, .build-media, .article-hero-image, .article-body > h2, .article-body > p, .article-body > ul, .robot-section > h2, .robot-section > p, .orbit-downloads, .orbit-footer-contact, .skateboard-documentation, .case-section';
    const excluded = 'header, dialog, .hero, .home-reveal, .orbit-stage, .location-gallery, #velocity-gallery, [data-tab-panel], details';
    const candidates = [...document.querySelectorAll(selectors)].filter(item => !item.closest(excluded));
    // Animate a card as a unit, never both it and its contents.
    const items = candidates.filter(item => !candidates.some(parent => parent !== item && parent.contains(item)));
    const active = new Map();
    const inside = new Set();
    let printing = false;
    const cancel = item => { active.get(item)?.cancel(); active.delete(item); };
    const stop = () => { items.forEach(cancel); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const item = entry.target;
        if (!entry.isIntersecting) {
          inside.delete(item);
          cancel(item);
          continue;
        }
        if (inside.has(item)) continue;
        inside.add(item);
        if (preference.matches || printing || item.contains(document.activeElement)) continue;
        const animation = item.animate([
          { opacity: 0.35, translate: '0 18px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)' });
        active.set(item, animation);
        animation.onfinish = () => active.delete(item);
      }
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    items.forEach(item => observer.observe(item));
    preference.addEventListener('change', stop);
    document.addEventListener('focusin', event => {
      items.filter(item => item.contains(event.target)).forEach(cancel);
    });
    window.addEventListener('beforeprint', () => { printing = true; stop(); });
    window.addEventListener('afterprint', () => { printing = false; });
    window.addEventListener('pagehide', stop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
