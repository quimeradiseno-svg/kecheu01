import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const component = await fs.readFile('app/manifesto-section.tsx', 'utf8');
const css = await fs.readFile('app/manifesto-section.module.css', 'utf8');

const relations = [
  ["line: 'Un lugar para descansar.'", "image: 'hero'"],
  ["line: 'Un valle para volar.'", "image: 'place-kecheu-home'"],
  ["line: 'El barro para habitar.'", "image: 'house-inside'"],
  ["line: 'Arcilla para crear.'", "image: 'real-clay'"],
];
for (const [line, image] of relations) {
  assert.ok(component.includes(line), 'Missing manifesto line: ' + line);
  assert.ok(component.includes(image), 'Missing related photograph: ' + image);
}
assert.equal((component.match(/line: '/g) || []).length, 4);
assert.ok(component.includes('Esto es <em>Kecheu.</em>'));
for (const behavior of ['onMouseEnter', 'onMouseLeave', 'onClick', 'aria-pressed', 'aria-controls', 'aria-live="polite"']) {
  assert.ok(component.includes(behavior), 'Missing interaction: ' + behavior);
}
assert.ok(component.includes('const active = hovered ?? focused ?? pinned'));
assert.ok(!/Carousel|accordion|card|href=|Arrow|zoom/i.test(component));

for (const rule of [
  'grid-template-columns: minmax(0, 47fr) minmax(0, 53fr)',
  'position: absolute',
  'opacity: 0',
  'opacity 550ms ease',
  "[data-active='true']",
  '@media (max-width: 760px)',
]) assert.ok(css.includes(rule), 'Missing visual rule: ' + rule);
assert.ok(!/translate|scale\(|rotate|perspective|animation:/.test(css));

const baseline = '9e7e253af9032c143007641e2449059a0c98640a';
const original = path => execFileSync('git', ['-c', `safe.directory=${process.cwd().replaceAll('\\', '/')}`, 'show', `${baseline}:${path}`], { encoding: 'utf8' });
const page = await fs.readFile('app/page.tsx', 'utf8');
const before = original('app/page.tsx')
  .replace(/  const manifestoItems=\[[\s\S]*?\n  \];\n/, '')
  .replace(/    <section className="manifesto-section"[\s\S]*?<\/section>/, '    MANIFESTO_SECTION');
const after = page
  .replace("import { ManifestoSection } from './manifesto-section';\n", '')
  .replace('    <ManifestoSection/>', '    MANIFESTO_SECTION');
assert.equal(after, before, 'Everything outside the requested manifesto section must remain identical');
assert.equal(await fs.readFile('app/globals.css', 'utf8'), original('app/globals.css'), 'Global styles must remain identical');
for (const path of [
  'app/place-section.tsx',
  'app/place-section.module.css',
  'app/pause-section.tsx',
  'app/pause-section.module.css',
  'app/house-story.tsx',
  'app/house-story.module.css',
  'app/house-sequence.ts',
]) assert.equal(await fs.readFile(path, 'utf8'), original(path), `${path} must remain identical`);

console.log('PASS: four interactive editorial phrases, one crossfading real photograph, click persistence, mobile touch behavior, and no changes outside the manifesto.');
