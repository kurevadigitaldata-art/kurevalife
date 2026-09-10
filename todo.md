# KurevaLife — estado de consolidación

## Fuente de verdad

El proyecto activo es **`/home/ubuntu/kureva-web`**. La ruta pública de simulación es **`/vida`**. Esta ruta es un prototipo navegable y local-first para pruebas; todavía no es una aplicación móvil nativa ni una aplicación clínica en producción.

## Cambios de esta iteración

- [x] Sustituir la entrada pasiva por un registro de simulación con nombre, apellidos, correo, contraseña de prueba, identidad opcional y consentimiento local.
- [x] Añadir recorrido de tres pasos: registro ficticio, selección de necesidades y bienvenida personalizada de cinco minutos.
- [x] Añadir control de pausa, reinicio, temporizador visual, texto ampliado y contraste.
- [x] Hacer funcionales los registros de tensión, glucosa, peso y molestias con confirmación visible.
- [x] Añadir ficha de edad, peso, identidad y condiciones documentables con límites explícitos de no diagnóstico.
- [x] Añadir recordatorios de medicación, citas y agua como avisos visuales locales; marcar las alarmas push como una función pendiente de la app online.
- [x] Añadir anotación manual de analíticas y selección local de foto, captura o PDF sin subida remota.
- [x] Añadir Kivi como conversación guiada simulada y explicar el límite de soporte humano/conectado.
- [x] Mantener alimentos con fichas en la misma tarjeta al hacer clic.
- [x] Mantener valoración privada de 1–5 estrellas y conversación temporal voluntaria sin datos de salud.
- [x] Generar y descargar PDF local con la K, registros, recordatorios y la nota de no sustitución médica.

## Validación ejecutada

- [x] TypeScript: `pnpm check`.
- [x] Producción: `pnpm build`.
- [x] Registro local de tensión de prueba: probado con `120/80 mmHg`.
- [x] Recordatorio local de medicación: probado.
- [x] PDF local: descargado y validado, incluye el registro y el recordatorio.
- [x] Kivi: respuesta guiada de prueba verificada.

## Límites reales y siguiente fase móvil

- [ ] Crear el proyecto Expo nativo de KurevaLife en una tarea WebDev nueva; el inicializador de proyecto móvil quedó bloqueado en esta tarea porque ya existe un proyecto WebDev activo.
- [ ] Sustituir el registro ficticio por autenticación real y consentimiento granular revisado legalmente.
- [ ] Persistir datos de salud únicamente con cifrado, control de acceso, recuperación segura y política de retención aprobada.
- [ ] Implementar notificaciones push reales solo después de permisos explícitos y una pauta configurada por la persona usuaria.
- [ ] Diseñar subida cifrada de documentos/fotos, borrado y exportación para el usuario antes de aceptar datos reales.
- [ ] Conectar Kivi a soporte humano o IA únicamente con políticas de seguridad, registro de límites y protocolo de escalado de urgencias.
- [ ] Crear comunidad con moderación, aviso de seguridad y reglas de contenido antes de permitir publicar fotos o comentarios reales.
