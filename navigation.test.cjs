const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const source=html.slice(html.indexOf('function go('),html.indexOf("document.querySelectorAll('[data-go]')"));
function boot(user,hash){
  const active=new Set(),changes=[];
  const context={user,location:{hash},views:['home','auth','dashboard','upload','result','pricing','workouts','nutrition','assistant','daily'],pendingUpload:false,
    $:id=>({classList:{toggle:(_,on)=>on?active.add(id):active.delete(id)}}),render(){},document:{querySelectorAll:()=>[]},window:{scrollTo(){}},
    history:{pushState(_,__,hash){context.location.hash=hash;changes.push('push')},replaceState(_,__,hash){context.location.hash=hash;changes.push('replace')}}};
  vm.createContext(context);vm.runInContext(source,context);
  return {context,active,changes,go:(view,history=false)=>context.go(view,history)};
}
for(const route of ['home','auth','invalid']){
  const app=boot({email:'demo@example.invalid',used:0},'#'+route);app.go(route,true);
  assert.deepEqual([...app.active],['dashboard']);assert.equal(app.context.location.hash,'#dashboard');assert.deepEqual(app.changes,['replace']);
}
for(const route of ['workouts','daily','nutrition','assistant']){
  const logged=boot({email:'demo@example.invalid'},'#'+route);logged.go(route,true);assert.deepEqual([...logged.active],[route]);
  const guest=boot(null,'#'+route);guest.go(route,true);assert.deepEqual([...guest.active],['home']);assert.equal(guest.context.location.hash,'#home');
}
const app=boot(null,'#home');app.go('home',true);assert.deepEqual([...app.active],['home']);
app.context.user={email:'demo@example.invalid'};app.go('home');assert.deepEqual([...app.active],['dashboard']);
app.go('auth');assert.deepEqual([...app.active],['dashboard']);
app.context.user=null;app.go('home');assert.deepEqual([...app.active],['home']);
app.go('result',true);assert.deepEqual([...app.active],['home']);
app.go('auth');assert.deepEqual([...app.active],['auth']);
console.log('Passed: logged-in landing/auth redirect, canonical bookmark/history URL, logo navigation, guest access, login/logout transitions and result access.');
