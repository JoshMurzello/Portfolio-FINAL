(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setRevealTiming() {
    const groups = [
      document.querySelectorAll('.split-panel > .reveal'),
      document.querySelectorAll('.metrics > .reveal'),
      document.querySelectorAll('.grid-3 > .reveal')
    ];

    groups.forEach((group) => {
      group.forEach((item, index) => {
        item.style.setProperty('--motion-delay', `${Math.min(index * 90, 240)}ms`);
      });
    });
  }

  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.querySelectorAll('.timeline-item').forEach((item, index) => {
      item.style.setProperty('--motion-delay', `${index * 115}ms`);
    });

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      timeline.classList.add('motion-in');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    observer.observe(timeline);
  }

  function initPortraitMotion() {
    const portrait = document.querySelector('.visual-panel');
    if (!portrait || reduceMotion) return;

    portrait.addEventListener('pointermove', (event) => {
      const rect = portrait.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      portrait.style.setProperty('--visual-x', `${(x * 100).toFixed(1)}%`);
      portrait.style.setProperty('--visual-y', `${(y * 100).toFixed(1)}%`);
      portrait.style.setProperty('--parallax-x', `${((x - 0.5) * -10).toFixed(1)}px`);
      portrait.style.setProperty('--parallax-y', `${((y - 0.5) * -10).toFixed(1)}px`);
    });

    portrait.addEventListener('pointerleave', () => {
      portrait.style.setProperty('--visual-x', '50%');
      portrait.style.setProperty('--visual-y', '50%');
      portrait.style.setProperty('--parallax-x', '0px');
      portrait.style.setProperty('--parallax-y', '0px');
    });
  }

  function initTabMotion() {
    if (reduceMotion) return;

    document.querySelectorAll('[data-tab-target]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-tab-target');
        window.requestAnimationFrame(() => {
          const panel = document.querySelector(`[data-tab-panel="${target}"]`);
          if (!panel || typeof panel.animate !== 'function') return;
          panel.animate(
            [
              { opacity: 0, transform: 'translateY(12px)', clipPath: 'inset(0 0 14% 0 round 16px)' },
              { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0 round 16px)' }
            ],
            { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setRevealTiming();
    initTimeline();
    initPortraitMotion();
    initTabMotion();
  });
})();
