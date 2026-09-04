import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {cabins,photos,contact} from '../app/content.ts';

const manifest=JSON.parse(await fs.readFile('design-references/image-manifest.json','utf8'));
const page=await fs.readFile('app/page.tsx','utf8');
const css=await fs.readFile('app/globals.css','utf8');
const houseSequence=await fs.readFile('app/house-sequence.ts','utf8');
const houseStory=await fs.readFile('app/house-story.tsx','utf8');
const placeSection=await fs.readFile('app/place-section.tsx','utf8');
const imageSizes=JSON.parse(await fs.readFile('app/image-sizes.json','utf8'));
for(const row of manifest)assert.ok(imageSizes[row.name]?.width>0&&imageSizes[row.name]?.height>0);
assert.ok(page.includes('width={size.width} height={size.height}'));
assert.equal(cabins.length,3);
assert.deepEqual(cabins.map(c=>c.capacity),['4 personas','4 personas','2 personas']);
for(const [index,c] of cabins.entries()){
  assert.ok(c.images.length>=4);
  for(const p of c.images){
    assert.ok(p.alt.length>15);
    const source=manifest.find(m=>m.name===p.name);
    assert.ok(source);
    if(p.name==='new-exterior'){
      assert.ok(index<2);
      assert.equal(source.source,'fotos kecheu/nueva/IMG_6733.JPEG');
      assert.ok(p.caption.includes('Exterior compartido'));
    }else if(p.name==='new-living'){
      assert.equal(index,0);
      assert.equal(source.source,'fotos kecheu/nueva/IMG_6620.JPEG');
    }else assert.ok(source.source.includes(index===0?'cabañaspara4_01':index===1?'cabañaspara4_02':'cabañaPara2'));
  }
}
for(const row of manifest)for(const suffix of ['.webp','-small.webp'])assert.ok((await fs.stat('public/images/'+row.name+suffix)).size>0);
for(const match of page.matchAll(/name:'([^']+)'/g))assert.ok(manifest.some(m=>m.name===match[1]),'Missing '+match[1]);
assert.equal(Object.values(photos).filter(p=>p.generated).length,0);
assert.equal(photos.hands.name,'real-clay');
assert.equal(photos.clay.name,'ceramic-switch');
assert.ok(!page.includes("name:'hands-temporary'"));
assert.ok(!page.includes("name:'clay-temporary'"));
assert.ok(page.includes('className="cabin-scenes"'));
assert.ok(css.includes('.cabin-scenes{display:grid;grid-template-columns:1.12fr 1fr .86fr'));
assert.ok(css.includes('.material-sequence{height:65svh;max-height:70svh'));
assert.ok(css.includes('height:120svh;display:grid;grid-template-columns:40fr 60fr'));
assert.ok(page.includes('<HouseStory paused={paused}/>'));
assert.ok(css.includes('.manifesto-sequence{height:130svh;max-height:140svh'));
assert.ok(css.includes('.conclusion{height:60svh'));
assert.ok(css.includes('--content-width:1360px'));
assert.ok(css.includes('.hero{height:85svh'));
assert.ok(houseSequence.includes("image: 'house-inside'"));
assert.ok(page.includes('aria-label="Cerrar archivo fotográfico"'));
const workshop=page.slice(page.indexOf('<section className="workshop-section'),page.indexOf('<section className="life-section'));
assert.equal((workshop.match(/<PhotoFrame/g)||[]).length,3);
for(const name of ['new-family-building','bread','workshop','harvest','house-building'])assert.ok(page.includes("name:'"+name+"'"));
assert.ok(!css.includes('scaleX(-1)'));
assert.ok(!page.includes('onMouseEnter'));
for(const line of ['Un lugar para descansar.','Un valle para volar.','El barro para habitar.','Arcilla para crear.'])assert.ok(page.includes(line));
assert.ok(page.includes('<PauseSection paused={paused}/>'));
assert.ok(placeSection.includes('Acá, hasta los motores'));
assert.ok(page.includes('Imagen generada · referencia temporal'));
assert.ok(css.includes('prefers-reduced-motion:reduce'));
assert.ok(page.includes('aria-label="Fotografía anterior"'));
assert.ok(page.includes('aria-label="Cerrar galería"'));
assert.equal(contact.whatsappNumber,'');
assert.ok(page.includes('todavía no se envían consultas'));
for(const id of ['llegar','historia','cabanas','casa','taller','lugar','contacto'])assert.ok((page+houseStory+placeSection).includes('id="'+id+'"'));
const metadata=await fs.readFile('app/layout.tsx','utf8');
assert.ok(metadata.includes('https://kecheu-hecho-para-habitar.mateunatalia.chatgpt.site/og.png'));
assert.ok(metadata.includes('index: false'));
console.log('PASS: preserved cabin mappings and galleries, photo archive, responsive assets, three workshop images, bounded narrative sections, anchors, honest contact state, reduced motion and preserved metadata.');
