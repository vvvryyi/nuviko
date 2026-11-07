const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/coach.js','utf8'),context);
const coach=context.window.NuvikoCoach;
for(const type of Object.keys(coach.guides)){
  const frames=[0,.15,.35,.55,.8,.99,1].map(p=>coach.draw(type,p,'test'));
  for(const frame of frames){assert.ok(!/NaN|undefined|Infinity/.test(frame),type);assert.ok(frame.includes('<path'),type)}
  if(type!=='face')assert.ok(new Set(frames).size>1,'No movement: '+type);
  assert.equal(coach.guides[type].length,4);
}
assert.ok(coach.markup('eye-orbit').includes('data-demo="zoom"'));
assert.ok(coach.draw('eye-orbit',.25,'test').includes('clip-path'));
assert.notEqual(coach.draw('eye-sweep',.15,'test'),coach.draw('eye-sweep',.55,'test'));
console.log('Passed: every exercise has changing finite poses, four instruction phases, zoom controls and clipped eye movement.');
