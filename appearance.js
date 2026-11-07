(() => {
  'use strict';
  const key='nuviko_appearance_v1',themes={violet:'Фиолетовая',graphite:'Графит',light:'Светлая'},icons={nuviko:['Nuviko','assets/icon-nuviko.png'],portrait:['Портрет','assets/icon-portrait.png'],squidward:['Сквидвард','assets/icon-squidward.png'],marble:['Мрамор','assets/icon-marble.png']};
  let stored={};try{stored=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
  const state={theme:Object.hasOwn(themes,stored.theme)?stored.theme:'violet',icon:Object.hasOwn(icons,stored.icon)?stored.icon:'nuviko',density:stored.density==='compact'?'compact':'comfortable'};
  function apply(){
    document.documentElement.dataset.theme=state.theme;document.documentElement.dataset.density=state.density;
    const path=icons[state.icon][1];
    for(const rel of ['icon','apple-touch-icon']){let link=document.querySelector(`link[rel="${rel}"]`);if(!link){link=document.createElement('link');link.rel=rel;document.head.append(link)}link.href=path;link.type='image/png'}
    let meta=document.querySelector('meta[name="theme-color"]');if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.append(meta)}meta.content=state.theme==='light'?'#f5f1fb':state.theme==='graphite'?'#111216':'#080710';
    document.querySelectorAll('.brand-symbol,.brand-mini,.auth-mark').forEach(el=>{
      let img=el.querySelector('[data-site-icon]');if(!img){img=document.createElement('img');img.dataset.siteIcon='';img.alt='';if(el.classList.contains('brand-mini'))el.textContent='';el.prepend(img)}img.src=path;
    });
  }
  function choose(kind,value){if(kind==='theme'&&Object.hasOwn(themes,value)||kind==='icon'&&Object.hasOwn(icons,value)||kind==='density'&&['comfortable','compact'].includes(value)){state[kind]=value;apply();try{localStorage.setItem(key,JSON.stringify(state));return true}catch{return false}}return false}
  function markup(){return `<section class="appearance-panel"><span class="eyebrow">СДЕЛАЙ NUVIKO СВОИМ</span><h2>Внешний вид</h2><p class="muted">Твоя тема, твой ритм. Выбор сохраняется в этом браузере.</p><h3>Тема интерфейса</h3><div class="appearance-themes" role="group" aria-label="Тема интерфейса">${Object.entries(themes).map(([id,name])=>`<button class="appearance-theme ${state.theme===id?'selected':''}" data-appearance="theme" data-value="${id}" aria-pressed="${state.theme===id}"><span class="appearance-sample sample-${id}"><i></i><i></i><i></i></span><span>${name}</span><b>${state.theme===id?'✓':''}</b></button>`).join('')}</div><h3>Плотность интерфейса</h3><div class="choice-tabs" role="group" aria-label="Плотность интерфейса">${[['comfortable','Комфортная'],['compact','Компактная']].map(([id,name])=>`<button class="choice ${state.density===id?'active':''}" data-appearance="density" data-value="${id}" aria-pressed="${state.density===id}">${name}</button>`).join('')}</div><h3>Иконка сайта</h3><p class="note">Изменится значок вкладки и логотипы внутри сайта. На уже установленном ярлыке телефона значок может обновиться только после повторного добавления сайта.</p><div class="appearance-icons" role="group" aria-label="Иконка сайта">${Object.entries(icons).map(([id,[name,path]])=>`<button class="appearance-icon ${state.icon===id?'selected':''}" data-appearance="icon" data-value="${id}" aria-pressed="${state.icon===id}"><img src="${path}" alt="${name}" loading="lazy"/><span>${name}</span><b>${state.icon===id?'✓':''}</b></button>`).join('')}</div></section>`}
  window.NuvikoAppearance={choose,markup};apply();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
