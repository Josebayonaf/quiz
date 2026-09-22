/** Jumpers · private lead intake. Deploy as Apps Script web app only after running setup(). */
const HEADERS = ['Fecha','ID','Nombre','Correo','WhatsApp','Servicio','Etapa','Oferta','Invitaciones 30d','Conversaciones 30d','Canal','Proceso','Capacidad','Validación','Barrera','Dificultad percibida','Objetivo','Prioridad sugerida','Provisional','Ayuda buscada','Cuándo','Contexto','Resumen para setting','Consentimiento','Versión consentimiento','Origen','Estado','Responsable','Próxima acción','Fecha próxima acción','Último contacto','Notas'];
function setup() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  const book = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('Jumpers · Prospectos del diagnóstico');
  if (!id) props.setProperty('SHEET_ID', book.getId());
  const sheet = book.getSheetByName('Prospectos') || book.getSheets()[0].setName('Prospectos');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,HEADERS.length).setBackground('#12382c').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setColumnWidths(1,HEADERS.length,160);
  sheet.setColumnWidth(23,460);
  console.log('Hoja privada creada o recuperada: ' + book.getUrl());
}
function safeCell(value, max) {
  let text = String(value == null ? '' : value).slice(0, max || 1500);
  // Avoid formulas when writing visitor-controlled text to Sheets.
  if (/^[\s]*[=+@\-]/.test(text)) text = "'" + text;
  return text;
}
function json(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return json({ok:true,service:'Jumpers intake',version:'1.0'}); }
function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 18000) return json({ok:false,error:'invalid_request'});
    const p = JSON.parse(e.postData.contents);
    if (p.website || p.consent !== true || p.consentVersion !== '2026-09-22') return json({ok:false,error:'invalid_consent'});
    if (!/^[a-f0-9-]{36}$/i.test(p.id || '') || typeof p.name !== 'string' || !p.name.trim() || p.name.length>100 || typeof p.email !== 'string' || p.email.length>150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return json({ok:false,error:'invalid_contact'});
    if (p.source !== 'https://quiz.josebayonaf.com') return json({ok:false,error:'invalid_source'});
    if (!['oferta','ejecucion','captacion','conversion','organizacion'].includes(p.priority)) return json({ok:false,error:'invalid_priority'});
    const a = p.answers;
    if (!a || typeof a !== 'object' || !a.stage || !a.goal || !p.support || !p.timing) return json({ok:false,error:'invalid_context'});
    const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!id) return json({ok:false,error:'not_configured'});
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return json({ok:false,error:'busy'});
    const sheet = SpreadsheetApp.openById(id).getSheetByName('Prospectos');
    if (!sheet) return json({ok:false,error:'not_configured'});
    // Retry is safe: one submission ID produces one row, even after client timeouts.
    if (sheet.getLastRow()>1 && sheet.getRange(2,2,sheet.getLastRow()-1,1).createTextFinder(p.id).matchEntireCell(true).findNext()) return json({ok:true,id:p.id});
    const cache = CacheService.getScriptCache();
    const key = 'email:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,p.email.toLowerCase()));
    if (cache.get(key)) return json({ok:false,error:'try_later'});
    const row = [new Date(),p.id,p.name.trim(),p.email.trim(),p.phone,a.service,a.stage,a.clarity,a.execution,a.leads,a.channel,a.process,a.capacity,a.validation,a.barrier,a.perceived,a.goal,p.priority,p.provisional?'Sí':'No',p.support,p.timing,p.context,p.summary,'Sí',p.consentVersion,p.source,'Nuevo','','Revisar diagnóstico y contactar por el medio autorizado','','',''];
    sheet.appendRow(row.map((v,i)=>i===0?v:safeCell(v,i===22?6000:1500)));
    SpreadsheetApp.flush();
    cache.put(key,'1',60);
    return json({ok:true,id:p.id});
  } catch (err) { return json({ok:false,error:'unable_to_save'}); }
  finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
