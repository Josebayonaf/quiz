from pathlib import Path
import re

p = Path('index.html')
original = p.read_text(encoding='utf-8')
html = original

def replace_once(before, after):
    global html
    assert html.count(before) == 1, f'Expected exactly one match: {before[:100]}'
    html = html.replace(before, after, 1)

replace_once(
    "text:'Revisemos tu diagnóstico, lo que está frenando tu avance y qué acompañamiento puede ayudarte a ordenar tu oferta, contenido y ventas. La conversación inicial es gratuita y no implica contratar. La mentoría tiene una inversión de USD 4.500.'",
    "text:'Hablemos de tu situación, revisemos tu diagnóstico y definamos juntos qué trabajar primero para estructurar tu negocio. La conversación inicial es gratuita.'"
)
old_evidence = '<section class="evidence diagnosis-evidence" aria-labelledby="evidence-title"><h2 id="evidence-title">Qué respuestas llevaron a esta prioridad</h2><p>${esc(p.text)}</p><ul>${p.reasons.map(x=>`<li>${esc(x.question)} <strong>${esc(x.answer)}</strong></li>`).join(\'\')}</ul></section>'
replace_once(old_evidence, '')
replace_once(
    "'Ya tienes conversaciones con posibles clientes, pero indicas que pocas avanzan después de presentar tu propuesta. Conviene revisar cómo explicas tu servicio, compruebas el encaje y das seguimiento.'",
    "'Estás conversando con posibles clientes, pero pocas personas avanzan después de conocer tu propuesta. Tu siguiente paso es revisar cómo explicas el valor de tu servicio, qué dudas aparecen y cómo retomas la conversación.'"
)
replace_once(
    "'Ya tienes conversaciones con posibles clientes, pero indicas que se detienen sin un siguiente paso acordado. Antes de aumentar el volumen de contenido, conviene revisar cómo presentas tu propuesta y das seguimiento.'",
    "'Hay personas interesadas en tu servicio, pero las conversaciones se quedan sin un siguiente paso. Empieza por definir cómo pasas del interés a una propuesta clara y cómo das seguimiento.'"
)
replace_once('priority:d.name,title:d.title,text:d.text,metric:d.metric',
             'priority:d.name,title:diagnosticIntro().title,text:diagnosticIntro().summary,metric:d.metric')
replace_once('<script src="plan-pdf.js"></script>', '<script src="plan-pdf.js?v=conversacion-20260928"></script>')

# Preserve the landing, all input questions, score assignment, segmentation and lead capture.
assert html.split('<script src="plan-pdf.js')[0] == original.split('<script src="plan-pdf.js')[0]
for start, end in [('const question=', 'function hasLeads('), ('function hasLeads(', 'const RESULTS='), ('function maturity(', 'const ROUTES='), ('const DAILY=', 'function personalPlan('), ('function captureContact(', 'const OUTBOX_PREFIX='), ('const OUTBOX_PREFIX=', 'function openPrivacy(')]:
    assert html[html.index(start):html.index(end)] == original[original.index(start):original.index(end)], start
assert 'La mentoría tiene una inversión' not in html
assert 'Qué respuestas llevaron a esta prioridad' not in html
p.write_text(html, encoding='utf-8')

p = Path('plan-pdf.js')
pdf = p.read_text(encoding='utf-8')
old = " y=text(pg,'Lo que nos cuentan tus respuestas',M,y,507,12,'#16846e','bold')+7;\n for(const r of p.reasons)y=text(pg,'• '+r.answer,M,y,507,11)+5;"
new = " y=text(pg,'Tu primer movimiento',M,y,507,12,'#16846e','bold')+7;\n y=text(pg,p.days[0],M,y,507,11);"
assert pdf.count(old) == 1
pdf = pdf.replace(old, new, 1)
p.write_text(pdf, encoding='utf-8')
print('Applied: no mentorship price in result/PDF; no repeated answer dump; concise conversion summary and practical PDF first step. Landing, questions, routing and lead capture preserved.')
