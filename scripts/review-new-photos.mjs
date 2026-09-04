import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source=path.resolve('../fotos kecheu/nueva');
const output=path.resolve('../revision-fotos/nueva');
await fs.mkdir(output,{recursive:true});
const files=(await fs.readdir(source)).filter(name=>/\.(jpe?g|png)$/i.test(name)).sort();
for(let start=0;start<files.length;start+=15){
  const layers=[];
  for(const [i,name] of files.slice(start,start+15).entries()){
    const input=path.join(source,name);
    const preview=await sharp(input).rotate().resize({width:390,height:285,fit:'inside'}).png().toBuffer();
    const {width,height}=await sharp(preview).metadata();
    const left=(i%3)*400,top=Math.floor(i/3)*330;
    layers.push({input:preview,left:left+Math.floor((400-width)/2),top:top+Math.floor((285-height)/2)});
    const label=Buffer.from(`<svg width="400" height="40"><text x="12" y="27" font-size="19" fill="#30392d">${name}</text></svg>`);
    layers.push({input:label,left,top:top+287});
  }
  const target=path.join(output,`plancha-${start/15+1}.jpg`);
  await sharp({create:{width:1200,height:1650,channels:3,background:'#f1efe6'}}).composite(layers).jpeg({quality:90}).toFile(target);
  console.log(target);
}
