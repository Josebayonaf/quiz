/* Keep the result useful and conversation-first; do not quote the mentorship fee. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const state={answers:{},contact:{name:'Prueba'}};
const nodes={};const $=key=>nodes[key]??={innerHTML:''};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx=vm.createContext({state,URL,$,esc,downloadPlan(){},show(){},renderStep(){}});
vm.runInContext(js.match(/const CONFIG = .*;/)[0]+js.slice(js.indexOf('const question='),js.indexOf('function show('))+js.slice(js.indexOf('function maturity('),js.indexOf('function planText(')),ctx);
const base={business:'Servicio de prueba',service:'coach',stage:'sales',clarity:'clear',pricing:'undefined',revenue:'under1k',execution:'few',leads:'some',channel:'content',process:'stuck',capacity:'routine',intent:'personal',timing:'now',commitment:'yes'};
const cases=[['oferta',{stage:'idea',clarity:'mixed',leads:'zero',validation:'none',barrier:'offer'}],['ejecucion',{stage:'offer',execution:'zero',leads:'zero',validation:'buyers',barrier:'exposure'}],['captacion',{execution:'many',leads:'zero',validation:'buyers',barrier:'channel'}],['conversion',{}],['organizacion',{stage:'steady',process:'followup',capacity:'reactive',leads:'many'}]];
for(const [priority,extra] of cases)for(const [budget,route] of [['none','youtube'],['500to1000','skool'],['5000plus','mentoria']]){
 state.answers={...base,...extra,budget};
 vm.runInContext('state.result=diagnose(state.answers);state.route=qualify(state.answers);renderResult()',ctx);
 assert.equal(state.result.key,priority);assert.equal(state.route,route);
 const rendered=nodes['#result'].innerHTML;
 assert(!/USD|4\.500|Qué respuestas llevaron|evidence-title|diagnosis-evidence|no bastan para atribuirlo/.test(rendered));
 assert(rendered.includes('diagnosis-explanation'));
 assert(rendered.includes('Tu primer movimiento'));
 assert(rendered.indexOf('result-next-step-title')<rendered.indexOf('id="download"'));
 const plan=vm.runInContext('personalPlan()',ctx),intro=vm.runInContext('diagnosticIntro()',ctx);
 assert.equal(plan.text,intro.summary);assert.equal(plan.title,intro.title);
 assert.equal(plan.days.length,7);assert(!/USD|4\.500/.test(plan.route.text));
 assert(!plan.text.includes('no bastan para atribuirlo'));
 if(route==='mentoria'){
  assert(plan.route.text.includes('La conversación inicial es gratuita'));
  assert.equal(new URL(plan.links[0].url).pathname,'/573015306201');
 }
}
// Preserve qualification choices: asking about a budget is not quoting a fee.
assert(vm.runInContext('Q.budget.options.some(([value])=>value==="4500to5000")',ctx));
assert(html.includes('Haz el quiz gratuito y descubre'));
const pdf=fs.readFileSync(__dirname+'/../plan-pdf.js','utf8');
assert(pdf.includes('Tu primer movimiento'));assert(!pdf.includes('Lo que nos cuentan tus respuestas'));assert(!pdf.includes('for(const r of p.reasons)'));
new Function(js);new Function(pdf);
console.log('PASS: 15 diagnosis/support combinations; no mentorship fee in result or PDF data; no duplicated raw responses; practical next step; unchanged budget choices and quiz framing.');
