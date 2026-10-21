// Genera content/index.json con las lecciones ordenadas por nivel y nombre de archivo.
import fs from 'fs';
export const LEVELS=['a1','a2','b1','b2','c1'];
export function lessonFiles(){return LEVELS.flatMap(l=>fs.existsSync(`content/${l}`)?fs.readdirSync(`content/${l}`).filter(f=>f.endsWith('.json')&&!f.startsWith('_')).sort().map(f=>`${l}/${f}`):[])}
if(process.argv[1].endsWith('build-index.mjs')){fs.writeFileSync('content/index.json',JSON.stringify({lessons:lessonFiles()},null,2)+'\n');console.log('index.json actualizado');}
