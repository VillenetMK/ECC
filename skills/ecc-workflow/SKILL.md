---
name: ecc-workflow
description: "Adaptación selectiva de ECC para software en ChatGPT Work Mode y Codex: explorar repositorios, planificar, implementar, depurar, revisar y verificar con evidencia. Usar cuando el usuario invoque ECC, pida trabajar con este método, o solicite un cambio de software con varias etapas, una investigación de fallos o una revisión técnica que se beneficie del flujo. No activar para preguntas generales o tareas ajenas al software salvo petición explícita."
---

# ECC adaptado

Aplicar un flujo de ingeniería proporcional a la tarea. Conservar las prácticas
útiles de ECC sin depender de su CLI, hooks, agentes de Claude o MCP adicionales.
Esta skill aporta procedimientos; no modifica el modelo, no añade permisos y no
garantiza activación en todas las conversaciones.

## Elegir el alcance

Distinguir consulta, revisión, implementación y publicación. Un análisis no
autoriza cambiar código. Una implementación requiere avanzar hasta un resultado
verificable; no detenerse en el plan salvo un impedimento concreto.

| Tarea | Procedimiento mínimo |
| --- | --- |
| Consulta | Leer la evidencia necesaria y responder. |
| Cambio sencillo y reversible | Inspeccionar, editar y comprobar directamente; sin imponer plan, pruebas nuevas o agentes. |
| Defecto o cambio de comportamiento | Reproducir o caracterizar, definir el resultado esperado, corregir y verificar la regresión pertinente. |
| Función con varias partes o refactor relevante | Explorar, planificar dependencias, implementar por partes y revisar interfaces. |
| Seguridad, permisos o persistencia | Verificar fronteras de confianza, casos negativos y recuperación según el riesgo real. |
| Revisión solicitada | Examinar y reportar; conservar el código salvo autorización para corregir. |

Respetar instrucciones de sesión, alcance del usuario y reglas aplicables del
proyecto. No añadir confirmaciones para acciones ya autorizadas. Preguntar solo
por ambigüedad material o aprobación exigida por una regla aplicable; preparar
antes el resultado revisable.

## Cargar únicamente los módulos necesarios

| Necesidad | Referencia |
| --- | --- |
| Reconocer el repositorio y preparar un plan | [Explorar y planificar](references/plan-and-explore.md) |
| Implementar, elegir pruebas o depurar | [Implementar y depurar](references/implement-and-debug.md) |
| Revisar cambios y seguridad | [Revisión con evidencia](references/review-and-security.md) |
| Ejecutar comprobaciones y entregar | [Verificación](references/verify-and-deliver.md) |
| Elegir herramientas y persistencia | [Entorno](references/work-mode-tools.md) |
| Retomar o preparar un traspaso | [Continuidad](references/continuity.md) |
| Auditar procedencia y licencia | [Fuentes](references/sources-and-license.md) |

No cargar todas las referencias por rutina. Usar la skill específica de una
plataforma cuando exista; este procedimiento no reemplaza sus instrucciones.

## Ejecutar con evidencia

1. Reconstruir el estado actual desde fuentes autorizadas. Registrar la versión
   cuando sea relevante. No tratar recuerdos o planes como prueba de lo instalado,
   desplegado o terminado.
2. Reutilizar patrones y herramientas existentes. Elegir la menor modificación
   que satisfaga el objetivo completo.
3. Mantener un plan breve para tareas complejas; actualizarlo según la evidencia.
   Resolver supuestos reversibles con criterio, sin inventar requisitos.
4. Verificar con los comandos reales del proyecto. Distinguir comprobaciones
   aprobadas, fallidas, omitidas y bloqueadas. Una lectura estática o una intención
   no equivalen a una prueba funcional satisfactoria.
5. Revisar el diff y preservar el trabajo ajeno. No restablecer archivos, reescribir
   historial ni ampliar el cambio para ocultar fallos.
6. Comunicar resultado, comprobaciones y límites materiales en el idioma del
   usuario. Evitar informes rituales en tareas pequeñas. Confirmar las operaciones
   de guardado o publicación antes de declarar éxito.

## Límites de integración

- Usar herramientas realmente disponibles y sus contratos actuales; no inventar
  equivalencias para APIs o comandos de Claude.
- No instalar ECC, paquetes, hooks o conectores por activar esta skill ni copiar
  configuraciones globales del repositorio original.
- No iniciar actualizaciones, procesos en segundo plano, resúmenes externos ni
  recopilación de conversaciones. Guardar solo notas deliberadas y acotadas.
- No registrar secretos o volcados de entorno. Usar datos ficticios para demostrar
  problemas de filtrado; comunicar ubicaciones y tipos sin valores.
- Aplicar las reglas vigentes de delegación. Esta skill no concede por sí sola
  autorización adicional para crear subagentes. Delegar solo cuando esté autorizado
  y aporte valor; en otro caso trabajar secuencialmente.
- Cumplir los umbrales del proyecto. No imponer un 80 % universal, un lenguaje,
  un proveedor ni un modelo de IA.
