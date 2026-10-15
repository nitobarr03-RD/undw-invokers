# UNDW INVOKERS

Guía comunitaria en español para Invokers: Titan Legacy. Aplicación estática, sin acceso ni inicio de sesión en cuentas de juego.

## Fuentes y actualización

- El roster completo, filtros, fichas y tiers están en el [índice oficial de HitZone](https://invokers.com/hub/index/invokers/).
- Las noticias públicas se sincronizan cada día desde el Centro de ayuda oficial de HitZone mediante `scripts/sync_hitzone.py` y se guardan en `data/hitzone-latest.json`.
- El navegador lee ese feed público y mantiene el resumen guardado como respaldo cuando no hay conexión.
- La app no usa una API de cuenta ni modifica perfiles del juego.

## Publicar en GitHub Pages

El flujo `.github/workflows/pages.yml` publica `index.html` y sus datos estáticos. En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente si Pages todavía no está activado. El sitio esperado es `https://nitobarr03-rd.github.io/undw-invokers/`.
