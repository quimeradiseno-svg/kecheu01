import path from 'node:path';
import sharp from 'sharp';

const source = path.resolve('..', 'fotos kecheu', 'construccion');
const images = {
  'build-step-01': '01.jpg',
  'build-step-02': '02.jpg',
  'build-step-03': '03.jpg',
  'build-step-04': '04.jpg',
  'build-step-05': '05.jpg',
  'build-step-06': '06.jpg',
  'build-step-07': '07.jpg',
  'build-step-08': '08.jpg',
  'build-step-09': '09.jpg',
  'build-step-10': '10.jpg',
  'build-step-11': '11.jpg',
  'build-step-12': '12.jpg',
  'build-step-13': '13.jpg',
  'build-step-14': '14.jpg',
  'build-step-15': '15.JPEG',
  'build-step-16': '16.JPEG',
};

for (const [name, file] of Object.entries(images)) {
  const input = path.join(source, file);
  await sharp(input).rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toFile(`public/images/${name}.webp`);
  await sharp(input).rotate().resize({ width: 800, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/images/${name}-small.webp`);
}

console.log(`Prepared ${Object.keys(images).length} construction photographs.`);
