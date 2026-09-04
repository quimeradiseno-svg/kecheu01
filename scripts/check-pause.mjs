import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pauseMomentIndex, pauseMoments } from '../app/pause-sequence.ts';

assert.deepEqual(pauseMoments.map(moment => moment.text), ['Tomar mate.', 'Escuchar el agua.', 'Mirar la montaña.', 'O nada.']);
assert.equal(new Set(pauseMoments.map(moment => moment.image)).size, 4);
for (const [progress, expected] of [[-1,0],[0,0],[.249,0],[.25,1],[.499,1],[.5,2],[.749,2],[.75,3],[1,3],[2,3],[NaN,0]]) {
  assert.equal(pauseMomentIndex(progress), expected, `Progress ${progress}`);
}
assert.deepEqual([1,.75,.5,.25,0].map(pauseMomentIndex), [3,3,2,1,0]);
for (const moment of pauseMoments) {
  for (const suffix of ['.webp','-small.webp']) assert.ok((await fs.stat(`public/images/${moment.image}${suffix}`)).size > 0);
}

const component = await fs.readFile('app/pause-section.tsx', 'utf8');
const css = await fs.readFile('app/pause-section.module.css', 'utf8');
assert.ok(component.includes('data-pause-sequence="4"'));
assert.ok(component.includes('Aunque también<br/>podés <em>no hacer<br/>nada.</em>'));
assert.equal((component.match(/data-active=\{index === activeIndex\}/g) || []).length, 2);
assert.ok(!/Carousel|<button|<Button|data-motion|data-mouse/.test(component));
assert.ok(css.includes('height: 270svh'));
assert.ok(css.includes('position: sticky'));
assert.ok(css.includes('height: 100svh'));
assert.ok(css.includes('transition: opacity 1200ms ease-in-out'));
assert.ok(!/transform|translate|scale|animation:/.test(css));
assert.ok(css.includes('prefers-reduced-motion: reduce'));

console.log('PASS: four synchronized moments, scroll boundaries in both directions, existing images, opacity-only transitions and bounded sticky.');
