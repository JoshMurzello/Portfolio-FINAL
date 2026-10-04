/* Featured creative media. Paths point to verified local exports. */
(() => {
  const dialog = document.getElementById('player');
  const video = dialog.querySelector('video');
  const title = document.getElementById('player-title');
  const description = document.getElementById('player-description');
  const clips = {
    assembly: {
      src: 'videos/optimized/cycloidal-assembly.mp4',
      poster: 'images/builds/cycloidal-assembly.webp',
      title: 'Cycloidal actuator assembly',
      description: 'Silent assembly walkthrough showing how the cycloidal actuator fits together.'
    },
    motion: {
      src: 'videos/optimized/cycloidal-detail-v2-horizontal.mp4',
      poster: 'images/optimized/cycloidal-actuator-closeup-1600.jpg',
      title: 'Cycloidal motion',
      description: 'Silent technical animation showing the motion of the cycloidal mechanism.'
    },
    delhi: {
      src: 'videos/delhi-final.mp4',
      poster: 'images/travel/delhi-film-poster.jpg',
      title: 'Delhi, India — travel film',
      description: 'The finished Delhi travel film from the December 2025–January 2026 India trip. Press play for the full edit with audio.'
    }
  };
  let opener;

  document.querySelectorAll('[data-play]').forEach(button => {
    button.addEventListener('click', () => {
      const clip = clips[button.dataset.play];
      if (!clip) return;
      document.querySelectorAll('video').forEach(media => media.pause());
      opener = button;
      title.textContent = clip.title;
      description.textContent = clip.description;
      video.src = clip.src;
      video.poster = clip.poster;
      video.preload = 'metadata';
      video.load();
      dialog.showModal();
    });
  });

  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    opener?.focus();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
  });
})();
