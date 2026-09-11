# Auditoría obligatoria del estado actual — KurevaLife

**Fecha:** 11 de septiembre de 2026
**Alcance:** revisión sin modificar código de producto.
**Referencia de validación:** contrato maestro de KurevaLife, Manual K Flúida y las 21 referencias visuales aprobadas.

> **Resultado global:** el proyecto compila y varias interacciones locales funcionan, pero la versión actual **no cumple todavía el contrato de simulacro KurevaLife**. Las desviaciones críticas son el orden y número de destinos de navegación, el uso de animaciones no aprobadas para la K, la ausencia de persistencia de los datos principales tras recargar y una estructura de interfaz que mezcla demasiadas funciones fuera de las cuatro áreas aprobadas.

## 1. Arquitectura actual

El proyecto es una aplicación estática de **React 19**, **TypeScript**, **Vite 7**, **Tailwind 4**, **Wouter** y **shadcn/ui**. Se ejecuta como cliente estático; el directorio `server/` solo cubre compatibilidad de plantilla y no aporta una API de producto. La exportación PDF se realiza en cliente mediante `jspdf`.

La ruta de KurevaLife renderiza `KurevaLifeApp`, un componente central de 404 líneas. Esta unidad contiene onboarding, estado de sesión, temporizador, registros, avisos, analíticas, documentos, citas, preguntas, alimentos, Kivi, comunidad, feedback, cierre del piloto y exportación PDF. Los formularios de participación y novedades son componentes separados, pero el núcleo del producto no está aún descompuesto en un sistema de componentes aprobado como `AppShell`, `BottomNavigation`, `Card`, `Input`, `Tabs`, `Switch`, `EmptyState` y `KiviLauncher`.

| Área | Estado actual | Hallazgo de auditoría |
|---|---|---|
| Enrutado | Wouter | Hay rutas de KurevaLife en `/vida`, `/kurevalife` y rutas de compatibilidad de CDN/Edge. |
| App principal | `KurevaLifeApp.tsx` | Centraliza 404 líneas y gran parte de los comportamientos del simulador. |
| Estilos | `index.css` | Tokens K Flúida correctos, pero incorpora capas móviles sucesivas y reglas de animación contrarias al contrato. |
| Feedback y novedades | `PilotFeedback`, `PilotInterestForm`, `pilotFeedback.ts` | Separados del estado local de la app y conectados a Supabase mediante REST. |
| Instalación | `manifest.webmanifest` | Existe manifest e icono, pero no existe service worker ni modo offline instalable real. |

## 2. Rutas y superficie pública

| Ruta | Resultado actual | Observación |
|---|---|---|
| `/` | Landing general de Kureva | Correcta como espacio institucional, ajeno al flujo principal de la app. |
| `/vida` | KurevaLife | Ruta principal del simulador. |
| `/kurevalife` | KurevaLife | Alias adicional. |
| `/functions/v1/kurevalife-piloto` y `/functions/v1/kurevalife-piloto/vida` | KurevaLife | Compatibilidad heredada de intentos de publicación. |
| Ruta de reserva con `window.location.pathname.includes('/vida')` | KurevaLife | Lógica de compatibilidad para CDNs, no parte de una arquitectura limpia de producto. |

La landing pública `https://kurevadigitaldata.manus.space/vida` y el alias público de Vercel devolvieron HTTP 200 durante esta auditoría. Este resultado confirma disponibilidad HTTP, no conformidad funcional completa.

## 3. Navegación frente al contrato aprobado

El contrato fija de forma invariable la navegación principal:

> **Hoy → Registrar → Informes → Perfil**

La navegación actual del simulador contiene siete destinos: **Inicio, Registrar, Avisos, Citas, Alimentos, Kivi y Tu opinión**. Esto incumple el orden aprobado, incorpora Kivi como destino principal en vez de asistente secundario y divide avisos, citas, alimentos y participación en pestañas principales.

| Requisito aprobado | Estado actual | Resultado |
|---|---|---|
| Cuatro destinos principales | Siete destinos principales | **Incumple** |
| Hoy como primera pestaña | Se denomina “Inicio” | **Incumple** |
| Registrar como segunda | Presente | Cumple parcialmente |
| Informes como tercera | No aparece en la navegación | **Incumple** |
| Perfil como cuarta | No aparece en la navegación | **Incumple** |
| Kivi como asistente secundario | Es una pestaña principal | **Incumple** |

## 4. Identidad, paleta y movimiento de marca

Los tokens base en `index.css` coinciden con la paleta aprobada: Bosque `#0F3A2D`, Crema `#F5F1E7`, Musgo `#5E806E`, Lima `#D9FF2B` y Tinta `#173A2E`. El modo nocturno usa superficies de bosque profundo y evita el negro puro, lo que se alinea con el contrato.

Sin embargo, la implementación actual contradice la instrucción explícita de movimiento de marca. La auditoría encontró **18 referencias** a pulso, respiración, rebote o animaciones relacionadas. En particular existen `kureva-k-pulse`, `kureva-k-breathe`, `animate-pulse` y un rebote de confirmación. La K debe **girar continuamente** y no latir, respirar, pulsar ni rebotar. El aro puede girar; el isotipo no debe escalar ni usar animaciones de pulso.

También se identificó iconografía con lectura sanitaria —por ejemplo `Stethoscope`, `Pill`, `Activity` y `HeartHandshake`— dentro de la interfaz principal. Aunque los textos establecen límites médicos de forma adecuada, estas elecciones visuales contradicen el requisito de tratamiento organizativo y no clínico.

## 5. Estado, persistencia y simulacro local-first

La mayor parte del estado de KurevaLife se mantiene en `useState`: registro de onboarding, perfil, records, recordatorios, documentos, analíticas, preguntas y citas. Durante la prueba funcional se confirmó lo siguiente:

| Prueba ejecutada | Resultado |
|---|---|
| Completar onboarding | Funciona en navegador móvil emulado. |
| Crear un registro de tensión | Funciona y se muestra en la sesión activa. |
| Crear un aviso visual | Funciona y se muestra en la sesión activa. |
| Activar modo nocturno | Funciona visualmente en la sesión activa. |
| Recargar el navegador | El registro creado deja de estar disponible. |

Los únicos usos detectados de `sessionStorage` son el código de ticket del feedback y el origen de entrada. No hay `localStorage`, IndexedDB ni otra persistencia para los datos principales de la simulación. Por tanto, el producto declara “local” pero su información central **no sobrevive a una recarga**, lo que incumple el requisito local-first cuando sea técnicamente posible.

Los adjuntos de imagen se transforman temporalmente a `dataUrl`; los PDF y otros archivos quedan solo como metadatos. Es decir, se puede seleccionar un archivo, pero no existe una persistencia duradera del archivo ni de su registro tras la recarga.

## 6. Funciones existentes y límites observados

| Función | Estado observado | Límite de conformidad |
|---|---|---|
| Onboarding | Registro de prueba en tres pasos | Solicita contraseña ficticia y no prioriza el uso sin cuenta como ruta claramente independiente. |
| Registros | Escritura, dictado, foto/captura/PDF/archivo | Funciona en sesión; no persiste tras recargar. |
| Dictado | Usa Web Speech API con fallback textual | El fallback no bloquea; correcto. |
| Avisos | Crea avisos visuales y solicita permiso de navegador | Funciona en sesión; no hay programación persistente. |
| Hidratación | Objetivo personal, estación y actividad | Mantiene el aviso no médico adecuado. |
| Analíticas | Hasta tres fechas y adjuntos locales | Está dentro de Registrar y no dentro de Informes; no persiste. |
| Preguntas de consulta | Plantillas seleccionables y pregunta propia | Existe y se incluye en el PDF local. |
| PDF | Generación cliente con nota de no sustitución médica | Se abre en iOS y descarga en otros navegadores; depende de la sesión actual. |
| Kivi | Simulación de conversación | No diagnostica en el texto revisado, pero se presenta como destino principal. |
| Modo nocturno | Cambia superficies y contraste | Funciona en sesión, sin persistencia. |
| Tamaño de texto y contraste | Controles disponibles | Funcionan dentro de la sesión; no persisten. |
| Feedback | Valoración, categoría, comentario privado, anonimato y consentimiento | Comunicación externa separada del contenido local. |
| Comunidad | Publicación temporal mediante Supabase | Requiere auditoría de políticas antes de considerarla segura para testers. |

## 7. Supabase, datos de feedback y privacidad

`pilotFeedback.ts` realiza llamadas REST directas contra Supabase para `pilot_feedback`, `pilot_interest`, `pilot_community_messages` y `pilot_windows`. La clave publicada es una clave pública de cliente; esto es compatible con una arquitectura Supabase pública **solo si** RLS, las políticas de inserción y las políticas de lectura están definidas de forma estricta.

La auditoría intentó consultar las políticas de las tablas mediante el conector de Supabase. El conector devolvió un error de permiso y no permitió realizar la consulta. Por ello:

> **No ha sido posible verificar de forma independiente las políticas RLS, el aislamiento de reseñas privadas ni los permisos de lectura de la comunidad.**

No existe base técnica suficiente para afirmar que el buzón, los correos ni la comunidad están protegidos correctamente hasta obtener una revisión con permiso administrativo verificable. El código de cliente además prepara alternativas `mailto:` si falla el envío, con aviso sobre pérdida de anonimato frente a Kureva.

## 8. Accesibilidad y móvil

Se inspeccionaron 360×800, 390×844, 412×915 y 430×932 mediante Chromium con modo táctil móvil. En los cuatro anchos no se detectó desbordamiento horizontal ni errores de JavaScript durante onboarding. Los inputs usan 16 px en móvil y los botones de navegación medidos tenían 68 px de alto.

| Validación móvil | 360 | 390 | 412 | 430 |
|---|---:|---:|---:|---:|
| Overflow horizontal | No | No | No | No |
| Error de página | No | No | No | No |
| Botones de navegación <44 px | No | No | No | No |
| Destinos de navegación | 7 | 7 | 7 | 7 |

Hallazgos de accesibilidad y usabilidad:

1. En onboarding, el control checkbox medido tiene aproximadamente **13×16 px**; su etiqueta es clicable, pero el control por sí mismo no alcanza el objetivo táctil mínimo especificado.
2. La navegación móvil no es una barra inferior de cuatro destinos. Es una cuadrícula sticky de siete destinos que puede ocupar varias filas. Después del flujo de entrada, la medición de la cuadrícula mostró filas parcialmente fuera de la ventana en varios viewports; esto no demuestra overflow horizontal, pero sí una accesibilidad vertical inestable y una jerarquía distinta de la referencia aprobada.
3. Hay un uso abundante de texto de 10–13 px. La capa CSS lo eleva parcialmente en móvil, pero el contrato fija 16 px como mínimo de interfaz para personas mayores y no existe una validación sistemática componente por componente.
4. Los controles de lectura y sonidos son opcionales, existen alternativas textuales y el dictado tiene fallback. Esto es positivo.
5. El CSS respeta `prefers-reduced-motion`, pero las animaciones de pulsación/respiración no deben existir incluso antes de aplicar esa preferencia, pues contradicen la regla de marca.
6. Hay overlays de envío a pantalla completa dentro de formularios de feedback. Son breves y presentan estado de carga, pero deben vigilarse porque el contrato prohíbe overlays que oculten acciones o generen bloqueos innecesarios.

## 9. Responsive, instalación y rendimiento

La compilación de producción se completó correctamente. No obstante, Vite informó un bundle principal de aproximadamente **1,385 kB** sin comprimir y **360.63 kB** comprimido; existen avisos de chunks superiores a 500 kB. Esto no impide la prueba actual, pero es un riesgo para carga inicial en conexiones móviles limitadas.

El manifest declara `display: standalone`, color de fondo, orientación vertical e icono SVG. No se detectó un service worker ni un mecanismo de caché offline. La aplicación puede instalarse como acceso web, pero no se verificó una experiencia PWA offline real.

## 10. Validaciones ejecutadas

| Validación | Resultado |
|---|---|
| TypeScript — `pnpm check` | Correcto, sin errores. |
| Build — `pnpm build` | Correcto. Aviso por bundle grande. |
| `git diff --check` | Correcto. |
| Lint | No existe script de lint configurado. |
| Tests automatizados | No existe script de test configurado. |
| Flujo móvil local | Onboarding, registro, aviso y modo nocturno funcionan durante la sesión. |
| Persistencia tras recarga | Falla: registro no persiste. |
| Auditoría RLS Supabase | Bloqueada por falta de permiso del conector. |
| Disponibilidad HTTP pública | URLs comprobadas devuelven HTTP 200. |

## 11. Incumplimientos del contrato maestro identificados

| Prioridad | Incumplimiento verificable |
|---|---|
| Crítica | Navegación con siete destinos en lugar de **Hoy → Registrar → Informes → Perfil**. |
| Crítica | Kivi funciona como pestaña principal en lugar de asistente secundario. |
| Crítica | No existe la pestaña principal Informes ni Perfil conforme a la estructura aprobada. |
| Crítica | La K usa pulso, respiración y rebote además del giro; solo está aprobado el giro. |
| Crítica | Los datos principales se pierden tras recargar; no hay persistencia local-first. |
| Alta | La interfaz concentra datos, avisos, citas, alimentos, Kivi y feedback en siete secciones; no corresponde a la arquitectura aprobada. |
| Alta | Existen iconos clínicos incompatibles con el enfoque visual organizativo no médico. |
| Alta | Las políticas de Supabase para feedback y comunidad no han podido verificarse con acceso administrativo. |
| Alta | El onboarding no presenta un uso sin cuenta claramente independiente y priorizado. |
| Media | Navegación móvil sticky de varias filas con posiciones parcialmente fuera de la ventana durante el flujo auditado. |
| Media | Texto de interfaz inferior a 16 px en varias piezas; correcciones CSS parciales, no sistemáticas. |
| Media | No existe service worker ni modo offline funcional confirmado. |
| Media | No existen scripts de lint ni tests automatizados en el repositorio. |
| Media | El bundle principal supera la recomendación de tamaño de Vite. |

## 12. Estado de cambios durante la auditoría

No se modificó código de producto, dependencias, estilos, rutas, datos remotos ni despliegue. La auditoría solo generó este documento y artefactos locales temporales de inspección, que se eliminan al cerrar la revisión. El árbol de código rastreado no presentó diferencias pendientes frente al último commit durante la auditoría.

> **Conclusión de auditoría:** la aplicación actual contiene material funcional reutilizable, pero no está alineada aún con la primera experiencia de testers especificada. En particular, no debe considerarse una implementación conforme del sistema visual, de la navegación ni del comportamiento local-first hasta corregir los incumplimientos enumerados.
