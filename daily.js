(() => {
  'use strict';
  const key='nuviko_daily_v1', root=document.getElementById('daily-app');
  const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const label=k=>new Date(k+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
  const tasks=[
    ['Вода под рукой','Выпей стакан воды, когда почувствуешь жажду.'],
    ['Время для движения','Сделай короткую тренировку из раздела «Тренировки».'],
    ['Перерыв от экрана','На пару минут отложи экран и посмотри вдаль.'],
    ['Тёплый душ','Прими душ комфортной температуры, если хочется.'],
    ['Свежий воздух','Выйди на небольшую прогулку в удобном темпе.'],
    ['Спокойный вечер','Отложи телефон на 15 минут перед сном.'],
    ['Небольшой порядок','Удели 5 минут своему рабочему месту.'],
    ['Приятная пауза','Послушай любимую песню без других дел.'],
    ['Заметить хорошее','Запиши одно приятное событие дня.'],
    ['Размяться','Встань и мягко разомни плечи после сидения.'],
    ['Время для себя','Удели 10 минут любимому занятию.'],
    ['Связь с близкими','Напиши пару тёплых слов близкому человеку.']
  ];
  const quotes=['Маленькие шаги тоже ведут вперёд.','Забота о себе начинается с доступного шага.','Не идеальный день, а твой собственный ритм.','Завтра — ещё одна возможность попробовать.'];
  let all={},failed=false,owner='',state,tab='day',month=dayKey().slice(0,7),selected=dayKey(),toast='';
  try{all=JSON.parse(localStorage.getItem(key)||'{}')}catch{failed=true}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(all))}catch{failed=true}};
  function account(){try{return JSON.parse(localStorage.getItem('nuviko_demo_v1'))?.email||'local'}catch{return 'local'}}
  function makeDay(k){const n=Math.floor(new Date(k+'T12:00:00Z').getTime()/86400000);return {tasks:Array.from({length:5},(_,i)=>({id:(n+i*2)%tasks.length,status:'pending'})),sessions:{},closed:false,quote:quotes[n%quotes.length]}}
  const getDay=k=>{if(!state.days[k]){state.days[k]=makeDay(k);save()}return state.days[k]};
  const score=d=>Math.round(d.tasks.filter(t=>t.status==='done').length/d.tasks.length*100);
  const verdict=d=>score(d)>=80?'Молодец! Отличный день заботы о себе.':score(d)>=40?'Хорошее начало! Продолжай в своём темпе.':'Есть куда расти. Завтра попробуй начать с одного задания.';
  function sync(){
    const who=account();if(who!==owner||!state){owner=who;state=all[owner]||(all[owner]={days:{},active:dayKey(),settings:{sound:true,music:false,reminders:false,time:'19:00'},notices:{}});tab='day';selected=dayKey();month=selected.slice(0,7)}
    const d=getDay(state.active), now=new Date();
    if(!d.closed&&(state.active<dayKey(now)||(state.active===dayKey(now)&&now.getHours()===23&&now.getMinutes()===59))){d.closed=true;d.tasks.forEach(t=>{if(t.status==='pending')t.status='missed'});save();notify('Итог дня',verdict(d)+' '+score(d)+'% заданий.');toast='Твой итог дня готов';}
    return d;
  }
  function notify(title,body){if(!state.settings.reminders)return;let banner=document.getElementById('daily-notification');if(!banner){banner=document.createElement('div');banner.id='daily-notification';banner.setAttribute('role','status');document.body.append(banner)}banner.replaceChildren();const message=document.createElement('span');message.textContent=title+' · '+body;const close=document.createElement('button');close.className='btn btn-small btn-ghost';close.textContent='Закрыть';close.onclick=()=>banner.remove();banner.append(message,close);if('Notification' in window&&Notification.permission==='granted'){try{new Notification(title,{body,tag:'nuviko-'+title})}catch{}}}
  const minutes=ms=>`${Math.floor(ms/60000)} мин ${Math.floor(ms%60000/1000)} сек`;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function history(d){const sessions=Object.values(d.sessions);return sessions.length?sessions.map(s=>`<div class="daily-session"><strong>${escape(s.name)}</strong><span>${minutes(s.ms)} · ${s.complete?'завершена':'частично / в процессе'} · ${s.done||0} упражнений</span></div>`).join(''):'<p class="muted">Тренировок за этот день пока нет.</p>'}
  function render(){
    const d=sync();let body='';
    if(tab==='day')body=`<div class="daily-hero"><span class="eyebrow">${d.closed?'ИТОГ ДНЯ':'ТВОЙ ЕЖЕДНЕВНЫЙ РИТУАЛ'}</span><h2>${label(state.active)}</h2><p class="muted">${d.closed?verdict(d):'Пять маленьких шагов для себя. Отмечай выполненное и то, что не успел.'}</p><div class="daily-score">${score(d)}<small>% выполнено</small></div><div class="bar"><span style="width:${score(d)}%"></span></div><p class="note">${d.closed?'«'+d.quote+'»':'День завершается в 23:59 по времени устройства. После итога новый день открывается по кнопке.'}</p>${d.closed?`<button class="btn btn-primary" data-daily="next" ${state.active>=dayKey()?'disabled':''}>Следующий день →</button>${state.active>=dayKey()?'<p class="note">Новый день станет доступен после полуночи.</p>':''}`:''}</div><div class="daily-tasks">${d.tasks.map((t,i)=>`<article class="daily-task ${t.status}"><span class="daily-task-number">${t.status==='done'?'✓':t.status==='missed'?'−':String(i+1).padStart(2,'0')}</span><div><h3>${tasks[t.id][0]}</h3><p>${tasks[t.id][1]}</p><span class="note">${t.status==='done'?'Выполнено':t.status==='missed'?'Не успел':'Ещё впереди'}</span></div><div class="daily-task-actions"><button class="btn btn-small ${t.status==='done'?'btn-primary':'btn-ghost'}" data-task="${i}" data-status="done" aria-pressed="${t.status==='done'}" ${d.closed?'disabled':''}>✓ Сделал</button><button class="btn btn-small btn-ghost" data-task="${i}" data-status="missed" aria-pressed="${t.status==='missed'}" ${d.closed?'disabled':''}>Не успел</button></div></article>`).join('')}</div>`;
    if(tab==='calendar'){
      const start=new Date(month+'-01T12:00:00'),offset=(start.getDay()+6)%7,count=new Date(start.getFullYear(),start.getMonth()+1,0).getDate();
      const entry=state.days[selected], sessions=entry?Object.values(entry.sessions):[];
      body=`<div class="daily-hero"><div class="row"><button class="btn btn-ghost" data-month="-1" aria-label="Предыдущий месяц">←</button><h2>${start.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})}</h2><button class="btn btn-ghost" data-month="1" aria-label="Следующий месяц">→</button></div><div class="daily-calendar">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span class="note">${x}</span>`).join('')}${'<span></span>'.repeat(offset)}${Array.from({length:count},(_,i)=>{const k=month+'-'+String(i+1).padStart(2,'0'),v=state.days[k];return `<button class="daily-cell ${selected===k?'selected':''} ${k===dayKey()?'today':''}" data-date="${k}" aria-label="${label(k)}${v?', задания '+score(v)+'%':''}"><b>${i+1}</b><small>${v?(v.closed?score(v)+'%':'·'):'—'}</small>${v&&Object.keys(v.sessions).length?'<i>●</i>':''}</button>`}).join('')}</div><p class="note">● Есть тренировка · проценты — итог заданий · точка — день ещё открыт</p></div><div class="panel"><span class="eyebrow">${label(selected)}</span><h2>${entry?(entry.closed?score(entry)+'% · '+verdict(entry):'День ещё не завершён'):'Нет записей за этот день'}</h2>${entry?`<p class="muted">Задания: ${entry.tasks.filter(t=>t.status==='done').length} из ${entry.tasks.length} · Время занятий: ${minutes(sessions.reduce((a,s)=>a+s.ms,0))} (с отдыхом, без пауз)</p>${history(entry)}<div class="daily-history-tasks">${entry.tasks.map(t=>`<p>${t.status==='done'?'✓':t.status==='missed'?'−':'○'} ${tasks[t.id][0]} · ${t.status==='done'?'выполнено':t.status==='missed'?'не успел':'не отмечено'}</p>`).join('')}</div>`:''}</div>`;
    }
    if(tab==='settings')body=`${window.NuvikoAppearance?.markup()||''}<div class="daily-hero"><span class="eyebrow">ПОД ТВОЙ РИТМ</span><h2>Настройки</h2>${[['sound','Звуковые эффекты','Сигналы старта, последних секунд и завершения этапа.'],['music','Музыка во время тренировки','Спокойная фоновая мелодия. Останавливается на паузе и при выходе.'],['reminders','Напоминания','Напоминание о заданиях и итог дня.']].map(([k,title,desc])=>`<label class="daily-setting"><div><strong>${title}</strong><p class="muted">${desc}</p></div><input type="checkbox" data-setting="${k}" ${state.settings[k]?'checked':''} role="switch" aria-label="${title}"/></label>`).join('')}<label class="daily-setting"><strong>Время напоминания</strong><input type="time" id="reminder-time" value="${state.settings.time}"/></label><p class="note">Напоминания работают, пока сайт открыт. При разрешении браузера появится системное уведомление; иначе — сообщение на сайте. После закрытия сайта уведомления пока не доставляются.</p><p class="note">Данные сохраняются в этом браузере отдельно для твоего демо-аккаунта.</p></div>`;
    root.innerHTML=`<div class="daily-top"><button class="back-link" data-daily="back">← В кабинет</button><span class="pill">ТВОЙ РИТМ / NUVIKO</span></div><h1>${tab==='day'?'Мой день':tab==='calendar'?'Календарь прогресса':'Настройки'}</h1><div class="choice-tabs">${[['day','☀ Мой день'],['calendar','▦ Прогресс'],['settings','⚙ Настройки']].map(([k,t])=>`<button class="choice ${tab===k?'active':''}" data-tab="${k}">${t}</button>`).join('')}</div><p role="status" class="message success">${escape(toast)}</p>${failed?'<p role="alert">Не удалось сохранить данные. Проверь доступность хранилища браузера.</p>':''}${body}`;
  }
  let ctx,musicTimer,playing=false;
  function tone(freq,duration=.16,volume=.07){try{ctx ||= new (window.AudioContext||window.webkitAudioContext)();ctx.resume().catch(()=>{});const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(volume,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration)}catch{}}
  function sound(kind){sync();if(state.settings.sound)tone(kind==='finish'?880:kind==='count'?440:660)}
  let note=0;
  function music(on){playing=on;clearInterval(musicTimer);if(on&&state.settings.music){const play=()=>{if(!document.hidden)tone([174.61,220,261.63,220,196,246.94,293.66,246.94][note++%8],1.3,.018)};play();musicTimer=setInterval(play,1600)}}
  function workout(s){sync();const k=dayKey(new Date(s.at)),d=getDay(k),v=d.sessions[s.id]||(d.sessions[s.id]={name:s.name,ms:0,done:0,complete:false});v.ms+=s.ms||0;v.done=s.done||0;v.complete=v.complete||!!s.complete;save()}
  window.NuvikoDaily={sound,music,workout};
  root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sync();toast='';if(b.dataset.appearance){toast=window.NuvikoAppearance?.choose(b.dataset.appearance,b.dataset.value)?'Внешний вид сохранён':'Настройка применена, но сохранить её не удалось';render();return}if(b.dataset.tab)tab=b.dataset.tab;
    if(b.dataset.daily==='back'){document.querySelector('[data-go="dashboard"]').click();return}
    if(b.dataset.daily==='next'&&getDay(state.active).closed&&state.active<dayKey()){state.active=dayKey();getDay(state.active);save()}
    if(b.dataset.task!==undefined&&!getDay(state.active).closed){const t=getDay(state.active).tasks[Number(b.dataset.task)];t.status=t.status===b.dataset.status?'pending':b.dataset.status;if(t.status==='done')sound('finish');save()}
    if(b.dataset.month){const d=new Date(month+'-01T12:00:00');d.setMonth(d.getMonth()+Number(b.dataset.month));month=dayKey(d).slice(0,7)}if(b.dataset.date)selected=b.dataset.date;render()});
  root.addEventListener('change',async e=>{sync();const k=e.target.dataset.setting;if(k){state.settings[k]=e.target.checked;save();if(k==='music')music(playing);if(k==='reminders'&&e.target.checked&&'Notification' in window&&Notification.permission==='default'){try{await Notification.requestPermission()}catch{}}toast='Настройки сохранены';render()}if(e.target.id==='reminder-time'&&/^\d{2}:\d{2}$/.test(e.target.value)){state.settings.time=e.target.value;save()}});
  document.querySelectorAll('[data-daily-tab]').forEach(b=>b.addEventListener('click',()=>{sync();tab=b.dataset.dailyTab;toast='';render()}));
  setInterval(()=>{const before=state?.active+':'+state?.days[state.active]?.closed;sync();const now=new Date(),k=dayKey(now),time=now.toTimeString().slice(0,5);if(state.settings.reminders&&time>=state.settings.time&&time<'23:59'&&!state.notices[k]){state.notices[k]=true;toast='Время для себя: загляни в «Мой день» и отметь задания.';notify('Мой день',toast);save();if(document.getElementById('daily').classList.contains('active'))render()}if(before!==state.active+':'+getDay(state.active).closed)render()},1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
  render();
})();
