import path from 'node:path';
import sharp from 'sharp';

const choices={
  'new-exterior':'IMG_6733.JPEG',
  'new-family-building':'IMG_5091.JPEG',
  'new-living':'IMG_6620.JPEG',
  'new-mountains':'IMG_4291.JPEG',
};
const records=[];
for(const [name,file] of Object.entries(choices)){
  const input=path.resolve('../fotos kecheu/nueva',file);
  const full=await sharp(input).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:83}).toFile(`public/images/${name}.webp`);
  const small=await sharp(input).rotate().resize({width:800,height:1000,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${name}-small.webp`);
  records.push({name,source:`fotos kecheu/nueva/${file}`,generated:false,size:{width:full.width,height:full.height,smallWidth:small.width}});
}
console.log(JSON.stringify(records,null,2));
