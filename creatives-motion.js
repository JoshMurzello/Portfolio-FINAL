(function () {
  const stage = document.querySelector(".velocity-stage");
  const scene = document.querySelector(".velocity-scene");
  const track = document.querySelector(".velocity-track");
  const planes = [...document.querySelectorAll(".velocity-plane")];
  const count = document.querySelector(".velocity-count");
  const scrubber = document.querySelector(".velocity-scrubber");
  const previousButton = document.querySelector(".velocity-prev");
  const nextButton = document.querySelector(".velocity-next");

  if (!stage || !scene || !track || !planes.length || !scrubber) return;

  let frameId = 0;
  let currentProgress = 0;
  let activeIndex = -1;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function getStageTop() {
    return window.scrollY + stage.getBoundingClientRect().top;
  }

  function getScrollableDistance() {
    return Math.max(stage.offsetHeight - window.innerHeight, 1);
  }

  function getScrollProgress() {
    return clamp((window.scrollY - getStageTop()) / getScrollableDistance(), 0, 1);
  }

  function getTrackBounds() {
    const first = planes[0];
    const last = planes[planes.length - 1];
    const firstCenter = first.offsetLeft + first.offsetWidth / 2;
    const lastCenter = last.offsetLeft + last.offsetWidth / 2;

    return {
      start: scene.clientWidth / 2 - firstCenter,
      end: scene.clientWidth / 2 - lastCenter
    };
  }

  function setActivePlane(index) {
    const nextIndex = clamp(index, 0, planes.length - 1);
    if (nextIndex === activeIndex && count.textContent) return;

    activeIndex = nextIndex;
    planes.forEach((plane, planeIndex) => {
      const isActive = planeIndex === activeIndex;
      plane.classList.toggle("is-active", isActive);
      plane.setAttribute("aria-current", isActive ? "true" : "false");
    });

    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(planes.length).padStart(2, "0")}`;
  }

  function render(progress) {
    currentProgress = clamp(progress, 0, 1);
    const bounds = getTrackBounds();
    const x = bounds.start + (bounds.end - bounds.start) * currentProgress;
    track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

    const nextIndex = Math.round(currentProgress * (planes.length - 1));
    setActivePlane(nextIndex);

    const sliderValue = Math.round(currentProgress * 1000);
    scrubber.value = String(sliderValue);
    scrubber.style.setProperty("--scrub-progress", `${(currentProgress * 100).toFixed(2)}%`);
  }

  function requestRender() {
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      render(getScrollProgress());
    });
  }

  function scrollToProgress(progress, behavior = "smooth") {
    const nextProgress = clamp(progress, 0, 1);
    window.scrollTo({
      top: getStageTop() + getScrollableDistance() * nextProgress,
      behavior
    });
    render(nextProgress);
  }

  function scrollToIndex(index) {
    const targetIndex = clamp(index, 0, planes.length - 1);
    const progress = planes.length > 1 ? targetIndex / (planes.length - 1) : 0;
    scrollToProgress(progress);
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);

  scrubber.addEventListener("input", () => {
    scrollToProgress(Number(scrubber.value) / 1000, "auto");
  });

  previousButton?.addEventListener("click", () => {
    scrollToIndex(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    scrollToIndex(activeIndex + 1);
  });

  planes.forEach((plane, index) => {
    plane.tabIndex = 0;
    plane.setAttribute("role", "button");
    plane.setAttribute("aria-label", `Show image ${index + 1} of ${planes.length}`);
    plane.addEventListener("click", () => scrollToIndex(index));
    plane.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      scrollToIndex(index);
    });
  });

  render(getScrollProgress());
})();
