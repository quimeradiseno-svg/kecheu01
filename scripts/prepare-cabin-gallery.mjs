import fs from 'node:fs/promises';
import sharp from 'sharp';
const selections = [
  ['cabin-one-cooking', 'cabañaspara4_01/1cb2f966-6ec5-40b2-922c-74130795bc1c.jpg'],
  ['cabin-one-view', 'cabañaspara4_01/65d9640e-51ba-4435-b00d-8b76ffb2add5.jpg'],
  ['cabin-one-entry', 'cabañaspara4_01/dfa6039c-8760-4e4e-9a33-43f4dbbacb4e.jpg'],
  ['cabin-one-stove', 'cabañaspara4_01/eb1445b5-3972-42d3-9180-eceeac35b37a.jpg'],
  ['cabin-two-fire', 'cabañaspara4_02/IMG_1454.JPEG'],
  ['cabin-two-flower', 'cabañaspara4_02/IMG_1470.JPEG'],
  ['cabin-two-kitchen-view', 'cabañaspara4_02/IMG_1486.JPEG'],
  ['cabin-two-from-above', 'cabañaspara4_02/IMG_1476.JPEG'],
  ['cabin-small-living', 'cabañaPara2/IMG_2737.JPEG'],
  ['cabin-small-door', 'cabañaPara2/IMG_2741.JPEG'],
  ['cabin-small-table', 'cabañaPara2/IMG_4456.JPEG'],
  ['cabin-small-outside', 'cabañaPara2/IMG_0025.JPEG'],
];
for (const [name, source] of selections) {
  const input = '../fotos kecheu/' + source;
  await sharp(input).rotate().resize({width:2200,height:2200,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(`public/images/${name}.webp`);
  await sharp(input).rotate().resize({width:320,height:320,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${name}-small.webp`);
}
await fs.writeFile('design-references/cabin-gallery-sources.json', JSON.stringify(selections.map(([name, source]) => ({name, source:'fotos kecheu/'+source,generated:false})),null,2)+'\n');
console.log(`Prepared ${selections.length} additional real cabin photographs.`);
