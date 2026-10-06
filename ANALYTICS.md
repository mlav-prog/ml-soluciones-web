# Medición de ML Soluciones Web

Flujo GA4: G-W4MMG2PXEC. Dominio: https://mlsolucionesweb.com.ar/
Etiqueta instalada en index.html. Interacciones en src/analytics.js.
No se envían valores de nombre, email, negocio ni mensaje en los eventos personalizados.
La medición depende de la disponibilidad de Analytics y de bloqueadores del visitante.

## Eventos publicados

| Evento | Qué significa | Parámetros |
|---|---|---|
| whatsapp_click | Clic para abrir WhatsApp; no confirma mensaje enviado | placement |
| email_click | Clic en dirección de correo; no confirma envío | placement |
| service_interest | Clic en propuesta de servicio | service_id, placement |
| service_select | Servicio elegido en formulario | service_id |
| project_click | Clic en portfolio | project_id, placement |
| inquiry_start | Primera edición del formulario por carga | service_id |
| inquiry_validation_error | Campo inválido, una vez por campo y carga | field_id |
| inquiry_submit_attempt | Formulario válido enviado hacia FormSubmit | service_id |
| section_view | Sección que intersecta el centro del viewport, una vez por carga; no prueba lectura | section_id |
| scroll_depth | Desplazamiento al 25/50/75/100% del recorrido, una vez por carga | percent_scrolled |
| faq_open | Pregunta desplegada | question_id |
| navigation_click | Clic en navegación interna | placement, destination |
| carousel_interaction | Uso de controles; no incluye cambios automáticos ni gestos de deslizamiento | carousel_id, control |

service_id: web, tiendanube, seo, orientacion, sin_elegir.
question_id: faq_1 a faq_6 en orden de publicación.
No se emite generate_lead: la entrega real ocurre fuera del sitio, en FormSubmit.
No sumar estos eventos a los automáticos click/form_submit/scroll como si fueran acciones distintas.

## Configuración pendiente en la cuenta (no realizada desde el código)

1. Revisar zona horaria Argentina y moneda ARS.
2. Confirmar medición mejorada en el flujo web. Revisar los eventos automáticos existentes antes de crear otros.
3. Crear dimensiones personalizadas de alcance Evento:
   placement, service_id, project_id, field_id, section_id, question_id,
   destination, carousel_id, control.
   Para scroll_depth usar percent_scrolled (dimensión predefinida Porcentaje de desplazamiento si está disponible).
4. Marcar whatsapp_click e inquiry_submit_attempt como eventos clave de intención de contacto.
   No llamarlos consultas recibidas ni ventas. email_click puede mantenerse como interacción secundaria.
5. Vincular la propiedad verificada de Search Console.
6. Retención: seleccionar 14 meses si se quiere comparar exploraciones durante un año.
7. Revisar tráfico interno primero en modo de prueba antes de excluirlo: una IP dinámica puede afectar visitas reales.
8. No activar recopilación de datos proporcionados por usuarios ni Google Signals sólo para acumular datos.

## Informes a preparar en la interfaz

- Adquisición: usuarios/sesiones por fuente, medio y campaña.
- Audiencia: dispositivo, país, región y ciudad (ubicación aproximada y sujeta a límites de datos).
- Interés: service_interest por service_id; project_click por project_id.
- Contacto: whatsapp_click y email_click por placement.
- Formulario: inquiry_start frente a inquiry_submit_attempt; errores por field_id.
  Diferencia entre inicio e intento no equivale exactamente a abandono ni entrega fallida.
- Contenido: section_view, scroll_depth y faq_open.
- SEO: consultas, impresiones, clics y CTR desde Search Console.
- Rendimiento: revisar PageSpeed/Search Console; esta integración no mide Core Web Vitals personalizados.

## Enlaces para atribución de campañas

Instagram bio:
https://mlsolucionesweb.com.ar/?utm_source=instagram&utm_medium=organic_social&utm_campaign=perfil&utm_content=bio

WhatsApp compartido:
https://mlsolucionesweb.com.ar/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=presentacion

Usar nombres consistentes, sin nombres de clientes, correos ni datos personales.
No usar UTM en enlaces internos.

## Verificación

Build de producción y prueba con navegador: WhatsApp, correo, servicio, proyecto,
FAQ, secciones, profundidad, inicio, validación e intento de formulario.
Formulario y Analytics interceptados durante QA local para no enviar correos de prueba.
El acceso al panel de Google no está disponible: los cambios de cuenta anteriores siguen pendientes.
