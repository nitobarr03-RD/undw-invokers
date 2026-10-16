# UNDW INVOKERS

Guía comunitaria en español para Invokers: Titan Legacy. Aplicación estática, sin acceso ni inicio de sesión en cuentas de juego.

## Fuentes y actualización

- El roster completo, filtros, fichas y tiers están en el [índice oficial de HitZone](https://invokers.com/hub/index/invokers/).
- Las noticias públicas se sincronizan cada día desde el Centro de ayuda oficial de HitZone mediante `scripts/sync_hitzone.py` y se guardan en `data/hitzone-latest.json`.
- El navegador lee ese feed público y mantiene el resumen guardado como respaldo cuando no hay conexión.
- La app no usa una API de cuenta ni modifica perfiles del juego.

## Publicar en GitHub Pages

El flujo `.github/workflows/pages.yml` publica `index.html` y sus datos estáticos. En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente si Pages todavía no está activado. El sitio esperado es `https://nitobarr03-rd.github.io/undw-invokers/`.

## Equipamiento automático

La pestaña usa las clases, las estadísticas iniciales y las señales de habilidades de las fichas oficiales, consultadas el 16 de octubre de 2026. Ofrece una build orientativa y tres alternativas; no conoce el inventario del usuario ni calcula estadísticas finales del juego. Los iconos de equipo son ilustraciones del tipo de pieza, no imágenes de objetos reales del inventario. Los Titanes se planifican a través de un campeón compatible de su facción (Litria es universal).

Los accesorios respetan facción y despertar: amuleto desde el inicio, pendientes en 2★, estandarte en 4★, talismán en 5★ y frasco en 6★. Los sets siguen bonos de 3 y 5 piezas; los totales de 5 ya incluyen los de 3.

## Visitas e idiomas

El contador público usa Busuanzi y solo se activa en undwclan.es y www.undwclan.es. Muestra cargas de página y visitantes estimados del servicio, no personas verificadas ni un histórico anterior. Al cargar la web, el navegador contacta con el servicio de conteo. Si el servicio falla, se muestra indisponibilidad, nunca un número local inventado.

El traductor de Google se carga al pulsar «Traducir aquí». Se guarda la preferencia de idioma en el navegador y se ofrece un enlace alternativo a la traducción completa. El contenido dinámico y los términos del juego dependen de la traducción automática.

## Gestión

La versión pública no incluye la pestaña de gestión ni enlaces a repositorio o configuración de Pages. Esto no altera la visibilidad del repositorio en GitHub. La administración continúa desde GitHub con la cuenta del propietario.
