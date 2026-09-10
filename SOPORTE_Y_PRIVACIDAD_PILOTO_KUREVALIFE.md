# Soporte y privacidad del piloto KurevaLife

**Versión:** 3.0 · **Estado:** simulador app-first en prueba cerrada  
**Responsable funcional:** Nathalia Romero · Kureva, San Miguel de Salinas (Alicante)  
**Base de datos del piloto:** proyecto Supabase privado de Kureva

## 1. Respuesta directa: ¿es todo público?

**No.** El simulador está diseñado con tres espacios claramente separados:

| Espacio | Qué ocurre | Visibilidad |
|---|---|---|
| **Sesión de la app** | Bloques, alarmas de prueba, edad, peso, diagnósticos, documentos analíticos de ejemplo, registros de tensión, glucosa, molestias y notas. | **No se envía a ninguna base de datos.** Existe solo en la página abierta y desaparece al salir o reiniciar. |
| **Sugerencia privada** | Estrellas, categoría, comentario, código de prueba y, solo si la persona lo decide, nombre y apellidos. | **No es pública.** Está protegida por Row Level Security; las personas que usan la web no pueden leer ni modificar las sugerencias de otros participantes. |
| **Conversación temporal de grupo** | Ideas sobre el producto, accesibilidad, navegación o funciones de KurevaLife. | **Visible a quienes tengan el enlace de prueba** mientras esté abierta la ventana de 24 horas. No es una comunidad indexada o abierta, pero tampoco es un espacio privado: nunca debe contener datos personales, diagnósticos, analíticas, medicación o documentos. |
| **Novedades por correo** | Correo, rol de participación y consentimientos elegidos. | **Privado** y separado técnicamente de las sugerencias. Por ahora se registra en la lista; la confirmación automática por email requiere configurar un remitente oficial. |

> **Regla fundamental del piloto:** no enviar, publicar ni probar con datos de salud reales. El simulador enseña el flujo de la futura app; no es todavía un archivo clínico ni una cuenta personal.

## 2. Qué puede ver Nathalia como soporte

Cuando tengas acceso a la cuenta de Supabase que contiene el proyecto, abre el panel en:

[Panel de datos privado de KurevaLife](https://supabase.com/dashboard/project/ikhvfugfmqulxbxrkdvl/editor)

Allí puedes revisar estas tres tablas dentro de `public`:

| Tabla | Para qué sirve | Qué buscar |
|---|---|---|
| `pilot_feedback` | Valoraciones privadas de 1–5 estrellas y sugerencias. | `rating`, `feedback_category`, `feedback_type`, `message`, `is_anonymous`, `sender_name`, `created_at`. |
| `pilot_interest` | Lista de personas que han pedido avances o futuros kits. | `email`, `participation_role`, `consent_updates`, `consent_kit_updates`, `created_at`. |
| `pilot_community_messages` | Conversación temporal y voluntaria del grupo. | `display_name`, `is_anonymous`, `category`, `message`, `created_at`, `visible_until`. |

La tabla `pilot_windows` solo controla el cierre compartido de 24 horas de la conversación. No contiene respuestas personales.

## 3. Cómo revisar el piloto al terminar las 24 horas

Revisa primero `pilot_feedback`, porque contiene las valoraciones privadas y categorizadas. Ordena por `created_at` y toma nota de la media de estrellas y de las categorías que más se repiten. Después revisa `pilot_community_messages` para identificar ideas conversadas públicamente durante la ventana temporal. Por último, revisa `pilot_interest` únicamente para comunicaciones futuras a quienes dieron consentimiento.

No copies diagnósticos, correos ni nombres a conversaciones públicas, documentos compartidos o mensajes de grupo. Si necesitas resumir hallazgos, trabaja con conteos y patrones, por ejemplo: “cuatro personas pidieron que los recordatorios fueran más visibles”, sin identificar a nadie.

## 4. Estado del correo de novedades

Actualmente, el formulario **guarda correctamente** el consentimiento y el correo en `pilot_interest`, pero no puede enviar una confirmación automática todavía. La cuenta de Gmail conectada al entorno es `romeronatu01@gmail.com`, mientras que el remitente deseado es `kurevadigitaldata@gmail.com`.

Para enviar desde la dirección oficial de Kureva hay dos vías válidas:

| Alternativa | Resultado | Requisitos | Adecuada para |
|---|---|---|---|
| **Conectar la cuenta Gmail oficial** | Correos de bienvenida y novedades enviados desde `kurevadigitaldata@gmail.com`. | Acceso autorizado a esa cuenta de Google y una conexión segura para el envío automatizado. | Piloto pequeño y comunicaciones personales. |
| **Usar una plataforma de correo transaccional con dominio de Kureva** | Correos automáticos profesionales desde una dirección del dominio propio, por ejemplo `hola@kureva.es`. | Dominio propio verificado y clave de la plataforma elegida. | Apertura pública, crecimiento y cumplimiento más sólido. |

No se debe automatizar un envío “desde” `kurevadigitaldata@gmail.com` sin que esa cuenta esté conectada y autorizada. Hacerlo de otra manera sería inseguro y podría aparentar una identidad de remitente que no está verificada.

## 5. Límites de seguridad actuales

La prueba está pensada para **10–20 personas de confianza**, no para difusión pública. La conversación temporal se debe usar solo para ideas de producto. El PDF generado por la app es un resumen local de la sesión y declara expresamente que no es clínico ni interpreta datos. El sistema no debe usarse para urgencias, decisiones de tratamiento o evaluación médica.

Antes de abrir una beta que guarde información real de salud, será necesario definir una arquitectura de privacidad, control de acceso, cifrado, exportación, borrado, retención de datos y revisión legal específica.
