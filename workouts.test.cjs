const {strict:assert}=require('node:assert');
const vm=require('node:vm');
const fs=require('node:fs');
const storage=new Map([['nuviko_demo_v1',JSON.stringify({email:'test@example.invalid'})]]);
function boot(){
  let now=100000, tick, click, observer; const reports=[];
  const root={innerHTML:'',addEventListener:(type,fn)=>{if(type==='click')click=fn}};
  const view={classList:{contains:()=>true}};
  const doc={hidden:false,getElementById:id=>id==='workout-app'?root:id==='workouts'?view:null,addEventListener(){},querySelector:()=>({click(){}})};
  class Clock extends Date {static now(){return now}}
  const sandbox={Image:class{},document:doc,Date:Clock,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setInterval:fn=>{tick=fn},MutationObserver:class{constructor(fn){observer=fn}observe(){}},window:{NuvikoDaily:{workout:r=>reports.push(r),sound(){},music(){}},scrollTo(){},addEventListener(){}}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/greek-coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/real-coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/posture-coach.js','utf8'),sandbox);
  vm.runInNewContext(fs.readFileSync(__dirname+'/workouts.js','utf8'),sandbox);
  return {reports,html:()=>root.innerHTML,select:id=>click({target:{closest:()=>({dataset:{select:id}})}}),action:name=>click({target:{closest:()=>({dataset:{action:name}})}}),advance:seconds=>{now+=seconds*1000;tick()},doc,observer};
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
app.action('video-zoom');assert.ok(app.html().includes('wk-video-viewport is-zoomed'));
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
  app.action('video-zoom');assert.ok(app.html().includes('is-zoomed'));
  app.action('video-mute');assert.ok(app.html().includes('Выключить звук'));
  app.action('catalog');
}
console.log('Passed: three video covers, eyes/back sources and right-panel zoom/mute controls.');
