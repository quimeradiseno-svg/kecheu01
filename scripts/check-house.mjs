import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { houseMomentIndex, houseMoments } from '../app/house-sequence.ts';

assert.deepEqual(houseMoments.map(moment => moment.image), ['house-building', 'house-beams', 'new-family-building', 'house-inside']);
assert.deepEqual(houseMoments.map(moment => moment.label), ['La estructura', 'El entramado', 'El barro', 'La casa']);
for (const [progress, expected] of [[-1,0],[0,0],[.249,0],[.25,1],[.499,1],[.5,2],[.749,2],[.75,3],[1,3],[2,3],[NaN,0]]) {
  assert.equal(houseMomentIndex(progress), expected, `Progress ${progress}`);
}
for (const moment of houseMoments) {
  for (const suffix of ['.webp','-small.webp']) assert.ok((await fs.stat(`public/images/${moment.image}${suffix}`)).size > 0);
}

const component = await fs.readFile('app/house-story.tsx', 'utf8');
const css = await fs.readFile('app/house-story.module.css', 'utf8');
assert.ok(component.includes('data-house-sequence="4"'));
assert.ok(component.includes('Y después,'));
assert.ok(component.includes('se convirtió'));
assert.ok(component.includes('en <em>casa.</em>'));
assert.ok(component.includes('LA CASA-TALLER DE LA FAMILIA · NO ES UNA CABAÑA DE ALQUILER'));
assert.ok(css.includes('height: 330svh'));
assert.ok(css.includes('position: sticky'));
assert.ok(css.includes('transition: opacity 1100ms ease-in-out'));
assert.ok(!/Carousel|<button|<Button/.test(component));

// The page change is limited to replacing the house section and adding its import.
const baseline = 'a0733acb23f7a46d86d33ec6fae058223e9fdcbe';
const original = path => execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\','/')}`, 'show', `${baseline}:${path}`], {encoding:'utf8'});
const page = await fs.readFile('app/page.tsx', 'utf8');
const before = original('app/page.tsx').replace(/    <section id="casa"[\s\S]*?    <\/section>/, '    HOUSE_SECTION');
const after = page.replace("import { HouseStory } from './house-story';\n", '').replace('    <HouseStory paused={paused}/>', '    HOUSE_SECTION');
assert.equal(after, before, 'Content outside the requested house section must remain identical');
assert.equal(await fs.readFile('app/globals.css','utf8'), original('app/globals.css'), 'Global styles must remain identical');
console.log('PASS: three real construction stages lead to the finished house; sticky progression, fallbacks, existing images, and unchanged remaining page.');
