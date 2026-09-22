const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Function(js);
const core=js.slice(js.indexOf('const question='),js.indexOf('function show('));const ctx=vm.createContext({state:{answers:{}}});vm.runInContext(core,ctx);
const check=(a,key,provisional)=>{const r=vm.runInContext('diagnose('+JSON.stringify(a)+')',ctx);assert.equal(r.key,key);if(provisional!==undefined)assert.equal(r.provisional,provisional)};
check({stage:'idea',clarity:'mixed'},'oferta');
check({stage:'offer',clarity:'clear',leads:'zero',execution:'zero',barrier:'exposure',validation:'buyers'},'ejecucion');
check({stage:'sales',clarity:'clear',leads:'zero',execution:'many',barrier:'channel',validation:'buyers',channel:'content'},'captacion');
check({stage:'sales',clarity:'clear',leads:'some',execution:'few',process:'stuck',capacity:'reactive'},'conversion');
check({stage:'steady',clarity:'clear',leads:'many',execution:'many',process:'followup',capacity:'reactive'},'organizacion');
check({stage:'sales',clarity:'clear',leads:'unknown',execution:'unknown'},'organizacion',true);
check({stage:'offer',clarity:'clear',leads:'zero',execution:'many',validation:'none',barrier:'offer'},'oferta');
const q=vm.runInContext('Q',ctx);const result=vm.runInContext('RESULTS',ctx);let routes=0;
for(const stage of q.stage.options.map(x=>x[0]))for(const clarity of q.clarity.options.map(x=>x[0]))for(const leads of q.leads.options.map(x=>x[0]))for(const execution of q.execution.options.map(x=>x[0])){const a={service:'coach',stage,clarity,leads,execution,channel:'content',process:'followup',capacity:'routine',validation:'buyers',barrier:'channel',perceived:'oferta',goal:'validate'};const r=vm.runInContext('diagnose('+JSON.stringify(a)+')',ctx);assert(result[r.key]);assert.equal(result[r.key].plan.length,3);for(const id of r.reasons)assert(q[id]);routes++}
const backend=fs.readFileSync(__dirname+'/../backend/Code.gs','utf8');new Function(backend);const bctx=vm.createContext({ContentService:{createTextOutput:contents=>({setMimeType:()=>JSON.parse(contents)}),MimeType:{JSON:'json'}}});vm.runInContext(backend,bctx);
assert.equal(vm.runInContext("safeCell('=IMPORTXML(1)',100)",bctx),"'=IMPORTXML(1)");assert.equal(vm.runInContext("safeCell('  +123',100)",bctx),"'  +123");assert.equal(vm.runInContext("safeCell('José',100)",bctx),'José');assert.equal(vm.runInContext("doPost({postData:{contents:'{}'}}).ok",bctx),false);
console.log('PASS: frontend/backend syntax; 7 targeted diagnosis cases; '+routes+' combinations; Sheets formula escaping; invalid-consent rejection. Browser smoke tests are separate.');
