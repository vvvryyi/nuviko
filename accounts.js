(() => {
  const key='nuviko_accounts_v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
  const write=data=>localStorage.setItem(key,JSON.stringify(data));
  const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
  async function hash(password,salt){
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new Uint8Array(salt.match(/../g).map(v=>parseInt(v,16))),iterations:210000,hash:'SHA-256'},material,256));
  }
  async function authenticate(email,password,register){
    const users=read(),existing=users[email],now=new Date().toISOString();
    if(register&&existing)throw Error('Этот аккаунт уже существует в браузере. Перейди во вкладку «Вход».');
    if(!register&&!existing)throw Error('Аккаунт не найден в этом браузере. Создай аккаунт или импортируй свой локальный аккаунт.');
    if(existing&&await hash(password,existing.salt)!==existing.passwordHash)throw Error('Неверная почта или пароль.');
    if(!existing){const salt=hex(crypto.getRandomValues(new Uint8Array(16)));users[email]={email,salt,passwordHash:await hash(password,salt),role:'user',createdAt:now,credits:1,used:0};}
    users[email].lastLogin=now;write(users);
    const {salt,passwordHash,...profile}=users[email];return profile;
  }
  function sync(user){const users=read();if(users[user.email]){users[user.email].credits=user.credits;users[user.email].used=user.used;write(users)}}
  const isAdmin=user=>!!user&&user.role==='admin'&&read()[user.email]?.role==='admin';
  async function importAccount(file,password){
    if(file.size>16384)throw Error('Файл аккаунта слишком большой.');
    const record=JSON.parse(await file.text());
    if(record.format!=='nuviko-local-account-v1'||typeof record.email!=='string'||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)||!['admin','user'].includes(record.role)||!/^[a-f0-9]{32}$/.test(record.salt)||!/^[a-f0-9]{64}$/.test(record.passwordHash))throw Error('Некорректный файл аккаунта.');
    if(await hash(password,record.salt)!==record.passwordHash)throw Error('Для импорта введи пароль от этого аккаунта.');
    const users=read();if(users[record.email])throw Error('Аккаунт уже есть в этом браузере. Используй обычный вход.');
    users[record.email]={email:record.email,role:record.role,salt:record.salt,passwordHash:record.passwordHash,createdAt:record.createdAt||new Date().toISOString(),credits:1,used:0};write(users);
    return authenticate(record.email,password,false);
  }
  const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderAdmin(user){
    const root=document.getElementById('admin-app');if(!root)return;
    if(!isAdmin(user)){root.innerHTML='';return}
    const users=Object.values(read()),count=users.filter(u=>u.lastLogin?.slice(0,10)===new Date().toISOString().slice(0,10)).length;
    root.innerHTML=`<div class="admin-heading"><div><span class="eyebrow">NUVIKO / УПРАВЛЕНИЕ</span><h1>Твоё пространство<br><span class="gradient">под контролем.</span></h1><p class="muted">Локальные аккаунты и их активность в одном месте.</p></div><span class="admin-badge">♔ Администратор</span></div><div class="admin-notice"><strong>Локальная демо-панель</strong><p>Показаны только аккаунты, созданные или импортированные в этом браузере для этого адреса сайта. Это не общий список пользователей Nuviko. Доступ и данные пока не защищены сервером.</p></div><div class="admin-stats"><article><span>Аккаунты в браузере</span><strong>${users.length}</strong><small>Сохранённые регистрации</small></article><article><span>Входили сегодня</span><strong>${count}</strong><small>По времени устройства</small></article><article><span>Администраторы</span><strong>${users.filter(u=>u.role==='admin').length}</strong><small>Локальные роли</small></article></div><div class="panel admin-users"><div class="row"><div><span class="eyebrow">СООБЩЕСТВО</span><h2>Пользователи</h2></div><span class="pill">${users.length} аккаунтов</span></div><label class="admin-search">⌕ <input id="admin-search" type="search" placeholder="Найти по почте" aria-label="Поиск пользователей по почте"/></label><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Пользователь</th><th>Роль</th><th>Регистрация</th><th>Последний вход</th></tr></thead><tbody>${users.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).map(u=>`<tr data-email="${escape(u.email.toLowerCase())}"><td><span class="admin-avatar">${escape(u.email[0].toUpperCase())}</span><strong>${escape(u.email)}</strong>${u.email===user.email?'<small class="admin-you">Это ты</small>':''}</td><td><span class="pill">${u.role==='admin'?'Администратор':'Пользователь'}</span></td><td>${u.createdAt?new Date(u.createdAt).toLocaleDateString('ru-RU'):'Нет данных'}</td><td>${u.lastLogin?new Date(u.lastLogin).toLocaleString('ru-RU'):'Ещё не входил'}</td></tr>`).join('')}</tbody></table></div><p id="admin-empty" class="note hidden">По этому запросу никого не найдено.</p><p class="note">Почта не подтверждена. Пароли и их хеши в списке не отображаются.</p></div>`;
    root.querySelector('#admin-search').addEventListener('input',e=>{let visible=0;root.querySelectorAll('tbody tr').forEach(row=>{row.hidden=!row.dataset.email.includes(e.target.value.trim().toLowerCase());if(!row.hidden)visible++});root.querySelector('#admin-empty').classList.toggle('hidden',visible>0)});
  }
  window.NuvikoAccounts={authenticate,importAccount,sync,isAdmin,renderAdmin};
})();
