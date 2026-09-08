import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const source = read('location-gallery.js');

function setup(albumIndex = 0) {
  const document = { activeElement: null };
  class Element {
    constructor(tag = 'div') {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.attributes = {};
      this.dataset = {};
      this.events = {};
      this.classes = new Set();
      this.capture = new Set();
      this.clientWidth = 800;
      this.style = { setProperty(name, value) { this[name] = String(value); } };
      this.classList = {
        add: (name) => this.classes.add(name),
        remove: (name) => this.classes.delete(name),
        toggle: (name, active) => active ? this.classes.add(name) : this.classes.delete(name)
      };
    }
    append(...nodes) { this.children.push(...nodes); }
    replaceChildren(...nodes) { this.children = nodes; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? this[name] ?? null; }
    addEventListener(type, callback, options = {}) { (this.events[type] ||= []).push({ callback, options }); }
    focus() { document.activeElement = this; }
    setPointerCapture(id) { this.capture.add(id); }
    hasPointerCapture(id) { return this.capture.has(id); }
    releasePointerCapture(id) { this.capture.delete(id); }
    emit(type, extra = {}) {
      const event = {
        target: this, isPrimary: true, button: 0, pointerId: 1, clientX: 0, clientY: 0,
        detail: 1, deltaX: 0, deltaY: 0, deltaMode: 0, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; }, ...extra
      };
      for (const { callback, options } of this.events[type] || []) if (!options.signal?.aborted) callback(event);
      return event;
    }
  }
  document.createElement = (tag) => new Element(tag);
  let time = 1000;
  const context = vm.createContext({ window: {}, document, AbortController, performance: { now: () => time } });
  vm.runInContext(read('travel-albums.js'), context);
  vm.runInContext(source, context);
  const host = new Element();
  const album = context.window.TRAVEL_ALBUMS[albumIndex];
  const controller = context.window.createLocationGallery(host, album);
  const gallery = host.children[0];
  const [, stage, controls, footer] = gallery.children;
  const [previous, status, next] = controls.children;
  const [counter, caption] = status.children;
  const [rail, fullSize] = footer.children;
  return { document, host, album, controller, gallery, stage, previous, next, counter, caption, rail, fullSize,
    index: () => Number(gallery.dataset.index), tick: (ms = 500) => { time += ms; } };
}

test('all five albums retain their photos, captions, and responsive near-slide loading', () => {
  for (let i = 0; i < 5; i++) {
    const app = setup(i);
    assert.equal(app.stage.children.length, app.album.media.length);
    assert.equal(app.index(), 0);
    assert.equal(app.stage.children.filter(s => s.attributes['aria-hidden'] === 'false').length, 1);
    assert.equal(app.stage.children.filter(s => s.children[0].children[0].src).length, 3);
    assert.match(app.stage.children[0].children[0].children[0].srcset, /640\.webp/);
    assert.equal(app.caption.textContent, app.album.media[0].caption);
    assert.equal(app.fullSize.href, app.album.media[0].src);
  }
});

test('arrows and direct selection update the active plane, caption, counter, and full-size link', () => {
  const app = setup();
  app.previous.emit('click');
  assert.equal(app.index(), 0);
  app.next.emit('click');
  assert.equal(app.index(), 1);
  assert.equal(app.counter.textContent, '02 / 08');
  assert.equal(app.stage.children[0].children[0].tabIndex, -1);
  assert.equal(app.stage.children[1].children[0].tabIndex, 0);
  assert.equal(app.rail.children[1].attributes['aria-pressed'], 'true');
  app.rail.children[7].emit('click');
  app.next.emit('click');
  assert.equal(app.index(), 7);
  assert.equal(app.next.attributes['aria-disabled'], 'true');
  assert.equal(app.fullSize.href, app.album.media[7].src);
});

test('keyboard navigation is bounded, respects modified shortcuts, and moves focus out of hidden slides', () => {
  const app = setup();
  app.stage.children[0].children[0].focus();
  assert.equal(app.gallery.emit('keydown', { key: 'ArrowRight' }).defaultPrevented, true);
  assert.equal(app.index(), 1);
  assert.equal(app.document.activeElement, app.stage);
  app.gallery.emit('keydown', { key: 'End' });
  assert.equal(app.index(), 7);
  app.gallery.emit('keydown', { key: 'Home', metaKey: true });
  assert.equal(app.index(), 7);
  app.gallery.emit('keydown', { key: 'Home' });
  assert.equal(app.index(), 0);
  assert.equal(app.gallery.emit('keydown', { key: 'Tab' }).defaultPrevented, false);
});

test('clicking a neighbor selects it; the centered link keeps normal full-size navigation', () => {
  const app = setup();
  assert.equal(app.stage.children[1].children[0].emit('click').defaultPrevented, true);
  assert.equal(app.index(), 1);
  assert.equal(app.stage.children[1].children[0].emit('click').defaultPrevented, false);
});

test('horizontal dragging advances one photo without accidentally opening its link', () => {
  const app = setup();
  app.stage.emit('pointerdown', { clientX: 400 });
  app.stage.emit('pointermove', { clientX: 290, clientY: 2 });
  assert.equal(app.stage.hasPointerCapture(1), true);
  app.stage.emit('pointerup', { clientX: 290 });
  assert.equal(app.index(), 1);
  assert.equal(app.stage.hasPointerCapture(1), false);
  assert.equal(app.stage.style['--drag'], '0px');
  assert.equal(app.stage.emit('click').defaultPrevented, true);
  assert.equal(app.stage.emit('click', { detail: 0 }).defaultPrevented, false);
  app.stage.emit('pointerdown', { clientX: 100 });
  app.stage.emit('pointermove', { clientX: 210 });
  app.stage.emit('pointerup', { clientX: 210 });
  assert.equal(app.index(), 0);
});

test('vertical, secondary, tiny, and cancelled gestures never change the selected photo', () => {
  for (const action of ['vertical', 'secondary', 'tiny', 'pointercancel', 'lostpointercapture']) {
    const app = setup();
    app.stage.emit('pointerdown', { clientX: 400, isPrimary: action !== 'secondary' });
    app.stage.emit('pointermove', { clientX: action === 'tiny' ? 396 : action === 'vertical' ? 402 : 250, clientY: action === 'vertical' ? 100 : 0 });
    app.stage.emit(action.startsWith('pointercancel') || action === 'lostpointercapture' ? action : 'pointerup');
    assert.equal(app.index(), 0, action);
    assert.equal(app.stage.style['--drag'], '0px');
  }
});

test('trackpad navigation ignores vertical scroll and zoom and releases at boundaries', () => {
  const app = setup();
  assert.equal(app.stage.emit('wheel', { deltaY: 100 }).defaultPrevented, false);
  assert.equal(app.stage.emit('wheel', { deltaX: 100, ctrlKey: true }).defaultPrevented, false);
  assert.equal(app.stage.emit('wheel', { deltaX: -100 }).defaultPrevented, false);
  assert.equal(app.stage.emit('wheel', { deltaX: 100 }).defaultPrevented, true);
  assert.equal(app.index(), 1);
  app.stage.emit('wheel', { deltaX: 100 });
  assert.equal(app.index(), 1, 'momentum must not skip through the entire album');
  app.tick();
  app.stage.emit('wheel', { deltaX: 100 });
  assert.equal(app.index(), 2);
});

test('closing aborts all gallery input handlers and releases the mounted media', () => {
  const app = setup();
  app.controller.destroy();
  assert.equal(app.host.children.length, 0);
  app.next.emit('click');
  app.gallery.emit('keydown', { key: 'End' });
  assert.equal(app.index(), 0);
  assert.doesNotMatch(source, /requestAnimationFrame|setInterval|setTimeout|window\.addEventListener/);
});

test('integration is journal-only, keyboard-safe, cache-busted, and has a reduced-motion fallback', () => {
  const js = read('creatives.js');
  const html = read('Creatives.html');
  const css = read('location-gallery.css');
  assert.match(js, /project\.photoJournal && window\.createLocationGallery/);
  assert.match(js, /locationGallery\?\.destroy\(\)/);
  assert.match(js, /element\.tabIndex >= 0 && !element\.disabled/);
  assert.match(js, /event\.target === modal && outside/);
  assert.ok(html.indexOf('src="location-gallery.js') < html.indexOf('src="creatives.js'));
  assert.match(html, /location-gallery\.css\?v=20260903-2/);
  assert.match(css, /perspective: 1250px/);
  assert.match(css, /object-fit: contain/);
  assert.match(css, /touch-action: pan-y pinch-zoom/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /\.location-plane:not\(\.is-current\) \{ visibility: hidden/);
});
