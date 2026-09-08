import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

test('BCI cover and documentation use the approved photos without changing the title', () => {
  const context = { window: {} };
  vm.runInNewContext(readFileSync('engineering-projects.js', 'utf8'), context);
  const bci = context.window.ENGINEERING_PROJECTS.find(project => project.id === 'bci');
  assert.equal(bci.title, 'Brain Controlled Interface');
  assert.equal(bci.image, './images/builds/bci-system-cover.webp');
  assert.equal(bci.imageMode, 'contain');
  const html = readFileSync('bci.html', 'utf8');
  for (const name of ['bci-system-cover', 'bci-car-remote', 'bci-servo-control', 'bci-headset']) {
    assert.ok(html.includes(`images/builds/${name}.webp`));
    assert.ok(existsSync(`images/builds/${name}.webp`));
  }
  assert.ok(html.includes('HC-04'));
  assert.ok(html.includes('Arduino → servo → remote → car'));
  assert.ok(!html.includes('Mobile 2'));
  assert.ok(!html.includes('electric-skateboard-assembly'));
});

test('skateboard assembly photo belongs to the skateboard documentation', () => {
  const html = readFileSync('eboard.html', 'utf8');
  assert.ok(html.includes('images/builds/electric-skateboard-assembly.webp'));
  assert.ok(existsSync('images/builds/electric-skateboard-assembly.webp'));
});
