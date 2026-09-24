const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const h=fs.readFileSync(__dirname+'/../index.html','utf8'),js=h.match(/<script>([\s\S]*?)<\/script>/)[1];
const state={answers:{},contact:{name:'María Fernanda'}};
const c=vm.createContext({state,URL,answerLabel:id=>state.answers[id]||id});
vm.runInContext(js.match(/const CONFIG = .*;/)[0]+js.slice(js.indexOf('const question='),js.indexOf('function show('))+js.slice(js.indexOf('function maturity('),js.indexOf('function renderResult(')),c);
const b=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/../backend/Code.gs','utf8'),b);
const base={stage:'sales',clarity:'clear',pricing:'charging',intent:'personal',timing:'now',commitment:'yes',budget:'5000plus',leads:'some',execution:'few',process:'stuck',capacity:'reactive'};
const expected={none:'youtube',under500:'youtube','500to1000':'skool','1000to2000':'skool','2000to4500':'mentoria','4500to5000':'mentoria','5000plus':'mentoria',unsure:'youtube'};
let n=0;for(const stage of ['idea','offer','sales','steady'])for(const clarity of ['clear','mixed','unclear'])for(const pricing of ['charging','testing','undefined'])for(const budget of Object.keys(expected))for(const intent of ['learn','community','personal'])for(const timing of ['now','later','explore'])for(const commitment of ['yes','no']){
 const a={...base,stage,clarity,pricing,budget,intent,timing,commitment};c.a=b.a=a;
 assert.equal(vm.runInContext('qualify(a)',c),expected[budget]);
 assert.equal(vm.runInContext('qualifyAnswers(a)',b),expected[budget]);n++;
}
for(const budget of [undefined,'','invalid']){c.a={...base,budget};assert.equal(vm.runInContext('qualify(a)',c),'youtube');}
state.answers={...base,stage:'idea',clarity:'unclear',budget:'2000to4500'};state.result=vm.runInContext('diagnose(state.answers)',c);state.route=vm.runInContext('qualify(state.answers)',c);
const starterPlan=vm.runInContext('personalPlan()',c);assert.equal(state.route,'mentoria');assert.equal(state.result.key,'oferta');assert.equal(starterPlan.level,'Construye tus bases');assert(starterPlan.links.some(x=>x.url.includes('calendar.app.google')));assert(starterPlan.links.some(x=>x.url.includes('wa.me')));
assert.equal(vm.runInContext('blocks().length',c),6);assert(!h.includes('id="route-form"'));assert(!h.includes('id="help-form"'));
console.log('PASS unified flow and '+n+' qualification cases, backend parity.');
if(process.argv.includes('--pdf'))(async()=>{const {createCanvas}=require('@napi-rs/canvas');const {create}=require('../plan-pdf.js');fs.mkdirSync('/tmp/jumpers-pdf',{recursive:true});for(const [i,stage] of ['idea','sales','steady'].entries()){state.answers={...base,stage,business:'Acompaño a profesionales para ordenar sus servicios y explicar su propuesta con claridad.'};if(i===2){state.contact.name='María Fernanda '.repeat(7).slice(0,100);state.answers.business='Acompañamiento profesional con un enfoque práctico para mejorar procesos y propuestas de servicio. '.repeat(5).slice(0,400);}state.result=vm.runInContext('diagnose(state.answers)',c);state.route=vm.runInContext('qualify(state.answers)',c);const p=vm.runInContext('personalPlan()',c);assert.equal(p.days.length,7);const blob=await create(p,createCanvas);fs.writeFileSync('/tmp/jumpers-pdf/plan-'+i+'.pdf',Buffer.from(await blob.arrayBuffer()));}console.log('PDF samples generated');})().catch(e=>{console.error(e);process.exitCode=1;});
