import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const component = await fs.readFile('app/place-section.tsx', 'utf8');
const css = await fs.readFile('app/place-section.module.css', 'utf8');
assert.ok(component.includes('La naturaleza<br/>no es el fondo.<br/><em>Es la protagonista.</em>'));
assert.ok(component.includes('Agua, senderos y montaña a pocos minutos de Kecheu. En el Lago Epuyén, incluso los motores se quedan afuera.'));
assert.equal((component.match(/<figure/g) || []).length, 1);
assert.ok(component.includes('data-place-landscape="lake"'));
for (const suffix of ['.webp','-small.webp']) assert.ok((await fs.stat(`public/images/lake${suffix}`)).size > 0);
for (const text of ['500 <small>m</small>', 'Río Epuyén', '3 <small>km</small>', 'Lago Epuyén', '4 <small>km</small>', 'Pueblo']) assert.ok(component.includes(text));
assert.ok(!/card|sticky|Carousel|<button|<Button|background:/.test(component));
assert.ok(css.includes('34fr) minmax(0, 66fr)'));
assert.ok(css.includes('height: clamp(430px, 48vw, 650px)'));
assert.ok(!/position:\s*sticky|animation:/.test(css));

const baseline = '5c9003f5de3a4bdfea8203a4f352f0d6d2be0f5d';
const original = path => execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\','/')}`, 'show', `${baseline}:${path}`], {encoding:'utf8'});
const page = await fs.readFile('app/page.tsx', 'utf8');
const before = original('app/page.tsx')
  .replace(', MapPin', '')
  .replace(/    <section className="place-section section-pad" id="lugar">[\s\S]*?<\/section>/, '    PLACE_SECTION');
const after = page
  .replace("import { PlaceSection } from './place-section';\n", '')
  .replace('    <PlaceSection/>', '    PLACE_SECTION');
assert.equal(after, before, 'Content outside the requested place section must remain identical');
assert.equal(await fs.readFile('app/globals.css','utf8'), original('app/globals.css'), 'Global styles must remain identical');
assert.equal(await fs.readFile('app/pause-section.tsx','utf8'), original('app/pause-section.tsx'), 'The preceding pause section must remain identical');
assert.equal(await fs.readFile('app/pause-section.module.css','utf8'), original('app/pause-section.module.css'), 'The preceding pause styles must remain identical');
console.log('PASS: one dominant lake landscape, 34/66 editorial layout, minimal narrative and distances, no sticky/cards, unchanged pause section and global styles.');
