// English Real: lógica de la app. El contenido vive en /content (JSON), no aquí.
const LV=["A1","A2","B1","B2"];let P=[],L=[];
const adapt=l=>({id:l.id,lv:l.level,t:l.title,can:l.can,text:l.text,es:l.translation,v:l.vocab.map(w=>[w.en,w.es,w.example]),g:l.grammar,c:l.caution,q:l.quiz.map(q=>[q.q,q.options,q.answer]),w:l.write.prompt,m:l.write.model});
const get=async p=>(await fetch(p)).json();
let S={lv:null,done:{},cards:{},min:0};
try{Object.assign(S,JSON.parse(localStorage.getItem("er")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("er",JSON.stringify(S))}catch(e){}};
let view="home",cur=null,st=0,T={},rq=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const say=(t,r)=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=r||.9;speechSynthesis.speak(u)}catch(e){}};
const sp=(t,r)=>`<button onclick='say(${JSON.stringify(t).replace(/'/g,"&#39;")},${r||.9})'>🔊${r?" lento":""}</button>`;
const go=(v,x)=>{view=v;if(x!==undefined)cur=x;st=0;T={};rq=null;render();scrollTo(0,0)};
setInterval(()=>{if(!document.hidden&&(view=="lesson"||view=="review")){S.min+=1/6;save()}},10000);
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.v));
const due=()=>Object.keys(S.cards).filter(k=>S.cards[k].due<=Date.now());
const DAY=864e5,IV=[0,1,3,7,16,35];
const norm=s=>s.toLowerCase().replace(/[’]/g,"'").replace(/[^a-z' ]/g,"").trim();
function render(){
document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("a",b.dataset.v==(view=="lesson"?"lessons":view=="ptest"?"home":view)));
const m=document.getElementById("m");m.innerHTML=({home,ptest,lessons,lesson,review,prog})[view]()}
function home(){
const si=Math.min(LV.indexOf(S.lv),Math.max(...L.map(l=>LV.indexOf(l.lv)))),nx=L.find(l=>!S.done[l.id]&&LV.indexOf(l.lv)>=si);
return `<h1>English Real</h1><p class="mu">Aprende inglés con lo que la investigación respalda: entender mucho, repasar con espaciado y producir tus propias frases. Sin rachas, sin puntos, sin compras.</p>`+
(S.lv?`<div class="c"><span class="tag">Tu nivel de partida: ${S.lv}</span>${nx?`<h2>Siguiente: ${nx.t}</h2><p class="mu">${nx.can}</p><button class="p" onclick="go('lesson','${nx.id}')">Continuar</button>`:`<p>Completaste todas las lecciones disponibles. Sigue repasando.</p>`}<button onclick="go('ptest')">Repetir prueba</button></div><div class="c"><b>${due().length}</b> tarjetas para repasar hoy. <button onclick="go('review')">Repasar</button></div>`:
`<div class="c"><h2>1. Descubre tu nivel</h2><p>10 preguntas, sin presión. Sirven para empezar donde corresponde, no para calificarte.</p><button class="p" onclick="go('ptest')">Empezar prueba</button> <button onclick="S.lv='A1';save();render()">Empezar desde cero (A1)</button></div>`)+
`<div class="c"><b>Cada lección:</b> leer y escuchar → vocabulario → gramática útil → comprensión → escribir tus propias frases. Lo que aprendes entra a un repaso espaciado donde tienes que recordar, no reconocer.</div>`}
function ptest(){const a=T.p||[];
return `<h1>Prueba de nivel</h1>`+P.map((q,i)=>`<div class="c"><div>${i+1}. ${q[0]}</div>${q[1].map((o,j)=>`<button class="o${a[i]===j?" s":""}" onclick="T.p=T.p||[];T.p[${i}]=${j};render()">${o}</button>`).join("")}</div>`).join("")+
`<button class="p" ${a.filter(x=>x!==undefined).length<P.length?"disabled":""} onclick="endP()">Ver mi nivel</button>`}
function endP(){let lv=0;for(let t=0;t<4;t++){const qs=P.map((q,i)=>[q,i]).filter(x=>x[0][3]==t);const ok=qs.filter(x=>T.p[x[1]]==x[0][2]).length;if(ok>=Math.ceil(qs.length*.6))lv=t+1;else break}
S.lv=LV[Math.min(lv,3)==lv?Math.min(lv,3):3];if(lv==0)S.lv="A1";save();view="home";render()}
function lessons(){return `<h1>Lecciones</h1>`+LV.filter(v=>L.some(l=>l.lv==v)).map(v=>`<h2>${v}</h2>`+L.filter(l=>l.lv==v).map(l=>`<div class="c"><b>${S.done[l.id]?"✓ ":""}${l.t}</b><div class="mu">${l.can}</div><button onclick="go('lesson','${l.id}')">${S.done[l.id]?"Repetir":"Empezar"}</button></div>`).join("")).join("")+`<p class="mu">B2 y C1 están en preparación: cada nivel nuevo se añade solo cuando las lecciones estén bien construidas.</p>`}
function lesson(){const l=L.find(x=>x.id==cur);const h=`<span class="tag">${l.lv}</span> <span class="mu">Paso ${st+1} de 5</span><h1>${l.t}</h1>`;
if(st==0)return h+`<div class="c"><b>Meta:</b> ${l.can}</div><div class="c en">${esc(l.text).replace(/\n/g,"<br>")}</div>${sp(l.text)}${sp(l.text,.6)}<button onclick="T.t=!T.t;render()">${T.t?"Ocultar":"Ver"} traducción</button>${T.t?`<div class="c mu">${l.es}</div>`:""}<p class="mu">Primero escucha y lee sin traducir. Usa la traducción solo para confirmar. Luego léelo en voz alta una vez.</p><br><button class="p" onclick="st=1;render()">Vocabulario →</button>`;
if(st==1){l.v.forEach(w=>{const k=w[0];if(!S.cards[k])S.cards[k]={es:w[1],ex:w[2],step:0,due:Date.now()+DAY}});save();
return h+`<h2>Palabras clave</h2>`+l.v.map(w=>`<div class="c"><b>${w[0]}</b> — ${w[1]}<div class="en mu">${w[2]}</div>${sp(w[2])}</div>`).join("")+`<p class="mu">Se añadieron a tu repaso espaciado.</p><button class="p" onclick="st=2;render()">Gramática →</button>`}
if(st==2)return h+`<div class="c">${l.g}</div><div class="c"><b>⚠ Cuidado:</b> ${l.c}</div><button class="p" onclick="st=3;render()">Comprensión →</button>`;
if(st==3){T.q=T.q||[];return h+l.q.map((q,i)=>`<div class="c"><div>${q[0]}</div>${q[1].map((o,j)=>{const a=T.q[i];const cl=a===undefined?"":(j==q[2]?"ok":(a==j?"no":""));return `<button class="${cl}" onclick="if(T.q[${i}]===undefined){T.q[${i}]=${j};render()}">${o}</button>`}).join("")}</div>`).join("")+`<button class="p" ${T.q.filter(x=>x!==undefined).length<l.q.length?"disabled":""} onclick="st=4;render()">Escribir →</button>`}
if(st==4)return h+`<h2>Produce tú</h2><p>${l.w}</p><textarea rows="5" oninput="T.w=this.value">${esc(T.w||"")}</textarea><button onclick="T.r=1;render()">Ver ejemplo y revisar</button>${T.r?`<div class="c"><b>Ejemplo:</b><div class="en">${l.m}</div>${sp(l.m)}<p class="mu">Compara con lo tuyo: ¿tienes sujeto en cada frase? ¿usaste la estructura de esta lección? ¿Lo leíste en voz alta? Corrige tu texto antes de continuar. Si quieres, pégalo en un chat con Claude y pide correcciones.</p></div><button class="p" onclick="fin()">Terminar lección</button>`:""}`}
function fin(){S.done[cur]=1;save();go("lessons")}
function review(){const d=due();if(!rq)rq=d.slice();
if(!rq.length)return `<h1>Repaso</h1><div class="c">No hay tarjetas pendientes ahora. ${Object.keys(S.cards).length?"Las próximas aparecerán según su intervalo.":"Completa una lección para crear tarjetas."}</div>`;
const k=rq[0],c=S.cards[k];
return `<h1>Repaso</h1><p class="mu">${rq.length} pendientes · Recuerda la palabra en inglés (empieza con “${k[0]}”).</p><div class="c"><div class="en">${c.es}</div><input id="ans" ${T.res?"disabled":""} autocomplete="off" autocapitalize="off" onkeydown="if(event.key=='Enter')chk()">${T.res?`<p class="${T.res=="ok"?"":"mu"}">${T.res=="ok"?"✓ Correcto":"La respuesta era:"} <b>${k}</b></p><div class="en mu">${c.ex}</div>${sp(c.ex)}<br><button class="p" onclick="nxt()">Siguiente</button>`:`<br><button class="p" onclick="chk()">Comprobar</button>`}</div>`}
function chk(){const k=rq[0],v=norm(document.getElementById("ans").value),c=S.cards[k];const ok=v==norm(k);T.res=ok?"ok":"no";
if(ok){c.step=Math.min(c.step+1,5);c.due=Date.now()+IV[c.step]*DAY}else{c.step=0;c.due=Date.now()}save();render()}
function nxt(){const k=rq.shift();if(T.res=="no")rq.push(k);T={};render()}
function prog(){const w=Object.values(S.cards).filter(c=>c.step>=3).length;
return `<h1>Progreso real</h1><div class="c"><b>${Math.round(S.min)}</b> minutos de estudio activo · <b>${Object.keys(S.done).length}</b> de ${L.length} lecciones · <b>${w}</b> palabras ya consolidadas (repasadas 3+ veces con éxito)</div>
<h2>Lo que ya puedes hacer</h2><div class="c">${L.filter(l=>S.done[l.id]).map(l=>"✓ "+l.can).join("<br>")||'<span class="mu">Aún nada marcado.</span>'}</div>
<h2>Referencia honesta de tiempo</h2><div class="c"><table><tr><th>Nivel</th><th>Horas guiadas acumuladas (Cambridge)</th></tr><tr><td>A2</td><td>≈ 180–200</td></tr><tr><td>B1</td><td>≈ 350–400</td></tr><tr><td>B2</td><td>≈ 500–600</td></tr><tr><td>C1</td><td>≈ 700–800</td></tr></table><p class="mu">Son estimaciones desde cero y varían según tu idioma, tu práctica fuera de la app y tu constancia. Esta app sola no te lleva a B2: complementa con escuchar, leer y hablar con personas.</p></div>
<button onclick="if(confirm('¿Borrar todo tu progreso?')){S={lv:null,done:{},cards:{},min:0};save();go('home')}">Borrar mis datos</button>`}
async function boot(){try{const ix=await get('content/index.json');
P=(await get('content/placement.json')).map(p=>[p.q,p.options,p.answer,LV.indexOf(p.level)]);
L=await Promise.all(ix.lessons.map(async f=>adapt(await get('content/'+f))));}
catch(e){document.getElementById('m').innerHTML='<p>No se pudo cargar el contenido. Sirve la carpeta con un servidor local: <code>npm run dev</code>.</p>';return}
render()}
boot();
