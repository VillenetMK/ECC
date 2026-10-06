# Verificar y entregar

## Usar los comandos reales

Extraer controles de manifiestos, configuración del runner, wrappers y CI.
Distinguir gestor de paquetes y runner: `bun test` no equivale a un script de
Jest; la presencia de Node no implica `npm test`. No adivinar scripts.

Inspeccionar qué ejecutan los comandos de un repositorio recién obtenido.
Ejecutar las comprobaciones pertinentes y los controles exigidos; ampliar solo
para resolver un riesgo restante concreto.

| Control | Evidencia |
| --- | --- |
| Sintaxis, tipos o build | Compilación y contratos estáticos afectados. |
| Lint | Reglas del área modificada o control obligatorio. |
| Unitarias | Lógica verificable sin servicios externos. |
| Integración | Interacción entre módulos, servicios o persistencia. |
| Flujo de usuario | Comportamiento no cubierto por controles inferiores. |
| Seguridad | Frontera de confianza o exposición concreta. |
| Diff | Todas las modificaciones de código o configuración. |

## Conservar resultados fiables

Capturar el código de salida real y un resumen suficiente. Evitar que tuberías
con `head` o `tail` oculten el resultado o terminen la prueba antes de tiempo.
Capturar salida o usar archivos temporales; redactar datos sensibles antes de
mostrarlos.

Clasificar cada comprobación:

- Aprobada: ejecución terminada y resultado esperado observado.
- Fallida: resultado observado que viola el criterio.
- Bloqueada: no pudo ejecutarse por requisitos o acceso ausentes.
- No ejecutada / no aplica: fuera de alcance o sin pertinencia; no contar como aprobada.

Un error del runner no demuestra un defecto del producto. Una búsqueda sin
coincidencias no prueba ausencia de vulnerabilidades. No deducir cobertura a
partir de archivos. Separar resultados locales y CI remota, asociando la CI
al commit correcto. Si cambia el código, comprobar vigencia de la evidencia.

## Cerrar la entrega

Revisar el diff completo, eliminaciones, archivos nuevos, lockfiles y configuración.
Excluir secretos, datos personales innecesarios, temporales y cambios ajenos.

Explicar primero el resultado práctico, después la verificación y los límites
materiales. Para tareas pequeñas, usar pocas frases. En una PR, describir
problema, cambio y comportamiento resultante con evidencia útil.

Completar guardado, commits, PR o publicación cuando formen parte del encargo
y estén autorizados. No presentar propuesta como edición, commit como push ni
push como despliegue. Si se exige aprobación final, preparar antes el resultado
concreto y revisable.
