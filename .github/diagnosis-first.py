"""Apply approved diagnosis-first copy while preserving quiz/qualification rules."""
from pathlib import Path
import hashlib
import re

p = Path('index.html')
original = p.read_text(encoding='utf-8')
raw = p.read_bytes()
assert hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest() == '686c2a636161e39d304643904f0a18c5da7da981', 'Unexpected base: review concurrent changes before applying'
html = original

def replace(old, new, count=1):
    global html
    assert html.count(old) == count, f'Expected {count} occurrences: {old[:100]}'
    html = html.replace(old, new)

replace('<title>Tu plan de acción de 7 días · Jumpers</title>', '<title>Descubre qué necesita tu negocio · Diagnóstico Jumpers</title>')
replace('content="Recibe tu plan de acción de 7 días para desbloquear tu negocio de servicios. Completa el quiz gratuito de Jumpers y descubre qué trabajar primero."', 'content="Descubre qué está frenando tus ventas y qué trabajar primero para conseguir clientes con más constancia. Diagnóstico gratuito para negocios de servicios, con acciones para los próximos 7 días."')
replace('<link rel="stylesheet" href="assets/reviews.css">', '<link rel="stylesheet" href="assets/reviews.css">\n<link rel="stylesheet" href="assets/diagnostico.css">')
hero = '''<section class="hero"><div class="hero-copy"><div class="eyebrow">Diagnóstico gratuito para coaches, mentores, consultores y profesionales de servicios</div><h1>Descubre qué está <span class="accent">frenando tus ventas</span> y qué trabajar primero para conseguir clientes con más constancia.</h1><p class="hero-symptoms">¿Publicas y no llegan consultas? ¿Tus prospectos se quedan en “lo voy a pensar”? ¿O sigues postergando tu oferta?</p><p class="desc">Responde el diagnóstico e identifica qué área necesita atención primero según tu situación. Además, recibe un paso a paso para empezar a trabajar en ella durante los próximos 7 días.</p><button class="btn" id="start">Descubrir qué necesita mi negocio <span class="arrow" aria-hidden="true">↗</span></button><p class="micro under-cta"><span>Gratis</span><span>Basado en tus respuestas</span><span>Una prioridad concreta</span></p></div>'''
match = re.search(r'<section class="hero"><div class="hero-copy">.*?(?=\n<div class="art")',html)
assert match
replace(match.group(),hero)
replace('<div class="mini-card"><b>7</b><span>DÍAS<br>UN FOCO CLARO ↗</span></div><div class="float-card"><span class="label">TU SIGUIENTE PASO</span><strong>Tu plan de acción<br>de 7 días.</strong>', '<div class="mini-card"><b>1</b><span>PRIORIDAD<br>CLARA ↗</span></div><div class="float-card"><span class="label">DEJA DE ADIVINAR</span><strong>Tu diagnóstico<br>de negocio.</strong>')
cta = '<button class="btn" type="button" data-start>Descubrir qué necesita mi negocio <span class="arrow" aria-hidden="true">↗</span></button>'
problems = '''<section class="problem-section" id="tu-situacion" aria-labelledby="problem-title">
 <div class="section-head"><div class="eyebrow">¿Te suena?</div><h2 id="problem-title">¿En cuál de estas situaciones está <span class="accent">hoy tu negocio?</span></h2></div>
 <div class="problem-grid">
  <article class="problem-card"><span class="num">01 / TU PROPUESTA</span><h3>“Sé ayudar, pero me cuesta explicar lo que vendo”.</h3><p>Tienes experiencia, herramientas y conocimientos. Pero cuando alguien pregunta por tu servicio, das una explicación larga y no queda claro qué resultado puede trabajar contigo.</p></article>
  <article class="problem-card"><span class="num">02 / TU CONTENIDO</span><h3>“Publico, pero casi nadie pregunta por mis servicios”.</h3><p>Inviertes tiempo en reels, historias y carruseles. Recibes algunas reacciones, pero pocas conversaciones con personas interesadas en contratarte.</p></article>
  <article class="problem-card"><span class="num">03 / TUS CONVERSACIONES</span><h3>“Me preguntan, envío información y la conversación se enfría”.</h3><p>Explicas tu propuesta y escuchas “lo voy a pensar”. Después no sabes cómo retomar la conversación ni qué está impidiendo avanzar.</p></article>
  <article class="problem-card"><span class="num">04 / TU EJECUCIÓN</span><h3>“Sigo preparándome para algo que nunca termino de lanzar”.</h3><p>Cambias la oferta, ajustas el perfil y guardas nuevas ideas. Termina la semana y todavía no publicaste esa invitación ni presentaste tu servicio.</p></article>
  <article class="problem-card"><span class="num">05 / TU ORGANIZACIÓN</span><h3>“Tengo clientes, pero todo depende de mí”.</h3><p>Entre atender, publicar, responder y vender, trabajas sobre la marcha. Las oportunidades se quedan sin seguimiento y cuesta sostener una rutina comercial.</p></article>
 </div>
 <div class="problem-close"><p>Puedes reconocerte en varias. La pregunta no es cuántas cosas necesitas mejorar, sino <strong>por cuál conviene empezar.</strong></p>__CTA__</div>
</section>
'''.replace('__CTA__',cta)
value = '''<section class="section deliverables" id="tu-plan" aria-labelledby="deliverables-title">
 <div class="section-head"><div class="eyebrow">El valor está en entender qué pasa</div><h2 id="deliverables-title">Antes de cambiar otra vez de estrategia, descubre <span class="accent">qué necesita atención de verdad.</span></h2><p>Si tu oferta no se entiende, publicar más no resuelve esa falta de claridad. Si las conversaciones se enfrían, atraer más interesados no sustituye un buen seguimiento.</p><p>Tu diagnóstico te ayuda a ordenar lo que ocurre entre tu oferta, la llegada de posibles clientes, tus conversaciones y tu forma de ejecutar.</p></div>
 <div class="deliverables-layout"><div class="deliverables-grid">
  <article class="deliverable"><span class="num">01 / DÓNDE MIRAR PRIMERO</span><h3>Identifica tu principal área de atención.</h3><p>Descubre si conviene empezar por aclarar tu oferta, generar conversaciones, mejorar tu proceso de venta, pasar a la acción u organizar lo que ya funciona.</p></article>
  <article class="deliverable"><span class="num">02 / POR QUÉ ESA PRIORIDAD</span><h3>Entiende qué señales explican tu resultado.</h3><p>No recibirás solamente una categoría. Verás qué respuestas llevaron a la recomendación y cómo se relacionan con tu situación.</p></article>
  <article class="deliverable"><span class="num">03 / TU SIGUIENTE MOVIMIENTO</span><h3>Deja de intentar resolver todo al mismo tiempo.</h3><p>Obtén una prioridad concreta y una primera acción para empezar a trabajar en ella.</p></article>
  <article class="deliverable"><span class="num">04 / DE LA CLARIDAD A LA ACCIÓN</span><h3>Llévalo a la práctica durante los próximos 7 días.</h3><p>Recibe el paso a paso, un ejercicio aplicado a tu negocio y una métrica para observar tu avance. Tu plan en PDF sigue incluido.</p></article>
 </div></div>
 <div class="diagnostic-shift"><span>De “no sé qué cambiar”</span><span aria-hidden="true">→</span><strong>A “sé qué priorizar, por qué y con qué acción empezar”.</strong></div>
 <div class="deliverables-cta">__CTA__<p>Diagnóstico gratuito · Basado en tus respuestas · Plan de acción incluido</p></div>
</section>
'''.replace('__CTA__',cta)
how = '''<section class="section" id="como-funciona"><div class="section-head"><div><div class="eyebrow">Tres pasos para empezar</div><h2>Así descubres <span class="accent">por dónde empezar.</span></h2></div></div><div class="cards"><article class="card"><span class="num">01 / TU SITUACIÓN REAL</span><h3>Cuéntanos qué está pasando.</h3><p>Responde sobre tu etapa, tu oferta, cómo llegan los interesados y qué ocurre en tus conversaciones.</p></article><article class="card"><span class="num">02 / TU DIAGNÓSTICO</span><h3>Descubre qué trabajar primero.</h3><p>Identifica tu prioridad y las respuestas que explican por qué conviene prestarle atención.</p></article><article class="card"><span class="num">03 / TU SIGUIENTE PASO</span><h3>Empieza con una dirección clara.</h3><p>Recibe tus acciones para 7 días y una recomendación para continuar con recursos gratuitos, comunidad o apoyo personal.</p></article></div></section>
'''
start = html.index('<section class="section" id="como-funciona">')
end = html.index('<section class="founder-section"', start)
html = html[:start] + problems + value + how + html[end:]
replace('Hacer el quiz y recibir mi plan', 'Descubrir qué necesita mi negocio', count=2)
replace('Un documento en PDF con el área que conviene trabajar primero, las respuestas que explican esa recomendación, acciones para cada uno de los próximos 7 días, un ejercicio práctico y una métrica para revisar tu avance.', 'Un diagnóstico orientativo basado en tus respuestas: el área que conviene priorizar, las señales que explican la recomendación y una primera acción. Además, recibirás un PDF con acciones para los próximos 7 días, un ejercicio práctico y una métrica para revisar tu avance.')
replace('No. El diagnóstico y tu plan son gratuitos. Según tus respuestas, te recomendaremos contenido gratuito, una comunidad de implementación o una sesión estratégica gratuita con José.', 'No. El diagnóstico y tu plan son gratuitos. Según tus respuestas, te recomendaremos recursos en YouTube, la comunidad Jumpers Club en Skool o una conversación personal para revisar qué acompañamiento puede ayudarte. Tú decides cómo continuar.')
final_cta = '''<section class="diagnostic-final" id="tu-siguiente-paso" aria-labelledby="final-title"><div class="eyebrow">Empieza por entender</div><h2 id="final-title">Antes de publicar más, cambiar tu oferta o comprar otra formación, <span class="accent">descubre qué necesita tu negocio.</span></h2><p>Identifica tu prioridad y empieza a trabajar en ella con una dirección concreta.</p>__CTA__<p class="micro">Gratis · Basado en tus respuestas · Sin compromiso de compra</p></section>
'''.replace('__CTA__',cta)
replace('</div>\n<section id="quiz"', final_cta + '</div>\n<section id="quiz"')
replace('<h1>Primero, conozcámonos.</h1><p class="intro">Déjanos tus datos y cuéntanos sobre tu negocio. Al terminar tendrás tu plan personalizado en PDF y una recomendación para seguir avanzando.</p>', '<h1>Empecemos por tu negocio.</h1><p class="intro">Déjanos tus datos para comenzar. Al terminar descubrirás qué área priorizar según tus respuestas, por qué merece atención y cómo dar el siguiente paso. Tu plan de 7 días en PDF también está incluido.</p>')
replace("'Ver mi siguiente paso <span aria-hidden=\"true\">↗</span>'", "'Descubrir mi resultado <span aria-hidden=\"true\">↗</span>'")

route_start = html.index('const ROUTES={')
route_end = html.index('const DAILY={', route_start)
routes = '''const ROUTES={
 youtube:{title:'Empieza a trabajar en tu siguiente paso con recursos gratuitos.',text:'Continúa con el contenido de José y utiliza tu diagnóstico como guía para elegir qué aplicar primero.',label:'Aprendizaje gratuito'},
 skool:{title:'No tienes que implementar todo esto solo.',text:'Conoce Jumpers Club, la comunidad donde trabajamos oferta, contenido y ventas para convertir lo que aprendes en acciones dentro de tu negocio.',label:'Implementación en comunidad'},
 mentoria:{title:'Hablemos personalmente y definamos cómo estructurar tu negocio.',text:'Revisemos tu diagnóstico, lo que está frenando tu avance y qué acompañamiento puede ayudarte a ordenar tu oferta, contenido y ventas. La conversación inicial es gratuita y no implica contratar. La mentoría tiene una inversión de USD 4.500.',label:'Conversación personal con José'}
};
function destination(url,label,secondary=false){try{const u=new URL(url);if(u.protocol!=='https:')return '';return `<a class="btn${secondary?' secondary':''}" href="${esc(u.href)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`}catch{return ''}}
function whatsappDestination(){
 const priority=RESULTS[state.result?.key]?.name;
 const message=priority?`Hola, José. Acabo de completar el diagnóstico y mi prioridad es ${priority}. Quiero conversar contigo sobre cómo estructurar mi negocio y trabajar en este punto. ¿Podemos revisar mi caso?`:'Hola, José. Quiero conversar contigo sobre cómo estructurar mi negocio. ¿Podemos revisar mi caso?';
 const url=new URL(CONFIG.whatsapp);url.searchParams.set('text',message);return url.href;
}
function routeLinks(route){if(route==='youtube')return [{url:CONFIG.youtube,label:'Ver recursos gratuitos en YouTube'}];if(route==='skool')return [{url:CONFIG.skool,label:'Quiero avanzar con la comunidad'}];return [{url:whatsappDestination(),label:'Hablar con José de mi negocio'},{url:CONFIG.booking,label:'Prefiero agendar una sesión'}];}
function routePanel({reminder=false}={}){
 const route=state.route||qualify(state.answers),r=ROUTES[route],links=routeLinks(route).map((l,i)=>destination(l.url,l.label,i>0)).join('');
 const reminders={
  youtube:{title:'Ya tienes una prioridad. Empieza a trabajar en ella.',text:'Explora los recursos gratuitos de José y elige uno que te ayude a aplicar tu siguiente acción.'},
  skool:{title:'Convierte tu diagnóstico en acción, acompañado.',text:'Conoce Jumpers Club en Skool y descubre cómo trabajar tu oferta, contenido y ventas con apoyo de la comunidad.'},
  mentoria:{title:'Hablemos de tu siguiente paso.',text:'Comparte tu diagnóstico por WhatsApp y revisemos qué apoyo puede ayudarte a estructurar tu negocio. También puedes agendar una sesión gratuita de 30 minutos.'}
 };
 const copy=reminder?reminders[route]:r,headingId=reminder?'result-reminder-title':'result-next-step-title';
 return `<section class="help-panel ${reminder?'route-reminder':'route-primary'}" aria-labelledby="${headingId}"><div class="eyebrow">${reminder?'AHORA, DA TU SIGUIENTE PASO':'CÓMO CONTINUAR CON TU DIAGNÓSTICO'}</div><h2 id="${headingId}">${esc(copy.title)}</h2><p class="route-context">${esc(copy.text)}</p><div class="result-actions">${links}</div>${route==='skool'?'<p class="micro">Conoce Jumpers Club en Skool.</p>':''}${links?'':'<p class="micro">Este acceso estará disponible próximamente. Tu diagnóstico y tu plan permanecen disponibles aquí.</p>'}</section>`;
}
'''
html = html[:route_start] + routes + html[route_end:]
result_start = html.index('function renderResult(){')
result_end = html.index('function planText(){',result_start)
result = '''function diagnosticIntro(){
 const a=state.answers,key=state.result.key;
 const titles={oferta:'Dar claridad a tu oferta.',ejecucion:'Convertir lo que postergas en acción.',captacion:'Generar conversaciones con posibles clientes.',conversion:'Avanzar tus conversaciones de venta.',organizacion:'Organizar un proceso que puedas sostener.'};
 const summaries={
  oferta:a.clarity!=='clear'||a.stage==='idea'?'Según tus respuestas, conviene concretar a quién ayudas, qué problema trabajas y cómo explicas tu servicio. Antes de buscar más alcance, necesitas una propuesta que puedas poner a prueba.':'Según tus respuestas, conviene contrastar tu propuesta con posibles compradores. Tu prioridad es escuchar qué entienden, qué necesitan y qué dudas aparecen antes de aumentar el alcance.',
  ejecucion:'Has reportado pocas invitaciones a conocer tu servicio y dificultades para dar ese paso. Conviene convertir el pendiente comercial en una acción pequeña y repetible.',
  captacion:'Según tus respuestas, conviene revisar cómo llegan personas interesadas a tu servicio y qué mensaje las invita a conversar. Tu siguiente prioridad es generar conversaciones pertinentes en un canal concreto.',
  conversion:a.process==='nosale'?'Ya tienes conversaciones con posibles clientes, pero indicas que pocas avanzan después de presentar tu propuesta. Conviene revisar cómo explicas tu servicio, compruebas el encaje y das seguimiento.':'Ya tienes conversaciones con posibles clientes, pero indicas que se detienen sin un siguiente paso acordado. Antes de aumentar el volumen de contenido, conviene revisar cómo presentas tu propuesta y das seguimiento.',
  organizacion:state.result.provisional?'Faltan algunos registros para distinguir con claridad dónde se detiene tu proceso comercial. El primer paso es hacer visibles tus oportunidades, sus siguientes acciones y sus fechas.':'Según tus respuestas, conviene hacer visible y ordenar tu proceso comercial. Reúne las oportunidades abiertas, define su siguiente acción y reserva un momento para darles seguimiento.'
 };
 return {title:titles[key],summary:summaries[key]};
}
function renderResult(){
 const p=personalPlan(),intro=diagnosticIntro();
 $('#result').innerHTML=`<section class="diagnosis-summary" aria-labelledby="result-title"><p class="diagnosis-greeting">Hola, <strong>${esc(p.name)}</strong>.</p><div class="eyebrow">TU DIAGNÓSTICO · BASADO EN TUS RESPUESTAS</div><h1 id="result-title" tabindex="-1">Tu prioridad hoy: <span class="accent">${esc(p.priority)}.</span></h1><p class="diagnosis-lead">${esc(intro.title)}</p><p class="diagnosis-explanation">${esc(intro.summary)}</p>${state.result.provisional?'<p class="diagnosis-provisional">Orientación inicial: empieza por reunir datos. Con un registro más completo podrás revisar esta prioridad.</p>':''}</section>${routePanel()}<section class="evidence diagnosis-evidence" aria-labelledby="evidence-title"><h2 id="evidence-title">Qué respuestas llevaron a esta prioridad</h2><p>${esc(p.text)}</p><ul>${p.reasons.map(x=>`<li>${esc(x.question)} <strong>${esc(x.answer)}</strong></li>`).join('')}</ul></section><section class="diagnosis-first-action" aria-labelledby="first-action-title"><div class="eyebrow">UN PASO CONCRETO PARA EMPEZAR</div><h2 id="first-action-title">Tu primer movimiento</h2><p>${esc(p.days[0])}</p></section><div class="result-top"><div><div class="eyebrow">${esc(p.level)}</div><h2>Tu diagnóstico, llevado a la práctica.</h2><p>${esc(p.context)}</p></div><div class="result-stamp" aria-hidden="true"><span>DE LA CLARIDAD A</span><strong>7</strong><span>DÍAS DE ACCIÓN</span></div></div><div class="result-actions plan-download"><button class="btn secondary" id="download">Guardar mi diagnóstico y plan en PDF ↓</button></div><p id="pdf-status" class="notice" role="status"></p><h2>Tu plan personalizado de 7 días</h2><div class="plan-grid">${p.plan.map((x,i)=>`<article class="card"><span class="num">${['DÍAS 1–2','DÍAS 3–5','DÍAS 6–7'][i]}</span><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></article>`).join('')}</div><div class="metric"><span class="icon" aria-hidden="true">↗</span><div><h3>La señal que vas a observar</h3><p>${esc(p.metric)}</p></div></div><details class="card"><summary>Ver mis acciones día a día</summary><ol>${p.days.map(x=>`<li style="margin:14px 0;line-height:1.7">${esc(x)}</li>`).join('')}</ol></details><div class="result-utility"><p class="micro">Diagnóstico orientativo y plan basados en tus respuestas. No garantizan ventas ni ingresos.</p><button class="text-btn" id="edit-answers">← Revisar mis respuestas</button></div>${routePanel({reminder:true})}`;
 $('#download').onclick=downloadPlan;$('#edit-answers').onclick=()=>{state.step=0;show('quiz');renderStep()};
}
'''
html = html[:result_start] + result + html[result_end:]
for begin,end in [('function diagnose(', 'const RESULTS='),('const Q={','function hasLeads('),('function qualify(', 'function qualificationPayload('),('const DAILY={','function renderResult(')]:
    if begin=='const DAILY={':
        before=original[original.index(begin):original.index('function renderResult(')]
        after=html[html.index(begin):html.index('function diagnosticIntro(')]
    else:
        before=original[original.index(begin):original.index(end,original.index(begin))]
        after=html[html.index(begin):html.index(end,html.index(begin))]
    assert before==after, begin
founder_pattern=r'<section class="founder-section"[\s\S]*?</section>'
assert re.search(founder_pattern,original).group()==re.search(founder_pattern,html).group()
review_pattern=r'<section class="reviews-section"[\s\S]*?</section>'
assert re.search(review_pattern,original).group().replace('Hacer el quiz y recibir mi plan','Descubrir qué necesita mi negocio')==re.search(review_pattern,html).group()
assert 'https://wa.me/573015306201' in html and '573183824316' not in html
p.write_text(html,encoding='utf-8')
print('Updated index.html; original diagnosis, qualification, consent, founder and reviews preserved.')
