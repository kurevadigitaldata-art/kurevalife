# KurevaLife — simulador de prueba

Este repositorio contiene el simulador web **KurevaLife**, una experiencia de prueba inclusiva y móvil para explorar cómo una futura aplicación puede ayudar a las personas a organizar recordatorios, registros personales, documentos y notas para una cita médica. La aplicación está diseñada para acompañar, no para diagnosticar: los registros clínicos de prueba se conservan localmente en el navegador y el informe PDF se genera en el propio dispositivo.

## Propósito del piloto

La ruta `/vida` ofrece un recorrido guiado de cinco minutos. La persona puede crear una sesión ficticia, seleccionar lo que desea organizar, probar el registro local de tensión, glucosa, peso o molestias, configurar un recordatorio visual, consultar alimentos de temporada, usar Kivi como guía de interfaz y descargar un informe local. Al finalizar, puede enviar una valoración voluntaria y elegir qué comunicaciones desea recibir.

La aplicación debe usarse exclusivamente con datos inventados o no sensibles durante el piloto. KurevaLife no sustituye la atención médica, no interpreta analíticas y no ofrece recomendaciones de diagnóstico o tratamiento.

## Accesibilidad y móvil

La experiencia se ha construido y verificado con viewport de **iPhone 13 (390 × 844)** y **Pixel 7 (412 × 915)**. Incluye texto ampliado, alto contraste, modo noche, lectura en voz alta del contenido, controles táctiles amplios y una navegación que sigue siendo usable incluso si un navegador móvil activa por error el modo “sitio para ordenador”.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000/vida`.

### Verificaciones

```bash
pnpm check
pnpm build
python3 verify_mobile_interactions.py
```

La comprobación móvil automatizada verifica la creación local de registros y recordatorios, la generación del PDF y las fichas de alimentos clicables.

## Propiedad y configuración

El repositorio oficial de Kureva es administrado mediante la cuenta de GitHub vinculada a `kurevadigitaldata@gmail.com`. No se deben asociar este proyecto, sus despliegues ni sus proveedores de correo a cuentas personales ajenas a Kureva.
