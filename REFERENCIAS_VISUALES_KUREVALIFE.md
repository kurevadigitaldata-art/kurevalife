# Referencias visuales aprobadas — KurevaLife

**Estado:** lectura y registro; no se aplica ningún cambio de código.

## Principios visuales extraídos

Las primeras nueve referencias confirman un sistema mobile-first de superficie predominantemente crema, tipografía oscura en Bosque, tarjetas blancas con bordes suaves y acentos Lima limitados a selección, CTA, progreso y pequeños indicadores. Las pantallas se presentan como una aplicación nativa dentro de un móvil, no como una web de escritorio comprimida. La firma es **KurevaLife · BY KUREVA**, con la K oficial. La frase de producto predominante es **“Tu día en orden. Tu consulta más clara.”**

La navegación principal e invariable queda fijada en la barra inferior: **Hoy, Registrar, Informes y Perfil**. Kivi aparece como asistente secundario y no se incorpora a dicha barra. El modo nocturno mantiene la misma composición y jerarquía, usando verdes profundos en vez de negro puro; el Lima permanece como un acento.

## Flujos confirmados en las referencias recibidas

| Paso | Pantalla | Comportamientos y composición visibles |
|---|---|---|
| 1 | Hoy | Saludo, progreso circular con número y porcentaje, siguiente acción, rutinas, CTA “Registrar un paso” y navegación inferior fija. |
| 2 | Registrar | Una pantalla con pestañas Datos, Notas y Archivos; registros de tensión, colesterol, HbA1c y observación; dictado; adjuntar foto/captura/PDF/archivo; guardado local; añadir al comparador. |
| 3 | Avisos | Formulario compacto con recordatorio, horario, frecuencia, permiso de avisos y CTA “Crear aviso visual”; explicación de fallback de notificaciones. |
| 4 | Hidratación | Objetivo personal, estación y actividad; CTA “Recordarme beber agua”; mensaje explícito de que no calcula necesidades médicas. |
| 5 | Informes | Pestañas Resumen, Tendencias y Registros; tarjetas de tensión, colesterol, HbA1c, hidratación y notas; CTA Descargar PDF y Compartir resumen. |
| 6 | Perfil y accesibilidad | Cuenta; modo oscuro, tamaño de texto y alto contraste; subtítulos, dictado, teclado, lector de pantalla y objetivos táctiles grandes. |
| 7 | Kivi | Asistente secundario; acciones “Preparar mi consulta”, “Revisar un registro”, “Organizar mis rutinas” y “Resolver una duda”; entrada de texto; aviso visible de que no diagnostica. |
| 8 | Modo nocturno | Misma pantalla de Hoy con tokens profundos de Bosque, contraste alto y Lima solo en progresos/CTA. |
| 9 | Feedback | Valoración 1–5, comentario público, comentario privado, sugerencia, qué quitarías y qué añadirías; envío con confirmación visible. |

## Movimiento de marca — corrección explícita

> **La K oficial gira de forma continua. No late, no pulsa, no hace efecto de respiración ni rebota.**

El movimiento debe ser opcional/ornamental, no necesario para comprender acciones, y debe detenerse o reducirse respetando `prefers-reduced-motion`.

## Identificación del simulacro

El simulacro debe identificarse de forma visible como **“Simulacro para testers”** o **“Simulacro para entorno de pruebas”**, sin modificar la estructura visual del producto ni confundirlo con una función de la futura aplicación online. Cuando el producto esté online, esta identificación de prueba se retirará o se adaptará mediante una configuración de entorno, no alterando la app final.

## Confirmaciones adicionales de las láminas de sistema y flujos

Las láminas panorámicas confirman que **Registrar, Avisos, Hidratación y Perfil** son vistas de una aplicación con la misma cabecera, escala, tarjetas y navegación inferior. Registrar tiene tres pestañas: **Datos, Notas y Archivos**. Avisos se representa como vista propia. Hidratación es una vista propia y no un bloque añadido dentro de otra pantalla. Perfil agrupa sus controles en filas y switches claramente etiquetados.

El sistema muestra la navegación superior únicamente como documentación de flujo; en el producto móvil la navegación real es la barra inferior con cuatro destinos. Kivi se presenta como **asistente secundario**, accesible pero sin ocupar una pestaña principal. El feedback debe recoger, además de valoración y comentarios, puntos de bloqueo, errores detectados, funciones confusas, qué mejorar, qué sacar y qué mantener.

Las referencias reiteran los requisitos no negociables: contraste AA, cuerpo mínimo de 16 px, objetivos táctiles mínimos de 44 × 44 px, formulación con etiquetas visibles, alternativa textual al sonido, archivos/fotos como alternativa de captura, y ausencia de overlays que oculten acciones.

## Referencias de incorporación y recordatorios

La incorporación aprobada es una secuencia de tres pantallas: bienvenida, explicación de que KurevaLife sirve para recordar rutinas, guardar registros, mostrar progreso y acompañar mediante Kivi; y una decisión final entre crear cuenta, continuar sin cuenta o acceder con cuenta existente. Para la prueba, el uso sin cuenta debe estar disponible y claramente priorizado como alternativa válida.

La referencia de recordatorios añade una vista propia con lista de rutinas, hora, frecuencia, switch por elemento, menú de más opciones, “Horario tranquilo” y CTA “Añadir recordatorio”. Kivi puede aparecer aquí como un lanzador secundario compacto, ubicado sin tapar el CTA, la navegación inferior ni los controles de la lista.

## Referencias de cuenta e informes ampliados

Las pantallas de acceso confirman la idea de continuidad: una cuenta permite sincronizar sin reemplazar la conservación local. La futura experiencia de cuenta incluye crear cuenta, iniciar sesión, enlace mágico y confirmación por correo; estas rutas pertenecen al producto online, no deben fingirse como operativas en el simulacro local.

La referencia de escritorio confirma cómo debe escalar Informes: navegación lateral en escritorio, tarjetas de progreso y tendencias legibles, selector de periodo, notas recientes, temas para comentar y acciones PDF/compartir visibles. La versión móvil conserva la jerarquía y el contenido esencial, no la distribución lateral de escritorio.

## Referencias de rutinas y privacidad

Las rutinas se agrupan por Mañana, Tarde y Noche, incluyen progreso diario, fecha, estados completados y CTA para crear o añadir una rutina. Son organización diaria y no tratamiento clínico. Las pantallas de privacidad muestran que el producto online debe distinguir el estado de sincronización y permitir gestionar, exportar o eliminar datos locales; estas acciones deben quedar separadas de la eliminación de cuenta remota.

Kivi debe admitir controles de privacidad: utilizar solo contexto necesario y no guardar conversaciones sensibles. Toda esta información se presenta en filas claras, con iconos secundarios y switches funcionales, sin recurrir a una estética sanitaria.

## Referencias de perfil y estados vacíos

Perfil debe mostrar alias o nombre, estado de cuenta/sincronización, información personal, idioma, zona horaria, datos locales, última sincronización y copia en la nube cuando exista. Debe quedar explícito que KurevaLife se puede usar sin cuenta y que la cuenta añade sincronización entre dispositivos.

El estado vacío de Hoy debe enseñar la aplicación: mensaje “Aún no tienes rutinas para hoy”, CTA principal para crear una rutina, CTA secundaria para registrar algo ahora y una explicación breve de tres pasos. Un lanzador a Kivi es posible como fila secundaria, siempre sin ocultar la barra de navegación inferior.

## Referencias de historial y Kivi ampliado

El historial de registros incluye selector de fecha, búsqueda, filtros por categoría y agrupación cronológica. Cada fila muestra hora, tipo, descripción, valor o estado y una entrada clara al detalle. Kivi puede dar una confirmación visual breve y no bloqueante tras un registro.

En escritorio, Kivi ofrece un resumen del día, acciones de organización (preparar consulta, revisar informe y organizar rutinas), chips de consulta y un campo de mensaje. El texto obligatorio mantiene el límite: Kivi ordena registros y preguntas; no diagnostica ni sustituye a un profesional. La acción “interpretar un informe” no debe presentarse como diagnóstico: en el simulacro se limita a revisar y ordenar la información disponible.
