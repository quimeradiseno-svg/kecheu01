import sharp from 'sharp';
const selections = [
  ['family-outdoors', 'CASA KECHEU/IMG_1528.JPEG'],
  ['family-at-home', 'CASA KECHEU/IMG_3275.JPEG'],
  ['family-window', 'CASA KECHEU/IMG_4905.JPEG'],
];
for (const [name, source] of selections) {
  const input = '../fotos kecheu/' + source;
  await sharp(input).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(`public/images/${name}.webp`);
  await sharp(input).rotate().resize({width:320,height:400,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(`public/images/${name}-small.webp`);
}
console.log('Prepared three real photographs for the family album.');
