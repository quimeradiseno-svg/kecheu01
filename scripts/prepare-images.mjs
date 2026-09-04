import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('..');
const inventory = JSON.parse(await fs.readFile(path.join(root, 'revision-fotos/inventario.json'), 'utf8'));
const source = path.join(root, 'fotos kecheu');
const allFiles = [];
async function walk(dir) { for (const e of await fs.readdir(dir, {withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) await walk(p); else allFiles.push(p); } }
await walk(source);
const choices = {
  hero:'K041', construction:'K012', wall:'K010', 'cabin-one':'K060', 'cabin-one-kitchen':'K057', 'cabin-one-bedroom':'K067', 'cabin-one-light':'K074',
  'cabin-two':'K030', 'cabin-two-living':'K023', 'cabin-two-window':'K034', 'cabin-two-stairs':'K032',
  'cabin-small':'K013', 'cabin-small-inside':'K006', 'cabin-small-window':'K001', 'cabin-small-bath':'K009',
  'house-building':'K084', 'house-beams':'K083', 'house-inside':'K111', family:'K129', workshop:'K119',
  'ceramic-switch':'K117', window:'K125', 'real-clay':'K092', harvest:'K163', garden:'K174', carrots:'K171',
  bread:'K100', river:'K176', lake:'K181', pause:'K034', 'house-pond':'K094'
};
await fs.mkdir('public/images',{recursive:true});
const manifest=[];
async function exportImage(name,input) {
  await sharp(input).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:83}).toFile(`public/images/${name}.webp`);
  await sharp(input).rotate().resize({width:800,height:1000,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${name}-small.webp`);
}
for(const [name,id] of Object.entries(choices)) {
  const old=inventory.find(x=>x.id===id);
  const matches=allFiles.filter(p=>path.basename(p)===old.name);
  if(matches.length!==1)throw new Error(`Expected one source for ${id}: ${matches.length}`);
  const input=matches[0]; await exportImage(name,input);
  manifest.push({name,id,source:path.relative(root,input).replaceAll('\\','/'),generated:false});
}
const generated = {
 'hands-temporary':'C:/Users/Admin/.codex/generated_images/01a06a37-81dd-7ce2-926b-19f4cc1c026e/exec-ce1a48cc-c774-4b80-afac-ed9e416c021a.png',
 'clay-temporary':'C:/Users/Admin/.codex/generated_images/01a06a37-aadb-7553-9d66-158fce514c11/exec-eda421e7-526d-45a2-b686-6199a7f27425.png'
};
await fs.mkdir('design-references',{recursive:true});
for(const [name,input] of Object.entries(generated)) {
  await fs.copyFile(input,`design-references/${name}.png`);
  await exportImage(name,input);
  manifest.push({name,generated:true,source:`design-references/${name}.png`,replacement:'Reemplazar con fotografía real y cambiar generated a false en app/content.ts.'});
}
await fs.writeFile('design-references/image-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Prepared ${manifest.length} images with responsive variants.`);
