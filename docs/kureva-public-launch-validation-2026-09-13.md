# Validación pública de Kureva — 13 de septiembre de 2026

## Alcance y fuente de verdad

Esta actualización se realiza sobre la rama `main` del repositorio canónico `kurevadigitaldata-art/kurevalife`. La publicación se entrega en GitHub Pages bajo el prefijo de proyecto **`/kurevalife`**. Por tanto, las rutas públicas de este repositorio empiezan por `https://kurevadigitaldata-art.github.io/kurevalife/`; las URLs sin ese prefijo pertenecen a la raíz de la organización y no pueden ser creadas ni corregidas desde este repositorio de proyecto.

La landing se ha ajustado para funcionar como una carta de presentación pública de Kureva. La narrativa explica por qué nace Kureva, a quién acompaña, qué problema resuelve y cómo trabaja con emprendedores y microempresas. Se eliminaron de la landing pública la paleta detallada, el manual de identidad, el merchandising, los enlaces a láminas internas y la sección de casos de trabajo interno. Esos elementos no se han publicado como activos de la landing.

## Rutas públicas verificadas

| Destino | Ruta canónica |
|---|---|
| Landing | `/kurevalife/` |
| Recursos | `/kurevalife/recursos` |
| Calculadora | `/kurevalife/calculadora` |
| Simulacro KurevaLife | `/kurevalife/vida#inicio` |
| Método | `/kurevalife/#metodo` |
| Contacto | `/kurevalife/#contacto` |

El workflow de GitHub Pages ahora crea documentos de entrada explícitos para `vida`, `recursos`, `calculadora` y `kurevalife`, además del fallback `404.html`. Esto evita que los accesos directos a esas rutas dependan únicamente de la navegación de la SPA.

## Movimiento de marca y experiencia responsive

La K oficial emplea una rotación lineal continua de diez segundos y no utiliza pulso, respiración ni rebote. El movimiento usa propiedades de composición (`transform` y `will-change`) para una animación ligera y se detiene cuando el sistema solicita `prefers-reduced-motion`.

La verificación automatizada de Playwright comprobó landing y simulacro en tres viewports: móvil (390 × 844), tableta (768 × 1024) y escritorio (1280 × 900). En los seis casos se verificó la ausencia de desbordamiento horizontal, la carga de la portada oficial y la rotación de la K. También se verificó que el simulacro conserva exactamente las cuatro pestañas obligatorias: **Hoy, Registrar, Informes y Perfil**, con Kivi como acción secundaria.

## Validación técnica

| Comprobación | Resultado |
|---|---|
| `pnpm test` | Correcto: 4 pruebas superadas |
| `pnpm check` | Correcto: TypeScript sin errores |
| Build estándar | Correcto |
| Build GitHub Pages | Correcto; activos y rutas incluidos |
| Prueba responsive | Correcta en móvil, tableta y escritorio |
| Movimiento reducido | Correcto; la K ornamental se detiene |

## Seguridad y límites honestos

La landing y el simulacro se publican por diseño para que cualquier persona pueda abrir los enlaces. No existe un mecanismo técnicamente honesto que permita que una web pública sea a la vez "imposible de rastrear o hackear". Esta actualización reduce la exposición evitable: no incluye secretos en el repositorio público, no expone materiales internos de marca en la landing y no presenta datos de salud reales; el simulacro es local-first y se identifica como entorno de prueba.

La protección de cuentas, permisos, datos remotos, ataques de infraestructura, monitorización y políticas de respuesta requieren servicios y configuraciones de seguridad externos a GitHub Pages. No se afirma que esos controles estén implementados por este sitio estático.
