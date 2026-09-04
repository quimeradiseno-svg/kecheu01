import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const component = await fs.readFile('app/place-section.tsx', 'utf8');
const css = await fs.readFile('app/place-section.module.css', 'utf8');

for (const text of [
  '06 — UN VALLE PARA VOLAR',
  'La naturaleza<br/>no es el fondo.<br/><em>Es la protagonista.</em>',
  'A 500 m,<br/><em>el río.</em>',
  'A 3 km,<br/><em>el lago.</em>',
  'Acá, hasta los motores<br/><em>se quedan afuera.</em>',
  'Y alrededor,<br/><em>montaña.</em>',
  'Y ahí en el medio,<br/><em>estamos nosotros.</em>',
]) assert.ok(component.includes(text), 'Missing text: ' + text);

const names = [...component.matchAll(/name="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(names, ['lake', 'river', 'place-forest-road', 'place-stream', 'place-lake-wide', 'new-mountains', 'place-kecheu-home']);
assert.ok(component.includes('data-place-horizontal="7"'));
assert.ok(component.includes("canvas.scrollWidth - window.innerWidth"));
assert.ok(component.includes("-rect.top / travel"));
assert.ok(component.includes("window.matchMedia('(max-width: 760px)')"));
assert.ok(!/Carousel|<button|<Button|Arrow|onDrag|draggable|crossfade/i.test(component));

for (const name of names) {
  for (const suffix of ['.webp', '-small.webp']) {
    assert.ok((await fs.stat(`public/images/${name}${suffix}`)).size > 0, `Missing ${name}${suffix}`);
  }
}

for (const rule of [
  'position: sticky',
  'height: 100svh',
  'width: max-content',
  'translate3d(var(--place-x), 0, 0)',
  'scaleX(var(--place-progress))',
  '@media (max-width: 760px)',
]) assert.ok(css.includes(rule), 'Missing CSS behavior: ' + rule);
assert.ok(/@media \(max-width: 760px\)[\s\S]*?\.section \{[\s\S]*?height: auto !important/.test(css));
assert.ok(!/perspective:|rotate\(|rotate3d\(|animation:/.test(css));
assert.ok(css.includes('grid-template-columns: 48vw 34vw'));
assert.ok(css.includes('height: min(72svh, 710px)'));

const baseline = '87dc8f2e072e692ee7d147e8a0b4a087e2516992';
const original = path => execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\','/')}`, 'show', `${baseline}:${path}`], { encoding: 'utf8' });
const page = await fs.readFile('app/page.tsx', 'utf8');
const before = original('app/page.tsx').replace('    <PlaceSection/>', '    PLACE_SECTION');
const after = page.replace('    <PlaceSection paused={paused}/>', '    PLACE_SECTION');
assert.equal(after, before, 'Content outside the requested place section must remain identical');
assert.equal(await fs.readFile('app/globals.css', 'utf8'), original('app/globals.css'), 'Global styles must remain identical');
for (const path of ['app/pause-section.tsx', 'app/pause-section.module.css', 'app/house-story.tsx', 'app/house-story.module.css', 'app/house-sequence.ts']) {
  assert.equal(await fs.readFile(path, 'utf8'), original(path), `${path} must remain identical`);
}

console.log('PASS: seven real photographs, continuous horizontal canvas, scroll-linked progress, natural mobile layout, and every other landing section unchanged.');
