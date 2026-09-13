# Validación de personalización y sesión — KurevaLife

> **Histórico.** Este informe registra la validación de un checkpoint anterior del 13 de septiembre. El contenido aprobado actual de las cinco primeras pantallas es neutral y queda documentado en `docs/kurevalife-first-five-screens-validation-2026-09-13.md`; ese documento es la referencia vigente para aceptar el recorrido inicial.

**Fecha:** 13 de septiembre de 2026  
**Repositorio canónico:** `kurevadigitaldata-art/kurevalife`  
**Ruta de simulación:** `/kurevalife/vida`

## Alcance y corrección principal

La simulación restauraba un estado persistente de una versión anterior de `localStorage`. Por ese motivo, una visita nueva podía entrar directamente al dashboard con el perfil de ejemplo “Nathalia”, en lugar de comenzar por Bienvenida. El comportamiento se corrigió: el estado de la simulación vive exclusivamente en memoria. Al recargar, cerrar la pestaña o abrir un enlace nuevo, el recorrido vuelve a la pantalla de Bienvenida y elimina nombre, registros, preferencias y archivos de ejemplo de esa prueba.

La clave heredada propia de KurevaLife se elimina en el arranque para evitar restauraciones de compilaciones anteriores. No se eliminan claves ajenas del navegador.

## Flujo guiado implementado

| Pantalla         | Comportamiento confirmado                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1. Bienvenida    | Presenta “Tu día en orden. Tu bienestar más claro.” y declara que los datos de ejemplo desaparecen al cerrar o recargar.      |
| 2. Introducción  | Personaliza el título y la redacción por nombre y trato: femenino, masculino o neutro/no binario.                             |
| 3. Inclusión     | Permite activar apoyo para lector de pantalla y subtítulos/transcripciones visibles.                                          |
| 4. Registro      | Recoge nombre y apellidos de ejemplo, trato y tamaño de texto; correo y teléfono no se incorporan al estado de la simulación. |
| 5. Configuración | Aplica de forma inmediata sonido/voz opcional, subtítulos, lectura fácil y modo nocturno.                                     |
| 6. Hoy           | Muestra el saludo dinámico “Hola, [Nombre]” y mantiene las cuatro pestañas obligatorias: Hoy, Registrar, Informes y Perfil.   |

## Personalización y accesibilidad

La introducción de Nathalia usa “Bienvenida”, “seleccionada” y “tranquila”. Un perfil masculino como Carlos usa “Bienvenido”, “seleccionado” y “tranquilo”. El trato neutro usa “Te damos la bienvenida” y elimina adjetivos con género.

Los tamaños **Grande** y **Muy grande** ajustan la escala tipográfica, el alto de botones y el flujo de tarjetas sin desbordamiento horizontal. El modo nocturno usa fondo bosque profundo y texto claro. El apoyo para lector de pantalla y el sonido opcional anuncian cambios de pantalla y respuestas de Kivi mediante una voz del navegador cuando está disponible; ningún flujo depende de ese sonido. Kivi conserva siempre una respuesta visible y, cuando están activados, una transcripción explícita.

## Respuestas y validación humana

Kivi incorpora el consejo de bienestar solicitado y personaliza el mensaje con el nombre de la persona. Un dato de tensión inválido muestra el mensaje amable solicitado: “¡Uy! Se nos escapó un número por ahí…”. Kivi no interpreta datos ni realiza diagnóstico.

## Evidencia ejecutada

| Comprobación                  | Resultado                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `pnpm test`                   | Correcto: 7 pruebas superadas, incluidos los tres tratos de bienvenida.                                     |
| `pnpm check`                  | Correcto: TypeScript sin errores.                                                                           |
| Build estándar y GitHub Pages | Correctos.                                                                                                  |
| Flujo móvil guiado            | Correcto: femenina, masculina, neutra, modo nocturno, texto muy grande, Kivi, validación amable y reinicio. |
| Memoria entre recargas        | Correcto: el perfil Carlos y su registro desaparecen tras recargar.                                         |
| Responsive                    | Correcto sin desbordamiento en móvil 390 × 844, tableta 768 × 1024 y escritorio 1280 × 900.                 |
| Movimiento reducido           | Correcto: la K ornamental detiene su rotación cuando el sistema solicita `prefers-reduced-motion`.          |

## Límite honesto

El prototipo puede solicitar al navegador `speechSynthesis` para una voz opcional, pero la disponibilidad y las voces concretas dependen del navegador y del dispositivo. El simulacro no realiza una lectura de pantalla real ni sustituye a las tecnologías de asistencia del sistema operativo; mantiene etiquetas, foco, anuncio `aria-live` y texto visible para que dichas tecnologías puedan interpretar la interfaz.
