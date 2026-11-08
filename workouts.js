(() => {
  'use strict';
  const root = document.getElementById('workout-app');
  const exercise = (name, seconds, instruction, art, cue) => ({name, seconds, instruction, art, cue});
  const programs = [
{ id:'face',name:'Убрать жир с лица',tag:'ЛИЦО / КОМПЛЕКС ИЗ ВИДЕО',accent:'#c5a0ff',glow:'#8954d04a',art:'face',rest:5,version:2,desc:'16 этапов по ролику Ивана Красавина: гимнастика для губ, щёк и языка с мягким массажем в конце.',truth:'Адаптация ролика: 30 секунд на этап, без перерывов между упражнениями. Упражнения не обеспечивают локальное сжигание жира и не гарантируют изменение овала лица. Выполняй без максимального усилия.',prep:['Чистые руки и удобная посадка','Не сжимай зубы, не дави на глаза или шею','При боли в челюсти или шее пропусти движение'],steps:[
exercise('Губы буквой «О»',30,'Округли губы в небольшую букву «О» и мягко вытяни вперёд. Челюсть свободна, зубы не сжаты.','lips-o','Мягко вперёд · без усилия'),
exercise('Подбородок и язык',30,'Чуть приподними подбородок, вытяни губы и мягко высунь язык. Не запрокидывай голову. При напряжении шеи пропусти этап.','chin-tongue','Небольшой подъём · без залома шеи'),
exercise('Круг губами · вправо',30,'Вытяни губы и описывай ими небольшие круги: вправо, вниз, влево, вверх. Голова неподвижна. Направления указаны относительно тебя.','lips-cw','Твоё право → вниз → лево → вверх'),
exercise('Круг губами · влево',30,'Повтори небольшие круги в обратную сторону: влево, вниз, вправо, вверх. Не помогай головой.','lips-ccw','Твоё лево → вниз → право → вверх'),
exercise('Надуть и расслабить',30,'Слегка наполни щёки воздухом, затем отпусти его и расслабь лицо. Повторяй спокойно, без долгой задержки дыхания.','cheeks-pulse','Надуть → расслабить'),
exercise('Щёки с сопротивлением',30,'Слегка надуй щёки. Подушечками пальцев создай едва заметное сопротивление снаружи, удерживая воздух. Расслабляйся между попытками.','cheeks-fingers','Лёгкое касание · без сильного давления'),
exercise('Поворот головы · вправо',30,'Немного поверни голову к своему правому плечу и мягко вытяни губы. Плечи неподвижны, не усиливай растяжение.','head-right','К твоему правому плечу'),
exercise('Поворот головы · влево',30,'Повтори влево. Можно чуть приподнять подбородок, только если шее комфортно. Не запрокидывай голову и не тяни руками.','head-left','К твоему левому плечу'),
exercise('Щёки и ладони',30,'Легко положи ладони по бокам щёк, пальцами к вискам. Слегка надуй щёки и мягко удерживай воздух. Не дави на глаза.','cheeks-palms','Ладони по бокам · глаза свободны'),
exercise('Мягкое вытяжение шеи',30,'Слегка приподними подбородок и вытяни губы. Без запрокидывания головы и давления на шею. При дискомфорте пропусти.','chin-lips','Маленькая амплитуда · без усилия'),
exercise('Губы вправо и влево',30,'Вытяни губы и плавно перемещай их вправо и влево. Голова по центру, плечи опущены.','lips-side','Двигаются губы · голова неподвижна'),
exercise('Круг языком · справа налево',30,'С закрытым ртом проведи языком по внутренней поверхности губ и щёк по кругу, начиная справа. Медленно, не сжимая зубы. При усталости сделай паузу.','tongue-cw','Язык внутри рта · схема движения'),
exercise('Круг языком · слева направо',30,'Повтори круг языком в обратную сторону. Не дави на зубы. Челюсть расслаблена, при дискомфорте пропусти этап.','tongue-ccw','Обратное направление · без усилия'),
exercise('Удержание воздуха',30,'Слегка надуй щёки и легко коснись их пальцами. Удерживай воздух короткими попытками, расслабляясь между ними. Не сдавливай щёки сильно.','cheeks-hold','Мягкое удержание · дыши свободно'),
exercise('Вытягивание губ',30,'Мягко вытяни губы вперёд. Не напрягай всё лицо максимально. Чередуй лёгкое вытягивание с расслаблением.','lips-forward','Вперёд → расслабить'),
exercise('Завершающий массаж',30,'Чистыми пальцами очень легко проведи от переносицы по щекам к ушам, обходя глаза. Не растягивай кожу. При раздражении кожи пропусти массаж.','massage','Лёгкое скольжение · обходи глаза')
]},
    {id:'eyes',name:'Глаза охотника',tag:'ВЗГЛЯД / КОМПЛЕКС ИЗ ВИДЕО',accent:'#9bc5ed',glow:'#376fc64a',art:'eye-sweep',rest:10,version:2,desc:'6 этапов по ролику Cardio Cult: мягкие движения по области скул, лба и бровей, круги глазами.',truth:'Мягкая адаптация видео Cardio Cult: 40 секунд на упражнение, без перерывов между упражнениями. Без растягивания век и давления на глазные яблоки. Комплекс не гарантирует изменение формы глаз и не исправляет зрение.',prep:['Вымой руки, касайся кожи очень легко','Не надавливай на глазные яблоки и не тяни веки','При заболеваниях глаз или недавней операции сначала обсуди массаж с офтальмологом'],steps:[
      exercise('Скольжение по скуловой кости',40,'Положи подушечки указательных и средних пальцев на скуловую кость ниже глаз. Очень легко скользи к вискам. Не тяни нижние веки, не касайся самих глаз.','eye-sweep','От центра к вискам · не растягивай кожу'),
      exercise('Лёгкие касания под глазами',40,'Касайся подушечками пальцев только костного края ниже глаз. Легко приложи и отпусти пальцы, без нажима. Это мягкая замена надавливания из ролика.','eye-touch','Коснуться → отпустить · без давления'),
      exercise('Скольжение по щекам',40,'Положи подушечки пальцев на верхнюю часть щёк, ниже области глаз. Легко проведи к сторонам лица и отпусти. Не растягивай кожу, не подтягивай веки.','eye-cheek','По щекам к сторонам · лёгкое касание'),
      exercise('Плавные круги глазами',40,'Голова неподвижна. Медленно опиши глазами небольшой комфортный круг, затем смени направление. Мягко моргай между кругами. При боли, двоении или головокружении остановись.','eye-orbit','Маленький круг · затем в другую сторону'),
      exercise('Массаж лба к вискам',40,'Положи подушечки пальцев на лоб над переносицей. Очень легко веди вверх и затем по лбу к вискам. Не дави на глаза и не тяни брови вверх.','eye-forehead','Вверх по лбу → к вискам'),
      exercise('Скольжение вдоль бровей',40,'Чистыми подушечками указательных пальцев легко пройди по линии бровей от начала к хвостикам. Не нажимай на веки и не сдвигай их. Закончи спокойным морганием.','eye-brow','От начала бровей к хвостикам')
    ]},
    {id:'back',name:'Ровная спина',tag:'ОСАНКА / КОМПЛЕКС СТОЯ',accent:'#9fe4c9',glow:'#387f684a',art:'posture-pull',version:2,rest:10,desc:'12 этапов по видео Ksenia Calm: движения лопатками, раскрытие плеч и мягкие наклоны стоя.',truth:'Адаптация комплекса Ksenia Calm без перерывов между упражнениями. Анимация показывает ориентир техники, а не оценивает твои движения. Это общая разминка, а не лечение сколиоза или боли в спине.',prep:['Освободи пространство для рук, встань устойчиво','Стопы примерно на ширине таза, колени мягкие','Не делай через боль и не усиливай прогиб поясницы'],steps:[
exercise('Сгибание локтей',30,'Встань прямо и подними руки в комфортную высоту. Плавно опускай локти в стороны, приближая лопатки друг к другу. Верни руки вверх. Не подтягивай плечи к ушам и не прогибай поясницу.','posture-pull','Локти вниз · плечи вдали от ушей'),
exercise('Сгибание с раскрытием ладоней',25,'Повтори сгибание локтей. В нижней точке мягко разверни ладони наружу, затем верни руки вверх. Движение спокойное, корпус остаётся неподвижным.','posture-palms','Плавно разверни ладони · без рывка'),
exercise('Разведение рук в стороны',40,'Вытяни руки перед собой примерно на уровне плеч. Раскрой их в стороны до комфортного положения, мягко сводя лопатки. Верни вперёд. Держи рёбра над тазом, не выгибай поясницу.','posture-open','Двигаются плечи и лопатки · таз неподвижен'),
exercise('Замок за спиной · вверх-вниз',40,'Мягко соедини руки за спиной. Немного отведи их от таза и опусти обратно. Не поднимай руки через усилие. Если замок неудобен, держи ладони раздельно и уменьши амплитуду.','posture-lock-back','Небольшой подъём · не тяни плечи силой'),
exercise('Раскрываем окно',40,'Подними локти примерно до уровня плеч и согни руки. Раскрой плечи и предплечья наружу, затем верни в исходное положение. Не сдвигай таз и не поднимай плечи.','posture-window','Предплечья раскрываются · поясница спокойна'),
exercise('Пловец',40,'Выполняй медленные попеременные круги руками: одна поднимается, другая опускается. Корпус не раскачивается, дыхание свободное. При дискомфорте уменьши круг или пропусти этап.','posture-swim','Одна рука вверх · другая вниз'),
exercise('Замок над головой',40,'Подними руки вверх и мягко соедини ладони. Согни локти, опуская руки за голову, и плавно выпрями. Не дави на затылок. Можно разъединить ладони или уменьшить высоту.','posture-overhead','Локти вверх · не тяни шею'),
exercise('Махи руками · обе стороны',40,'Разведи руки в комфортную высоту. Выполняй плавные круговые движения, затем смени направление. Не делай резких махов, сохраняй устойчивое положение корпуса.','posture-circles','Плавные круги · затем обратное направление'),
exercise('Раскрытие грудной клетки',40,'Мягко округли только верх спины, затем расправь грудную клетку и потянись макушкой вверх. Руки свободно направлены вниз. Таз остаётся устойчивым, поясницу не переразгибай.','posture-chest','Работает верх спины · без прогиба поясницы'),
exercise('Наклон влево',25,'Подними правую руку и слегка наклони корпус влево. Оба бедра остаются над стопами, не разворачивай грудь к полу. Вернись в центр. Небольшого комфортного наклона достаточно.','posture-side-left','Правый бок вытягивается · стопы на полу'),
exercise('Наклон вправо',25,'Подними левую руку и повтори мягкий наклон вправо. Держи таз устойчиво, не заваливайся вперёд. Плавно вернись в центр, дыши свободно.','posture-side-right','Левый бок вытягивается · таз неподвижен'),
exercise('Дыхание и завершение',15,'Со спокойным вдохом подними руки в комфортную высоту. С выдохом опусти и расслабь плечи. Повтори без задержки дыхания.','posture-finish','Вдох — вверх · выдох — вниз')
    ]}
  ];
  function load(){try{return JSON.parse(localStorage.getItem('nuviko_workouts_v1'))||{}}catch{return {}}}
  let data=load(), selected=null, screen='catalog', index=0, remaining=0, running=false, deadline=0, storageFailed=false, results=[];
  for(const ownerData of Object.values(data)){
    for(const id of ['face','eyes','back']){if(ownerData[id] && ownerData[id].version!==2) ownerData[id]={version:2,previousProgramCount:ownerData[id].count||0};}
  }
  // Use the same local demo account as the main application.
  const account=()=>{try{return JSON.parse(localStorage.getItem('nuviko_demo_v1'))?.email||'local'}catch{return 'local'}};
  let owner=account();
  const records=()=>data[owner]||(data[owner]={});
  const record=()=>records()[selected.id]||(records()[selected.id]={});
  function save(){try{localStorage.setItem('nuviko_workouts_v1',JSON.stringify(data))}catch{storageFailed=true}}
  function stages(p){return p.steps}
  const duration=p=>{const sec=stages(p).reduce((n,s)=>n+s.seconds,0);return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')};
  const clock=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const sourceTimes=[15,48,83,119,155,190,224,258,294,328,364,400,433,468,502,538];
  const eyeSourceTimes=[5,55,105,155,205,255];
  const backSourceTimes=[8,37,63,111,158,205,252,297,344,391,414,437];
  const media={face:{file:'face-workout.mp4',cover:'face-cover.jpg',times:sourceTimes},eyes:{file:'eyes-workout.mp4',cover:'eyes-cover.jpg',times:eyeSourceTimes},back:{file:'back-workout.mp4',cover:'back-cover.jpg',times:backSourceTimes}};
  for(const p of programs)p.steps.forEach((step,i)=>{const times=media[p.id].times;if(times[i+1])step.seconds=Math.min(step.seconds,times[i+1]-times[i])});
  const cover=p=>`<div class="wk-cover"><img src="assets/${media[p.id].cover}" alt="${p.name} — кадр из видео тренировки" loading="lazy"/><span>▶ ВИДЕОТРЕНИРОВКА</span></div>`;
  const sourceLink=i=>{const back=selected?.id==='back',eye=selected?.id==='eyes';return `<a class="wk-source" href="https://www.youtube.com/watch?v=${back?'5mOpoYnXxpE':eye?'q7VMzvxWKsc':'T-W1o7AOEUg'}&t=${(back?backSourceTimes:eye?eyeSourceTimes:sourceTimes)[i]||0}s" target="_blank" rel="noopener">↗ Техника в оригинальном видео</a>`};
  const art=type=>window.NuvikoCoach.markup(type);
  const tip=()=>`<div class="wk-note">Двигайся мягко. При боли, головокружении или дискомфорте остановись. ${selected?.id==='eyes'?'При проблемах с глазами обсуди упражнения с офтальмологом. ':''}Следуй текстовой инструкции и выбирай комфортную амплитуду.<br>Материалы: <a href="https://www.nhs.uk/live-well/exercise/sitting-exercises/" target="_blank" rel="noopener">разминка NHS</a> · <a href="https://www.aao.org/eye-health/tips-prevention/computer-usage" target="_blank" rel="noopener">отдых от экрана, AAO</a>${storageFailed?'<br>Не удалось сохранить прогресс. Проверь доступность хранилища браузера.':''}</div>`;
  const top=()=>`<div class="wk-top"><button class="back-link" data-action="${screen==='catalog'?'dashboard':'catalog'}">← ${screen==='catalog'?'В кабинет':'Все программы'}</button><span class="wk-stat"><b>✓ ${programs.filter(p=>records()[p.id]?.count).length}/3</b> программ пройдено</span></div>`;
  let videoFilled=false,videoMuted=true,playedSeconds=0,lastVideoTime=null,autoAt=0,autoNext=false;
  try{autoNext=localStorage.getItem('nuviko_auto_next')==='1'}catch{}
  const autoControl=()=>`<button class="btn btn-ghost btn-small wk-auto ${autoNext?'enabled':''}" data-action="auto-next" aria-pressed="${autoNext}"><span class="wk-auto-dot"></span>Автопереход ${autoNext?'вкл.':'выкл.'}</button>`;
  function paintClock(){for(const id of ['wk-clock','wk-fs-clock']){const el=document.getElementById(id);if(el)el.textContent=clock(remaining)}}
  function finishStage(){
    if(!running)return;running=false;remaining=0;autoAt=autoNext?Date.now()+900:0;checkpoint();report();audio();window.NuvikoDaily?.sound('finish');render();revealHUD();
  }
  function sampleVideo(video){
    if(!running||video.seeking||video.readyState<2)return;
    const from=media[selected.id].times[index],seconds=stages(selected)[index].seconds;
    const position=Math.min(seconds,Math.max(0,video.currentTime-from));
    if(lastVideoTime!==null&&position>=lastVideoTime)report((position-lastVideoTime)*1000);
    lastVideoTime=position;playedSeconds=position;
    const next=Math.max(0,Math.ceil(seconds-position));
    if(next!==remaining){remaining=next;if(next>0&&next<=3)window.NuvikoDaily?.sound('count');paintClock();checkpoint()}
    if(position>=seconds-.04)finishStage();
  }
  let fullscreen=false,orientationLocked=false,hudHidden=false,hudHideAt=0;
  function setHUDHidden(hidden){
    hudHidden=hidden;root.classList?.toggle('wk-hud-hidden',hidden);
    root.querySelectorAll?.('.wk-fs-top,.wk-fs-bottom').forEach(el=>{el.inert=hidden});
  }
  function revealHUD(){
    if(!fullscreen||!mobileFullscreen())return;
    setHUDHidden(false);hudHideAt=Date.now()+5000;
  }
  const mobileFullscreen=()=>window.matchMedia?.('(pointer: coarse)').matches;
  async function lockLandscape(){
    if(!fullscreen||!mobileFullscreen()||!window.screen?.orientation?.lock)return;
    try{
      await window.screen.orientation.lock('landscape');
      if(fullscreen)orientationLocked=true;else window.screen.orientation.unlock();
    }catch{} // Portrait phones use the rotated CSS layout when orientation locking is unavailable.
  }
  function exitFullscreen(){
    if(orientationLocked){try{window.screen.orientation.unlock()}catch{}orientationLocked=false}
    setHUDHidden(false);hudHideAt=0;
    pinchStart=0;pinching=false;suppressTapUntil=0;
    fullscreen=false;root.classList?.remove('wk-fullscreen');document.body?.classList.remove('wk-fullscreen-open');
    if(document.fullscreenElement===root)document.exitFullscreen?.().catch(()=>{});
  }
  function openFullscreen(){
    if(screen!=='player')return;
    fullscreen=true;root.classList?.add('wk-fullscreen');document.body?.classList.add('wk-fullscreen-open');
    if(mobileFullscreen())setHUDHidden(true);
    if(root.requestFullscreen){try{Promise.resolve(root.requestFullscreen()).then(lockLandscape).catch(()=>{})}catch{}}else lockLandscape();
  }
  document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&fullscreen)exitFullscreen()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fullscreen)exitFullscreen()});
  const fullscreenHUD=()=>`<div class="wk-fs-top"><div><span class="wk-label">${selected.name} · ${index+1} / ${selected.steps.length}</span><h2>${stages(selected)[index].name}</h2></div><button class="btn btn-ghost btn-small" data-action="video-fullscreen-exit" aria-label="Выйти из полного экрана">✕ Закрыть</button></div><div class="wk-fs-bottom">${remaining===0?`<div class="wk-fs-next" role="status"><span class="wk-fs-check">✓</span><div><span class="wk-label">ЭТАП ЗАВЕРШЁН</span><h3>${stages(selected)[index+1]?'Готов к следующему шагу?':'Ты справился с тренировкой!'}</h3><p>${stages(selected)[index+1]?.name||'Сохрани результат своего занятия.'}</p></div><button class="btn btn-primary" data-action="next">${stages(selected)[index+1]?'Следующий этап →':'Завершить тренировку ✓'}</button>${autoControl()}</div>`:''}<div class="wk-fs-toolbar">${autoControl()}<span class="wk-fs-clock" id="wk-fs-clock">${clock(remaining)}</span>${remaining>0?`<button class="btn btn-ghost btn-small" data-action="pause">${running?'Ⅱ Пауза':'▶ Продолжить'}</button>`:''}<button class="btn btn-ghost btn-small" data-action="video-mute" aria-pressed="${videoMuted}">${videoMuted?'Включить звук':'Выключить звук'}</button></div></div>`;
  function mountVideo(){
    const video=root.querySelector?.('#wk-training-video');if(!video)return;
    video.muted=videoMuted;video.disablePictureInPicture=true;video.disableRemotePlayback=true;
    video.addEventListener('contextmenu',e=>e.preventDefault());
    const step=stages(selected)[index],from=media[selected.id].times[index]||0;lastVideoTime=playedSeconds;
    const seek=()=>{video.currentTime=Math.min(from+Math.min(playedSeconds,Math.max(0,step.seconds-.06)),Math.max(0,video.duration-.1));if(running)video.play().catch(()=>{const help=root.querySelector('#wk-video-help');if(help)help.textContent='Для запуска видео нажми «Пауза», затем «Продолжить» на панели справа.'})};
    video.addEventListener('loadedmetadata',seek,{once:true});if(video.readyState>=1)seek();
    video.addEventListener('timeupdate',()=>sampleVideo(video));
    video.addEventListener('ended',()=>{sampleVideo(video);if(running)finishStage()});
    video.addEventListener('error',()=>{const help=root.querySelector('#wk-video-help');if(help)help.textContent='Видео не загрузилось. Проверь соединение и открой тренировку снова.'});
  }
  function render(){
    root.querySelector?.('video')?.pause();
    let html=top();
    if(screen==='catalog')html+=`<div class="wk-heading"><span class="wk-label">MOVE / ТВОЁ ВРЕМЯ ДЛЯ СЕБЯ</span><h1>Маленький шаг.<br><span class="gradient">Большая забота о себе.</span></h1><p class="muted">Выбери свой фокус на сегодня. Короткие практики, понятные движения и спокойный темп — мы проведём тебя через каждый этап.</p></div><div class="wk-cards">${programs.map((p,i)=>`<article class="wk-card" style="--accent:${p.accent};--glow:${p.glow}"><span class="wk-number">0${i+1} / MOVE</span>${cover(p)}<div class="wk-card-body"><span class="wk-badge ${records()[p.id]?.count?'done':''}">${records()[p.id]?.count?'✓ ПРОЙДЕНО':p.tag}</span><h2>${p.name}</h2><p>${p.desc}</p><div class="wk-meta"><span>◷ ${duration(p)}</span><span>${p.steps.length} упражнений</span><span>Легко</span></div><button class="btn btn-ghost" data-select="${p.id}">${records()[p.id]?.session?'Продолжить тренировку':'Открыть программу'} <span>↗</span></button></div></article>`).join('')}</div><div class="wk-note">✦ Твой ритм — лучший ритм. Упражнения идут подряд. Всегда можно нажать паузу. Пройденные тренировки сохраняются в этом браузере.</div>`;
    else if(screen==='detail')html+=`<span class="wk-label">${selected.tag}</span><div class="wk-detail"><div><h1>${selected.name}</h1><p class="muted">${selected.desc}</p><div class="wk-facts"><div><strong>${duration(selected)}</strong><small>минут практики</small></div><div><strong>${selected.steps.length}</strong><small>упражнений</small></div><div><strong>Без</strong><small>перерывов между этапами</small></div></div><ul class="wk-prep">${selected.prep.map(t=>`<li>${t}</li>`).join('')}</ul><button class="btn btn-primary" data-action="start">${record().session?'Продолжить тренировку':'Начать тренировку'} →</button>${record().session?'<button class="wk-exit" style="margin-left:15px" data-action="restart">Начать заново</button>':''}</div><div style="--accent:${selected.accent};--glow:${selected.glow}">${cover(selected)}</div></div><div class="wk-note">${selected.truth}${['face','eyes','back'].includes(selected.id)?sourceLink(0):''}${record().count?`<br>✓ Пройдено ${record().count} раз · последний раз ${new Date(record().last).toLocaleDateString('ru-RU')}`:''}</div><h3 style="margin-top:30px">Твой маршрут</h3><div class="wk-outline">${selected.steps.map((s,i)=>`<div class="wk-step"><span>${String(i+1).padStart(2,'0')}</span><strong>${s.name}</strong><small>${s.seconds} сек</small></div>`).join('')}</div><div style="margin-top:22px">${tip()}</div>`;
    else if(screen==='player'){
      const list=stages(selected), s=list[index], ready=remaining===0;
      const videoActive=true;
      html+=`<span class="wk-label">${selected.name} / УПРАЖНЕНИЕ ${index+1} ИЗ ${selected.steps.length}</span><div class="wk-progress"><span style="width:${index/list.length*100}%"></span></div><div class="wk-progress-label"><span>Этап ${index+1} из ${list.length}</span><span>Твой комфортный темп</span></div><div class="wk-player"><div class="wk-stage wk-illustrated ${running?'':'wk-paused'}">${videoActive?`<div class="wk-video-wrap"><div class="wk-video-viewport "><video id="wk-training-video" src="assets/${media[selected.id].file}" poster="assets/${media[selected.id].cover}" muted playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback" tabindex="-1" preload="metadata" aria-label="Видео упражнения: ${s.name}"></video></div><p class="note" id="wk-video-help">Фрагмент текущего упражнения · В полном экране разведи два пальца, чтобы убрать поля; сведи, чтобы вернуть полный кадр.</p></div>`:art(s.art)}<span class="wk-stage-label">${s.cue}${['face','eyes','back'].includes(selected.id)?'<small>Видеопоказ · движение без усилия</small>':''}</span></div><div class="wk-coach"><span class="wk-badge">${ready?'✓ ЭТАП ЗАВЕРШЁН':'ПРАКТИКА'}</span><h2>${s.name}</h2><p>${s.instruction}</p>${['face','eyes','back'].includes(selected.id)?sourceLink(index):''}${videoActive?`<div class="wk-video-controls" role="group" aria-label="Управление видео"><button class="btn btn-ghost btn-small" data-action="video-fullscreen">⛶ На весь экран</button><button class="btn btn-ghost btn-small" data-action="video-mute" aria-pressed="${videoMuted}">${videoMuted?'Включить звук':'Выключить звук'}</button></div>`:window.NuvikoCoach.controls?window.NuvikoCoach.controls():''}<div class="wk-timer" id="wk-clock" role="timer" aria-label="Осталось времени">${clock(remaining)}</div><div class="wk-controls">${autoControl()}${ready?`<button class="btn btn-primary" data-action="next">${index===list.length-1?'Завершить тренировку ✓':'Следующий этап →'}</button>`:`<button class="btn btn-primary" data-action="pause">${running?'Ⅱ Пауза':'▶ Продолжить'}</button>`}${!ready?`<button class="btn btn-ghost" data-action="skip">Пропустить упражнение ↠</button>`:''}</div><div class="wk-next">${list[index+1]?`Далее: ${list[index+1].name}`:'Далее: твоя первая маленькая победа ✦'}</div><button class="wk-exit" data-action="detail">Выйти и сохранить прогресс</button></div></div><div class="wk-outline">${list.map((step,i)=>`<div class="wk-step ${results[i]==='skipped'?'skipped':i<index?'done':i===index?'active':''}"><span>${results[i]==='skipped'?'↠':i<index?'✓':String(i+1).padStart(2,'0')}</span><strong>${step.name}</strong><small>${results[i]==='skipped'?'Пропущено':step.seconds+' сек'}</small></div>`).join('')}</div><div style="margin-top:22px">${tip()}</div>`;
    }else {
      const done=selected.steps.filter((_,i)=>results[i]==='done').length;
      const skipped=selected.steps.length-done;
      html+=`<div class="wk-complete"><div class="wk-medal">${skipped?'✦':'✓'}</div><span class="wk-label">ТВОЁ ВРЕМЯ ДЛЯ СЕБЯ</span><h1>${skipped?'Практика завершена':'Ты справился. Отличный ритм!'}</h1><p class="muted">«${selected.name}»<br>${skipped?'Ты выбрал свой темп. К пропущенным упражнениям можно вернуться в новом прохождении.':'Все упражнения выполнены. Можно расслабиться!'}</p><div class="wk-facts" style="justify-content:center"><div><strong>${done} / ${selected.steps.length}</strong><small>выполнено</small></div><div><strong>${skipped}</strong><small>пропущено</small></div><div><strong>${record().count||0}</strong><small>полных прохождений</small></div></div><span class="wk-badge ${skipped?'':'done'}">${skipped?'↠ ЧАСТИЧНОЕ ПРОХОЖДЕНИЕ':'✓ ПРОЙДЕНО ПОЛНОСТЬЮ'}</span><div class="wk-outline">${selected.steps.map((step,i)=>`<div class="wk-step ${results[i]==='done'?'done':'skipped'}"><span>${results[i]==='done'?'✓':'↠'}</span><strong>${step.name}</strong><small>${results[i]==='done'?'Выполнено':'Пропущено'}</small></div>`).join('')}</div><div class="wk-controls"><button class="btn btn-primary" data-action="catalog">К программам →</button><button class="btn btn-ghost" data-action="restart">Повторить</button></div>${storageFailed?'<p class="note">Хранилище недоступно: результат сохранится только до закрытия страницы.</p>':''}</div>`;
    }
    if(screen==='player'&&autoAt)html+=`<div class="wk-transition" role="status"><span>✓ Этап выполнен</span><strong>${stages(selected)[index+1]?.name||'Тренировка завершена'}</strong><i></i></div>`;
    if(screen==='player')html+=fullscreenHUD();else if(fullscreen)exitFullscreen();
    root.innerHTML=screen==='player'?`<div class="wk-fs-surface">${html}</div>`:html;
    window.NuvikoCoach.mount(root);
    if(screen==='player'){mountVideo();setHUDHidden(hudHidden)}
  }
  let attemptId='', trackedAt=0;
  function report(ms=0,complete=false){
    if(!selected||!attemptId)return;
    window.NuvikoDaily?.workout({id:attemptId,name:selected.name,ms,at:Date.now(),done:selected.steps.filter((_,i)=>results[i]==='done').length,complete});
  }
  function track(){
    if(!running||!trackedAt)return;
    const video=root.querySelector?.('#wk-training-video');if(video){sampleVideo(video);return}
    const end=Math.min(Date.now(),deadline),ms=Math.max(0,end-trackedAt);
    if(ms)report(ms);trackedAt=end;
  }
  function audio(){window.NuvikoDaily?.music(running&&screen==='player')}
  function checkpoint(){if(screen==='player'&&selected){record().session={noRest:true,attemptId,index,remaining,playedSeconds,results,version:selected.version||1};save()}}
  function pause(){track();if(running){if(!root.querySelector?.('#wk-training-video'))remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));running=false}audio();root.querySelector?.('video')?.pause();checkpoint()}
  function start(fresh){
    const prior=!fresh&&record().session;
    let saved=prior&&(prior.version||1)===(selected.version||1)?prior:null;
    // Preserve completed exercises and resume at the next exercise when an old session was resting.
    autoAt=0;
    if(saved&&!saved.noRest){
      const next=Math.min(selected.steps.length-1,Math.ceil(saved.index/2));
      saved={...saved,noRest:true,index:next,remaining:saved.index%2?selected.steps[next].seconds:saved.remaining,results:(saved.results||[]).filter((_,i)=>i%2===0)};
    }
    index=saved&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<stages(selected).length?saved.index:0;
    remaining=saved&&Number.isFinite(saved.remaining)?Math.min(stages(selected)[index].seconds,Math.max(0,saved.remaining)):stages(selected)[index].seconds;
    playedSeconds=saved&&Number.isFinite(saved.playedSeconds)?Math.max(0,Math.min(stages(selected)[index].seconds,saved.playedSeconds)):stages(selected)[index].seconds-remaining;
    results=saved&&Array.isArray(saved.results)?[...saved.results]:Array.from({length:index},()=> 'done');
    attemptId=saved?.attemptId||('workout-'+Date.now()+'-'+Math.random().toString(36).slice(2));trackedAt=Date.now();
    screen='player';running=remaining>0;deadline=Date.now()+remaining*1000;record().version=selected.version||1;checkpoint();audio();window.NuvikoDaily?.sound('start');render();
  }
  function advance(skip){
    if(screen!=='player'||(!skip&&remaining>0))return;
    track();autoAt=0;
    results[index]=skip&&remaining>0?'skipped':'done';
    if(index===stages(selected).length-1){
      running=false;
      const done=selected.steps.filter((_,i)=>results[i]==='done').length;
      record().lastAttempt={date:new Date().toISOString(),done,skipped:selected.steps.length-done};
      if(done===selected.steps.length){record().count=(record().count||0)+1;record().last=new Date().toISOString()}
      delete record().session;save();screen='complete';report(0,true);window.NuvikoDaily?.sound('finish');
    }else{index++;playedSeconds=0;lastVideoTime=null;remaining=stages(selected)[index].seconds;running=true;deadline=Date.now()+remaining*1000;checkpoint()}
    trackedAt=Date.now();report();audio();render();window.scrollTo({top:0,behavior:'smooth'});
  }
  function action(name){
    if(name==='auto-next'){autoNext=!autoNext;try{localStorage.setItem('nuviko_auto_next',autoNext?'1':'0')}catch{}autoAt=autoNext&&screen==='player'&&remaining===0?Date.now()+900:0;render();return}

    if(name==='video-fullscreen'){openFullscreen();return}
    if(name==='video-fullscreen-exit'){exitFullscreen();return}
    if(name==='video-mute'){
      if(screen!=='player'||!selected)return;
      videoMuted=!videoMuted;
      const video=root.querySelector?.('#wk-training-video');
      if(video){video.muted=videoMuted;root.querySelectorAll('[data-action="video-mute"]').forEach(mute=>{mute.textContent=videoMuted?'Включить звук':'Выключить звук';mute.setAttribute('aria-pressed',String(videoMuted))})}else render();
      return;
    }
    if(name==='pause'&&screen==='player'&&remaining>0){if(running)pause();else{running=true;trackedAt=Date.now();deadline=Date.now()+remaining*1000;audio()}render();return}
    if(name==='next'||name==='skip'){advance(name==='skip');return}
    if(name==='start'||name==='restart'){start(name==='restart');window.scrollTo({top:0,behavior:'smooth'});return}
    pause();if(name==='dashboard'){document.querySelector('[data-go="dashboard"]').click();return}screen=name;render();window.scrollTo({top:0,behavior:'smooth'});
  }
  root.addEventListener('contextmenu',e=>{if(e.target.closest('.wk-video-viewport'))e.preventDefault()});
  let pinchStart=0,pinching=false,suppressTapUntil=0;
  const touchDistance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
  root.addEventListener('touchstart',e=>{
    if(!fullscreen||!e.target.closest('.wk-video-viewport')||e.touches.length!==2)return;
    pinchStart=Math.max(1,touchDistance(e.touches));pinching=true;e.preventDefault();
  },{passive:false});
  root.addEventListener('touchmove',e=>{
    if(!fullscreen||!pinching||e.touches.length!==2)return;
    e.preventDefault();const ratio=touchDistance(e.touches)/pinchStart;
    if(ratio>1.12||ratio<.88){videoFilled=ratio>1.12;root.classList?.toggle('wk-video-filled',videoFilled)}
    if(!hudHidden)hudHideAt=Date.now()+5000;
  },{passive:false});
  const endPinch=()=>{if(pinching){pinching=false;pinchStart=0;suppressTapUntil=Date.now()+500}};
  root.addEventListener('touchend',endPinch);root.addEventListener('touchcancel',endPinch);
  root.addEventListener('click',e=>{
    if(Date.now()<suppressTapUntil)return;
    const b=e.target.closest('button');
    if(fullscreen&&mobileFullscreen()){
      if(!b&&e.target.closest('.wk-video-viewport')){if(hudHidden)revealHUD();else setHUDHidden(true);return}
      const wasHidden=hudHidden;revealHUD();if(wasHidden)return;
    }
    if(!b)return;
    if(b.dataset.select){selected=programs.find(p=>p.id===b.dataset.select);screen='detail';render();window.scrollTo({top:0,behavior:'smooth'})}else if(b.dataset.action)action(b.dataset.action);
  });
  root.addEventListener('focusin',revealHUD);
  setInterval(()=>{
    if(fullscreen&&mobileFullscreen()&&!hudHidden&&Date.now()>=hudHideAt)setHUDHidden(true);
    if(screen!=='player')return;
    if(autoAt&&Date.now()>=autoAt){autoAt=0;if(autoNext&&remaining===0)advance(false);return}
    if(!running)return;
    const video=root.querySelector?.('#wk-training-video');if(video){sampleVideo(video);return}
    track();const next=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    if(next!==remaining){remaining=next;paintClock();checkpoint();if(remaining===0)finishStage()}
  },100);

  new MutationObserver(()=>{if(!document.getElementById('workouts').classList.contains('active')){if(fullscreen)exitFullscreen();if(running){pause();render()}}else if(owner!==account()){pause();owner=account();selected=null;screen='catalog';render()}}).observe(document.getElementById('workouts'),{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){pause();render()}});
  window.addEventListener('pagehide',pause);
  render();
})();
