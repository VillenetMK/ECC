# Implementar y depurar

Leer el área afectada, sus consumidores y pruebas cercanas. Mantener contratos,
convenciones y dependencias salvo que el objetivo requiera cambiarlos.

## Elegir evidencia útil

| Situación | Comprobación |
| --- | --- |
| Texto o estilo de bajo impacto | Diff y comprobación directa; sin suite nueva. |
| Error reproducible | Reproducción o regresión que falle por el defecto observado. |
| Comportamiento nuevo | Casos de aceptación y errores pertinentes al contrato. |
| Cambio de integración | Interfaz entre componentes y fallos del servicio. |
| Datos o autenticación | Casos negativos, autorización y conservación de datos. |

Cuando una prueba nueva aporte valor, escribirla antes de corregir, ejecutarla
y confirmar que falla por la causa esperada. Implementar el cambio mínimo y
repetirla. No inventar evidencia de una ejecución fallida ni afirmar TDD si las
pruebas se escribieron después. Cumplir reglas más estrictas del proyecto.

## Investigar un fallo

1. Capturar un caso mínimo con datos no sensibles. Distinguir síntoma y causa.
2. Formular una hipótesis verificable sobre llamadas, estado o configuración.
3. Buscar la observación más pequeña que la confirme o descarte.
4. Modificar un factor causal a la vez y vincularlo a la comprobación.
5. Revisar el comportamiento vecino que pueda romperse. Detener pruebas
   adicionales cuando se resuelva el riesgo concreto y los controles requeridos.

En fallos intermitentes, describir condiciones y límites de lo observado.
No sustituir una reproducción controlada con llamadas repetidas a servicios
reales, transacciones o acciones de hardware.

## Resolver bloqueos

Separar dependencias o acceso ausentes de un fallo funcional. Inspeccionar los
requisitos antes de instalar; aislar dependencias cuando corresponda, sin
configuración global por comodidad.

No silenciar errores, desactivar controles, reducir umbrales o alterar pruebas
correctas para obtener un resultado satisfactorio. Modificar una prueba solo
si cambia el contrato o se demuestra que era incorrecta; explicar el motivo.
