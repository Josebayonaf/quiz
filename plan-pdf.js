/* Jumpers: local PDF generation. Personal data never leaves the browser here. */
(function(root){
'use strict';
const W=595,H=842,M=44;
function encode(s){return new TextEncoder().encode(s);}
function merge(parts){const n=parts.reduce((a,b)=>a+b.length,0),out=new Uint8Array(n);let pos=0;for(const p of parts){out.set(p,pos);pos+=p.length;}return out;}
function pdfFromPages(pages){
 const objects=[null,null],ids=[];
 const add=x=>{objects.push(x);return objects.length;};
 const str=x=>String(x).replace(/[^\x20-\x7e]/g,c=>encodeURI(c)).replace(/([\\()])/g,'\\$1');
 for(const page of pages){
  const image=add(merge([encode(`<< /Type /XObject /Subtype /Image /Width ${W*2} /Height ${H*2} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>\nstream\n`),page.bytes,encode('\nendstream')]));
  const commands=`q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`,content=add(encode(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`));
  const annots=page.links.map(l=>add(encode(`<< /Type /Annot /Subtype /Link /Rect [${l.x} ${H-l.y-l.h} ${l.x+l.w} ${H-l.y}] /Border [0 0 0] /A << /S /URI /URI (${str(l.url)}) >> >>`)));
  const id=add(encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${image} 0 R >> >> /Contents ${content} 0 R /Annots [${annots.map(i=>i+' 0 R').join(' ')}] >>`));ids.push(id);
 }
 objects[0]=encode('<< /Type /Catalog /Pages 2 0 R >>');objects[1]=encode(`<< /Type /Pages /Count ${ids.length} /Kids [${ids.map(i=>i+' 0 R').join(' ')}] >>`);
 const parts=[encode('%PDF-1.4\n')],offsets=[0];let size=parts[0].length;
 objects.forEach((obj,i)=>{offsets.push(size);const chunk=merge([encode(`${i+1} 0 obj\n`),obj,encode('\nendobj\n')]);parts.push(chunk);size+=chunk.length;});
 const xref=size;parts.push(encode(`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));return new Blob(parts,{type:'application/pdf'});
}
async function create(p,canvasFactory){
 const pages=[];
 function page(number,section){const canvas=canvasFactory?canvasFactory(W*2,H*2):document.createElement('canvas');canvas.width=W*2;canvas.height=H*2;const c=canvas.getContext('2d');c.scale(2,2);c.fillStyle='#f4f7f5';c.fillRect(0,0,W,H);c.fillStyle='#080c0c';c.fillRect(0,0,W,118);c.fillStyle='#39dfc2';c.fillRect(M,36,20,5);c.fillRect(M+15,36,5,20);c.font='bold 24px Arial';c.fillStyle='#ffffff';c.fillText('jumpers',M+34,58);c.font='9px Arial';c.fillStyle='#a4bcb3';c.fillText('POR JOSÉ BAYONA',M+35,74);c.fillStyle='#39dfc2';c.font='10px Arial';c.fillText(section.toUpperCase(),M,99);c.fillStyle='#71847d';c.font='9px Arial';c.fillText('TU SIGUIENTE SALTO · PLAN PERSONALIZADO',M,H-31);c.fillText(number+' / 3',W-M-28,H-31);c.fillStyle='#c8d9d0';c.fillRect(M,H-47,W-2*M,1);return {canvas,c,links:[]};}
 function text(pg,value,x,y,width=507,size=12,color='#203a31',weight='normal',line=size*1.45){const c=pg.c;c.font=`${weight} ${size}px Arial`;c.fillStyle=color;c.textBaseline='top';for(const para of String(value||'').split('\n')){let row='';for(const word of para.split(/\s+/)){if(c.measureText(word).width>width){if(row){c.fillText(row,x,y);y+=line;row='';}let chunk='';for(const ch of word){if(c.measureText(chunk+ch).width>width){c.fillText(chunk,x,y);y+=line;chunk='';}chunk+=ch;}row=chunk;continue;}const next=row?row+' '+word:word;if(row&&c.measureText(next).width>width){c.fillText(row,x,y);y+=line;row=word;}else row=next;}if(row)c.fillText(row,x,y);y+=line;}return y;}
 function rule(pg,y){pg.c.fillStyle='#28baa0';pg.c.fillRect(M,y,36,3);}
 function finish(pg){const b64=pg.canvas.toDataURL('image/jpeg',0.94).split(',')[1];const raw=atob(b64),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));pages.push({bytes,links:pg.links});}
 let pg=page(1,'Tu punto de partida'),y=148;
 y=text(pg,'Hola, '+p.name+'.',M,y,507,25,'#0a2018','bold',30)+14;
 y=text(pg,p.level,M,y,507,15,'#16846e','bold')+12;
 y=text(pg,p.context,M,y)+16;
 if(p.business){y=text(pg,'TU NEGOCIO',M,y,507,9,'#58796a','bold')+6;y=text(pg,p.business,M,y,507,11)+15;}
 rule(pg,y);y+=17;y=text(pg,'Tu prioridad: '+p.priority,M,y,507,20,'#0a2018','bold')+10;
 y=text(pg,p.title,M,y,507,14,'#203a31','bold')+8;y=text(pg,p.text,M,y,507,11)+12;
 y=text(pg,'Lo que nos cuentan tus respuestas',M,y,507,12,'#16846e','bold')+7;
 for(const r of p.reasons)y=text(pg,'• '+r.answer,M,y,507,11)+5;
 finish(pg);
 pg=page(2,'Siete días para pasar a la acción');y=146;
 y=text(pg,'Un paso concreto cada día.',M,y,507,23,'#0a2018','bold')+17;
 for(let i=0;i<p.days.length;i++){pg.c.fillStyle='#d5f6eb';pg.c.fillRect(M,y,35,29);text(pg,String(i+1).padStart(2,'0'),M+8,y+6,25,13,'#086750','bold');y=Math.max(y+36,text(pg,p.days[i],M+50,y,457,11,'#203a31','normal',15))+16;}
 finish(pg);
 pg=page(3,'Tu ejercicio y cómo continuar');y=146;
 y=text(pg,'Hazlo tuyo, '+p.name+'.',M,y,507,22,'#0a2018','bold',27)+16;
 y=text(pg,p.exercise,M,y,507,15,'#16846e','bold')+7;
 y=text(pg,p.prompt,M,y,507,11,'#203a31','normal',15)+16;
 rule(pg,y);y+=17;y=text(pg,'Qué observar al terminar la semana',M,y,507,14,'#16846e','bold')+7;y=text(pg,p.metric,M,y,507,11)+20;
 y=text(pg,p.route.title,M,y,507,18,'#0a2018','bold')+8;y=text(pg,p.route.text,M,y,507,11,'#203a31','normal',15)+16;
 for(const l of p.links){try{if(new URL(l.url).protocol!=='https:')continue;}catch{continue;}pg.c.fillStyle='#133d31';pg.c.fillRect(M,y,507,36);text(pg,l.label,M+12,y+11,483,11,'#ffffff','bold',14);pg.links.push({x:M,y,w:507,h:36,url:l.url});y+=45;}
 if(!p.links.length)y=text(pg,'Mientras se habilita el acceso, comienza con el día 1. Tu plan no depende de una compra.',M,y,507,10,'#58796a')+8;
 text(pg,'Orientación basada en tus respuestas. No garantiza ventas ni ingresos.\nquiz.josebayonaf.com',M,748,507,9,'#58796a','normal',13);
 finish(pg);return pdfFromPages(pages);
}
root.JumpersPDF={create};
if(typeof module!=='undefined')module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
