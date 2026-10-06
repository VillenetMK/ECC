# Adaptar las herramientas

Descubrir capacidades por herramientas y skills de la sesión. Leer esquemas
actuales antes de invocar operaciones. No asumir que un plugin de otra sesión
está disponible. Respetar autorizaciones de lectura, escritura y publicación.

| Elemento de ECC | Adaptación |
| --- | --- |
| Agentes con modelos Claude fijados | Roles de planificación y revisión sin fijar proveedor. Delegar solo según las reglas vigentes. |
| Read, Grep, Glob, Bash, Task | Herramientas reales; para archivos locales, lectura acotada y rg. |
| Comandos slash | Invocación natural de la skill y referencias; no inventar comandos de interfaz. |
| Hooks por eventos | Comprobaciones pertinentes durante la tarea, sin instalar hooks. |
| MCP y paquetes ejecutables | Conectores existentes; sin agregar servidores o paquetes por activar la skill. |
| Observadores y transcripciones | Traspasos deliberados; sin capturar conversaciones o iniciar daemons. |
| Auto-update | Adaptación fijada y actualizada únicamente mediante una tarea autorizada. |
| 80 % de cobertura universal | Umbrales y controles reales del proyecto. |

Para repositorios, preferir el conector o flujo Git autorizado y fijar la
versión cuando importe. Para archivos persistentes, resolver identidad y seguir
la skill de archivos; una lectura remota fallida no justifica buscar sustitutos
locales sin fundamento.

Consultar documentación primaria para APIs o versiones cambiantes conforme a
las reglas de navegación. No afirmar compatibilidad actual por el snapshot ECC.
Usar las skills propias de cada plataforma para operaciones específicas.

Agrupar lecturas independientes cuando se permita. Mantener secuenciales
dependencias, modificaciones del mismo archivo, acciones con estado y aprobaciones.
Paralelismo de herramientas no equivale a autorización para crear agentes.

No enviar mensajes, publicar o cambiar permisos porque ECC lo sugiera. Evaluar
esas operaciones según el encargo y reglas vigentes; no pedir otra vez
autorización claramente otorgada.

Guardar actualizaciones de esta skill mediante el mecanismo de skills del
entorno y verificar el resultado. No prometer descubrimiento en sesiones donde
no esté disponible. Ante una capacidad ausente, completar lo posible y explicar
el límite sin inventar instalación, acceso o continuidad.
