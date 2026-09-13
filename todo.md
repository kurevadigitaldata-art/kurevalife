# KurevaLife — estado de consolidación

## Fuente de verdad

El proyecto canónico activo es **`/home/ubuntu/workspaces/kurevalife`** y corresponde a **`kurevadigitaldata-art/kurevalife`**. La ruta de simulación es **`/vida`**. Esta ruta es un prototipo navegable y local-first para pruebas; todavía no es una aplicación móvil nativa ni una aplicación clínica en producción.

## Cambios de esta iteración

- [x] Ajustar exclusivamente la pantalla de Introducción: título genérico, copia sin saludo, selector de idioma, aviso informativo de simulacro y acento lima deslizante que respeta movimiento reducido.
- [x] Verificar la pantalla de Introducción en móvil y su ausencia de regresiones responsive antes de publicar el checkpoint.
- [x] Aplicar exclusivamente los contenidos y controles aprobados para Bienvenida, Introducción, Inclusión, Registro y Configuración; sin alterar las pantallas posteriores del simulacro.
- [x] Convertir la Introducción en la versión neutral aprobada y eliminar las precargas de nombre de Registro.
- [x] Situar Español / English al inicio de Registro y reflejar la selección en el idioma semántico durante el recorrido de prueba.
- [x] Sustituir Configuración por la lista de sonido, traducción en línea, lectura fácil, comunicaciones opcionales y consentimiento solicitada.
- [x] Validar el recorrido de los cinco pasos en móvil y la ausencia de persistencia antes de publicar el checkpoint.
- [x] Corregir el inicio del simulacro para que no restaure perfiles ni registros entre sesiones o pestañas: la prueba comienza siempre en Bienvenida y permanece solo en memoria durante la pestaña abierta.
- [x] Implementar las cinco pantallas guiadas de bienvenida, introducción, inclusión, registro y configuración con datos locales de prueba, identidad elegida y personalización inclusiva de textos.
- [x] Hacer que el nombre, trato, escala tipográfica, modo nocturno, subtítulos y apoyos de lectura configurados durante la bienvenida se apliquen inmediatamente al simulacro.
- [x] Añadir anuncios accesibles y voz opcional no clínica para cambios de pantalla y respuestas de Kivi, sin hacer depender ninguna acción del sonido.
- [x] Probar el flujo completo con perfiles femenino, masculino y neutro en móvil, tableta y escritorio, incluyendo reinicio y ausencia de persistencia entre sesiones.
- [x] Corregir enlaces internos y rutas directas de GitHub Pages bajo `/kurevalife`, incluidos recursos, calculadora y simulacro, sin afirmar que las URLs raíz externas al proyecto estén controladas por este repositorio.
- [x] Convertir la landing en una presentación pública centrada en Kureva, su origen, propuesta de valor y mentoría para emprendedores y microempresas; retirar paleta, manual, merchandising y demás detalles internos.
- [x] Verificar en móvil, tableta y escritorio la navegación, rutas públicas y rotación continua de la K, respetando movimiento reducido y sin prometer una web imposible de rastrear o hackear.
- [x] Sustituir en la landing la lámina ilustrativa de UI basada en el ejemplo externo por la portada y la K oficiales de KurevaLife, sin trasladar sus patrones de escritorio a la navegación funcional mobile-first de KurevaLife. La K rota de forma continua —sin pulso ni rebote— en landing y simulacro, con respeto a `prefers-reduced-motion`.
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

## Auditoría final de aceptación — 12 de septiembre de 2026

- [x] Confirmar la instalación inmutable, TypeScript, formato y compilación desde el commit canónico `a0967fb4abca8407c6e8124f63859f81647cf17c`.
- [x] Ejecutar y contrastar las comprobaciones de interacción existentes frente a la implementación actual, sin afirmar resultados históricos no reproducidos.
- [x] Endurecer la hidratación `localStorage` con validación estructural para conservar registros válidos y descartar únicamente entradas corruptas.
- [x] Conservar de forma explícita la entrada sin cuenta tras recargar, incluso si la persona no indica alias.
- [x] Corregir únicamente controles verificablemente inactivos, límites de entrada o estados accesibles que afecten al piloto.
- [x] Capturar y revisar `/vida` en móvil y escritorio, incluyendo navegación de cuatro destinos, Kivi secundario, persistencia, contraste y ausencia de desbordamiento.
- [x] Documentar evidencia reproducible, límites externos de Supabase y el checkpoint final antes de autorizar testers.

### Hallazgos reproducidos antes de corregir

- [x] `verify_feedback_states.py` finaliza con código 0 aunque informa `"error_fallback": false`; debe fallar si cualquiera de los dos estados no se verifica.
- [x] `verify_mobile_interactions.py` todavía automatiza el simulador anterior y la ruta de desarrollo fija `localhost:3000`; debe actualizarse al flujo actual y a una URL configurable.
- [x] El estado local acepta arrays sin validar sus registros y usa el alias como proxy de entrada, por lo que una entrada sin alias se pierde visualmente al recargar.
- [x] El CTA vacío «Ir a Registrar» no cambia de pestaña, y la mejora de Kivi declarada en `a0967fb` hace scroll pero no traslada el foco al panel.
- [x] El HTML incorpora un script de analítica con variables no definidas que produce avisos de compilación; debe cargarse únicamente cuando exista configuración explícita.
- [x] La configuración de `patchedDependencies` y `overrides` está en una ubicación deprecada de `package.json`; debe migrarse y regenerar el bloqueo para recuperar una instalación inmutable sin avisos de configuración.
- [x] **Cierre operativo — 12 de septiembre de 2026:** GitHub Pages fue habilitado con origen GitHub Actions; la publicación final verde `34719556282` entrega `/vida` con HTTP 200. El detalle reproducible está en `docs/kurevalife-pages-closure-2026-09-12.md`.

## Límites reales y siguiente fase móvil

- [ ] Crear el proyecto Expo nativo de KurevaLife en una tarea WebDev nueva; el inicializador de proyecto móvil quedó bloqueado en esta tarea porque ya existe un proyecto WebDev activo.
- [ ] Sustituir el registro ficticio por autenticación real y consentimiento granular revisado legalmente.
- [ ] Persistir datos de salud únicamente con cifrado, control de acceso, recuperación segura y política de retención aprobada.
- [ ] Implementar notificaciones push reales solo después de permisos explícitos y una pauta configurada por la persona usuaria.
- [ ] Diseñar subida cifrada de documentos/fotos, borrado y exportación para el usuario antes de aceptar datos reales.
- [ ] Conectar Kivi a soporte humano o IA únicamente con políticas de seguridad, registro de límites y protocolo de escalado de urgencias.
- [ ] Crear comunidad con moderación, aviso de seguridad y reglas de contenido antes de permitir publicar fotos o comentarios reales.
