const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const store=new Map([['nuviko_demo_v1',JSON.stringify({email:'test@example.invalid'})]]);
let now=new Date(2026,10,7,23,58,0).getTime();
function boot(){
  const handlers={},timers=[];
  const root={innerHTML:'',addEventListener:(k,f)=>handlers[k]=f};
  const document={hidden:false,getElementById:id=>id==='daily-app'?root:{classList:{contains:()=>true}},querySelectorAll:()=>[],querySelector:()=>({click(){}}),addEventListener(){}};
  class Clock extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
  const window={};
  vm.runInNewContext(fs.readFileSync(__dirname+'/daily.js','utf8'),{document,window,Date:Clock,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setInterval:f=>{timers.push(f);return timers.length},clearInterval(){}});
  return {root,api:window.NuvikoDaily,click:dataset=>handlers.click({target:{closest:()=>({dataset})}}),tick:()=>timers[0](),change:(k,v)=>handlers.change({target:{dataset:{setting:k},checked:v}})};
}
const data=()=>JSON.parse(store.get('nuviko_daily_v1'))['test@example.invalid'];
let app=boot();assert.equal(data().active,'2026-11-07');assert.equal(data().days['2026-11-07'].tasks.length,5);
app.click({task:'0',status:'done'});app.click({task:'1',status:'missed'});
app=boot();assert.equal(data().days['2026-11-07'].tasks[0].status,'done');
now=new Date(2026,10,7,23,59,0).getTime();app.tick();assert.equal(data().days['2026-11-07'].closed,true);assert.ok(app.root.innerHTML.includes('20'));assert.ok(app.root.innerHTML.includes('Следующий день'));
app.click({task:'0',status:'missed'});assert.equal(data().days['2026-11-07'].tasks[0].status,'done');
app.click({daily:'next'});assert.equal(data().active,'2026-11-07');
now=new Date(2026,10,8,0,0,0).getTime();app.tick();assert.equal(data().active,'2026-11-07');
app.click({daily:'next'});assert.equal(data().active,'2026-11-08');assert.notDeepEqual(data().days['2026-11-08'].tasks.map(t=>t.id),data().days['2026-11-07'].tasks.map(t=>t.id));
app.api.workout({id:'a',name:'Ровная спина',ms:10000,at:now,done:1});app.api.workout({id:'a',name:'Ровная спина',ms:5000,at:now,done:2,complete:true});app.api.workout({id:'a',name:'Ровная спина',ms:0,at:now,done:2});assert.equal(data().days['2026-11-08'].sessions.a.ms,15000);assert.equal(data().days['2026-11-08'].sessions.a.complete,true);
app.click({tab:'calendar'});app.click({date:'2026-11-08'});assert.ok(app.root.innerHTML.includes('Ровная спина'));assert.ok(app.root.innerHTML.includes('15 сек'));
app.change('sound',false);app.change('music',true);app=boot();assert.equal(data().settings.sound,false);assert.equal(data().settings.music,true);
now=new Date(2026,10,12,12).getTime();app=boot();assert.equal(data().days['2026-11-08'].closed,true);app.click({daily:'next'});assert.equal(data().active,'2026-11-12');
store.set('nuviko_demo_v1',JSON.stringify({email:'other@example.invalid'}));app=boot();assert.ok(!app.root.innerHTML.includes('Ровная спина'));assert.ok(JSON.parse(store.get('nuviko_daily_v1'))['test@example.invalid'].days['2026-11-08'].sessions.a);
console.log('Passed: persistence, 23:59 closure, immutable results, midnight/manual rollover, new tasks, calendar sessions, settings, missed days and account isolation.');

