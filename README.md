# Jumpers · Diagnóstico y prospección

Sitio: https://quiz.josebayonaf.com/

Recorrido: portada → registro con consentimiento → seis bloques de diagnóstico y calificación → resultado y PDF personalizado. No hay un segundo formulario de calificación al final.

El registro recoge nombre, país, teléfono con indicativo y correo. El quiz incluye negocio, etapa, facturación, precio, necesidad, intención, disponibilidad y presupuesto en USD. El contacto se encola inmediatamente; las actualizaciones se envían después en orden, con confirmación del servidor y reintentos durante un máximo de 24 horas.

## Clasificación

- YouTube: sin ventas, oferta poco clara, sin presupuesto definido, aprendizaje gratuito, exploración o falta de tiempo para implementar.
- Skool: oferta clara, ventas, presupuesto y disposición para implementar, sin reunir todos los criterios de mentoría.
- Sesión gratuita de 30 minutos: ventas, oferta clara, precio que ya cobra, acompañamiento personal, inicio inmediato, tiempo disponible y presupuesto desde USD 4.500.

El presupuesto por sí solo no determina la ruta. La recomendación no garantiza resultados ni obliga a comprar. Los enlaces se configuran en `CONFIG` en `index.html`. WhatsApp está configurado para la ruta de sesión estratégica con el indicativo confirmado por el titular.

## PDF

`plan-pdf.js` genera localmente un PDF de tres páginas con nombre, etapa, prioridad, evidencias, acciones para siete días, ejercicio, métrica y enlaces de la ruta. No requiere IA, servidor de generación ni envío de los datos a otro proveedor.

## Estado de la integración

El endpoint de Apps Script devuelve un bloqueo de Google por sus condiciones del servicio. El guardado en Sheets no está operativo mientras este bloqueo continúe. No confundir una copia local pendiente con un registro guardado. `backend/Code.gs` incluye la clasificación nueva preparada para cuando se pueda restaurar legítimamente el servicio; actualizar el archivo en GitHub no despliega Apps Script.

## Comprobaciones

```
node tests/logic.cjs
node tests/outbox.cjs
node tests/qualification.cjs
```

Para generar muestras PDF de prueba: `node tests/qualification.cjs --pdf` (requiere `@napi-rs/canvas`; salida en `/tmp/jumpers-pdf`). Publicación con GitHub Pages desde main.
