const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const storage=new Map();
function boot(fail=false){
 const links={},document={readyState:'complete',documentElement:{dataset:{}},querySelector:s=>links[s]||null,querySelectorAll:()=>[],createElement:()=>({}),head:{append(el){links[el.rel?`link[rel="${el.rel}"]`:'meta[name="theme-color"]']=el}}},window={};
 vm.runInNewContext(fs.readFileSync(__dirname+'/appearance.js','utf8'),{document,window,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('storage disabled');storage.set(k,v)}}});
 return {document,links,api:window.NuvikoAppearance};
}
let app=boot();assert.equal(app.document.documentElement.dataset.theme,'violet');assert.equal(app.links['link[rel="icon"]'].href,'assets/icon-nuviko.png');
for(const icon of ['portrait','squidward','marble','nuviko']){assert.equal(app.api.choose('icon',icon),true);assert.equal(app.links['link[rel="icon"]'].href,'assets/icon-'+icon+'.png');assert.equal(app.links['link[rel="apple-touch-icon"]'].href,'assets/icon-'+icon+'.png')}
app.api.choose('theme','light');app.api.choose('density','compact');app.api.choose('icon','marble');app=boot();
assert.equal(app.document.documentElement.dataset.theme,'light');assert.equal(app.document.documentElement.dataset.density,'compact');assert.equal(app.links['link[rel="icon"]'].href,'assets/icon-marble.png');
assert.ok(app.api.markup().includes('data-value="marble" aria-pressed="true"'));assert.equal(app.api.choose('icon','../bad'),false);
storage.set('nuviko_appearance_v1','{"theme":"bad","icon":"bad"}');app=boot();assert.equal(app.document.documentElement.dataset.theme,'violet');assert.equal(app.links['link[rel="icon"]'].href,'assets/icon-nuviko.png');
app=boot(true);assert.equal(app.api.choose('theme','graphite'),false);assert.equal(app.document.documentElement.dataset.theme,'graphite');
console.log('Passed: fourth image is default, all icons update favicon/touch icon, theme/density persistence, selected controls, invalid settings fallback and storage failure.');
