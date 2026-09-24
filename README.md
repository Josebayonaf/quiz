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

El acceso a PROSPECTOS y al endpoint de Apps Script fue restablecido y verificado el 24 de septiembre de 2026 (UTC). Una prueba sintética confirmó el alta del contacto y la actualización de sus respuestas en la misma fila. El registro técnico fue retirado tras la verificación.

La columna N de Prospectos usa las respuestas de AC para aplicar la clasificación actual del quiz (etapa, claridad, precio, intención, disponibilidad y presupuesto). Los registros antiguos sin presupuesto conservan sus criterios anteriores. Se comprobaron las rutas YouTube, Skool y Mentoría 1:1, incluido el caso de un principiante con presupuesto alto.

El envío sigue siendo asíncrono: la interfaz permite avanzar antes de recibir la confirmación. La prueba de alta tardó aproximadamente 16 segundos en el servicio; no se promete persistencia en 1–2 segundos. El estado de sincronización se conserva internamente; los avisos técnicos no se muestran al cliente. Los reintentos y la confirmación del servidor siguen activos. No se realizó una migración a Supabase.

## Comprobaciones

```
node tests/logic.cjs
node tests/outbox.cjs
node tests/qualification.cjs
```

Para generar muestras PDF de prueba: `node tests/qualification.cjs --pdf` (requiere `@napi-rs/canvas`; salida en `/tmp/jumpers-pdf`). Publicación con GitHub Pages desde main.
