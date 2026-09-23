/** Set SHEET_ID in Apps Script properties to the authorized PROSPECTOS spreadsheet. */
function setup(){const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)throw Error('Set SHEET_ID first');const sheet=SpreadsheetApp.openById(id).getSheetByName('Prospectos');if(!sheet||sheet.getRange('A1').getValue()!=='ID prospecto')throw Error('Unexpected schema');}
function safeCell(v,max){const t=String(v==null?'':v).slice(0,max||1500);return /^[\s]*[=+@\-]/.test(t)?"'"+t:t;}
function matchesCell(stored,raw){return String(stored)===String(raw)||String(stored)===safeCell(raw);}
function json(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return json({ok:true,service:'Jumpers intake',version:'2.0'});}
function doPost(e){let lock;try{
 if(!e?.postData||e.postData.contents.length>18000)return json({ok:false,error:'invalid_request'});
 const p=JSON.parse(e.postData.contents);
 if(p.website||p.consent!==true||p.consentVersion!=='2026-09-23-v3')return json({ok:false,error:'invalid_consent'});
 if(!/^[a-f0-9-]{36}$/i.test(p.id||'')||typeof p.name!=='string'||!p.name.trim()||p.name.length>100||typeof p.email!=='string'||p.email.length>150||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)||!/^\+[0-9 ()-]{8,22}$/.test(p.phone||''))return json({ok:false,error:'invalid_contact'});
 if(!/^[A-Z]{2}$/.test(p.country||'')||!/^\+\d{1,3}$/.test(p.dialCode||'')||!p.phone.startsWith(p.dialCode))return json({ok:false,error:'invalid_country'});
 if(p.source!=='https://quiz.josebayonaf.com'||!['contact','diagnosed','qualified'].includes(p.event))return json({ok:false,error:'invalid_source'});
 const a=p.answers||{},q=p.qualification||{};
 if(p.event!=='contact'&&!['oferta','ejecucion','captacion','conversion','organizacion'].includes(p.priority))return json({ok:false,error:'invalid_priority'});
 if(p.event==='qualified'&&(!['learn','community','personal'].includes(q.intent)||!['now','later','explore'].includes(q.timing)||!['yes','no'].includes(q.commitment)||!['free','community','ready','unsure'].includes(q.investment)))return json({ok:false,error:'invalid_qualification'});
 const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)return json({ok:false,error:'not_configured'});
 lock=LockService.getScriptLock();if(!lock.tryLock(10000))return json({ok:false,error:'busy'});
 const sheet=SpreadsheetApp.openById(id).getSheetByName('Prospectos');if(!sheet||sheet.getRange('A1').getValue()!=='ID prospecto')return json({ok:false,error:'schema'});
 const ids=sheet.getRange(2,1,999,1).getValues().flat();let row=ids.indexOf(p.id)+2;const existing=row>=2;
 if(!existing){if(p.event!=='contact')return json({ok:false,error:'contact_required'});const blank=ids.findIndex(v=>!v);if(blank<0)return json({ok:false,error:'capacity'});row=blank+2;
 sheet.getRange(row,1,1,5).setValues([[p.id,new Date(),safeCell(p.name),safeCell(p.email),safeCell(p.phone)]]);
 sheet.getRange(row,29).setValue(safeCell(JSON.stringify({contact:{country:p.country,countryName:p.countryName,dialCode:p.dialCode}}),6000));
 sheet.getRange(row,15,1,6).setValues([['Contacto captado','Sí',new Date(),p.consentVersion,p.source,'Nuevo']]);
 }else{if(!matchesCell(sheet.getRange(row,4).getValue(),p.email)||!matchesCell(sheet.getRange(row,5).getValue(),p.phone))return json({ok:false,error:'contact_mismatch'});if(sheet.getRange(row,16).getValue()!=='Sí')return json({ok:false,error:'consent_revoked'});}
 if(p.event!=='contact'){
 const service={coach:'Coaching o mentoría',consult:'Consultoría',therapy:'Terapia o acompañamiento',professional:'Otro servicio profesional'};
 const stage={idea:'Definiendo oferta',offer:'Oferta sin ventas',sales:'Ventas iniciales',steady:'Ventas recurrentes'};
 const priority={oferta:'Oferta',ejecucion:'Ejecución',captacion:'Captación',conversion:'Conversión',organizacion:'Organización'};
 const goals={validate:'Poner a prueba una oferta clara',launch:'Ofrecer con constancia',leads:'Más conversaciones pertinentes',sales:'Mejorar propuestas y seguimiento',order:'Ordenar un proceso sostenible'};
 sheet.getRange(row,6,1,4).setValues([[service[a.service]||'',stage[a.stage]||'',goals[a.goal]||'',priority[p.priority]]]);
 sheet.getRange(row,29).setValue(safeCell(JSON.stringify({contact:{country:p.country,countryName:p.countryName,dialCode:p.dialCode},answers:a}),6000));
 if(sheet.getRange(row,15).getValue()!=='Calificación completa')sheet.getRange(row,15).setValue('Diagnóstico completo');
 }
 if(p.event==='qualified'){
 sheet.getRange(row,10,1,4).setValues([[{learn:'Aprender gratis',community:'Comunidad',personal:'Mentoría personal'}[q.intent],{now:'Próximos 30 días',later:'Más adelante',explore:'Explorando'}[q.timing],q.commitment==='yes'?'Sí':'No',{free:'Gratis',community:'Membresía',ready:'Considera USD 4.500',unsure:'Por definir'}[q.investment]]]);
 sheet.getRange(row,15).setValue('Calificación completa');
 }
 SpreadsheetApp.flush();return json({ok:true,id:p.id});
 }catch(err){return json({ok:false,error:'unable_to_save'});}finally{if(lock?.hasLock())lock.releaseLock();}}
