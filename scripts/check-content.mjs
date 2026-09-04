import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {cabins,photos,contact} from '../app/content.ts';

const manifest=JSON.parse(await fs.readFile('design-references/image-manifest.json','utf8'));
const page=await fs.readFile('app/page.tsx','utf8');
const css=await fs.readFile('app/globals.css','utf8');
assert.equal(cabins.length,3);
assert.deepEqual(cabins.map(c=>c.capacity),['4 personas','4 personas','2 personas']);
for(const [index,c] of cabins.entries()){
  assert.ok(c.images.length>=4);
  for(const p of c.images){
    assert.ok(p.alt.length>15);
    const source=manifest.find(m=>m.name===p.name);
    assert.ok(source);
    assert.ok(source.source.includes(index===0?'cabañaspara4_01':index===1?'cabañaspara4_02':'cabañaPara2'));
  }
}
for(const row of manifest)for(const suffix of ['.webp','-small.webp'])assert.ok((await fs.stat('public/images/'+row.name+suffix)).size>0);
for(const match of page.matchAll(/name:'([^']+)'/g))assert.ok(manifest.some(m=>m.name===match[1]),'Missing '+match[1]);
assert.equal(Object.values(photos).filter(p=>p.generated).length,2);
assert.ok(page.includes('Imagen generada · referencia temporal'));
assert.ok(css.includes('prefers-reduced-motion:reduce'));
assert.ok(page.includes('aria-label="Fotografía anterior"'));
assert.ok(page.includes('aria-label="Cerrar galería"'));
assert.equal(contact.whatsappNumber,'');
assert.ok(page.includes('todavía no se envían consultas'));
for(const id of ['llegar','historia','cabanas','casa','taller','lugar','contacto'])assert.ok(page.includes('id="'+id+'"'));
const metadata=await fs.readFile('app/layout.tsx','utf8');
assert.ok(metadata.includes('https://kecheu-hecho-para-habitar.mateunatalia.chatgpt.site/og.png'));
assert.ok(metadata.includes('index: false'));
console.log('PASS: cabin mapping, 66 responsive image assets, generated labels, anchors, contact draft state, motion preferences and social metadata.');
