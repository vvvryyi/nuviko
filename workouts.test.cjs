const {strict:assert}=require('node:assert');
const vm=require('node:vm');
const fs=require('node:fs');
const storage=new Map([['nuviko_demo_v1',JSON.stringify({email:'test@example.invalid'})]]);
function boot(windowOptions={},fullscreenRequest,videoMock){
  let now=100000, tick, click, observer; const reports=[];
  const classes=new Set(),handlers={};
  const root={classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),toggle:(c,v)=>v?classes.add(c):classes.delete(c)},innerHTML:'',addEventListener:(type,fn)=>{handlers[type]=fn;if(type==='click')click=fn}};
  if(videoMock)root.querySelector=selector=>(selector==='#wk-training-video'||selector==='video')&&root.innerHTML.includes('wk-training-video')?videoMock:null;
  if(fullscreenRequest)root.requestFullscreen=fullscreenRequest;
  const view={classList:{contains:()=>true}};
  const doc={hidden:false,getElementById:id=>id==='workout-app'?root:id==='workouts'?view:null,addEventListener(){},querySelector:()=>({click(){}})};
  class Clock extends Date {static now(){return now}}
  const sandbox={Image:class{},document:doc,Date:Clock,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setInterval:fn=>{tick=fn},MutationObserver:class{constructor(fn){observer=fn}observe(){}},window:{NuvikoDaily:{workout:r=>reports.push(r),sound(){},music(){}},scrollTo(){},addEventListener(){},...windowOptions}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/greek-coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/real-coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/posture-coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/workouts.js','utf8'),sandbox);
  return {classes,tap:()=>click({target:{closest:selector=>selector==='.wk-video-viewport'?{}:null}}),touch:(type,points)=>handlers[type]({target:{closest:()=>({})},touches:points.map(x=>({clientX:x,clientY:0})),preventDefault(){}}),reports,html:()=>root.innerHTML,select:id=>click({target:{closest:()=>({dataset:{select:id}})}}),action:name=>click({target:{closest:()=>({dataset:{action:name}})}}),advance:seconds=>{now+=seconds*1000;tick()},doc,observer};
}

let app=boot();
for(const [id,count] of [['face',16],['eyes',6],['back',12]]){
  app.reports.length=0;app.select(id);app.action('start');
  assert.ok(app.html().includes('Этап 1 из '+count));
  assert.ok(!app.html().includes('Время выдохнуть'));assert.ok(!app.html().includes('Пропустить отдых'));
  assert.ok(!app.html().includes('mode-animation'));assert.ok(app.html().includes('id="wk-training-video"'));assert.ok(app.html().includes('assets/'+id+'-workout.mp4'));
  app.advance(10);app.action('pause');const ms=app.reports.reduce((sum,r)=>sum+r.ms,0);assert.equal(ms,10000);
  const rec=JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'][id].session;
  app.advance(100);assert.equal(app.reports.reduce((sum,r)=>sum+r.ms,0),ms);
  app=boot();app.select(id);app.action('start');assert.ok(app.html().includes('Этап 1 из '+count));
  assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'][id].session.remaining,rec.remaining);
  for(let i=0;i<count;i++){app.advance(100);app.action('next')}
  assert.ok(app.html().includes('Ты справился'));
  assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'][id].count,1);
  app.action('next');assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'][id].count,1);
  app.action('catalog');
}
assert.ok(app.html().includes('✓ 3/3'));
app.select('face');app.action('restart');app.action('pause');
const tag=app.html().match(/<video[^>]+>/)[0];assert.ok(!/\scontrols(?:\s|=|>)/.test(tag));
assert.ok(!app.html().includes('video-zoom'));
app.action('video-mute');assert.ok(app.html().includes('Выключить звук'));
for(let i=0;i<16;i++)app.action('skip');assert.ok(app.html().includes('ЧАСТИЧНОЕ ПРОХОЖДЕНИЕ'));
assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.count,1);
assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.lastAttempt.skipped,16);
// Old rest stage resumes at exercise 2 without losing exercise 1 or the attempt ID.
storage.set('nuviko_workouts_v1',JSON.stringify({'test@example.invalid':{face:{version:2,count:4,session:{version:2,index:1,remaining:3,results:['done'],attemptId:'existing'}}}}));
app=boot();app.select('face');app.action('start');assert.ok(app.html().includes('Этап 2 из 16'));
let session=JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.session;
assert.equal(session.remaining,30);assert.equal(session.attemptId,'existing');assert.deepEqual(session.results,['done']);
app.action('pause');app=boot();app.select('face');app.action('start');assert.ok(app.html().includes('Этап 2 из 16'));
// Old exercise stage keeps remaining time and skips.
storage.set('nuviko_workouts_v1',JSON.stringify({'test@example.invalid':{eyes:{version:2,session:{version:2,index:4,remaining:17,results:['done','done','skipped','done']}}}}));
app=boot();app.select('eyes');app.action('start');session=JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].eyes.session;
assert.equal(session.index,2);assert.equal(session.remaining,17);assert.deepEqual(session.results,['done','skipped']);
console.log('Passed: 34 consecutive exercises, video for all programs, no rest stages, pause/resume, actual time, complete/partial results, no duplicate completion, zoom/mute and migration of old rest/exercise sessions.');

app=boot();assert.ok(app.html().includes('eyes-cover.jpg'));assert.ok(app.html().includes('back-cover.jpg'));assert.ok(app.html().includes('face-cover.jpg'));
for(const id of ['eyes','back']){
  app=boot();app.select(id);app.action('restart');app.action('pause');
  assert.ok(app.html().includes('assets/'+id+'-workout.mp4'));
  assert.ok(!app.html().includes('video-zoom'));
  app.action('video-mute');assert.ok(app.html().includes('Выключить звук'));
  app.action('catalog');
}
console.log('Passed: three video covers, eyes/back sources and right-panel zoom/mute controls.');

app=boot();app.select('eyes');app.action('restart');app.action('video-fullscreen');
assert.ok(app.html().includes('video-fullscreen-exit'));assert.ok(!app.html().includes('wk-fs-next'));
app.advance(40);assert.ok(app.html().includes('wk-fs-next'));assert.ok(app.html().includes('Готов к следующему шагу?'));
app.action('next');assert.ok(app.html().includes('Этап 2 из 6'));assert.ok(!app.html().includes('wk-fs-next'));
for(let i=1;i<6;i++){app.advance(40);if(i<5)app.action('next')}
assert.ok(app.html().includes('Сохрани результат своего занятия.'));app.action('next');assert.ok(app.html().includes('Ты справился'));
console.log('Passed: fullscreen controls, completion prompt, next exercise, final completion and preserved progression.');

(async()=>{
  let requested=0,locked=0,unlocked=0;
  const mobile={matchMedia:()=>({matches:true}),screen:{orientation:{lock:async value=>{assert.equal(value,'landscape');locked++},unlock:()=>unlocked++}}};
  const phone=boot(mobile,async()=>{requested++});phone.select('face');phone.action('restart');phone.action('video-fullscreen');
  await new Promise(resolve=>setImmediate(resolve));assert.equal(requested,1);assert.equal(locked,1);
  phone.tap();phone.action('video-fullscreen-exit');assert.equal(unlocked,1);
  const desktop=boot({...mobile,matchMedia:()=>({matches:false})});desktop.select('eyes');desktop.action('restart');desktop.action('video-fullscreen');await new Promise(resolve=>setImmediate(resolve));assert.equal(locked,1);
  const denied=boot({...mobile,screen:{orientation:{lock:async()=>{throw Error('not supported')},unlock(){}}}},()=>Promise.reject(Error('fullscreen unavailable')));
  denied.select('back');denied.action('restart');denied.action('video-fullscreen');await new Promise(resolve=>setImmediate(resolve));denied.advance(30);assert.ok(denied.html().includes('wk-fs-next'));denied.action('video-fullscreen-exit');
  console.log('Passed: mobile landscape request after fullscreen, orientation unlock on exit, desktop unchanged and rejected fullscreen fallback.');
})().catch(e=>{console.error(e);process.exitCode=1});

const mobileHUD=boot({matchMedia:()=>({matches:true})});mobileHUD.select('face');mobileHUD.action('restart');mobileHUD.action('video-fullscreen');
assert.ok(mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.tap();assert.ok(!mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.advance(4);assert.ok(!mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.action('video-mute');mobileHUD.advance(4);assert.ok(!mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.advance(1);assert.ok(mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.advance(21);assert.ok(!mobileHUD.classes.has('wk-hud-hidden'));assert.ok(mobileHUD.html().includes('wk-fs-next'));
mobileHUD.advance(5);assert.ok(mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.tap();assert.ok(!mobileHUD.classes.has('wk-hud-hidden'));
mobileHUD.action('video-fullscreen-exit');assert.ok(!mobileHUD.classes.has('wk-hud-hidden'));
console.log('Passed: mobile HUD hidden on entry, tap to reveal, exact 5-second timeout, activity reset, completion prompt reveal, hiding while stopped and cleanup on exit.');

const pinch=boot({matchMedia:()=>({matches:true})});pinch.select('eyes');pinch.action('restart');pinch.action('video-fullscreen');
pinch.tap();assert.ok(!pinch.classes.has('wk-hud-hidden'));pinch.tap();assert.ok(pinch.classes.has('wk-hud-hidden'));
pinch.touch('touchstart',[0,100]);pinch.touch('touchmove',[0,150]);assert.ok(pinch.classes.has('wk-video-filled'));
pinch.touch('touchend',[]);pinch.tap();assert.ok(pinch.classes.has('wk-hud-hidden'));
pinch.advance(1);pinch.touch('touchstart',[0,150]);pinch.touch('touchmove',[0,90]);assert.ok(!pinch.classes.has('wk-video-filled'));
pinch.touch('touchend',[]);pinch.advance(1);pinch.tap();assert.ok(!pinch.classes.has('wk-hud-hidden'));
pinch.action('video-mute');assert.ok(!pinch.classes.has('wk-hud-hidden'));
console.log('Passed: pinch fill/fit, no zoom button, gesture does not trigger taps, video tap toggles HUD, control taps keep HUD visible.');

const events={};const video={readyState:0,duration:595,currentTime:0,seeking:false,paused:false,addEventListener:(name,fn)=>events[name]=fn,play(){this.paused=false;return Promise.resolve()},pause(){this.paused=true}};
const synced=boot({},null,video);synced.select('face');synced.action('restart');synced.advance(100);
assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.session.remaining,30);
video.readyState=4;events.loadedmetadata();video.currentTime=25;synced.advance(10);
assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.session.remaining,20);
synced.advance(100);assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.session.remaining,20);
video.readyState=1;synced.advance(100);assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.session.remaining,20);
video.readyState=4;synced.action('pause');assert.equal(JSON.parse(storage.get('nuviko_workouts_v1'))['test@example.invalid'].face.session.remaining,20);synced.action('pause');video.currentTime=45;events.timeupdate();assert.ok(synced.html().includes('ЭТАП ЗАВЕРШЁН'));assert.ok(video.currentTime>44);
synced.action('auto-next');assert.ok(synced.html().includes('wk-transition'));synced.advance(2);assert.ok(synced.html().includes('Этап 1 из 16'));synced.advance(1);assert.ok(synced.html().includes('Этап 2 из 16'));
assert.equal(video.currentTime,48);synced.advance(100);assert.ok(synced.html().includes('Этап 2 из 16'));
video.currentTime=78;events.timeupdate();synced.action('auto-next');synced.advance(2);assert.ok(synced.html().includes('Этап 2 из 16'));
console.log('Passed: media-based clock, loading/buffering do not advance time, no completion rewind, source-aligned auto advance, no premature transition and auto cancellation.');

const controls=boot();controls.select('face');controls.action('restart');assert.ok(!controls.html().includes('data-action="auto-next"'));assert.ok(!controls.html().includes('youtube.com'));assert.ok(!controls.html().includes('Техника в оригинальном видео'));
controls.advance(30);assert.ok(controls.html().includes('data-action="auto-next"'));controls.action('next');assert.ok(!controls.html().includes('data-action="auto-next"'));
controls.action('detail');assert.ok(!controls.html().includes('youtube.com'));
console.log('Passed: auto switch only at completion, hidden during exercises, 3-second transition and original video links removed.');
