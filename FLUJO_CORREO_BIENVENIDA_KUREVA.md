# Flujo de bienvenida y remitente oficial de Kureva

**Fecha de verificación:** 10 de septiembre de 2026  
**Responsable:** Nathalia Romero · Kureva  
**Remitente oficial verificado:** `kurevadigitaldata@gmail.com`

---

## 1. Estado de la cuenta oficial

La cuenta **`kurevadigitaldata@gmail.com`** ya está vinculada en el conector y confirmada como cuenta activa. El sistema tiene capacidad para buscar y enviar correos usando la integración con autorización oficial.

### ¿Cómo funciona ahora la bienvenida de KurevaLife?

1. La persona entra en el simulador en `/vida`.
2. Si quiere recibir novedades y futuros kits, abre la pestaña **Tu opinión → Novedades**.
3. Deja su correo y acepta los consentimientos explícitos.
4. El simulador muestra una pantalla de carga animada con la órbita de la marca y después un estado de éxito claro:
   - Le da la bienvenida anticipada a Kureva.
   - Le confirma que su correo se guardó en una lista privada separada de sus sugerencias.
   - Le indica que las novedades y kits oficiales llegarán desde `kurevadigitaldata@gmail.com`.
   - Le ofrece un enlace directo a la web principal de Kureva (`/#metodo`) para conocer la visión completa y opinar.

---

## 2. Plantilla oficial del correo de bienvenida para el piloto

Cuando envíes el primer aviso manual o automático a quienes se inscriban, este es el texto oficial aprobado:

```text
Asunto: Bienvenida anticipada a Kureva | Gracias por acompañar el proceso

Hola,

Gracias por acercarte y formar parte de esta primera prueba de KurevaLife.

Kureva nace de un camino real: de estudiar, emprender, tropezar, aprender como empleada, como líder y como fundadora, hasta entender que la tecnología debe ser comprensible, humana y cercana.

KurevaLife es nuestra app para ayudarte a organizar tu día, tus citas, tus preguntas y lo que tú decides registrar para tu salud y bienestar, sin sustituir jamás a tu médico ni interpretar datos por ti.

Si quieres conocer más sobre Kureva, nuestros servicios de autonomía digital y todo lo que estamos construyendo:
https://3000-ipsxdmj6p56lymsfksu6y-c63881cc.us1.manus.computer/

Te escribiremos únicamente cuando tengamos avances significativos, la apertura formal de la beta o novedades sobre los kits oficiales de Kureva.

Gracias por caminar con nosotros. Crecemos juntos.

Un abrazo,
Nathalia Romero
Fundadora de Kureva · San Miguel de Salinas (Alicante)
kurevadigitaldata@gmail.com
```

---

## 3. Hoja de ruta para el lunes

| Paso | Acción concreta | Dónde se revisa |
|---|---|---|
| **1. Recopilación de sugerencias** | Revisar las valoraciones privadas de 1 a 5 estrellas y los comentarios categorizados de los testers. | Panel de Supabase → tabla `pilot_feedback`. |
| **2. Cierre de la ventana temporal** | Comprobar qué ideas se compartieron en la conversación voluntaria de 24 horas y archivar los aprendizajes. | Panel de Supabase → tabla `pilot_community_messages`. |
| **3. Lista de novedades** | Exportar la lista de personas inscritas que solicitaron avances y kits. | Panel de Supabase → tabla `pilot_interest`. |
| **4. Envío oficial** | Emitir el primer correo de agradecimiento formal desde `kurevadigitaldata@gmail.com` usando la plantilla aprobada. | Bandeja de Gmail oficial de Kureva. |
| **5. Siguiente nivel** | Planificar la arquitectura técnica de persistencia de datos reales, autenticación por usuario y acuerdos de privacidad. | Próxima fase técnica. |
