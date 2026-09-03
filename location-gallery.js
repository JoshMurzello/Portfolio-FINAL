// An on-demand gallery: no autoplay, animation loop, or global input listeners.
(() => {
  window.createLocationGallery = function createLocationGallery(host, project) {
    const assets = project.media.filter((asset) => asset.type === "image");
    if (!assets.length) return null;
    const events = new AbortController();
    const listen = (element, type, handler, options = {}) =>
      element.addEventListener(type, handler, { ...options, signal: events.signal });
    const make = (tag, className, text) => {
      const node = document.createElement(tag);
      node.className = className;
      if (text) node.textContent = text;
      return node;
    };
    const button = (className, label, text) => {
      const node = make("button", className, text);
      node.type = "button";
      node.setAttribute("aria-label", label);
      return node;
    };
    const gallery = make("section", "location-gallery");
    gallery.classList.toggle("is-landscape-album", assets.every((asset) => asset.width > asset.height));
    gallery.setAttribute("aria-roledescription", "carousel");
    gallery.setAttribute("aria-label", `${project.title} photo gallery`);
    const stage = make("div", "location-stage");
    stage.tabIndex = 0;
    stage.setAttribute("role", "group");
    stage.setAttribute("aria-label", "Photos: use Left and Right arrow keys to browse");
    const hint = make("p", "location-hint", "Drag to explore · or use the arrows");
    const controls = make("div", "location-controls");
    const previous = button("location-arrow", "Previous photo", "←");
    const next = button("location-arrow", "Next photo", "→");
    const status = make("div", "location-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    const counter = make("p", "location-counter");
    const caption = make("p", "location-caption");
    status.append(counter, caption);
    controls.append(previous, status, next);
    const rail = make("div", "location-rail");
    rail.setAttribute("role", "group");
    rail.setAttribute("aria-label", "Choose a photo");
    const fullSize = make("a", "location-full-size", "View full-size photo ↗");
    fullSize.target = "_blank";
    fullSize.rel = "noopener";
    const footer = make("div", "location-footer");
    footer.append(rail, fullSize);
    gallery.append(hint, stage, controls, footer);
    host.replaceChildren(gallery);

    let index = 0;
    let gesture = null;
    let suppressClick = false;
    let wheelDistance = 0;
    let lastWheel = -Infinity;
    const slides = assets.map((asset, position) => {
      const figure = make("figure", "location-plane");
      figure.setAttribute("role", "group");
      figure.setAttribute("aria-roledescription", "slide");
      figure.setAttribute("aria-label", `${position + 1} of ${assets.length}`);
      const link = make("a", "location-photo-link");
      link.href = asset.src;
      link.target = "_blank";
      link.rel = "noopener";
      link.draggable = false;
      link.setAttribute("aria-label", `Open full-size photo: ${asset.alt}`);
      const img = make("img", "location-photo");
      img.alt = asset.alt;
      img.width = asset.width;
      img.height = asset.height;
      img.decoding = "async";
      img.draggable = false;
      img.sizes = "(max-width: 600px) 72vw, (max-width: 1000px) 60vw, 680px";
      link.append(img);
      figure.append(link);
      stage.append(figure);
      const dot = button("location-dot", `Photo ${position + 1}: ${asset.caption || asset.alt}`, "");
      rail.append(dot);
      listen(dot, "click", () => select(position));
      listen(link, "click", (event) => {
        if (position !== index) {
          event.preventDefault();
          select(position);
        }
      });
      return { figure, link, img, dot, asset };
    });

    function select(value) {
      index = Math.max(0, Math.min(assets.length - 1, value));
      gallery.dataset.index = String(index);
      stage.style.setProperty("--drag", "0px");
      slides.forEach(({ figure, link, img, dot, asset }, position) => {
        const offset = position - index;
        const distance = Math.abs(offset);
        const active = offset === 0;
        // Focus must never remain inside an off-center, aria-hidden slide.
        if (!active && document.activeElement === link) stage.focus({ preventScroll: true });
        figure.style.setProperty("--offset", offset);
        figure.style.setProperty("--depth", `${-150 * distance}px`);
        figure.style.setProperty("--angle", `${-Math.sign(offset) * Math.min(22 * distance, 40)}deg`);
        figure.style.zIndex = String(assets.length - distance);
        figure.classList.toggle("is-current", active);
        figure.classList.toggle("is-distant", distance > 2);
        figure.setAttribute("aria-hidden", String(!active));
        link.tabIndex = active ? 0 : -1;
        dot.setAttribute("aria-pressed", String(active));
        if (distance <= 2 && !img.getAttribute("src")) {
          const thumbWidth = Math.round(Math.min(640, 640 * asset.width / asset.height));
          img.srcset = `${asset.src.replace(/\.webp$/, `-640.webp`)} ${thumbWidth}w, ${asset.src} ${asset.width}w`;
          img.src = asset.src;
        }
      });
      previous.setAttribute("aria-disabled", String(index === 0));
      next.setAttribute("aria-disabled", String(index === assets.length - 1));
      counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(assets.length).padStart(2, "0")}`;
      caption.textContent = assets[index].caption || assets[index].alt;
      fullSize.href = assets[index].src;
      fullSize.setAttribute("aria-label", `View full-size photo ${index + 1}: ${assets[index].alt}`);
    }
    listen(previous, "click", () => select(index - 1));
    listen(next, "click", () => select(index + 1));
    listen(gallery, "keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const destination = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: assets.length - 1 }[event.key];
      if (destination === undefined) return;
      event.preventDefault();
      select(destination);
    });
    listen(stage, "dragstart", (event) => event.preventDefault());
    listen(stage, "pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      suppressClick = false;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, horizontal: false };
    });
    listen(stage, "pointermove", (event) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!gesture.horizontal) {
        if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) {
          gesture = null; // Leave vertical scrolling and pinch zoom to the browser.
          return;
        }
        if (Math.abs(dx) < 9 || Math.abs(dx) <= Math.abs(dy)) return;
        gesture.horizontal = true;
        suppressClick = true;
        stage.setPointerCapture(event.pointerId);
        stage.classList.add("is-dragging");
      }
      gesture.dx = dx;
      const boundary = (index === 0 && dx > 0) || (index === assets.length - 1 && dx < 0);
      stage.style.setProperty("--drag", `${Math.max(-180, Math.min(180, dx * (boundary ? 0.15 : 0.65)))}px`);
    });
    function finishGesture(event, cancelled = false) {
      if (!gesture || event.pointerId !== gesture.id) return;
      const completed = gesture;
      gesture = null;
      stage.classList.remove("is-dragging");
      if (stage.hasPointerCapture(completed.id)) stage.releasePointerCapture(completed.id);
      const threshold = Math.min(64, stage.clientWidth * 0.12);
      select(index + (!cancelled && completed.horizontal && Math.abs(completed.dx) >= threshold ? -Math.sign(completed.dx) : 0));
    }
    listen(stage, "pointerup", (event) => finishGesture(event));
    listen(stage, "pointercancel", (event) => finishGesture(event, true));
    listen(stage, "lostpointercapture", (event) => finishGesture(event, true));
    listen(stage, "pointerleave", (event) => {
      if (gesture && !gesture.horizontal) finishGesture(event, true);
    });
    listen(stage, "click", (event) => {
      if (!suppressClick || event.detail === 0) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, { capture: true });
    listen(stage, "wheel", (event) => {
      // Only intentional horizontal trackpad gestures; never capture vertical scroll/zoom.
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      const direction = Math.sign(event.deltaX);
      if ((direction < 0 && index === 0) || (direction > 0 && index === assets.length - 1)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel < 380) return;
      wheelDistance += event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientWidth : 1);
      if (Math.abs(wheelDistance) < 45) return;
      select(index + Math.sign(wheelDistance));
      wheelDistance = 0;
      lastWheel = now;
    }, { passive: false });
    select(0);
    return { destroy() { events.abort(); gesture = null; host.replaceChildren(); } };
  };
})();
