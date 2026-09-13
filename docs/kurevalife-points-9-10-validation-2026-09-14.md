# Validación de las pantallas 9 y 10 — KurevaLife

**Fecha:** 14 de septiembre de 2026  
**Repositorio canónico:** `kurevadigitaldata-art/kurevalife`  
**Ruta:** `/kurevalife/vida`

## Alcance

Esta entrega completa el recorrido aprobado con el módulo **Entorno Social y Ciencia** dentro de la cuarta pestaña obligatoria, **Perfil**, y con el cierre local de la prueba. La navegación principal conserva exactamente cuatro destinos: **Hoy, Registrar, Informes y Perfil**. Kivi continúa como panel secundario y no se añadió una quinta pestaña.

## Cambios confirmados

| Pantalla                    | Implementación                                                                                                                                                           | Límite operativo                                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9. Entorno Social y Ciencia | Perfil presenta Comunidad Abierta con tres comentarios de ejemplo en área de scroll, Alimentos de Temporada con tres fichas informativas y una nota de rigor científico. | No se habilitan publicaciones, perfiles, mensajes, fotos ni datos de salud reales. La información estacional es general, basada en fuentes públicas y no personalizada.                        |
| 10. Cierre                  | Valoración de una a cinco estrellas, campo de sugerencias temporal, mensaje de finalización, enlace público de Kureva y créditos de propiedad.                           | El control usa el texto solicitado de publicación para completar la demostración, pero no publica ni transmite información. La valoración y el comentario se eliminan al recargar o finalizar. |

## Validación ejecutada

| Comprobación                   | Resultado                                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                    | Correcto: 6 pruebas superadas.                                                                                                    |
| `pnpm check`                   | Correcto: TypeScript sin errores.                                                                                                 |
| `pnpm build`                   | Correcto.                                                                                                                         |
| Flujo 9–10 en móvil 390 × 844  | Correcto: Entorno, scroll de comentarios, contenido estacional, estrellas, comentario local, finalización y retorno a Bienvenida. |
| Transmisión de datos en cierre | Correcto: el navegador no emitió solicitudes `POST`, `PUT` ni `PATCH` durante la valoración de prueba.                            |
| Responsive                     | Correcto en móvil 390 × 844, tableta 768 × 1024 y escritorio 1280 × 900 sin desbordamiento horizontal.                            |
| Navegación                     | Correcto: se mantienen Hoy, Registrar, Informes y Perfil; Kivi es secundario.                                                     |

## Revisión visual

La pantalla de Entorno utiliza tarjetas compactas, legibles y táctiles para mantener el lenguaje mobile-first del simulacro. En tableta y escritorio, la aplicación conserva el contenedor centrado y evita convertirse en un panel de escritorio expandido. El cierre coloca la confirmación y los controles de valoración en una sola columna, con el botón de finalización y la navegación inferior disponibles sin solapamientos.

## Límites pendientes de una aplicación online

Una Comunidad abierta real requerirá autenticación, consentimiento específico, moderación, reportes, reglas de contenido, borrado, retención y un protocolo de seguridad. La recopilación de opiniones reales requerirá base legal, aviso de privacidad, mecanismos de retirada y una frontera segura de transporte. Ninguna de estas capacidades se afirma ni se activa en el simulacro.
