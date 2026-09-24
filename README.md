# Jumpers · Diagnóstico y prospección

Sitio: https://quiz.josebayonaf.com/

Recorrido: portada → registro con consentimiento → seis bloques de diagnóstico y calificación → resultado y PDF personalizado. No hay un segundo formulario de calificación al final.

El registro recoge nombre, país, teléfono con indicativo y correo. El quiz incluye negocio, etapa, facturación, precio, necesidad, intención, disponibilidad y presupuesto en USD. El contacto se encola inmediatamente; las actualizaciones se envían después en orden, con confirmación del servidor y reintentos durante un máximo de 24 horas.

## Clasificación

El presupuesto disponible determina la ruta:
- Sin presupuesto, menos de USD 500 o presupuesto por definir: YouTube.
- Desde USD 500 y menos de USD 2.000: Skool.
- Desde USD 2.000: agenda y WhatsApp para una sesión estratégica gratuita de 30 minutos.

Los límites son inclusivos: USD 500 habilita Skool y USD 2.000 habilita llamada. Etapa, claridad, intención y tiempo disponible se guardan para contextualizar el seguimiento y personalizar el diagnóstico/PDF; no bloquean la ruta indicada por el presupuesto. La mentoría mantiene su precio de USD 4.500. Calificar para la llamada no implica disponer del precio completo ni garantiza una compra.

Los enlaces se configuran en `CONFIG` en `index.html`. WhatsApp está configurado con el indicativo confirmado por el titular.

## PDF

`plan-pdf.js` genera localmente un PDF de tres páginas con nombre, etapa, prioridad, evidencias, acciones para siete días, ejercicio, métrica y enlaces de la ruta. No requiere IA, servidor de generación ni envío de los datos a otro proveedor.

## Estado de la integración

El acceso a PROSPECTOS y al endpoint de Apps Script fue restablecido y verificado el 24 de septiembre de 2026 (UTC). Una prueba sintética confirmó el alta del contacto y la actualización de sus respuestas en la misma fila. El registro técnico fue retirado tras la verificación.

La columna N de Prospectos usa el presupuesto de las respuestas en AC para aplicar los mismos límites que el quiz. Los registros antiguos sin un rango de presupuesto conservan sus criterios anteriores; no se infiere una cantidad que no declararon. Se verificaron las tres rutas y los límites de USD 500 y USD 2.000.

El envío sigue siendo asíncrono: la interfaz permite avanzar antes de recibir la confirmación. La prueba de alta tardó aproximadamente 16 segundos en el servicio; no se promete persistencia en 1–2 segundos. El estado de sincronización se conserva internamente; los avisos técnicos no se muestran al cliente. Los reintentos y la confirmación del servidor siguen activos. No se realizó una migración a Supabase.

## Comprobaciones

```
node tests/logic.cjs
node tests/outbox.cjs
node tests/qualification.cjs
```

Para generar muestras PDF de prueba: `node tests/qualification.cjs --pdf` (requiere `@napi-rs/canvas`; salida en `/tmp/jumpers-pdf`). Publicación con GitHub Pages desde main.
