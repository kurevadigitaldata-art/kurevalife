# Entrega técnica — KurevaLife

**Fases completadas:** FASE A — Design System y FASE B — AppShell + navegación
**Estado:** Validado en compilación de producción local
**Fecha:** 11 de septiembre de 2026

## Alcance ejecutado

Esta entrega aplica únicamente el orden autorizado del Prompt Maestro: primero el sistema visual **K Flúida** y, sobre él, la carcasa de aplicación con la navegación principal. La interfaz se ha reconstruido como una experiencia móvil *local-first*: no crea una cuenta ni transmite registros cuando la persona entra al simulacro. El nombre o alias introducido queda únicamente en el almacenamiento local del navegador para personalizar la sesión de prueba.

La **K oficial** se muestra mediante el activo `kureva-app-icon.svg` y utiliza exclusivamente una rotación lineal continua. No se ha aplicado pulso, latido, rebote ni otra animación sustitutiva. El modo de movimiento reducido desactiva dicha rotación conforme a la preferencia del dispositivo.

## Cambios aplicados

| Área | Antes | Después |
|---|---|---|
| Paleta y tipografía | Estilos generales y componentes con reglas heterogéneas | Tokens K Flúida centralizados: verde bosque, crema cálido, verde suave y lima de acento, con Space Grotesk para títulos y Noto Sans para lectura. |
| Superficies | Jerarquía visual inconsistente entre secciones | Fondo crema, tarjetas claras, bordes suaves, radios amplios y sombras muy contenidas; no se introdujeron fondos negros. |
| Marca en movimiento | Existían referencias anteriores a animaciones no aprobadas | K oficial con rotación continua `kl-rotate`; sin pulso ni latido. |
| Inicio del simulacro | Recorrido previo con capas y controles de producto mezclados | Entrada clara: alias opcional, continuación sin cuenta y aviso visible de guardado local. |
| Estructura de app | Navegación y contenido no aislados en un AppShell | Cabecera, región principal, barra inferior de cuatro destinos y estado de simulacro estructurados en componentes reutilizables. |
| Navegación | Flujo de prueba expuesto a superposiciones de confirmación | Cuatro destinos táctiles: **Hoy**, **Registrar**, **Informes** y **Perfil**. La confirmación flotante que bloqueaba la barra se ha eliminado. |
| Persistencia | Estado disperso | Estructura local tipada y persistente bajo `kurevalife-simulator-v2`; no se realiza envío de datos. |

## Archivos modificados o creados

| Archivo | Cambio |
|---|---|
| `client/src/index.css` | Sistema de tokens, componentes K Flúida, AppShell responsive, navegación, modo nocturno tokenizado, movimiento reducido y estilos de accesibilidad. |
| `client/src/components/KurevaLifeApp.tsx` | Entrada local-first y punto de integración de la aplicación sobre el nuevo AppShell. |
| `client/src/components/kurevalife/types.ts` | Tipos de navegación, rutinas y preferencias; almacenamiento local seguro. |
| `client/src/components/kurevalife/ui.tsx` | Primitivas reutilizables: K oficial, firma de marca, botones, tarjetas, estado local y elementos de rutina. |
| `client/src/components/kurevalife/AppShell.tsx` | Cabecera, landmark principal y navegación inferior de cuatro destinos. |

## Capturas móviles

| Vista | Evidencia |
|---|---|
| Entrada del simulacro, 390 px | [Abrir captura](/home/ubuntu/kureva-phase-ab-qa/kurevalife-390-entry.png) |
| Pantalla **Hoy**, 390 px | [Abrir captura](/home/ubuntu/kureva-phase-ab-qa/kurevalife-390-hoy.png) |
| Perfil y barra inferior, 390 px | [Abrir captura](/home/ubuntu/kureva-phase-ab-qa/kurevalife-390.png) |

## Validación móvil de producción

La validación se ejecutó sobre `vite preview`, no sobre la capa de desarrollo. Se recorrieron los cuatro destinos, se recargó la sesión para comprobar la persistencia del alias y se capturaron errores de página.

| Ancho | Desbordamiento horizontal | Barra inferior | Tamaño mínimo de destino | Cuatro vistas | Alias persistente | Errores de página | K en rotación |
|---:|---|---|---:|---|---|---|---|
| 360 px | No | Hoy, Registrar, Informes, Perfil | 85 × 56 px | Sí | Sí | 0 | Sí, 10 s lineal |
| 390 px | No | Hoy, Registrar, Informes, Perfil | 92 × 56 px | Sí | Sí | 0 | Sí, 10 s lineal |
| 412 px | No | Hoy, Registrar, Informes, Perfil | 98 × 56 px | Sí | Sí | 0 | Sí, 10 s lineal |
| 430 px | No | Hoy, Registrar, Informes, Perfil | 102 × 56 px | Sí | Sí | 0 | Sí, 10 s lineal |

El detalle estructurado de la prueba está disponible en [phase-ab-mobile.json](/home/ubuntu/kureva-phase-ab-qa/phase-ab-mobile.json).

## Accesibilidad comprobada

- Documento declarado en español (`lang="es"`).
- Enlace de salto operativo hacia `#contenido-kurevalife`.
- Landmark `main` y landmark `nav` identificable por tecnologías de apoyo.
- Campo de alias asociado a etiqueta visible.
- Los cuatro destinos contienen nombre textual además del icono.
- Existe exactamente un destino activo con `aria-current="page"`.
- Todos los destinos inferiores superan 44 × 44 px.
- Foco visible con contorno lima de alto contraste.
- `prefers-reduced-motion` desactiva la animación de la K.
- El diseño no depende exclusivamente de color para identificar el destino activo: combina fondo, icono y etiqueta.

## Comprobaciones de calidad

| Comprobación | Resultado |
|---|---|
| TypeScript (`pnpm check`) | Superado sin errores. |
| Build de producción (`pnpm build`) | Superado. |
| Formato (`prettier --check`) | Superado en todos los archivos de FASE A y B. |
| Pruebas funcionales móviles | Superadas en 360, 390, 412 y 430 px. |
| Prueba de navegación | Superada: cuatro destinos accesibles, sin superposición de confirmación. |
| Prueba de persistencia local | Superada: el alias permanece tras recargar. |
| Errores de ejecución | 0 capturados durante los recorridos automatizados. |
| Lint | El proyecto no incluye script ni dependencia ESLint; no es posible declarar una ejecución de lint inexistente como superada. |

El build informa de un **aviso no bloqueante** de tamaño de chunk superior a 500 kB, procedente de dependencias existentes. La compilación termina correctamente y no afecta al funcionamiento ni a la validación móvil de estas dos fases.

## Limitación externa registrada

La comprobación administrativa de RLS de Supabase sigue sin estar disponible desde el contexto actual. No se ha utilizado ningún dato remoto ni se ha alterado la base de datos en estas fases; la implementación entregada funciona localmente y esta limitación externa no bloquea el frontend ni el simulacro local-first.

## Estado de orden del Prompt Maestro

**FASE A** y **FASE B** están completas y verificadas. Las fases C a J no se han adelantado ni reinterpretado en esta entrega, para mantener el orden expresamente autorizado.
