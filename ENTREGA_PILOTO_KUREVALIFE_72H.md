# Entrega operativa — piloto KurevaLife de 72 horas

**Enlace de acceso para las personas probadoras:** <https://kurevadigitaldata.manus.space/vida>

## Alcance validado

KurevaLife se presenta como una **simulación guiada de una aplicación de organización personal de salud**. El registro inicial, los datos de salud, documentos, imágenes y la contraseña de prueba son locales al navegador; no crean una cuenta ni se almacenan como datos clínicos. La aplicación no diagnostica, no interpreta resultados y no sustituye a un profesional sanitario.

El recorrido incluye registro ficticio, personalización de temas, temporizador virtual de cinco minutos, pausa y reinicio, fichas de tensión, glucosa, peso y molestias, perfil con diagnósticos, documentos y analíticas, recordatorios visuales, alimentos de temporada desplegables, Kivi como guía de la simulación e informe PDF local con el distintivo Kureva y la advertencia sanitaria.

## Inclusión y acceso

La interfaz se ha verificado a 393 px de ancho: no genera desplazamiento horizontal, usa controles táctiles grandes y campos de 16 px para evitar zoom involuntario. Ofrece texto ampliado, alto contraste, modo noche, lectura por voz del contenido y sonidos de confirmación opcionales. La animación de la K mantiene su movimiento circular salvo que el dispositivo solicite reducción de movimiento.

## Participación al finalizar

Al terminar se ofrecen tres vías claramente separadas:

1. **Valoración privada:** 1 a 5 estrellas, categoría, sugerencia, modo anónimo o identificado y procedencia de la invitación. No se solicita información de salud en ese formulario.
2. **Comunidad Kureva:** reseñas e ideas públicas temporales para las personas con enlace durante las 72 horas, bajo seudónimo o con el nombre elegido. No se permiten datos de salud ni fotos identificables.
3. **Novedades:** dirección de correo con consentimiento granular para fecha de lanzamiento, avances de Kureva y regalos de participación/primeras 30 personas.

La tabla privada histórica de Supabase conserva una configuración de permisos que actualmente rechaza las inserciones desde la web. Para no mostrar el error técnico a las personas probadoras ni perder una aportación, tanto la valoración privada como las novedades preparan una **copia de correo dirigida a kurevadigitaldata@gmail.com** y descargan la copia de la valoración. Para que una sugerencia llegue durante este intervalo, quien la complete debe pulsar **“Abrir correo privado preparado”** y enviarlo. El contenido aclara que un correo no puede ser anónimo ante su destinataria; la Comunidad Kureva permite compartir una reseña pública anónima.

## Enlace de marca al final

El único enlace hacia la landing general se presenta tras completar la prueba y, en la confirmación de novedades, dirige a <https://kurevadigitaldata.manus.space/>. Allí pueden conocer Kureva y compartir ese enlace si desean invitar a otra persona.

## Resultado de control

La prueba automatizada móvil comprobó una anchura de aplicación de 393 px sin desbordamiento, activación del sonido opcional, generación de un PDF local y enlaces `mailto:` correctos para el respaldo de valoración y novedades. El proyecto compila sin errores de TypeScript ni de construcción.
