# Validación de los cinco primeros pasos — KurevaLife

**Fecha:** 13 de septiembre de 2026  
**Repositorio canónico:** `kurevadigitaldata-art/kurevalife`  
**Ruta:** `/kurevalife/vida`

## Alcance estricto

Esta entrega modifica únicamente el recorrido inicial de cinco pantallas del simulacro. No rediseña ni altera las pantallas posteriores de Hoy, Registrar, Informes, Perfil o Kivi.

## Contenido aprobado aplicado

| Paso             | Contenido y comportamiento verificado                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Bienvenida    | Firma KurevaLife by Kureva, “Tu día en orden. Tu bienestar más claro.”, la presentación aprobada, CTA Comenzar simulacro, enlace Conocer Kureva y aviso de que no se guardan datos reales. |
| 2. Introducción  | Versión neutral aprobada: no muestra nombre, género ni adjetivos condicionados. Conserva el botón Comenzar.                                                                                |
| 3. Inclusión     | Cuatro bloques respetuosos: discapacidad visual, discapacidad auditiva, mayores de 18 años y modo familiar; los dos primeros activan sus apoyos de prueba.                                 |
| 4. Registro      | Idioma Español / English primero; campos de nombre, apellidos, correo y teléfono comienzan vacíos; incluye selector de tamaño de texto.                                                    |
| 5. Configuración | Sonido, traducción en línea, modo de lectura fácil, comunicaciones opcionales, mensaje Tranquilidad Kureva, consentimiento y botón Finalizar bloqueado hasta aceptar.                      |

La selección de idioma actualiza el atributo semántico `lang` del documento dentro del recorrido. La traducción en línea se conserva como preferencia de simulación, sin realizar solicitudes a servicios externos ni enviar datos personales. Las selecciones de comunicaciones siguen siendo de prueba y no se transmiten.

## Validación ejecutada

| Comprobación                                | Resultado                                                                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                                 | Correcto: 6 pruebas superadas.                                                                                                                 |
| `pnpm check`                                | Correcto: TypeScript sin errores.                                                                                                              |
| `pnpm build`                                | Correcto.                                                                                                                                      |
| Flujo de los cinco pasos en móvil 390 × 844 | Correcto. Verifica textos aprobados, campos inicialmente vacíos, idioma, texto muy grande, consentimiento y regreso a Bienvenida tras recarga. |
| Regresión responsive                        | Correcta en móvil, tableta y escritorio, sin desbordamiento horizontal y con la rotación de K respetando movimiento reducido.                  |

El simulacro sigue siendo estrictamente de prueba y mantiene su regla de no persistir los datos al recargar o cerrar la pestaña.
