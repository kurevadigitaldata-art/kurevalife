# Validación de los puntos 6 a 8 — KurevaLife

**Fecha:** 14 de septiembre de 2026  
**Repositorio canónico:** `kurevadigitaldata-art/kurevalife`  
**Ruta:** `/kurevalife/vida`

## Alcance

Esta entrega adapta únicamente el panel **Hoy**, la pestaña **Informes** y el panel secundario de **Kivi** al guion aprobado de los puntos 6, 7 y 8. Conserva las cuatro pestañas obligatorias —Hoy, Registrar, Informes y Perfil— y no convierte Kivi en una quinta pestaña. Los controles incorporados son interacciones locales del simulacro: no crean cuentas, no sincronizan datos, no envían recordatorios, no suben archivos y no realizan diagnóstico ni análisis clínico.

## Cambios confirmados

| Punto                    | Implementación de simulacro                                                                                                                                      | Límite explícito                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6. Hoy                   | Panel con constantes vitales, alta manual de datos, antecedentes, agua de un toque, alimentación, aviso visual de medicación, cita de ejemplo y progreso diario. | Cada dato permanece solo en memoria durante la pestaña. Los valores no se interpretan clínicamente.                                                     |
| 7. Analíticas e informes | Controles Imagen, Análisis y Revisión; selección local de imagen o PDF para demostrar el recorrido; progreso de tres documentos y PDF local ya existente.        | No se suben ni leen imágenes; no se extraen resultados ni se generan gráficos clínicos. La descripción de funciones conectadas se presenta como futura. |
| 8. Kivi                  | Chat secundario con las seis preguntas aprobadas sobre alimentación, analíticas, medicación, límites médicos, comunidad y estacionalidad.                        | Cada respuesta recuerda cuándo una función es futura, no activa o no diagnóstica. La transcripción visible sigue disponible.                            |

## Validación ejecutada

| Comprobación          | Resultado                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`           | Correcto: 6 pruebas superadas.                                                                                             |
| `pnpm check`          | Correcto: TypeScript sin errores.                                                                                          |
| `pnpm build`          | Correcto.                                                                                                                  |
| Flujo móvil 390 × 844 | Correcto: registra tensión, antecedente, agua, alimentación y un aviso visual; verifica Informes y las respuestas de Kivi. |
| Responsive            | Correcto en móvil 390 × 844, tableta 768 × 1024 y escritorio 1280 × 900, sin desbordamiento horizontal.                    |
| Movimiento reducido   | Correcto: la marca K detiene la rotación ornamental cuando el sistema lo solicita.                                         |

## Revisión visual

El panel Hoy conserva la densidad y jerarquía de una aplicación móvil: tarjetas verticales, objetivos táctiles amplios y navegación inferior disponible. En tableta y escritorio, el simulacro permanece como una experiencia compacta centrada, sin estirarse a una interfaz de gestión de escritorio. Kivi se abre como un panel secundario en la experiencia y no altera la navegación de cuatro destinos.

## Límites pendientes de una aplicación online

La aplicación conectada requerirá, antes de aceptar información real, consentimiento granular, autenticación, cifrado, retención aprobada, políticas de acceso, aviso y configuración explícita de notificaciones, y un protocolo de seguridad clínica. El presente simulacro no sustituye ninguna de esas medidas.
