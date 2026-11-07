/* One pose engine for every exercise. Coordinates are in a 400 × 420 coaching board. */
(() => {
'use strict';
const guides={
'lips-o':['Расслабь челюсть','Округли и вытяни губы','Удерживай мягкую «О»','Верни губы в покой'],
'lips-forward':['Губы расслаблены','Мягко вытяни вперёд','Без напряжения челюсти','Расслабь губы'],
'lips-side':['Голова по центру','Губы к твоему правому боку','Губы к твоему левому боку','Верни губы в центр'],
'lips-cw':['Голова неподвижна','Вправо и вниз','Влево и вверх','Замкни небольшой круг'],
'lips-ccw':['Голова неподвижна','Влево и вниз','Вправо и вверх','Замкни небольшой круг'],
'chin-tongue':['Голова прямо','Слегка подними подбородок','Мягко высуни язык','Убери язык и опусти подбородок'],
'chin-lips':['Голова прямо','Чуть подними подбородок','Мягко вытяни губы','Вернись без запрокидывания'],
'head-right':['Плечи неподвижны','Поверни голову к правому плечу','Вытяни губы без усилия','Медленно вернись в центр'],
'head-left':['Плечи неподвижны','Поверни голову к левому плечу','Вытяни губы без усилия','Медленно вернись в центр'],
'cheeks-pulse':['Лицо расслаблено','Слегка надуй обе щеки','Без сильного давления воздуха','Выпусти воздух и расслабься'],
'cheeks-fingers':['Пальцы на щеках','Слегка наполни щёки воздухом','Очень лёгкое сопротивление','Отпусти пальцы и воздух'],
'cheeks-hold':['Пальцы на щеках','Слегка надуй щёки','Мягко удерживай воздух','Отпусти и расслабься'],
'cheeks-palms':['Ладони по бокам щёк','Слегка надуй щёки','Глаза свободны · без давления','Отпусти ладони и воздух'],
'massage':['Пальцы рядом с переносицей','Скользи по щекам к ушам','Не касайся глаз','Подними руки и начни снова'],
'eye-sweep':['Пальцы на кости ниже глаз','Легко веди пальцы к вискам','Веки не растягиваются','Подними пальцы и вернись'],
'eye-touch':['Пальцы ниже глаз, на кости','Легко приложи подушечки','Не дави на глазные яблоки','Отпусти и отведи пальцы'],
'eye-cheek':['Пальцы на верхней части щёк','Проведи к сторонам лица','Не тяни кожу и веки','Подними пальцы и вернись'],
'eye-forehead':['Пальцы над переносицей','Поднимись по лбу','Проведи к вискам','Подними пальцы и вернись'],
'eye-brow':['Пальцы у начала бровей','Скользи вдоль бровей','Дойди до хвостиков','Подними пальцы и вернись'],
'eye-orbit':['Голова неподвижна','Маленький круг глазами','Следующий круг — обратно','Мягко моргни и расслабься'],
'back':['Стопы на полу','Потянись макушкой вверх','Плечи свободно опущены','Не держи спину жёстко'],
'shoulders':['Сядь устойчиво, руки свободны','Отведи плечи назад и вниз','Мягко раскрой грудную клетку','Опусти руки и расслабься'],
'twist':['Руки скрещены на груди','Поверни корпус в одну сторону','Таз и колени неподвижны','Вернись, затем другая сторона'],
'neck':['Плечи свободно опущены','Медленно посмотри в сторону','Не запрокидывай голову','Вернись, затем другая сторона'],
'breathe':['Удобная посадка','Спокойный вдох','Спокойный выдох','Плечи и руки расслаблены'],
'rest':['Отпусти напряжение','Дыши в своём ритме','Расслабь плечи','Продолжай, когда удобно'],
'face':['Расслабь лицо','Дыши спокойно','Челюсть свободна','Плечи опущены']};
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const path=(d,fill,stroke='#7e5946',w=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
let serial=0;
function defs(id){return `<defs><radialGradient id="${id}s" cx=".38" cy=".3" r=".8"><stop stop-color="#fff1db"/><stop offset=".58" stop-color="#e6cfac"/><stop offset="1" stop-color="#bca07b"/></radialGradient><linearGradient id="${id}h" x2=".8" y2="1"><stop stop-color="#806749"/><stop offset="1" stop-color="#433a2c"/></linearGradient><linearGradient id="${id}t" x2="1" y2=".7"><stop stop-color="#dfd4bd"/><stop offset="1" stop-color="#ac9b7c"/></linearGradient><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 L9 5 1 9" fill="none" stroke="#168b87" stroke-width="1.8"/></marker></defs>`}
function arrow(d,id){return `<path d="${d}" fill="none" stroke="#168b87" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#${id}a)"/>`}
function hand(x,y,side,id,palm=false){
// Tips are anchored at (0,0); wrist and individually outlined fingers follow as a rigid hand.
return `<g transform="translate(${x} ${y}) scale(${side} 1)">${path('M-19 102 L-21 60 Q-27 47 -18 37 L-6 3 Q-4 -4 1 -2 Q6 0 3 7 L-4 35 L10 0 Q12 -6 17 -3 Q21 0 18 7 L8 37 L20 15 Q23 10 27 13 Q30 16 27 22 L17 46 L24 34 Q27 29 31 32 Q34 35 31 41 L20 70 L18 102Z',`url(#${id}s)`)}${path('M-14 48 Q-26 30 -30 38 Q-35 44 -20 62 M-15 62 Q-2 51 10 55 M-18 84 Q-2 91 19 83 M-8 40 L-3 43 M7 42 L12 45 M17 48 L22 51','none','#b58066',.8)}${path('M-5 3 L0 4 M11 1 L16 3 M21 17 L25 19','none','#ffebdb',3)}${palm?'<ellipse cx="0" cy="56" rx="10" ry="16" fill="#dba88a" opacity=".45"/>':''}</g>`}
function curls(id){
let result='';
const positions=[[148,52,13],[163,41,14],[182,35,15],[203,34,15],[225,36,14],[244,47,14],[252,65,11],[143,72,11],[159,58,12],[179,54,13],[201,52,12],[223,55,12],[240,68,10]];
for(const [x,y,r] of positions)result+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}h)" stroke="#68533e" stroke-width=".8"/><path d="M${x-r*.6} ${y+2} C${x-r} ${y-r*.7} ${x+r*.8} ${y-r} ${x+r*.55} ${y} Q${x+r*.25} ${y+r*.5} ${x-r*.2} ${y+r*.15}" fill="none" stroke="#b19a72" stroke-width="1.3"/>`;
return result;
}
function head(type,p,id){
const wave=smooth(p<.12?0:p<.4?(p-.12)/.28:p<.65?1:1-(p-.65)/.3);
let shiftX=0,shiftY=0,rx=13,ry=3,cheek=0,irisX=0,irisY=0;
if(type==='lips-o'||type==='lips-forward'||type==='chin-lips'){rx=mix(13,8,wave);ry=mix(3,12,wave)}
if(type==='lips-side')shiftX=14*Math.sin(p*Math.PI*2);
if(type==='lips-cw'||type==='lips-ccw'){const a=p*Math.PI*2*(type==='lips-cw'?-1:1);shiftX=9*Math.sin(a);shiftY=-6*Math.cos(a);rx=8;ry=7}
if(type.startsWith('cheeks'))cheek=wave;
if(type==='eye-orbit'){const a=(p<.5?p*2:2-p*2)*Math.PI*2;irisX=5*Math.sin(a);irisY=-4*Math.cos(a)}
const turn=type==='head-right'?-wave:type==='head-left'?wave:type==='neck'?Math.sin(p*2*Math.PI):0;
const chin=type.startsWith('chin')?wave:0;
const eye=(x)=>`<defs><clipPath id="${id}eye${x}"><path d="M${x-16} 121 Q${x} 108 ${x+16} 121 Q${x} 133 ${x-16} 121"/></clipPath></defs><path d="M${x-16} 121 Q${x} 108 ${x+16} 121 Q${x} 133 ${x-16} 121" fill="#fffdf8" stroke="#805c49"/><g clip-path="url(#${id}eye${x})"><ellipse cx="${x+irisX}" cy="${120+irisY}" rx="7" ry="8" fill="#6b938c" stroke="#47665f"/><ellipse cx="${x+irisX}" cy="${120+irisY}" rx="3" ry="4.5" fill="#263e3d"/><circle cx="${x+irisX+2}" cy="${118+irisY}" r="2" fill="white"/></g><path d="M${x-16} 121 Q${x} 108 ${x+16} 121 M${x-12} 135 Q${x} 140 ${x+12} 135" fill="none" stroke="#a5755f" stroke-width=".8"/>`;
return `<g transform="translate(${turn*16} ${-chin*5}) translate(200 153) scale(${1-Math.abs(turn)*.19} ${1-chin*.035}) translate(-200 -153)">
${path('M174 201 L174 234 Q200 253 226 234 L226 201',`url(#${id}s)`)}<ellipse cx="143" cy="143" rx="10" ry="19" fill="#dca487"/><ellipse cx="257" cy="143" rx="10" ry="19" fill="#dca487"/>${path('M143 93 Q140 35 200 35 Q260 35 257 93 L254 149 L245 176 L226 204 L210 216 L190 216 L174 204 L155 176 L146 149Z',`url(#${id}s)`)}
${path('M143 109 Q127 82 139 48 Q153 21 186 25 Q222 13 252 43 Q271 65 258 109 L249 93 L245 67 Q228 63 217 69 Q195 61 178 69 Q159 61 153 82 L152 108Z',`url(#${id}h)`,'#594634',1.2)}${curls(id)}
${path('M158 103 Q174 95 190 104 M210 104 Q226 95 242 103','none','#6c4d38',4)}${eye(174)}${eye(226)}
<path d="M151 140 L176 142 L184 161 L165 155 L155 165Z M249 140 L224 142 L216 161 L235 155 L245 165Z" fill="#bfa17f" opacity=".24"/><path d="M159 167 L174 181 L179 194 M241 167 L226 181 L221 194" fill="none" stroke="#b89a7a" stroke-width="1" opacity=".5"/>
${path('M200 116 L198 149 L208 153 L207 157 M187 156 Q193 153 197 157 M208 157 L214 155','none','#a5896d',1.1)}<path d="M196 126 L190 149 L195 153" fill="#c6a786" opacity=".3"/>
<ellipse cx="163" cy="157" rx="${15+cheek*7}" ry="${11+cheek*7}" fill="#d9897e" opacity="${.12+cheek*.19}"/><ellipse cx="237" cy="157" rx="${15+cheek*7}" ry="${11+cheek*7}" fill="#d9897e" opacity="${.12+cheek*.19}"/>
${type.startsWith('tongue')?`<ellipse cx="200" cy="178" rx="29" ry="20" fill="#6b3d45" stroke="#b57a78"/><ellipse cx="200" cy="178" rx="24" ry="15" fill="none" stroke="#f6bec3" stroke-dasharray="3 3"/><ellipse cx="${200+22*Math.sin(p*Math.PI*2*(type.endsWith('ccw')?-1:1))}" cy="${178-13*Math.cos(p*Math.PI*2)}" rx="6" ry="7" fill="#eea8b0"/>`:`<g transform="translate(${shiftX} ${shiftY})"><ellipse cx="200" cy="178" rx="${rx}" ry="${ry}" fill="${ry>5?'#653d45':'#bd827a'}" stroke="#ac6f69" stroke-width="2"/><path d="M${200-rx+2} 177 Q200 ${172-ry*.2} ${200+rx-2} 177" fill="none" stroke="#e8ada0"/></g>`}
${type==='chin-tongue'?path(`M193 181 Q${193-wave*2} ${182+wave*22} 200 ${182+wave*22} Q${207+wave*2} ${182+wave*22} 207 181`,'#de95a1','#b56878'):''}
${path('M180 202 Q200 212 220 202 M183 220 L180 230 M217 220 L220 230','none','#bd8b72',.7)}
</g>`}
function faceScene(type,p,id){
const wave=smooth(p<.25?p/.25:p<.7?1:(1-p)/.3),out=p<.75?smooth(Math.max(0,(p-.1)/.6)):1-smooth((p-.75)/.25),lift=p>.75?14*Math.sin((p-.75)/.25*Math.PI):0;
let hands='',target='',route='';
if(type.startsWith('eye-')&&type!=='eye-orbit'||type==='massage'||type.startsWith('cheeks')&&type!=='cheeks-pulse'){
let x=176,y=147;
if(type==='eye-sweep'){x=176-28*out;y=147+4*out+lift;route='M180 145 Q164 155 144 147'}
if(type==='eye-touch'){x=164;y=148+7*(1-wave);target='<circle cx="164" cy="148" r="6" fill="#42aa9d44"/><circle cx="236" cy="148" r="6" fill="#42aa9d44"/>'}
if(type==='eye-cheek'){x=179-33*out;y=163+2*out+lift;route='M177 161 Q158 170 141 163'}
if(type==='eye-brow'){x=184-31*out;y=101+lift;route='M186 96 Q166 87 147 100'}
if(type==='eye-forehead'){x=186-38*smooth((p-.35)/.4);y=90-23*smooth(p/.35)+lift;route='M187 91 L187 68 Q164 60 144 76'}
if(type==='massage'){x=186-42*out;y=149+12*Math.sin(out*Math.PI)+lift;route='M184 148 Q162 170 139 151'}
if(type.startsWith('cheeks')){x=153-5*(1-wave);y=160;target='<ellipse cx="158" cy="161" rx="10" ry="14" fill="#42aa9d33"/><ellipse cx="242" cy="161" rx="10" ry="14" fill="#42aa9d33"/>'}
hands=hand(x,y,1,id,type==='cheeks-palms')+hand(400-x,y,-1,id,type==='cheeks-palms');
}
if(type==='lips-cw'||type==='lips-ccw')route=type==='lips-cw'?'M200 155 A29 23 0 1 0 229 178':'M200 155 A29 23 0 1 1 171 178';
if(type==='eye-orbit')route=p<.5?'M175 140 A20 19 0 1 1 192 122':'M175 140 A20 19 0 1 0 155 122';
if(type==='lips-side')route='M172 204 L226 204';
return `<ellipse cx="200" cy="383" rx="130" ry="12" fill="#7994a315"/>${path('M78 402 L85 303 Q110 248 174 238 Q200 259 226 238 Q290 248 315 303 L322 402',`url(#${id}t)`,'#385262',1.5)}${path('M174 238 Q200 278 226 238 M117 281 L108 375 M283 281 L292 375','none','#93acb8',2)}${head(type,p,id)}${target}${hands}${route?arrow(route,id)+((type.startsWith('eye-')||type==='massage')?`<g transform="translate(400 0) scale(-1 1)">${arrow(route,id)}</g>`:''):''}${type.startsWith('tongue')?'<text x="200" y="330" text-anchor="middle" fill="#76594e" font-size="12">Разрез-схема: язык внутри рта</text>':''}`;
}
function bodyScene(type,p,id){
const wave=smooth(p<.28?p/.28:p<.68?1:(1-p)/.32),turn=type==='twist'?Math.sin(p*Math.PI*2)*14:0;
const arm=(side)=>{const s=side,shoulder=[200+s*51,230];let elbow=[200+s*65,290],wrist=[200+s*55,327];
if(type==='shoulders'){elbow=[200+s*(65+wave*42),290-wave*18];wrist=[200+s*(55+wave*85),327-wave*55]}
if(type==='twist'){elbow=[200+s*60,277];wrist=[200-s*24,241]}
return `<path d="M${shoulder} L${elbow} L${wrist}" fill="none" stroke="#b78a70" stroke-width="23" stroke-linecap="round"/><path d="M${shoulder} L${elbow} L${wrist}" fill="none" stroke="#e9bfa0" stroke-width="19" stroke-linecap="round"/><ellipse cx="${wrist[0]}" cy="${wrist[1]+5}" rx="10" ry="14" fill="url(#${id}s)" stroke="#b38870"/><path d="M${wrist[0]-4} ${wrist[1]+1} v12 m4 -12 v13 m4 -12 v11" stroke="#bd8f75" stroke-width=".6"/>`};
return `<path d="M130 295 L125 399 M270 295 L275 399 M125 326 H275" stroke="#7f919d" stroke-width="9" fill="none"/>${path('M157 304 L243 304 Q263 313 264 337 L257 393 L229 393 L230 343 L200 326 L170 343 L171 393 L143 393 L136 337 Q135 313 157 304','#3e4f63','#283e51',1.5)}<path d="M145 335 L166 337 M234 337 L256 335 M152 347 L154 382 M246 347 L244 382" fill="none" stroke="#71869a" stroke-width="1.4"/><path d="M138 399 H175 M225 399 H263" stroke="#253b49" stroke-width="9" stroke-linecap="round"/><g transform="translate(${turn} ${type==='back'?7*(1-wave):type==='breathe'||type==='rest'?2*Math.sin(p*Math.PI*2):0}) translate(200 240) skewY(${turn*.18}) scale(${type==='twist'?1-Math.abs(turn)/120:1} 1) translate(-200 -240)">${path('M143 223 Q157 204 178 205 L222 205 Q243 204 257 223 L244 309 Q200 323 156 309Z',`url(#${id}t)`,'#345060',1.3)}${arm(-1)}${arm(1)}<g transform="translate(80 80) scale(.6)">${head(type==='neck'?'neck':'face',p,id)}</g>${type==='back'?'<path d="M200 218 L200 299" stroke="#8fd7bf" stroke-dasharray="4 4" opacity=".6"/>':''}</g>${type==='shoulders'?arrow('M116 280 Q80 270 67 248',id)+arrow('M284 280 Q320 270 333 248',id):type==='twist'?arrow('M137 187 Q201 163 262 187',id):type==='back'?arrow('M200 210 L200 177',id):''}<text x="200" y="417" text-anchor="middle" fill="#6f8390" font-size="11">Стопы на полу · таз неподвижен</text>`;
}
function draw(type,p,id){const body=['back','shoulders','twist','neck','breathe','rest'].includes(type);return defs(id)+(body?bodyScene(type,p,id):faceScene(type,p,id))}
const bodyType=t=>['back','shoulders','twist','neck','breathe','rest'].includes(t);
function markup(type){const id='nc'+(++serial);const steps=guides[type]||guides.face;return `<div class="nc-demo ${type.startsWith('eye-')?'wk-eye-art':''}" data-coach="${type}" data-coach-id="${id}"><div class="nc-top"><span>${bodyType(type)?'ПОЗА И ДВИЖЕНИЕ':'ЛИЦО КРУПНЫМ ПЛАНОМ'}</span><span>Зеркальный показ</span></div><div class="nc-board"><svg class="nc-main" viewBox="${bodyType(type)?'0 0 400 420':'90 15 220 270'}" aria-hidden="true">${draw(type,0,id)}</svg><div class="nc-inset" ${bodyType(type)?'hidden':''}><span>ЗОНА ДВИЖЕНИЯ</span><svg viewBox="${type.startsWith('tongue')||type.startsWith('lips')?'147 143 106 80':'138 77 124 110'}" aria-hidden="true">${draw(type,0,id+'z')}</svg></div></div><div class="nc-phases">${steps.map((label,i)=>`<div class="${i===0?'active':''}" data-phase="${i}"><b>${i+1}</b><span>${label}</span></div>`).join('')}</div><div class="nc-controls"><button type="button" data-demo="play">Ⅱ Показ</button><button type="button" data-demo="slow">Скорость 1×</button><button type="button" data-demo="step">По шагам →</button><button type="button" data-demo="zoom">Крупнее</button><label>Движение<input aria-label="Положение демонстрации" type="range" min="0" max="1000" value="0" step="1"/></label></div><p class="nc-help">«По шагам» останавливает показ на следующей фазе. Ползунок позволяет рассмотреть любое положение.</p></div>`}
let cleanup=()=>{},previousType='',position=0;
function mount(root){cleanup();if(typeof requestAnimationFrame!=='function'||!root.querySelector)return;
const demo=root.querySelector('.wk-stage [data-coach]');if(!demo)return;
const type=demo.dataset.coach,id=demo.dataset.coachId; if(previousType!==type)position=0;previousType=type;
const svg=demo.querySelector('.nc-main'),detail=demo.querySelector('.nc-inset svg'),range=demo.querySelector('input'),play=demo.querySelector('[data-demo="play"]'),slow=demo.querySelector('[data-demo="slow"]');
let playing=!root.querySelector('.wk-paused'),speed=1,zoom=false,last=0,frame=0,disposed=false,lastPhase=-1;
const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)playing=false;
function paint(){svg.innerHTML=draw(type,position,id);if(detail)detail.innerHTML=draw(type,position,id+'z');range.value=Math.round(position*1000);const phase=Math.min(3,Math.floor(position*4));if(phase!==lastPhase){demo.querySelectorAll('[data-phase]').forEach((el,i)=>el.classList.toggle('active',i===phase));lastPhase=phase}play.textContent=playing?'Ⅱ Показ':'▶ Показ'}
function loop(time){if(disposed)return;if(playing&&last&&!document.hidden){position=(position+Math.min(time-last,80)/1000*speed/8)%1;paint()}last=time;frame=requestAnimationFrame(loop)}
demo.onclick=e=>{const b=e.target.closest('[data-demo]');if(!b)return;if(b.dataset.demo==='play')playing=!playing;if(b.dataset.demo==='slow'){speed=speed===1?.5:1;slow.textContent='Скорость '+(speed===1?'1×':'0,5×')}if(b.dataset.demo==='zoom'){zoom=!zoom;svg.setAttribute('viewBox',zoom?(bodyType(type)?'65 80 270 280':type.startsWith('lips')||type.startsWith('tongue')?'140 137 120 110':'126 67 148 160'):(bodyType(type)?'0 0 400 420':'90 15 220 270'));b.textContent=zoom?'Общий вид':'Крупнее'}if(b.dataset.demo==='step'){playing=false;position=((Math.floor(position*4)+1)%4)/4+.03}paint()};
range.oninput=()=>{playing=false;position=Number(range.value)/1000;paint()};paint();frame=requestAnimationFrame(loop);cleanup=()=>{disposed=true;cancelAnimationFrame(frame)};
}
window.NuvikoCoach={markup,mount,draw,guides};
})();
