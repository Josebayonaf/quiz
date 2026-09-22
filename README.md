# Diagnóstico Jumpers

Sitio estático para `https://quiz.josebayonaf.com`, publicado desde `main / (root)` en GitHub Pages. La web principal vive en otro repositorio.

## Estado de esta versión

- Landing responsive, negro/turquesa, ilustración orbital original en SVG y tipografía de sistema (sin dependencias externas).
- Cuatro bloques, diez preguntas por recorrido, dos rutas según existencia de conversaciones.
- Cinco prioridades: oferta, ejecución, captación, conversión y organización. Explicación con respuestas reales, plan de 14 días, ejercicio, descarga TXT y resumen de setting.
- No recoge contactos ni transmite respuestas mientras `CONFIG.leadEndpoint` esté vacío. Los datos se mantienen en memoria y desaparecen al recargar. El resumen se comparte manualmente.
- No hay videos, testimonios, cifras de resultados ni calendarios inventados.
- La captura en Google Sheets está preparada, pero **no está activa** hasta desplegar, conectar y probar el conector.

## Buyer persona y decisiones

Coaches, mentores, consultores y profesionales de servicios que tienen experiencia, pero necesitan concretar una oferta, actuar con constancia o convertir interés en un proceso comercial. Se distingue etapa (idea/oferta/ventas/recurrente), conducta observable y dificultad percibida. No se atribuye automáticamente todo a autosabotaje; el cuestionario no diagnostica personalidad ni salud mental.

La entrada entrega valor sin pedir contacto. La solicitud de ayuda viene después del resultado: etapa + objetivo + dificultad + tipo de acompañamiento + momento de inicio. No se utiliza capacidad económica para alterar la prioridad. La hipótesis es mejorar el contexto y pertinencia de las conversaciones; todavía no hay datos para afirmar una mejora de conversión.

### Reglas de prioridad (orden importa)

1. Oferta poco clara o todavía en idea: oferta.
2. Sin conversaciones, pocas invitaciones y barrera de exposición/tiempo: ejecución.
3. Sin registros de invitaciones ni conversaciones: organización provisional.
4. Conversaciones que se detienen en siguiente paso o propuesta: conversión.
5. Ventas recurrentes y proceso reactivo: organización.
6. Sin conversaciones y sin validación con compradores: oferta; provisional si desconoce volumen.
7. Conversaciones nulas/escasas o sin canal: captación.
8. Proceso desconocido: organización provisional.
9. Resto: organización; presentar como orientación, no como único problema probado.

La selección subjetiva se contrasta con las demás respuestas. La interfaz explica diferencias y permite volver y corregir. No se muestran porcentajes ficticios ni tasas de cierre calculadas desde rangos.

## Activar captación privada en Google Sheets

1. En `https://script.google.com`, crea un proyecto bajo tu cuenta de Google.
2. Copia `backend/Code.gs` en el editor. Ejecuta `setup` y autoriza el acceso solicitado. Esta función crea una hoja privada y conserva su ID en propiedades del script. El enlace aparece en el registro de ejecución.
3. **Implementar → Nueva implementación → Aplicación web.** Ejecutar como tú; acceso para cualquier persona (incluidas personas sin sesión). Publicar el endpoint no publica la hoja: `doGet` solo devuelve estado y `doPost` solo recibe solicitudes. No compartas públicamente el spreadsheet.
4. Copia la URL de implementación que termina en `/exec`, nunca la URL `/dev`.
5. Sustituye el valor vacío de `CONFIG.leadEndpoint` en `index.html` por esa URL. No añadas tokens, credenciales ni claves privadas al repositorio.
6. En la web publicada por HTTPS, realiza una solicitud de prueba con datos de prueba. Comprueba que aparezca una sola fila en Sheets y que la interfaz confirme el mismo ID. Repite tras un fallo o timeout para probar deduplicación. Elimina esa fila de prueba al terminar.
7. Si CORS, autorizaciones o políticas de Workspace impiden leer la respuesta, no uses `no-cors` ni muestres éxito falso. Mantén la captura desactivada hasta resolverlo. La web permite copiar el contexto si no puede confirmar el envío.
8. Revisa el texto de datos y el canal para solicitudes de privacidad antes de invitar a prospectos. El consentimiento se limita a revisar y responder al caso; no suscribe a campañas.

El backend valida contacto, consentimiento, tamaño, prioridad y origen declarado, neutraliza fórmulas de Sheets, incluye honeypot, bloqueo de escritura y deduplicación por ID. El origen declarado y el honeypot no son controles fuertes contra bots. Para tráfico de campañas a escala, añade protección verificada en servidor y observa cuotas. No se envían correos automáticos ni avisos al equipo en esta versión.

Documentación oficial: https://developers.google.com/apps-script/guides/web

## Rutina de setting propuesta

- Responsable revisa registros `Nuevo`; objetivo operativo inicial: responder durante el siguiente día hábil, según capacidad real del equipo. No es una promesa mostrada al visitante.
- Lee el resumen y abre con contexto: «Vi que ya estás [etapa] y quieres [objetivo]. ¿Qué has intentado hasta ahora para resolver [dificultad]?».
- Aclara situación, avance deseado, disponibilidad para implementar y apoyo preferido antes de proponer una llamada.
- Estados manuales sugeridos: Nuevo → Contactado → Conversando → Llamada acordada → Seguimiento → Cerrado / No encaja.
- En cada oportunidad, registra responsable, próxima acción y fecha. No contactes por canales distintos de los autorizados ni conviertas la solicitud en suscripción masiva.
- Mantén la hoja privada y limita acceso al equipo que necesita trabajar los casos. Revisa registros inactivos a los seis meses.

## Medición

Esta versión no instala trackers. Tras activar la captación se podrán contar solicitudes, conversaciones iniciadas, llamadas pertinentes y próximos pasos cumplidos en Sheets. Las tasas de inicio/finalización requieren añadir una medición de eventos específica antes de interpretar abandono. No hay analítica de embudo funcionando todavía.

## Pruebas

`tests/smoke.cjs` usa Playwright instalado en el runtime. Iniciar servidor local en puerto 8080 y ejecutar el archivo. Comprueba rutas, navegación, accesibilidad básica, descarga, resumen, validación, envío simulado y fallo. La prueba de envío real a Google queda pendiente de la autorización y despliegue de Apps Script.
