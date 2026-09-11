# Entrega técnica — KurevaLife: fases C a J

**Fecha:** 11 de septiembre de 2026
**Alcance:** Simulacro local-first para testers, conforme al Prompt Maestro aprobado.
**Ruta de la aplicación:** `/vida`
**Repositorio oficial:** `kurevadigitaldata-art/kurevalife`

## Resultado de la implementación

Se ha sustituido el contenido estructural de las pestañas por un recorrido funcional de aplicación. La navegación se mantiene estrictamente en el orden **Hoy → Registrar → Informes → Perfil**. Kivi continúa siendo secundario y se ha reubicado en la cabecera para que sea accesible sin flotar sobre formularios, acciones o la navegación inferior.

| Fase                       | Antes                                              | Después                                                                                                                     | Validación funcional                                                                              |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| C · Hoy                    | Panel informativo sin contenido operativo          | Saludo, progreso, siguiente acción, rutinas marcables, estado local y CTA para registrar                                    | Las rutinas actualizan progreso y persisten en el dispositivo                                     |
| D · Registrar              | Sin formularios funcionales en la nueva carcasa    | Datos, notas, dictado no bloqueante, foto/captura/PDF/archivo y confirmación local                                          | Registro de tensión, nota y metadatos de archivo visibles en Informes                             |
| E · Avisos e hidratación   | Sin flujo operativo integrado                      | Avisos visuales con hora y frecuencia; objetivo personal de agua, estación y actividad                                      | Confirmación visible, lista de avisos y contador de vasos funcionan                               |
| F · Informes               | Sin resumen integrado                              | Resumen, tendencias neutras, registros, preguntas de consulta, descarga de PDF y compartir                                  | PDF descargado con registros, archivo local, avisos, agua y nota de límites                       |
| G · Perfil y accesibilidad | Contenido de fase pendiente                        | Modo nocturno, texto ampliado, alto contraste, preferencias de sonido/mensajes visuales, preguntas de consulta              | Todos los controles modifican estado local real y las preguntas entran al PDF                     |
| H · Kivi                   | Lanzador deshabilitado                             | Asistente secundario abierto desde la cabecera, opciones, texto y respuesta guiada                                          | Kivi no tapa controles ni diagnostica                                                             |
| I · Modo nocturno          | Tokens parciales y contraste insuficiente          | Misma jerarquía y componentes con tokens profundos de bosque y contraste reforzado                                          | El contraste medido para títulos, labels, controles y firma usa `#F5F1E7` sobre superficie oscura |
| J · Feedback               | Formulario externo no integrado con el nuevo flujo | Valoración 1–5, comentario público, comentario privado, qué quitar/añadir, anonimato, consentimiento y novedades opcionales | Confirmación de éxito y fallback local verificados con respuestas simuladas de red                |

## Archivos modificados o creados

| Archivo                                               | Cambio                                                                                              |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `client/src/components/KurevaLifeApp.tsx`             | Orquestación completa del simulacro, persistencia y navegación de vistas                            |
| `client/src/components/kurevalife/types.ts`           | Modelo local-first para rutinas, registros, adjuntos, avisos, hidratación, preguntas y preferencias |
| `client/src/components/kurevalife/AppShell.tsx`       | Navegación fija aprobada y acceso a Kivi desde cabecera                                             |
| `client/src/components/kurevalife/Screens.tsx`        | Pantallas Hoy, Registrar, Avisos, Hidratación, Informes, Perfil y Kivi                              |
| `client/src/components/kurevalife/FeedbackScreen.tsx` | Feedback de prueba y consentimiento opcional de novedades                                           |
| `client/src/components/kurevalife/screens.css`        | Estilos mobile-first de componentes y contraste nocturno                                            |
| `client/src/index.css`                                | Inclusión de los estilos de pantallas y corrección del foco visible                                 |
| `verify_phase_cj.py`                                  | Validación de flujo en cuatro viewports y comprobación de PDF                                       |
| `verify_feedback_states.py`                           | Validación de estados de éxito y error del feedback                                                 |
| `check_night_contrast.py`                             | Medición de colores calculados en modo nocturno                                                     |

## Capturas y validación móvil

Las capturas se han producido desde una compilación de producción con Playwright. La prueba comenzó desde el alta local, registró un dato de tensión (`120 / 80 mmHg`), adjuntó un PDF de prueba, creó un aviso visual, sumó un vaso de agua, activó el modo nocturno, abrió Kivi y llegó al feedback.

| Viewport  | Overflow horizontal | Acciones Hoy, Registrar, Avisos, Agua, Informes, PDF, Perfil, Kivi y Feedback | Foco por teclado | Botones inferiores a 44 px | Errores de página |
| --------- | ------------------: | ----------------------------------------------------------------------------: | ---------------: | -------------------------: | ----------------: |
| 360 × 800 |                  No |                                                                     Correctas |               Sí |                          0 |                 0 |
| 390 × 844 |                  No |                                                                     Correctas |               Sí |                          0 |                 0 |
| 412 × 915 |                  No |                                                                     Correctas |               Sí |                          0 |                 0 |
| 430 × 932 |                  No |                                                                     Correctas |               Sí |                          0 |                 0 |

**Capturas:**

- [Hoy · 390 px](/home/ubuntu/kureva-phase-cj-qa/390-hoy.png)
- [Informes · 390 px](/home/ubuntu/kureva-phase-cj-qa/390-informes.png)
- [Perfil nocturno · 390 px](/home/ubuntu/kureva-phase-cj-qa/390-perfil-nocturno.png)
- [Feedback · 390 px](/home/ubuntu/kureva-phase-cj-qa/390-feedback.png)
- [Éxito de feedback](/home/ubuntu/kureva-feedback-qa/feedback-success.png)
- [Fallback local de feedback](/home/ubuntu/kureva-feedback-qa/feedback-error.png)

## Accesibilidad revisada

La interfaz usa landmarks, navegación inferior con nombres visibles, labels asociados a los campos, iconos con alternativa accesible, foco visible, controles táctiles de 44 px o más, navegación por teclado y un enlace para saltar al contenido. El dictado no bloquea el formulario: si no está disponible se comunica en lenguaje humano y se mantienen las alternativas de escritura y adjunto. El sonido es opcional; las confirmaciones de registro, aviso, PDF y feedback disponen de texto visible. El modo de texto ampliado y el alto contraste cambian el estado de la aplicación, no son controles decorativos.

## Estados y límites explícitos

Los registros del simulacro permanecen en `localStorage` bajo la clave `kurevalife-simulator-v3`. El selector de archivos almacena localmente metadatos del adjunto en el simulacro y no sube archivos a un servidor. El PDF se genera en el navegador. KurevaLife muestra de manera constante que organiza información personal y no diagnostica, prescribe ni sustituye a profesionales sanitarios.

Las valoraciones y las preferencias de novedades usan el buzón de piloto ya configurado. Si la red no puede aceptar una valoración, el contenido se conserva localmente y se muestra un mensaje claro, sin errores técnicos. La consulta administrativa de RLS de Supabase sigue siendo una **limitación externa registrada**: la credencial actual no permite verificar políticas administrativas, aunque no bloquea el funcionamiento local-first del simulacro.

## Comprobaciones técnicas

| Comprobación                            | Resultado                                                                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript (`pnpm check`)               | Correcto                                                                                                                                       |
| Formato de cambios (`git diff --check`) | Correcto                                                                                                                                       |
| Build de producción (`pnpm build`)      | Correcto                                                                                                                                       |
| Flujo móvil en 360/390/412/430 px       | Correcto, sin overflow ni errores de página                                                                                                    |
| PDF local                               | Correcto; contenido extraído y verificado                                                                                                      |
| Feedback con respuesta exitosa          | Correcto                                                                                                                                       |
| Feedback con error de red               | Correcto; fallback local visible                                                                                                               |
| Lint                                    | El paquete no define un script de lint. Se han aplicado las comprobaciones disponibles: TypeScript, compilación, diffs y pruebas de navegador. |

La compilación informa de un aviso no bloqueante sobre un bundle JavaScript superior a 500 kB. No impide el simulacro ni produce error de ejecución; queda registrado como consideración de rendimiento para una fase posterior, sin alterar el sistema aprobado en esta entrega.
