/* Featured creative media. Paths point to verified local exports. */
(() => {
  const dialog = document.getElementById('player');
  const video = dialog.querySelector('video');
  const title = document.getElementById('player-title');
  const description = document.getElementById('player-description');
  const clips = {
"maze": {"src": "videos/optimized/self-balancing-maze-web.mp4", "poster": "images/optimized/self-balancing-maze-still.jpg", "title": "Robot maze demo", "description": "Silent footage of the robot navigating a maze."},
"camera-print": {"src": "videos/optimized/camera-storage-print.mp4", "poster": "images/builds/camera-storage-print.webp", "title": "Printing a camera holder", "description": "Silent timelapse of the camera holder being 3D printed."},
"camera-fit": {"src": "videos/optimized/camera-storage-fit.mp4", "poster": "images/builds/camera-storage-fit.webp", "title": "Camera-holder fit check", "description": "Silent eight-second fit check of the printed camera holder."},
"robot-bench": {"src": "videos/optimized/self-balancing-bench-web.mp4", "poster": "images/optimized/self-balancing-bench-still.jpg", "title": "Robot hardware close-up", "description": "Silent close-up of the robot hardware on the bench."},

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
  const rail = document.getElementById('feed-rail');
  const previous = document.getElementById('feed-prev');
  const next = document.getElementById('feed-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateControls() {
    previous.disabled = rail.scrollLeft < 2;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  }
  function move(direction) {
    rail.scrollBy({left: direction * rail.clientWidth * 0.8, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', updateControls, {passive:true});
  rail.addEventListener('keydown', event => {
    if (event.target !== rail) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  new ResizeObserver(updateControls).observe(rail);
  updateControls();
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
