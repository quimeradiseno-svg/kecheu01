import sharp from 'sharp';

const input = '../fotos kecheu/CASA KECHEU/IMG_8351.JPEG';
const name = 'house-almost-finished';
await sharp(input).rotate().resize({width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true}).webp({quality: 83}).toFile(`public/images/${name}.webp`);
await sharp(input).rotate().resize({width: 800, height: 1000, fit: 'inside', withoutEnlargement: true}).webp({quality: 80}).toFile(`public/images/${name}-small.webp`);
console.log('Prepared IMG_8351 as responsive WebP assets.');
