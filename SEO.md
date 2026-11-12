# SEO y publicación

Dominio principal: https://mlsolucionesweb.com.ar/
Objetivo: negocios y profesionales de toda Argentina.

## Páginas
- /: presentación general, servicios, portfolio y contacto.
- /diseno-paginas-web/: alcance, proceso, presupuesto y preguntas del servicio.
- /trabajos/tomento-capilar/: caso de diseño y desarrollo, sin métricas comerciales inventadas.

Las páginas nuevas se generan como HTML completo en scripts/build-content.mjs después de Vite.
Editar el contenido allí y ejecutar npm run build. El CSS principal de producción se comparte.
GitHub Pages sirve cada directorio con su index.html, incluso al entrar directamente.
El inicio y las páginas nuevas tienen enlaces entre sí. public/sitemap.xml incluye las tres URLs.
Cada nueva página incluye título, descripción, canonical, Open Graph y datos estructurados.
La medición de interacciones usa src/analytics.js también en las páginas estáticas.

## Estado comprobado el 12 de noviembre de 2026
- HTTP y www redirigen 301 al dominio principal HTTPS.
- robots.txt permite rastreo y declara el sitemap.
- Search Console del usuario registra una URL indexada y otra excluida por redirección (datos hasta el 8 de noviembre).
- GA4 instalado: G-W4MMG2PXEC.
- La indexación de las nuevas URLs debe comprobarse después del despliegue. No implica posiciones garantizadas.

## Pendiente
- Solicitar indexación de las nuevas páginas desde la propiedad del usuario, si se desea acelerar su descubrimiento.
- Ampliar el contenido de otros servicios cuando se defina su alcance.
- Revisar la antigua versión en Sites antes de decidir si se retira o se redirige.
