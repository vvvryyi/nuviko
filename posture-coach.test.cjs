const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{},Image:class{}};for(const file of ['coach.js','greek-coach.js','real-coach.js','posture-coach.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
const api=ctx.window.NuvikoCoach,dist=(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i]));
for(const type of Object.keys(api.posturePhases)){
  let start=api.posturePose(type,0),moving=false;
  for(let i=0;i<=100;i++){
    const pose=api.posturePose(type,i/100);
    assert.equal(JSON.stringify(pose.feet),JSON.stringify(start.feet),type+' moved feet');
    assert.equal(JSON.stringify(pose.hips),JSON.stringify(start.hips),type+' moved pelvis');
    for(let j=0;j<2;j++){
      const arm=pose.arms[j];assert.ok(Math.abs(dist(arm.s,arm.e)-.30)<.00001,type+' upper arm length');assert.ok(Math.abs(dist(arm.e,arm.w)-.29)<.00001,type+' forearm length');
      assert.ok(arm.w.every(Number.isFinite),type+' nonfinite pose');
      if(dist(arm.w,start.arms[j].w)>.01)moving=true;
    }
  }
  if(type!=='posture-rest')assert.ok(moving,type+' static');
  assert.ok(api.markup(type).includes('data-posture'));
}
console.log('Passed: all 13 posture poses at 101 samples, constant arm lengths, fixed feet/pelvis, movement and scene routing.');
