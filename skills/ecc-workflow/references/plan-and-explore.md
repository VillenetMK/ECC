# Explorar y planificar

## Reconocer lo existente

1. Resolver el repositorio o archivo mediante su fuente autorizada. Distinguir
   coincidencias ambiguas antes de modificar.
2. Leer las instrucciones aplicables al directorio de trabajo.
3. Inspeccionar estado Git, rama y cambios existentes sin alterarlos. Separar
   trabajo previo y cambios de la tarea.
4. Buscar con `rg --files` y consultas acotadas. Leer manifiestos, puntos de
   entrada, pruebas y CI pertinentes; excluir dependencias generadas cuando
   no sean el objeto de análisis.
5. Rastrear un recorrido completo: entrada, validación, lógica, persistencia o
   servicio y salida. Leer consumidores antes de inferir que falta una protección.

Registrar hechos y dudas por separado, vinculados a archivos y contratos.
Un listado de carpetas no demuestra cómo funciona el sistema.

## Investigar antes de añadir

Buscar implementaciones equivalentes en el proyecto. Confirmar APIs cambiantes
en documentación oficial conforme a las reglas de navegación de la sesión.
No instalar herramientas o consultar registros de paquetes para resolver una
modificación que ya pueda hacerse con lo existente.

Si hace falta una dependencia, comparar funcionalidad, compatibilidad, licencia,
mantenimiento y coste operativo. La disponibilidad de un paquete no autoriza a
configurar servicios, conceder acceso o transmitir datos.

## Planificar proporcionalmente

Para cambios con varias partes, definir:

- Resultado observable y criterio de aceptación.
- Componentes y contratos afectados.
- Pasos por dependencias, cada uno con una comprobación concreta.
- Incertidumbres que puedan cambiar la solución y cómo resolverlas.
- Recuperación para cambios de datos o disponibilidad cuando corresponda.

Continuar con la implementación autorizada sin pedir aprobación ritual del plan.
Si el usuario pide solo planificar, entregar el plan sin modificar.
Ampliar la exploración desde la ruta afectada hacia sus dependencias; no leer
todo el repositorio ni importar todas las skills de ECC. Identificar expresamente
el alcance cuando la revisión sea una muestra.
