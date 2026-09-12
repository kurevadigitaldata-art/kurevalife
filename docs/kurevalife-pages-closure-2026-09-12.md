# Cierre técnico — GitHub Pages de KurevaLife

**Fecha:** 12 de septiembre de 2026
**Repositorio canónico:** [`kurevadigitaldata-art/kurevalife`](https://github.com/kurevadigitaldata-art/kurevalife)
**Ruta pública validada:** <https://kurevadigitaldata-art.github.io/kurevalife/vida>

> **Resultado final: APTO.** GitHub Pages está habilitado, utiliza **GitHub Actions**, HTTPS está forzado, ambos jobs de la publicación final están verdes y la ruta pública directa `/vida` responde `HTTP 200` con el simulador KurevaLife.

## Resumen ejecutivo

El estado inicial era coherente con la incidencia reportada: el sitio Pages no existía (`has_pages: false`) y la ejecución **34702623504** fallaba en **Set up GitHub Pages** antes de instalar dependencias o construir el artifact. Se habilitó Pages desde la configuración administrativa del repositorio con fuente **GitHub Actions**, se eliminó de la workflow la instrucción redundante `enablement: true` y se conservó el paso oficial `actions/configure-pages@v5` sin autoactivación.

Tras la primera publicación verde, la raíz de Pages respondió correctamente, pero la ruta directa `/vida` devolvía el contenido de fallback con `HTTP 404`. Se aplicó una corrección estrictamente técnica al artifact: generar `dist/public/vida/index.html` como copia de `index.html`, además del `404.html` de fallback existente. La publicación final ha quedado en el commit `712aace81bd6ae8ae806231cb4d835db298c583f`; tanto la raíz como `/vida` y `/vida/` responden ahora `HTTP 200` y cargan KurevaLife.

## Cronología documentada

| Hora aproximada (UTC) | Paso                                  | Resultado y evidencia                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21:08                 | Inspección inicial de Pages y Actions | `GET /repos/kurevadigitaldata-art/kurevalife/pages` devolvió `404`; el repositorio indicó `has_pages: false`. La ejecución reportada **34702623504** tenía estado `failure` en el commit `5122d80`.                                                                                      |
| 21:10                 | Aislamiento de la falla               | Los metadatos del job mostraron **Set up GitHub Pages** como único paso fallido; instalación, build y artifact quedaron `skipped`. El workflow incluía `actions/configure-pages@v5` con `enablement: true`.                                                                              |
| 21:11                 | Intento de configuración por API      | La cuenta disponía de permisos administrativos de repositorio, pero `POST /repos/.../pages` con el token de integración devolvió `403 Resource not accessible by integration`. Esto impidió usar esa vía API para el ajuste de Pages.                                                    |
| 21:14                 | Habilitación administrativa           | En Settings → Pages se seleccionó **GitHub Actions** como origen. La comprobación posterior devolvió `has_pages: true`, `build_type: workflow`, `public: true` y `https_enforced: true`.                                                                                                 |
| 21:14–21:15           | Reparación de la workflow             | Se rebasó el checkpoint de auditoría sobre la rama canónica actual y se resolvió el conflicto de workflow conservando `configure-pages@v5` pero sin `enablement: true`. Ese input requiere un token distinto de `GITHUB_TOKEN` y ya no era necesario una vez activado Pages en Settings. |
| 21:15                 | Publicación 1                         | Se publicó el commit `4faf104bc6216e61b15f076e53a125c338f7f188`. La ejecución **34719449218** terminó `success`: build y deploy verdes; cada paso, incluido **Configure GitHub Pages**, finalizó correctamente.                                                                          |
| 21:17                 | Verificación del primer despliegue    | La raíz `.../kurevalife/` devolvió `200`, pero `/vida` y `/vida/` devolvían `404`, aunque contenían el HTML de fallback. Se identificó que `404.html` resuelve la aplicación cliente pero no convierte el código HTTP de la URL directa en 200.                                          |
| 21:17–21:18           | Corrección de ruta directa            | Se modificó solamente el paso de empaquetado del workflow para crear `dist/public/vida/index.html`, preservando `404.html`. No se alteró diseño, estilo ni funcionalidad del simulador.                                                                                                  |
| 21:18                 | Publicación final                     | Se publicó el commit `712aace81bd6ae8ae806231cb4d835db298c583f`. La ejecución **34719556282** terminó `success`, con build y deploy verdes.                                                                                                                                              |
| 21:19                 | Validación pública final              | La API de Pages devolvió deployment `succeed`. `curl` confirmó `200` en `/`, `/vida` y `/vida/`. El navegador personal abrió `/vida`, siguió correctamente a `/vida/` y mostró la pantalla inicial KurevaLife con el botón **Empezar simulacro**.                                        |

## Correcciones aplicadas

### Configuración administrativa

Pages quedó habilitado con los siguientes valores efectivos:

| Propiedad          | Valor final                                           |
| ------------------ | ----------------------------------------------------- |
| URL de Pages       | `https://kurevadigitaldata-art.github.io/kurevalife/` |
| Fuente             | GitHub Actions (`build_type: workflow`)               |
| Visibilidad        | Pública                                               |
| HTTPS              | Forzado                                               |
| Rama de referencia | `main`                                                |

### Workflow de publicación

La workflow mantiene los permisos necesarios (`pages: write`, `id-token: write`), instala dependencias con bloqueo congelado, construye con `GITHUB_PAGES=true`, carga el artifact oficial y despliega con `actions/deploy-pages@v4`.

La única adaptación nueva en esta fase es de empaquetado de ruta: tras construir, se generan los archivos siguientes.

```text
 dist/public/index.html       # raíz de Pages
 dist/public/404.html         # fallback SPA
 dist/public/vida/index.html  # destino estático con HTTP 200 para el enlace de testers
```

Esta corrección no modifica la interfaz ni cambia la navegación interna del simulador. Solo elimina el estado HTTP 404 que producía el fallback de GitHub Pages al solicitar la URL pública aprobada.

## Validación técnica final

| Verificación                                        | Resultado                                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `pnpm install --frozen-lockfile`                    | Correcto con pnpm 10.18.1.                                                                             |
| `pnpm test`                                         | Correcto: 4 pruebas Vitest superadas.                                                                  |
| `pnpm check`                                        | Correcto: `tsc --noEmit` sin errores.                                                                  |
| Build local estándar                                | Correcto.                                                                                              |
| Build GitHub Pages (`GITHUB_PAGES=true pnpm build`) | Correcto; assets, manifest e icono bajo `/kurevalife/`.                                                |
| Ejecución 34719449218                               | Verde: build y deploy correctos sobre `4faf104`.                                                       |
| Ejecución 34719556282                               | Verde: build y deploy correctos sobre `712aace`.                                                       |
| API GitHub Pages                                    | Site activo, `build_type: workflow`, HTTPS forzado; deployment del commit final con estado `succeed`.  |
| URL pública raíz                                    | `https://kurevadigitaldata-art.github.io/kurevalife/` → `HTTP 200`.                                    |
| URL pública de testers                              | `https://kurevadigitaldata-art.github.io/kurevalife/vida` → redirige a `/vida/` y responde `HTTP 200`. |
| Navegador autenticado                               | Carga la pantalla inicial KurevaLife y el control **Empezar simulacro**.                               |

## Contraste con la validación anterior

| Entorno                   | Estado anterior validado                                       | Estado de cierre                                                                              |
| ------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Vista previa local        | `/vida` respondía `HTTP 200`; simulador funcional.             | Se conserva la misma base funcional.                                                          |
| URL temporal de auditoría | `/vida` respondía `HTTP 200`, pero era un entorno transitorio. | No se usa como enlace operativo.                                                              |
| GitHub Pages oficial      | Deshabilitado (`has_pages: false`); la URL `/vida` no existía. | Habilitado y publicado mediante Actions; `/vida` es una ruta estática pública con `HTTP 200`. |

## Referencias operativas

- [Workflow verde final 34719556282](https://github.com/kurevadigitaldata-art/kurevalife/actions/runs/34719556282)
- [Commit final 712aace](https://github.com/kurevadigitaldata-art/kurevalife/commit/712aace81bd6ae8ae806231cb4d835db298c583f)
- [Aplicación publicada en `/vida`](https://kurevadigitaldata-art.github.io/kurevalife/vida)
- [Documentación oficial de GitHub Pages con workflows personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
