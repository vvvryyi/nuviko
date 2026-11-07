const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const context={window:{},Image:class{}};
for(const name of ['coach.js','greek-coach.js','real-coach.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/'+name,'utf8'),context);
const api=context.window.NuvikoCoach;
assert.equal(api.realMotion(0).amount,0);
assert.equal(api.realMotion(2/7).amount,1);
assert.equal(api.realMotion(4/7).amount,1);
assert.equal(api.realMotion(5/7).amount,1);
assert.equal(api.realMotion(1).amount,0);
assert.ok(api.realMotion(1/7).amount>0&&api.realMotion(1/7).amount<1);
assert.ok(api.realMotion(6/7).amount>0&&api.realMotion(6/7).amount<1);
for(const type of Object.keys(api.guides))assert.ok(api.markup(type).includes(body(type)?'data-greek':'data-real'),type);
function body(t){return ['back','shoulders','twist','neck','breathe'].includes(t)}
console.log('Passed: 2-second transition, 3-second hold, 2-second release, portrait scenes and posture fallback.');
