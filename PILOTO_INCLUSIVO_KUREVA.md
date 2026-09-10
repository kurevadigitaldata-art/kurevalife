# Protocolo de piloto inclusivo: Kureva y KurevaLife

**Versión:** 1.0 · **Estado:** preparado para prueba cerrada  
**Grupo previsto:** 10–20 personas de confianza  
**Ámbito:** web de Kureva, simulacro de KurevaLife e informe de simulación de costes  
**Responsable editorial:** Nathalia Romero · Kureva, San Miguel de Salinas, Alicante

## 1. Propósito y criterio de salida

Este piloto no pretende validar si una pantalla “gusta”. Su propósito es identificar qué partes de Kureva resultan claras, confusas, excluyentes o útiles antes de abrir la siguiente fase. Las personas participantes no son una audiencia pasiva. Son **personas colaboradoras de prueba** y sus observaciones forman parte del proceso de diseño.

La prueba puede comenzar cuando cada participante reciba el enlace de Kureva y sepa tres cosas antes de entrar: que KurevaLife es un **simulacro**, que no necesita crear una cuenta y que las acciones realizadas dentro de la vista diaria no se guardan como datos de la aplicación. El único contenido persistente de la prueba es una sugerencia que la persona decida enviar voluntariamente y un correo que la persona decida suscribir por separado.

> **Principio del piloto:** Kureva no solicita que una persona se adapte al producto sin más. El producto debe aprender de las maneras reales en las que las personas leen, navegan, recuerdan, priorizan y se comunican.

## 2. Nombres utilizados durante la prueba

Para no convertir a las personas en expedientes, la terminología distingue la colaboración humana de la clasificación operativa.

| Término | Definición | Uso visible para participantes | Uso interno |
|---|---|---|---|
| **Persona colaboradora de prueba** | Persona de confianza que explora el simulacro y comparte una observación voluntaria. | Sí | Sí |
| **Código de prueba anónimo** | Identificador aleatorio con formato `KUREVA-XXXXXX`. No contiene nombre, correo ni perfil. | Sí | Sí |
| **Sugerencia de prueba** | Comentario enviado desde la web, clasificado como observación, problema, idea, accesibilidad o ánimo. | Sí | Sí |
| **Estado interno** | Fase de gestión de una sugerencia: nueva, revisada, planificada, resuelta o archivada. | No | Sí |
| **Interés por avances** | Correo opcional y separado para novedades, futuras aperturas y materiales de Kureva. | Sí | Sí |

No se emplearán los términos “usuario de prueba” como etiqueta principal ni “ticket de tester” en la comunicación externa. **Persona colaboradora de prueba** reconoce que la participación aporta criterio y no solo detecta fallos.

## 3. Recorrido de la persona participante

El flujo de prueba está diseñado para ser breve y no exigir conocimientos técnicos.

| Paso | Acción solicitada | Qué se conserva | Qué no se conserva |
|---|---|---|---|
| 1. Llegada | Leer la bienvenida del simulacro y el aviso de inclusión. | Nada. | Navegación, identidad y datos de acceso no se registran en la base de feedback. |
| 2. Simulacro KurevaLife | Cambiar de día, marcar un bloque, crear un bloque ficticio y escribir una nota de ejemplo. | Nada. | Bloques, notas y cambios del simulacro. |
| 3. Calculadora | Ajustar cifras ficticias o aproximadas y descargar un informe de simulación. | Nada. | Importes de la calculadora y el informe descargado. |
| 4. Sugerencia | Enviar una observación desde el buzón anónimo. | Código aleatorio, categoría, comentario, contexto de accesibilidad opcional y fecha. | Nombre, correo, nota de la demo y relación pública con la persona. |
| 5. Novedades opcionales | Dejar un correo si quiere saber qué cambia o recibir información futura sobre kits. | Correo, tipo de participación y consentimientos. | Vínculo técnico o editorial con una sugerencia anónima. |

## 4. Inclusión y accesibilidad

Kureva declara una intención práctica de inclusión, no una certificación que todavía no se ha auditado formalmente. La prueba busca detectar barreras para personas ciegas, con baja visión, sordas o con discapacidad auditiva, y para distintos modos de interacción, incluyendo teclado, apoyos motores y necesidades de atención o comprensión. La discapacidad no se trata como una excepción individual sino como una relación entre la persona, la tarea y las barreras del entorno. [2]

La interfaz incorpora una vía para que la persona indique, solo si quiere, desde qué necesidad de acceso está probando. Esa información no busca diagnosticar, clasificar clínicamente ni identificar a nadie. Permite agrupar barreras observadas, por ejemplo: “el foco de teclado no se aprecia”, “la explicación depende de una señal visual”, “el texto es demasiado denso” o “el contraste se percibe insuficiente”.

El criterio de evaluación toma como referencia los cuatro principios de las Pautas de Accesibilidad para el Contenido Web (WCAG): contenido perceptible, interfaz operable, información comprensible y tecnología robusta. [1] Durante este piloto, Kureva no afirma todavía conformidad WCAG AA; documenta problemas y prioriza correcciones verificables antes de hacer esa afirmación.

| Área de revisión | Pregunta para la prueba | Evidencia que se busca |
|---|---|---|
| Lectura y contraste | ¿Se distingue el texto importante sin esfuerzo? | Comentarios sobre tamaño, contraste, jerarquía y fatiga visual. |
| Teclado y foco | ¿Se puede recorrer lo importante sin ratón? | Orden de foco, indicadores visibles y acciones que no se pueden ejecutar. |
| Comprensión | ¿Se entiende qué es una demo y qué sucede con cada dato? | Confusiones sobre almacenamiento, consentimiento, términos y siguiente paso. |
| Señales no visuales | ¿Una instrucción depende solo de color, sonido o posición? | Lugares donde falta texto, etiqueta o alternativa. |
| Ritmo y carga | ¿La tarea puede hacerse sin prisa ni saturación? | Comentarios sobre densidad, avisos, tiempo y memoria requerida. |

## 5. Privacidad y separación de datos

La base de datos del piloto usa dos registros separados. Esta separación es deliberada.

| Registro | Finalidad | Datos admitidos | Acceso público |
|---|---|---|---|
| `pilot_feedback` | Entender mejoras del producto. | Código anónimo, área de experiencia, tipo de sugerencia, comentario, contexto de accesibilidad opcional y fecha. | Solo permite insertar; no permite leer, editar ni borrar desde el navegador. |
| `pilot_interest` | Enviar novedades y, si existe consentimiento separado, información futura sobre kits. | Correo, modo de participación, consentimientos y fecha. | Solo permite insertar; no permite leer, editar ni borrar desde el navegador. |

Las dos tablas no comparten un identificador. Por diseño, un correo voluntario no se puede asociar a la sugerencia anónima de una persona. El formulario de sugerencias advierte que no se incluyan datos de salud, contraseñas ni información confidencial.

## 6. Sistema de revisión y decisiones

Nathalia Romero, o la persona responsable de producto que designe Kureva, revisará las sugerencias de forma periódica. El objetivo no es implementar todo. Es detectar patrones y decidir con transparencia.

| Estado interno | Significado | Respuesta esperada |
|---|---|---|
| **Nueva** | Aún no ha sido leída o agrupada. | Revisar contenido y eliminar cualquier dato que no debiera conservarse. |
| **Revisada** | Ha sido entendida y categorizada. | Vincularla a un problema concreto o registrarla como aprendizaje. |
| **Planificada** | Se repetirá o tiene impacto claro. | Definir ajuste, responsable y forma de comprobarlo. |
| **Resuelta** | Se ha hecho un cambio o se ha documentado una decisión. | Probar el cambio con una nueva persona o con el mismo flujo. |
| **Archivada** | No se implementará ahora. | Registrar un motivo breve y revisable. |

Una sola observación puede revelar una barrera crítica y merece atención inmediata. Para ajustes no críticos, Kureva priorizará los patrones repetidos por tres o más personas, sin ignorar la evidencia de personas que utilizan tecnologías de apoyo.

## 7. Qué debe comprobarse antes de enviar el enlace

Antes de abrir la prueba, la responsable debe comprobar que el formulario anónimo acepta una sugerencia y que el formulario de novedades acepta un correo con consentimiento. También debe confirmar que el acceso público no puede leer las sugerencias ni la lista de correos. Esta verificación técnica se ha realizado al preparar la versión 1.0: ambos envíos autorizados devuelven una respuesta de creación y una consulta pública de sugerencias devuelve denegación de permisos.

La persona responsable también debe revisar el enlace desde un móvil y desde un ordenador. Debe comprobar el menú, el enlace “Saltar al contenido principal”, la navegación por teclado, el botón de descarga del informe y el formulario de sugerencias. Si se modifica el esquema de datos, la redacción de privacidad o las preguntas del piloto, este documento debe actualizarse antes de invitar a más personas.

## 8. Relato de marca que guía la prueba

Kureva está fundada por Nathalia Romero. Su punto de partida no es una promesa de éxito inmediato, sino experiencia acumulada: estudiar, tropezar, emprender, fracasar, trabajar como empleada, liderar y volver a emprender. También recoge una historia familiar vinculada a emprendimientos y empresas, y experiencia en marketing político, comercial, digital y tradicional.

Este relato no debe usarse como credencial vacía. Es una obligación de método: tratar con empatía a cada negocio, emprendimiento o microempresa; explicar sin superioridad; y reconocer que el conocimiento real se forma cuando la experiencia personal se contrasta con la práctica profesional. Kureva es dinamismo, acompañamiento y la voluntad de que lo humano convierta un proceso digital en un proceso útil.

## 9. Mensaje de salida para participantes

El mensaje definitivo se preparará después de revisar la versión desplegada y probar los flujos completos. Debe incluir el enlace, el tiempo aproximado de prueba, el aviso de que es un simulacro, tres tareas concretas y la opción de enviar una sugerencia anónima o suscribirse de forma independiente a las novedades. No debe pedir datos de salud, datos financieros reales ni información confidencial.

## References

[1]: https://www.w3.org/WAI/standards-guidelines/wcag/ "W3C Web Content Accessibility Guidelines (WCAG) 2 Overview"
[2]: https://www.who.int/health-topics/disability "World Health Organization: Disability"
