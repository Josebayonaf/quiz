const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const code=html.slice(html.indexOf("const OUTBOX_PREFIX="),html.indexOf('\nfunction openPrivacy'));
const values=new Map(),requests=[],resolvers=[];
const ctx={state:{leadId:'test-id',contact:{consent:true},answers:{}},CONFIG:{leadEndpoint:'https://example.com'},location:{origin:'https://quiz.josebayonaf.com'},localStorage:{get length(){return values.size},key:i=>[...values.keys()][i],getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},$:()=>({}),window:{addEventListener(){}},AbortSignal:{timeout(){}},setTimeout:()=>1,clearTimeout(){},fetch:(url,o)=>{requests.push(JSON.parse(o.body));return new Promise(resolve=>resolvers.push(()=>resolve({ok:true,json:async()=>({ok:true,id:'test-id'})})))}};
vm.createContext(ctx);vm.runInContext(code,ctx);
(async()=>{
await vm.runInContext("queueContact('contact')",ctx);
assert.equal(requests.length,1);assert.equal(values.size,1); // Advances while server has not responded.
ctx.state.answers={revenue:'1000'};await vm.runInContext("queueContact('diagnosed')",ctx);
assert.equal(values.size,2);assert.equal(requests.length,1); // Contact must arrive first.
resolvers.shift()();await new Promise(setImmediate);
assert.equal(requests[1].event,'diagnosed');assert.equal(values.size,1);
resolvers.shift()();await new Promise(setImmediate);assert.equal(values.size,0);assert.equal(ctx.state.contactSaved,true);
// A failed request remains durable and is retried with the same ID.
ctx.fetch=async()=>{throw Error('offline')};await vm.runInContext("queueContact('qualified')",ctx);await new Promise(setImmediate);assert.equal(values.size,1);
ctx.fetch=async(u,o)=>({ok:true,json:async()=>({ok:true,id:JSON.parse(o.body).id})});await vm.runInContext('flushOutbox()',ctx);assert.equal(values.size,0);
assert(html.includes("show('landing');"));assert(!html.includes('\ncaptureContact();'));assert(html.includes('rel="icon"'));
console.log('PASS: immediate enqueue, contact-first delivery, chained updates, durable retry, acknowledgement cleanup, landing and favicon.');
})().catch(e=>{console.error(e);process.exitCode=1});
