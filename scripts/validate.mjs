// Valida el contenido sin dependencias. Uso: npm test
import fs from 'fs';import {lessonFiles} from './build-index.mjs';
const err=[];const bad=(f,m)=>err.push(`${f}: ${m}`);
const str=(f,o,k)=>{if(typeof o?.[k]!=='string'||!o[k].trim())bad(f,`falta "${k}"`)};
const quiz=(f,q)=>{str(f,q,'q');if(!Array.isArray(q.options)||q.options.length<2)bad(f,'options inválido');else if(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)bad(f,`answer fuera de rango en "${q.q}"`)};
const ids=new Set(),files=lessonFiles();
for(const f of files){let l;try{l=JSON.parse(fs.readFileSync('content/'+f,'utf8'))}catch(e){bad(f,'JSON inválido');continue}
['id','level','title','can','text','translation','grammar','caution'].forEach(k=>str(f,l,k));
if(ids.has(l.id))bad(f,'id duplicado');ids.add(l.id);
if(!f.endsWith(`/${l.id}.json`))bad(f,'el nombre del archivo debe ser <id>.json');
if(!f.startsWith(String(l.level).toLowerCase()+'/'))bad(f,'la carpeta debe coincidir con level');
if(!Array.isArray(l.vocab)||l.vocab.length<4)bad(f,'mínimo 4 palabras de vocabulario');else l.vocab.forEach(w=>['en','es','example'].forEach(k=>str(f,w,k)));
if(!Array.isArray(l.quiz)||l.quiz.length<2)bad(f,'mínimo 2 preguntas');else l.quiz.forEach(q=>quiz(f,q));
str(f,l.write,'prompt');str(f,l.write,'model');}
try{JSON.parse(fs.readFileSync('content/placement.json','utf8')).forEach(q=>{quiz('placement.json',q);if(!['A1','A2','B1','B2','C1'].includes(q.level))bad('placement.json','level inválido')})}catch(e){bad('placement.json','no se pudo leer')}
try{if(JSON.stringify(JSON.parse(fs.readFileSync('content/index.json','utf8')).lessons)!==JSON.stringify(files))bad('index.json','desactualizado: ejecuta npm run build:index')}catch(e){bad('index.json','no existe')}
if(err.length){console.error(err.join('\n'));process.exit(1)}console.log(`OK: ${files.length} lecciones válidas`);
