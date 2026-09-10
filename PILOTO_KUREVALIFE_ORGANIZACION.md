# Protocolo del simulacro KurevaLife: organización y bienestar personal

**Versión:** 2.0 · **Estado:** simulacro navegable preparado para prueba cerrada  
**Grupo previsto:** 10–20 personas de confianza  
**Ámbito exclusivo:** [KurevaLife](https://3000-ipsxdmj6p56lymsfksu6y-c63881cc.us1.manus.computer/kurevalife#demo) (simulacro personal navegable)  
**Responsable:** Nathalia Romero · Kureva, San Miguel de Salinas, Alicante

## 1. Naturaleza del simulacro

KurevaLife se presenta como una libreta personal con inteligencia práctica para organizar el día a día, preparar consultas, recordar horarios y consultar ideas de bienestar. Este simulacro no es una aplicación médica, no realiza diagnósticos, no interpreta datos clínicos, no prescribe tratamientos ni sustituye la atención sanitaria o de urgencias. [2]

El simulacro funciona sin crear una cuenta y sin guardar en la nube los bloques, notas, documentos de ejemplo o mediciones ficticias que la persona pruebe en pantalla. Lo único que se conserva de forma deliberada es la valoración y sugerencia que la persona decida enviar mediante el buzón del piloto, o el correo que decida registrar por separado para recibir novedades del proyecto.

> **Principio de responsabilidad:** La salud y el bienestar de las personas exigen prudencia. KurevaLife ayuda a recordar y a ordenar; ante cualquier duda, dolor, cambio o decisión sobre un tratamiento, la indicación médica prevalece siempre.

## 2. Novedades incorporadas en la versión 2.0

La experiencia de KurevaLife se ha ampliado para responder a las necesidades planteadas para el simulacro:

| Módulo del simulacro | Qué permite probar en este entorno | Qué límite mantiene |
|---|---|---|
| **Mi día** | Vista por bloques, cambio entre días, marcado de tareas y creación de bloques ficticios. | No guarda notas ni bloques al cerrar la sesión; no envía notificaciones del sistema. |
| **Mi salud** | Preparación de citas, lista de preguntas para la consulta, ejemplo de analítica con comparación simulada y botones de registro rápido (tensión, glucosa, molestias). | No interpreta valores analíticos ni guarda datos de salud; no prescribe ni ajusta dosis. |
| **Alimentos** | Fichas de frutas y verduras de temporada (septiembre en España: higos, granada, pimiento rojo y calabaza) con aporte general e ideas sencillas. | Información general de alimentación; no ofrece dietas terapéuticas ni sustituye a profesionales de la nutrición. |
| **Kivi** | Bienvenida de soporte, presentación de sus límites y respuestas a preguntas frecuentes clicables. | Es una simulación guiada; no es un chat libre conectado a un LLM ni un asesor clínico. |
| **Familia** | Presentación conceptual de cómo podría funcionar una gestión familiar respetuosa y revocable. | No recoge datos familiares; invita a dejar sugerencias sobre cómo debería diseñarse. |
| **Controles de lectura** | Conmutador de texto más grande y conmutador de alto contraste. | Ajustes visuales directos en el simulacro para facilitar la prueba a personas con baja visión. |
| **Buzón con estrellas y categorías** | Valoración de 1 a 5 estrellas, categorías específicas, opción de envío anónimo o con nombre voluntario, y confirmación visual animada. | El nombre voluntario solo se guarda en el registro privado del piloto; no se publica. |

## 3. Modelo de privacidad y separación de datos

Para garantizar la confidencialidad de las personas que participan en la prueba, el sistema utiliza dos tablas independientes en la base de datos:

| Tabla | Contenido admitido | Quién puede leer |
|---|---|---|
| `pilot_feedback` | Código aleatorio (`KUREVA-XXXXXX`), área, tipo de sugerencia, categoría temática, valoración (1–5), mensaje, contexto de accesibilidad opcional, indicador de anonimato y nombre voluntario. | Solo la responsable del proyecto. El acceso público está restringido por Row Level Security (RLS) y no permite lectura ni edición desde el navegador. |
| `pilot_interest` | Correo electrónico, rol de participación y consentimientos explícitos para avances y futuros kits. | Solo la responsable del proyecto. No tiene relación técnica con las sugerencias anónimas. |

En el simulacro, la casilla de privacidad informa expresamente que los datos introducidos en los bloques, mediciones y notas ficticias no se transfieren a la base de datos. Una función real de "privacidad total" o cifrado de extremo a extremo requerirá una memoria técnica y legal propia antes de ofrecerse en producción.

## 4. Clasificación de sugerencias recibidas

Las valoraciones y comentarios se organizan según las siguientes categorías temáticas para facilitar su análisis:

1. **Claridad y lenguaje:** comprensión de los textos, ausencia de jerga y tono respetuoso.
2. **Vista diaria y bloques:** comodidad de la organización por bloques y tiempos.
3. **Avisos y recordatorios:** utilidad de las alertas de medicación, citas y pausas.
4. **Organización médica:** facilidad para preparar consultas, guardar preguntas y archivar documentos.
5. **Alimentos y bienestar:** interés por las frutas y verduras de temporada y las ideas prácticas.
6. **Accesibilidad:** contraste, tamaño de texto, navegación por teclado y lectores de pantalla. [1]
7. **Privacidad y confianza:** percepción de seguridad y claridad sobre qué se guarda y qué no.
8. **Kivi y soporte:** utilidad de las preguntas frecuentes y el tono del asistente.
9. **Modo familiar:** opiniones sobre cómo compartir resúmenes con personas de apoyo.
10. **Comunidad Kureva:** ideas sobre cómo compartir recetas y métodos respetando la privacidad.
11. **Otra idea:** propuestas libres no contempladas en las categorías anteriores.

## 5. Criterios de accesibilidad e inclusión

KurevaLife aplica las Pautas de Accesibilidad para el Contenido Web (WCAG 2.2) bajo cuatro principios: [1]

- **Perceptible:** contraste suficiente, etiquetas visibles y conmutadores de texto ampliado y alto contraste.
- **Operable:** todos los controles del simulacro son navegables mediante teclado y no dependen de gestos complejos.
- **Comprensible:** lenguaje llano, separación clara entre lo ficticio y lo real, y avisos de confirmación legibles.
- **Robusto:** estructura semántica compatible con lectores de pantalla y soporte para reducción de movimiento (`prefers-reduced-motion`).

## References

[1]: https://www.w3.org/WAI/standards-guidelines/wcag/ "W3C Web Content Accessibility Guidelines (WCAG) 2 Overview"
[2]: https://www.who.int/health-topics/disability "World Health Organization: Disability and Health"
