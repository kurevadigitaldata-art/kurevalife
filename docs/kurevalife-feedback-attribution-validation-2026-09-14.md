# Validación de atribución en la valoración final — KurevaLife

**Fecha:** 14 de septiembre de 2026  
**Repositorio canónico:** `kurevadigitaldata-art/kurevalife`  
**Ruta:** `/kurevalife/vida`

## Alcance y fuente de verdad

Esta corrección se limita exclusivamente al cierre de **valoración y sugerencias** del simulacro. No modifica el onboarding, nombre o alias inicial, pantallas funcionales, navegación, estilos, identidad visual, landing ni las demás interacciones. El nombre o alias disponible al terminar onboarding procede del estado en memoria de la pestaña actual; no se persiste al recargar.

## Cambios confirmados

| Aspecto                       | Comportamiento implementado                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atribución con nombre o alias | La opción **«Publicar con mi nombre o alias»** queda seleccionada por defecto cuando existe un nombre o alias inicial. La vista de confirmación muestra ese nombre junto con la valoración y sugerencia. |
| Atribución anónima            | **«Publicar de forma anónima»** oculta el nombre o alias, incluso en el encabezado de la pantalla final, y genera un código temporal `KLV-…` mediante el navegador.                                      |
| Sin nombre inicial            | La alternativa con nombre queda deshabilitada y se selecciona de forma segura la opción anónima.                                                                                                         |
| Confirmación                  | Tras seleccionar estrellas y escribir una sugerencia, la pantalla final muestra la identidad elegida, la puntuación y el texto exacto introducido.                                                       |
| Datos y publicación           | El rótulo de publicación completa una demostración local. No se almacena, publica ni transmite información; tanto el comentario como el código desaparecen al recargar o volver a Bienvenida.            |

## Validación ejecutada

| Comprobación         | Resultado                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm test`          | Correcto: 6 pruebas unitarias superadas.                                                                |
| `pnpm check`         | Correcto: TypeScript sin errores.                                                                       |
| `pnpm build`         | Correcto.                                                                                               |
| Atribución con alias | Correcto: reutiliza **Alex** y muestra 4/5 estrellas y la sugerencia en la confirmación.                |
| Atribución anónima   | Correcto: no muestra el alias, genera código `KLV-…`, muestra 5/5 estrellas y la sugerencia.            |
| Sin alias            | Correcto: la atribución anónima se activa de forma predeterminada y la opción de nombre se deshabilita. |
| Transmisión de datos | Correcto: durante ambas rutas no se observaron solicitudes `POST`, `PUT` ni `PATCH`.                    |
| Regresión responsive | Correcto en móvil 390 × 844, tableta 768 × 1024 y escritorio 1280 × 900, sin desbordamiento horizontal. |

## Accesibilidad y límites

Las opciones de identidad son controles de radio con etiquetas descriptivas. La puntuación conserva roles de radio y anuncia la selección. La confirmación contiene un resumen textual de la aportación. La funcionalidad sigue siendo una simulación: una publicación real exigiría autenticación, consentimiento explícito, moderación, retención, borrado y un transporte seguro antes de aceptar datos personales o comentarios.
