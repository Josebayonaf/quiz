/* Regression coverage for the approved diagnosis-first experience. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Function(js);
assert(html.includes('Haz el quiz gratuito y descubre <span class="accent">qué está frenando tus ventas'));
assert(html.includes('Hacer el quiz y ver mi diagnóstico'));
assert(html.includes('Quiz gratuito para coaches'));
assert(html.includes('Resultado al terminar'));
assert(!html.includes('Descubrir qué necesita mi negocio'));
assert.equal((html.match(/class="problem-card"/g)||[]).length,5);
assert(!html.includes('Hacer el quiz y recibir mi plan'));
assert(!html.includes('573183824316'));
assert(html.includes('https://wa.me/573015306201'));
for(const id of ['tu-situacion','tu-plan','como-funciona','sobre-jose','experiencias','tu-siguiente-paso'])assert(html.includes(`id="${id}"`));
assert(html.indexOf('id="tu-situacion"')<html.indexOf('id="tu-plan"'));
assert(html.indexOf('id="tu-plan"')<html.indexOf('id="como-funciona"'));
const state={answers:{},contact:{name:'María <img src=x onerror=alert(1)>'}};
const nodes={};const $=s=>nodes[s]??=( {innerHTML:'',onclick:null} );
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const c=vm.createContext({state,URL,$,esc,downloadPlan(){},show(){},renderStep(){},answerLabel:id=>state.answers[id]||'Sin respuesta'});
vm.runInContext(js.match(/const CONFIG = .*;/)[0]+js.slice(js.indexOf('const question='),js.indexOf('function show('))+js.slice(js.indexOf('function maturity('),js.indexOf('function planText(')),c);
const base={business:'Servicio de prueba',service:'coach',stage:'sales',clarity:'clear',pricing:'undefined',revenue:'under1k',execution:'few',leads:'some',channel:'content',process:'stuck',capacity:'routine',intent:'personal',timing:'now',commitment:'yes'};
const cases=[
 ['oferta',{stage:'idea',clarity:'mixed',leads:'zero',validation:'none',barrier:'offer'}],
 ['ejecucion',{stage:'offer',execution:'zero',leads:'zero',validation:'buyers',barrier:'exposure'}],
 ['captacion',{execution:'many',leads:'zero',validation:'buyers',barrier:'channel'}],
 ['conversion',{}],
 ['organizacion',{stage:'steady',process:'followup',capacity:'reactive',leads:'many'}]
];
for(const [priority,extra] of cases)for(const [budget,route,host] of [['none','youtube','www.youtube.com'],['500to1000','skool','www.skool.com'],['5000plus','mentoria','wa.me']]){
 state.answers={...base,...extra,budget};vm.runInContext('state.result=diagnose(state.answers);state.route=qualify(state.answers);renderResult()',c);
 assert.equal(state.result.key,priority);assert.equal(state.route,route);
 const rendered=nodes['#result'].innerHTML;
 assert(rendered.indexOf('id="result-title"')<rendered.indexOf('id="result-next-step-title"'));
 assert(rendered.indexOf('id="result-next-step-title"')<rendered.indexOf('id="download"'));
 assert.equal((rendered.match(/<h1\b/g)||[]).length,1);
 assert(!rendered.includes('<img src=x'));
 assert(rendered.includes('María &lt;img'));
 assert(rendered.includes('class="btn secondary" id="download"'));
 const links=vm.runInContext('routeLinks(state.route)',c);assert.equal(new URL(links[0].url).hostname,host);
 if(route==='mentoria'){
  const u=new URL(links[0].url);assert.equal(u.pathname,'/573015306201');
  const message=u.searchParams.get('text');assert(message.includes('mi prioridad es '+vm.runInContext('RESULTS[state.result.key].name',c)));
  assert(!message.includes('5000'));assert(!message.includes('María'));assert(!message.includes('Servicio de prueba'));
  assert(links[1].url.includes('calendar.app.google'));assert.equal(links[0].label,'Hablar con José de mi negocio');
 }
 assert.equal(vm.runInContext('personalPlan().days.length',c),7);
}
state.answers={...base,leads:'unknown',execution:'unknown',budget:'none'};
vm.runInContext('state.result=diagnose(state.answers);state.route=qualify(state.answers);renderResult()',c);
assert(nodes['#result'].innerHTML.includes('Orientación inicial: empieza por reunir datos'));
assert(nodes['#result'].innerHTML.includes('Faltan algunos registros'));
console.log('PASS: diagnosis-first hierarchy; 5 problem situations; 15 priority/support combinations; contextual WhatsApp without contact/financial data; escaped output; provisional result; 7-day plans retained.');
