/* Classical, warmly lit training character. The stage contains only the performer. */
(()=>{
const api=window.NuvikoCoach;
let serial=0,dispose=()=>{},position=0,previous='';
const body=t=>['back','shoulders','twist','neck','breathe','rest'].includes(t);
const view=(type,zoom)=>body(type)?(zoom?'65 80 270 280':'0 0 400 420'):(zoom?(type.startsWith('lips')||type.startsWith('tongue')?'137 132 126 115':'125 68 150 175'):'92 10 216 265');
const drawing=(type,p,id)=>api.draw(type,p,id);
api.markup=type=>{let id='greek'+(++serial);return `<div class="greek-demo ${type.startsWith('eye-')?'wk-eye-art':''}" data-greek="${type}" data-id="${id}"><svg viewBox="${view(type,false)}" role="img" aria-label="Светлый персонаж в классическом стиле показывает упражнение">${drawing(type,0,id)}</svg></div>`};
api.controls=()=>`<div class="greek-controls"><p class="greek-phase" aria-live="off"></p><div class="greek-buttons"><button type="button" data-greek-control="play">Ⅱ Показ</button><button type="button" data-greek-control="slow">Темп 0,5×</button><button type="button" data-greek-control="step">По шагам →</button><button type="button" data-greek-control="zoom">Крупнее</button></div><input type="range" aria-label="Положение демонстрации" min="0" max="1000" value="0"/><small>Показ движений можно остановить и рассмотреть. Таймер тренировки управляется отдельно.</small></div>`;
api.mount=root=>{dispose();if(typeof requestAnimationFrame!=='function'||!root.querySelector)return;const demo=root.querySelector('.wk-stage [data-greek]');if(!demo)return;
const type=demo.dataset.greek,id=demo.dataset.id,svg=demo.querySelector('svg'),control=root.querySelector('.greek-controls'),range=control.querySelector('input'),play=control.querySelector('[data-greek-control="play"]'),phase=control.querySelector('.greek-phase');
if(previous!==type)position=0;previous=type;let speed=.5,playing=!root.querySelector('.wk-paused'),zoom=false,last=0,frame,dead=false,lastPhase=-1;
if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)playing=false;
function paint(){svg.innerHTML=drawing(type,position,id);range.value=position*1000;play.textContent=playing?'Ⅱ Показ':'▶ Показ';const stage=Math.min(3,Math.floor(position*4));if(stage!==lastPhase){const guide=api.guides[type]||api.guides.face;phase.innerHTML=`<b>${stage+1} / 4</b> ${guide[stage]}`;lastPhase=stage}}
function loop(t){if(dead)return;if(playing&&last&&!document.hidden){position=(position+Math.min(80,t-last)/8000*speed)%1;paint()}last=t;frame=requestAnimationFrame(loop)}
control.onclick=e=>{const b=e.target.closest('[data-greek-control]');if(!b)return;switch(b.dataset.greekControl){case 'play':playing=!playing;break;case 'slow':speed=speed===1?.5:1;b.textContent='Темп '+(speed===1?'1×':'0,5×');break;case 'step':playing=false;position=((Math.floor(position*4)+1)%4)/4+.03;break;case 'zoom':zoom=!zoom;svg.setAttribute('viewBox',view(type,zoom));b.textContent=zoom?'Общий вид':'Крупнее'}paint()};
range.oninput=()=>{playing=false;position=range.value/1000;paint()};paint();frame=requestAnimationFrame(loop);dispose=()=>{dead=true;cancelAnimationFrame(frame)};
};
})();
