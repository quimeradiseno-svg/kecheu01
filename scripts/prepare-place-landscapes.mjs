import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '..', 'fotos kecheu', 'pasiajes');
const output = join(root, 'public', 'images');

const photos = [
  ['place-forest-road', 'IMG_7355.JPEG'],
  ['place-stream', 'IMG_5349.JPEG'],
  ['place-lake-wide', 'IMG_8786.JPEG'],
];

for (const [name, filename] of photos) {
  await sharp(join(source, filename))
    .rotate()
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(join(output, name + '.webp'));

  await sharp(join(source, filename))
    .rotate()
    .resize({ width: 800, height: 1000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(output, name + '-small.webp'));
}

console.log('Prepared 3 landscape photos in two responsive sizes.');
