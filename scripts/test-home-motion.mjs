import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../home-motion.js', import.meta.url), 'utf8');
test('entrances repeat on entry and respect reduced motion', () => {
  let notify;
  const animations = [];
  const preference = { matches: false, addEventListener() {} };
  const item = { contains: () => false, animate(frames, options) {
    const animation = { frames, options, cancel() {} };
    animations.push(animation); return animation;
  } };
  class Observer { constructor(fn) { notify = fn; } observe() {} }
  vm.runInNewContext(source, {
    Element: { prototype: { animate() {} } }, IntersectionObserver: Observer,
    document: { querySelectorAll: () => [item], addEventListener() {} },
    window: { IntersectionObserver: Observer, matchMedia: () => preference, addEventListener() {} }
  });
  const enter = value => notify([{target: item, isIntersecting: value}]);
  enter(true); enter(true);
  assert.equal(animations.length, 1);
  assert.equal(animations[0].options.duration, 850);
  assert.equal(animations[0].frames[0].translate, '0 30px');
  enter(false); enter(true);
  assert.equal(animations.length, 2);
  preference.matches = true; enter(false); enter(true);
  assert.equal(animations.length, 2);
});
test('homepage loads the replacement for all twelve targets', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('home-motion.js?v=20260910-2'));
  assert.equal((html.match(/home-reveal/g) || []).length, 12);
});
