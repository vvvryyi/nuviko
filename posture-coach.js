/* Joint-length-preserving 3D posture rig, projected to a shaded instructional canvas. */
(()=>{
const api=window.NuvikoCoach,baseMarkup=api.markup,baseMount=api.mount,baseControls=api.controls;
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(v=>v*s),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),len=a=>Math.hypot(...a),norm=a=>mul(a,1/(len(a)||1));
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const phases={
'posture-pull':['Руки вверх, плечи свободны','Опусти локти, сведи лопатки','Без прогиба в пояснице','Плавно верни руки вверх'],
'posture-palms':['Руки вверх в комфортную высоту','Согни локти и раскрой ладони','Плечи не поднимаются к ушам','Верни ладони и выпрями руки'],
'posture-open':['Руки перед собой','Раскрой руки в стороны','Лопатки сближаются, таз неподвижен','Верни руки перед собой'],
'posture-lock-back':['Ладони соединены за спиной','Слегка подними замок','Не тяни плечи через усилие','Плавно опусти руки'],
'posture-window':['Локти согнуты перед собой','Раскрой плечи наружу','Локти примерно на уровне плеч','Вернись без движения таза'],
'posture-swim':['Стой устойчиво','Одна рука поднимается','Вторая рука опускается','Продолжай без раскачивания'],
'posture-overhead':['Руки соединены над головой','Согни локти, опусти ладони','Не дави руками на затылок','Плавно выпрями локти'],
'posture-circles':['Руки в стороны','Выполняй плавный круг','Движение в обратную сторону','Корпус и таз неподвижны'],
'posture-chest':['Мягко округли верх спины','Расправь грудную клетку','Поясницу не переразгибай','Вернись в мягкое округление'],
'posture-side-left':['Правая рука поднята','Мягкий наклон влево','Таз остаётся над стопами','Вернись в центр'],
'posture-side-right':['Левая рука поднята','Мягкий наклон вправо','Не поворачивай грудь к полу','Вернись в центр'],
'posture-finish':['Плечи расслаблены','Вдох, руки поднимаются','Дыши без задержки','Выдох, руки опускаются'],
'posture-rest':['Устойчивая стойка','Расслабь руки и плечи','Дыши спокойно','Продолжай, когда удобно']};
function ik(s,target,side){const d0=sub(target,s),d=Math.min(.589,Math.max(.025,len(d0))),u=norm(d0),a=(.30*.30-.29*.29+d*d)/(2*d),h=Math.sqrt(Math.max(0,.30*.30-a*a));let b=[side,0,-.2];b=sub(b,mul(u,dot(b,u)));if(len(b)<.05)b=[0,0,-1];b=norm(b);return {e:add(add(s,mul(u,a)),mul(b,h)),w:add(s,mul(u,d))}}
function pose(type,p){const g=ease(p<.3?p/.3:p<.65?1:(1-p)/.35),a=p*Math.PI*2,tilt=type==='posture-side-left'?g*.25:type==='posture-side-right'?-g*.25:0;
const upper=q=>{const y=q[1]-1;return [q[0]*Math.cos(tilt)-y*Math.sin(tilt),1+q[0]*Math.sin(tilt)+y*Math.cos(tilt),q[2]]};
const flex=type==='posture-chest'?(1-g):0,shoulderZ=.08*flex;
const r={hips:[[-.14,1,0],[.14,1,0]],knees:[[-.15,.54,0],[.15,.54,0]],ankles:[[-.16,.09,0],[.16,.09,0]],feet:[[-.16,.055,.12],[.16,.055,.12]],hip:[0,1,0],waist:upper([0,1.18,0]),neck:upper([0,1.73-.03*flex,.11*flex]),head:upper([0,1.88-.035*flex,.14*flex]),arms:[],g,tilt};
for(const side of [-1,1]){
let s=[side*.24,1.60-.03*flex,shoulderZ],e,w;
if(type==='posture-pull'||type==='posture-palms'){const angle=g*1.35;e=add(s,[side*.30*Math.sin(angle),.30*Math.cos(angle),0]);w=add(e,[0,.29,0]);}
else if(type==='posture-open'){let angle=g*Math.PI/2;const d=[side*Math.sin(angle),0,Math.cos(angle)];e=add(s,mul(d,.30));w=add(e,mul(d,.29));}
else if(type==='posture-window'){const d=[side*Math.sin(g*Math.PI/2),0,Math.cos(g*Math.PI/2)];e=add(s,mul(d,.30));w=add(e,[0,.29,0]);}
else if(type==='posture-swim'){let angle=a+(side===1?Math.PI:0);const d=[side*.04,Math.cos(angle),Math.sin(angle)];const u=norm(d);e=add(s,mul(u,.30));w=add(e,mul(u,.29));}
else if(type==='posture-circles'){let angle=p<.5?a*2:(2-p*2)*Math.PI*2;const d=[side*Math.cos(angle),Math.sin(angle),.025];e=add(s,mul(norm(d),.30));w=add(e,mul(norm(d),.29));}
else if(type==='posture-finish'){let angle=g*Math.PI;const d=[side*Math.sin(angle),-Math.cos(angle),0];e=add(s,mul(d,.30));w=add(e,mul(d,.29));}
else {
let t=add(s,[side*.04,-.585,0]);
if(type==='posture-lock-back')t=[side*.025,1.09+g*.14,-.28];
if(type==='posture-overhead')t=[side*.025,2.12-g*.35,-.18*g];
if(type==='posture-side-left'||type==='posture-side-right'){const raised=(type==='posture-side-left'?side===1:side===-1);t=raised?[side*.21,2.18,0]:[side*.18,1.12,-.04];}
if(type==='posture-chest')t=[side*.29,1.07,-.12*g];
const solved=ik(s,t,side);e=solved.e;w=solved.w;
}
r.arms.push({s:upper(s),e:upper(e),w:upper(w),side,palm:type==='posture-palms'?g*Math.PI:0});}
return r;
}
api.posturePose=pose;api.posturePhases=phases;
function painter(canvas){const ctx=canvas.getContext('2d');
function scene(type,p,yaw,origin,scale,inset=false){const r=pose(type,p),c=Math.cos(yaw),s=Math.sin(yaw);const proj=q=>{const z=-q[0]*s+q[2]*c,k=1/(1+z*.15);return [origin[0]+(q[0]*c+q[2]*s)*scale*k,origin[1]-q[1]*scale*k,z,k]};
function line(a,b,width,color){const pa=proj(a),pb=proj(b);ctx.lineCap='round';ctx.lineWidth=width*scale*(pa[3]+pb[3])/2;const grad=ctx.createLinearGradient(pa[0]-width*scale/2,pa[1],pa[0]+width*scale/2+1,pa[1]+1);grad.addColorStop(0,color[0]);grad.addColorStop(.42,color[1]);grad.addColorStop(1,color[2]);ctx.strokeStyle=grad;ctx.beginPath();ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);ctx.stroke();}
const skin=['#9f7863','#e6c0a4','#b38d73'],pants=['#263649','#526478','#304459'],shirt=['#254b57','#5a8f94','#315e6b'];
function ball(q,rx,ry,palette,angle=0){let v=proj(q);const gr=ctx.createRadialGradient(v[0]-rx*scale*.3,v[1]-ry*scale*.4,1,v[0],v[1],rx*scale*1.4);gr.addColorStop(0,palette[1]);gr.addColorStop(1,palette[0]);ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(v[0],v[1],rx*scale*v[3],ry*scale*v[3],angle,0,Math.PI*2);ctx.fill();}
function marker(q){if(inset)return;let v=proj(q);ctx.strokeStyle='#a0f4df';ctx.fillStyle='#326867';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(v[0],v[1],3.6,0,7);ctx.fill();ctx.stroke();}
const segments=[];for(let i=0;i<2;i++){segments.push({a:r.hips[i],b:r.knees[i],w:.145,col:pants},{a:r.knees[i],b:r.ankles[i],w:.10,col:pants},{a:r.ankles[i],b:r.feet[i],w:.085,col:['#1b2833','#40566a','#213445']})}
segments.sort((a,b)=>(proj(b.a)[2]+proj(b.b)[2])-(proj(a.a)[2]+proj(a.b)[2]));for(const seg of segments)line(seg.a,seg.b,seg.w,seg.col);
// Draw arms on their actual depth side of the torso, so a side camera shows forward/backward motion.
const armDraw=arm=>{line(arm.s,arm.e,.103,skin);ball(arm.e,.052,.052,skin);line(arm.e,arm.w,.078,skin);const palm=add(arm.w,mul(norm(sub(arm.w,arm.e)),.045));const pv=proj(palm),wv=proj(arm.w),angle=Math.atan2(pv[1]-wv[1],pv[0]-wv[0])+Math.PI/2;ball(palm,.012+.026*Math.abs(Math.cos(arm.palm||0)),.067,(arm.palm||0)>Math.PI/2?['#b99177','#f0cfb3','#bc9479']:skin,angle);marker(arm.s);marker(arm.e);marker(arm.w);};
const near=[],far=[];for(const arm of r.arms)(proj(arm.w)[2]>proj(r.waist)[2]+.05?far:near).push(arm);far.forEach(armDraw);
// A tapered, shaded torso with a fixed pelvis and a separately moving thoracic region.
const rings=[[1.0,.18,.125],[1.18,.15,.11],[1.43,.205,.14],[1.60,.24,.11],[1.69,.075,.065]];
const leftEdge=[],rightEdge=[];
for(const [y,rx,rz] of rings){const ring=[];for(let i=0;i<24;i++){const angle=i*Math.PI/12,x=Math.cos(angle)*rx,z=Math.sin(angle)*rz,dy=y-1;ring.push(proj([x*Math.cos(r.tilt)-dy*Math.sin(r.tilt),1+x*Math.sin(r.tilt)+dy*Math.cos(r.tilt),z+(type==='posture-chest'?.05*(1-r.g)*(y-1)/.69:0)]))}ring.sort((a,b)=>a[0]-b[0]);leftEdge.push(ring[0]);rightEdge.push(ring[ring.length-1]);}
const points=[...leftEdge,...rightEdge.reverse()],xs=points.map(v=>v[0]);let grad=ctx.createLinearGradient(Math.min(...xs),0,Math.max(...xs)+1,0);grad.addColorStop(0,shirt[0]);grad.addColorStop(.4,shirt[1]);grad.addColorStop(1,shirt[2]);ctx.fillStyle=grad;ctx.beginPath();points.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();
line(r.neck,add(r.head,[0,-.05,0]),.105,skin);ball(r.head,.105,.137,skin);const hv=proj(r.head);ctx.fillStyle='#443c35';ctx.beginPath();ctx.ellipse(hv[0],hv[1]-.065*scale,.107*scale,.085*scale,0,Math.PI,Math.PI*2);ctx.fill();
if(c<-.4){ctx.fillStyle='#344943';for(const x of [-.034,.034]){let ev=proj(add(r.head,[x,.015,.095]));ctx.beginPath();ctx.arc(ev[0],ev[1],Math.max(1,scale*.008),0,7);ctx.fill();}}
if(c>-.25){const spine=[add(r.neck,[0,0,-.13]),add(r.waist,[0,0,-.13]),[0,1.04,-.13]].map(proj);ctx.strokeStyle='#b0d9cc';ctx.lineWidth=inset?1:2;ctx.setLineDash([3,4]);ctx.beginPath();spine.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.setLineDash([]);
for(const side of [-1,1]){const x=side*(.12-.025*r.g);const b=proj([x,1.47,-.145]),t=proj([side*.16,1.57,-.145]),e=proj([side*.10,1.35,-.145]);ctx.strokeStyle=`rgba(255,203,116,${.3+.5*r.g})`;ctx.lineWidth=inset?2:4;ctx.beginPath();ctx.moveTo(t[0],t[1]);ctx.quadraticCurveTo(b[0],b[1],e[0],e[1]);ctx.stroke();}}
near.forEach(armDraw);marker(r.hip);
if(!inset){for(let arm=0;arm<2;arm++){const track=[];for(let i=0;i<7;i++){const t=((p-.07+i*.012)%1+1)%1;track.push(proj(pose(type,t).arms[arm].w))}ctx.strokeStyle='#439a9e99';ctx.lineWidth=1.7;ctx.setLineDash([3,3]);ctx.beginPath();track.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.setLineDash([]);}}

if(!inset){ctx.strokeStyle='#7fc3b3';ctx.lineWidth=1.5;for(const f of r.feet){const v=proj(f);ctx.beginPath();ctx.ellipse(v[0],v[1]+4,.09*scale,.025*scale,0,0,7);ctx.stroke();}}
}
return {paint(type,p,yaw,zoom,side){const w=800,h=1100;canvas.width=w;canvas.height=h;ctx.fillStyle='#edf2ef';ctx.fillRect(0,0,w,h);let bg=ctx.createRadialGradient(360,370,20,400,450,650);bg.addColorStop(0,'#fcfaf3');bg.addColorStop(1,'#dce7e5');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.fillStyle='#8a9d9b20';ctx.beginPath();ctx.ellipse(375,1010,230,30,0,0,7);ctx.fill();
scene(type,p,yaw,[370,1010],zoom?445:410);if(side){ctx.save();ctx.beginPath();ctx.roundRect(606,30,170,240,16);ctx.fillStyle='#ffffffc9';ctx.fill();ctx.strokeStyle='#bdd0cb';ctx.lineWidth=1;ctx.stroke();ctx.clip();scene(type,p,Math.abs(Math.cos(yaw))<.4?.18:Math.PI/2,[688,252],88,true);ctx.fillStyle='#627975';ctx.textAlign='center';ctx.font='15px system-ui';ctx.fillText(Math.abs(Math.cos(yaw))<.4?'Вид сзади':'Вид сбоку',690,54);ctx.restore();}
ctx.font='17px system-ui';ctx.fillStyle='#5a7771';ctx.textAlign='center';ctx.fillText('Стопы и таз устойчивы',375,1080);
}};
}
let active=false,dispose=()=>{},position=0,previous='',yaw=.18;
api.markup=type=>{if(type.startsWith('posture-'))active=true;else if(type!=='rest')active=false;if(!active)return baseMarkup(type);const name=type==='rest'?'posture-rest':type;return `<div class="posture-demo" data-posture="${name}"><canvas width="800" height="900" role="img" aria-label="Объёмная учебная фигура показывает упражнение стоя, видны спина, руки и ноги"></canvas></div>`};
api.controls=()=>!active?baseControls():`<div class="posture-controls"><p class="posture-phase"></p><div class="posture-camera"><button data-posture-control="back" type="button">Сзади</button><button data-posture-control="side" type="button">Сбоку</button><button data-posture-control="front" type="button">Спереди</button></div><div class="posture-buttons"><button data-posture-control="play" type="button">Ⅱ Показ</button><button data-posture-control="slow" type="button">Темп 0,5×</button><button data-posture-control="step" type="button">По шагам →</button><button data-posture-control="inset" type="button">Второй ракурс ✓</button></div><input type="range" aria-label="Положение демонстрации" min="0" max="1000" value="0"/><small>Зелёная линия — положение спины. Золотистая зона — область лопаток. Можно остановить показ и сменить ракурс.</small></div>`;
api.mount=root=>{dispose();if(typeof requestAnimationFrame!=='function'||!root.querySelector)return;for(const preview of root.querySelectorAll('.posture-demo')){if(!preview.closest('.wk-stage'))painter(preview.querySelector('canvas')).paint(preview.dataset.posture,.45,.18,false,false)}const demo=root.querySelector('.wk-stage [data-posture]');if(!demo){baseMount(root);return}baseMount({querySelector:()=>null});const type=demo.dataset.posture,control=root.querySelector('.posture-controls'),range=control.querySelector('input'),label=control.querySelector('.posture-phase'),play=control.querySelector('[data-posture-control="play"]'),render=painter(demo.querySelector('canvas'));if(previous!==type){position=0;yaw=type==='posture-chest'?Math.PI/2:.18}previous=type;let playing=!root.querySelector('.wk-paused'),speed=.5,zoom=false,side=true,last=0,frame,dead=false;if(matchMedia('(prefers-reduced-motion: reduce)').matches)playing=false;
function paint(){render.paint(type,position,yaw,zoom,side);range.value=position*1000;play.textContent=playing?'Ⅱ Показ':'▶ Показ';const n=Math.min(3,Math.floor(position*4));label.innerHTML=`<b>${n+1} / 4</b> ${(phases[type]||phases['posture-rest'])[n]}`;for(const id of ['back','side','front'])control.querySelector('[data-posture-control="'+id+'"]').classList.toggle('on',id==='back'?Math.abs(yaw)<.5:id==='side'?Math.abs(yaw-Math.PI/2)<.1:Math.abs(yaw-Math.PI)<.1)}
function loop(t){if(dead)return;if(playing&&last&&!document.hidden){position=(position+Math.min(80,t-last)/8000*speed)%1;paint()}last=t;frame=requestAnimationFrame(loop)}control.onclick=e=>{const b=e.target.closest('[data-posture-control]');if(!b)return;switch(b.dataset.postureControl){case 'play':playing=!playing;break;case 'slow':speed=speed===1?.5:1;b.textContent='Темп '+(speed===1?'1×':'0,5×');break;case 'step':playing=false;position=((Math.floor(position*4)+1)%4)/4+.03;break;case 'back':yaw=.18;break;case 'side':yaw=Math.PI/2;break;case 'front':yaw=Math.PI;break;case 'inset':side=!side;b.textContent=side?'Второй ракурс ✓':'Второй ракурс';break}paint()};range.oninput=()=>{playing=false;position=range.value/1000;paint()};paint();frame=requestAnimationFrame(loop);dispose=()=>{dead=true;cancelAnimationFrame(frame)};
};
})();
