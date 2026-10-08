import fs from 'node:fs/promises';
import sharp from 'sharp';
const folders = ['cabañaspara4_01', 'cabañaspara4_02', 'cabañaPara2'];
for (let group = 0; group < folders.length; group++) {
  const folder = '../fotos kecheu/' + folders[group];
  const files = (await fs.readdir(folder)).filter(file => /\.(jpe?g|png)$/i.test(file)).sort();
  const tiles = [];
  for (let i = 0; i < files.length; i++) {
    const image = await sharp(folder+'/'+files[i]).rotate().resize(260, 190, { fit: 'contain', background: '#e9e5dc' }).jpeg().toBuffer();
    const label = Buffer.from(`<svg width="260" height="35"><rect width="260" height="35" fill="#fff"/><text x="8" y="22" font-family="Arial" font-size="14">${i+1} — ${files[i].slice(0,22)}</text></svg>`);
    tiles.push({ input: image, left: (i%4)*260, top: Math.floor(i/4)*225 });
    tiles.push({ input: label, left: (i%4)*260, top: Math.floor(i/4)*225+190 });
  }
  await sharp({create:{width:1040,height:Math.ceil(files.length/4)*225,channels:3,background:'#fff'}}).composite(tiles).jpeg({quality:85}).toFile(`../revision-fotos/cabin-review-${group+1}.jpg`);
  console.log(JSON.stringify({group:group+1, folder,files}));
}
