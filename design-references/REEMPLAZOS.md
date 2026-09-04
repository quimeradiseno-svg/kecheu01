# Kecheu · Imágenes para reemplazar

Las fotografías reales de arquitectura, cabañas, familia y paisaje se conservan. Solo las dos escenas conceptuales de cerámica son generadas, con rótulo visible en la página. No representan manos de Laura ni piezas de su autoría.

## Prioridad para el fotógrafo

1. **Manos trabajando una pieza real de Laura.** Horizontal 3:2, luz de ventana lateral, manos y pieza juntas, mesa y herramientas reales. También una vertical y un clip estable de 8–12 segundos. Reemplaza `hands-temporary.webp`.
2. **Detalle de una pieza real.** Horizontal 3:2, huellas y textura de arcilla, luz suave, fondo del taller. Reemplaza `clay-temporary.webp`.
3. **Laura en el taller.** Retrato ambiental haciendo su trabajo. Permite sumar autora y acción a la sección.
4. **Hero horizontal.** Repetir el espíritu de K041: conjunto de cabañas y montaña, primer plano limpio, margen alrededor. Entregar original completo.
5. **Cabañas.** Completar dormitorio y baño de cada unidad, nombrando 01, 02 y para dos. Identificación confirmada por carpetas: `cabañaspara4_01`, `cabañaspara4_02`, `CabañasPara4_afuera` compartida.

## Cambio sin rediseñar

Actualizar `photos.hands` y `photos.clay` en `app/content.ts`: nombre del nuevo archivo, descripción real y `generated:false`. Preparar versiones WebP grande y pequeña dentro de `public/images`. Cambiar también la nota final de referencias generadas cuando ambas imágenes sean reales. La composición y el movimiento no necesitan reconstruirse.

Conservar originales de cámara, sin compresión de mensajería. Los archivos generados completos están en esta carpeta y las versiones optimizadas en `public/images`.

## Antes de compartir públicamente

- Confirmar permiso de publicación del retrato familiar y fotos de personas.
- Incorporar WhatsApp, Instagram y Airbnb reales en `app/content.ts`. Actualmente vacíos: la consulta abre una explicación y no finge un envío.
- Reemplazar mapa general de Epuyén por el enlace confirmado de Kecheu.
- Confirmar ubicación de las fotografías del río y el lago.
- Quitar `noindex` solo cuando se decida publicar la versión definitiva.
- Casa y estanque son parte de la historia, no alojamiento adicional ni piscina anunciada para huéspedes.

## Imágenes generadas y prompts

Se utilizó la herramienta integrada de generación, no la API ni una clave externa. Son referencias conceptuales, no evidencia documental. Los prompts íntegros se conservan en `generation-prompts.json`.
