import fs from 'node:fs/promises';
import sharp from 'sharp';

const selections = [
  ['piece', 'IMG_1152.JPEG', false],
  ['door', 'Screenshot 2026-09-07 at 22-41-19 Instagram.png', true],
  ['room', 'IMG_4646.JPEG', false],
  ['window', 'IMG_4881.JPEG', false],
  ['hands', 'Screenshot 2026-09-07 at 22-39-44 Instagram.png', true],
  ['child', 'IMG_4905.JPEG', false],
  ['shared', 'Screenshot 2026-09-07 at 22-37-29 Instagram.png', false],
];
const metadata = {};
await fs.mkdir('public/images/atelier', { recursive: true });
for (const [name, file, trimInterface] of selections) {
  let input = sharp('../fotos kecheu/taller/' + file).rotate();
  if (trimInterface) {
    const size = await input.metadata();
    input = input.extract({ left: 0, top: 0, width: size.width, height: size.height - 46 });
  }
  const buffer = await input.toBuffer();
  const full = await sharp(buffer).resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toFile(`public/images/atelier/${name}.webp`);
  const small = await sharp(buffer).resize({ width: 760, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/images/atelier/${name}-small.webp`);
  metadata[name] = { width: full.width, height: full.height, smallWidth: small.width, source: file };
}
await fs.writeFile('app/workshop-images.json', JSON.stringify(metadata, null, 2) + '\n');
console.log(`Prepared ${selections.length} real workshop photographs.`);
