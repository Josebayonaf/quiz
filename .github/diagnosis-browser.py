import threading,functools,http.server,json
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright
root=Path.cwd();out=root/'diagnostic-checks';out.mkdir(exist_ok=True)
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8765),functools.partial(Handler,directory=str(root)))
threading.Thread(target=srv.serve_forever,daemon=True).start()
BASE='http://127.0.0.1:8765/'
errors=[];intake=[]
def intake_mock(route):
 data=json.loads(route.request.post_data or '{}');intake.append(data)
 route.fulfill(status=200,content_type='application/json',body=json.dumps({'ok':True,'id':data.get('id')}),headers={'Access-Control-Allow-Origin':'*'})
def setup(context):
 context.route('https://script.google.com/macros/s/**',intake_mock)
 context.route('https://drive.google.com/file/d/**/preview',lambda r:r.fulfill(status=200,content_type='text/html',body='<html><body>Mocked external player</body></html>'))
def complete(page,answers):
 page.goto(BASE);page.locator('#start').click()
 assert page.locator('#contact-form h1').inner_text()=='Empecemos por tu negocio.'
 page.locator('#contact-name').fill('Prueba de interfaz')
 page.locator('#contact-country').select_option('CO')
 page.locator('#contact-phone').fill('3000000000')
 page.locator('#contact-email').fill('prueba@example.com')
 page.locator('[name=consent]').check();page.locator('.intake-submit').click()
 page.locator('#quiz-form').wait_for(state='visible')
 page.locator('#next').click();assert page.locator('#quiz-error').inner_text()
 for i in range(6):
  for name,val in answers.items():
   loc=page.locator(f'#questions [name="{name}"]')
   if loc.count():
    if loc.evaluate('(e)=>e.tagName')=='SELECT': loc.select_option(val)
    else: loc.fill(val)
  page.locator('#next').click()
 page.locator('#result-title').wait_for(state='visible')
 assert page.locator('#result h1').count()==1
 assert page.locator('.route-primary').bounding_box()['y']>page.locator('.diagnosis-summary').bounding_box()['y']
 assert page.locator('#download').get_attribute('class')=='btn secondary'
 assert page.evaluate('personalPlan().days.length')==7
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 return page.evaluate('({priority:state.result.key,route:state.route})')
base=dict(business='Ayudo a profesionales a ordenar su servicio.',service='coach',stage='sales',clarity='clear',revenue='under1k',pricing='undefined',execution='few',leads='some',channel='content',process='stuck',capacity='routine',perceived='conversion',goal='sales',intent='personal',timing='now',commitment='yes',budget='5000plus')
cases=[('oferta',{**base,'stage':'idea','clarity':'mixed','leads':'zero','execution':'zero','validation':'none','barrier':'offer','budget':'none'}),('ejecucion',{**base,'stage':'offer','leads':'zero','execution':'zero','validation':'buyers','barrier':'exposure','budget':'500to1000'}),('captacion',{**base,'leads':'zero','execution':'many','validation':'buyers','barrier':'channel','budget':'5000plus'}),('conversion',base),('organizacion',{**base,'stage':'steady','process':'followup','capacity':'reactive','leads':'many','budget':'none'})]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':1440,'height':1050},reduced_motion='reduce');setup(context)
 page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE)
 page.screenshot(path=str(out/'landing-computador.png'),full_page=True)
 page.locator('#tu-situacion').screenshot(path=str(out/'problemas-computador.png'))
 for key,a in cases:
  res=complete(page,a);assert res['priority']==key,(key,res)
  if key=='conversion':
   link=page.locator('.route-primary a.btn').first.get_attribute('href');u=urlparse(link)
   assert u.netloc=='wa.me' and u.path=='/573015306201';assert 'Conversión' in parse_qs(u.query)['text'][0]
   page.screenshot(path=str(out/'resultado-whatsapp.png'),full_page=True)
   with page.expect_download() as dl: page.locator('#download').click()
   dl.value.save_as(out/'plan-prueba.pdf')
   page.locator('#privacy-link').click();assert page.locator('#privacy').is_visible();page.locator('#privacy-back').click();assert page.locator('#result').is_visible()
   page.locator('#edit-answers').click();assert page.locator('[name=business]').input_value()==a['business']
 page.goto(BASE)
 selectors=['#start','#tu-situacion [data-start]','#tu-plan [data-start]','#experiencias [data-start]','.faq [data-start]','#tu-siguiente-paso [data-start]']
 for selector in selectors:
  page.locator(selector).click();assert page.locator('#contact-form').is_visible();page.locator('#brand').click()
 for key in ['ivan','andres','sara']:
  card=page.locator(f'[data-review-id={key}]')
  link=card.locator('.review-launch');drive_id=link.get_attribute('data-drive-id');link.click()
  assert drive_id in card.locator('iframe').get_attribute('src')
 assert page.locator('#experiencias iframe').count()==3
 mobile_context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,device_scale_factor=1,reduced_motion='reduce');setup(mobile_context)
 mobile=mobile_context.new_page();mobile.on('pageerror',lambda e:errors.append(str(e)))
 mobile.goto(BASE);mobile.screenshot(path=str(out/'landing-celular.png'),full_page=True)
 for width in [320,390,680,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':1000});page.goto(BASE)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),width
 complete(mobile,base);mobile.screenshot(path=str(out/'resultado-celular.png'),full_page=True)
 assert not errors,errors
 browser.close()
srv.shutdown()
(out/'report.json').write_text(json.dumps({'status':'PASS','diagnostic_cases':5,'responsive_widths':[320,390,680,768,1024,1440],'all_landing_ctas':len(selectors),'video_players':'3 click-to-load frames with external playback mocked','pdf_download':True,'contact_delivery':'mocked only, no data sent to production','js_errors':errors},ensure_ascii=False,indent=2))
print((out/'report.json').read_text())
