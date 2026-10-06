# ECC en ChatGPT Work Mode y Codex

Este fork conserva ECC y añade una entrada pequeña para usar sus prácticas de
ingeniería en ChatGPT Work Mode y Codex. El punto de entrada es
[`skills/ecc-workflow/SKILL.md`](../skills/ecc-workflow/SKILL.md).

La adaptación es selectiva: no convierte todos los agentes, skills y hooks en
herramientas de ChatGPT. Aporta instrucciones reutilizables; no cambia el modelo,
sus permisos ni las capacidades disponibles en una sesión.

## Estructura y uso

| Necesidad | Archivo en `skills/ecc-workflow/` |
| --- | --- |
| Decidir el alcance y empezar | `SKILL.md` |
| Explorar y planificar | `references/plan-and-explore.md` |
| Implementar o depurar | `references/implement-and-debug.md` |
| Revisar código y seguridad | `references/review-and-security.md` |
| Verificar y entregar | `references/verify-and-deliver.md` |
| Ajustarse a las herramientas disponibles | `references/work-mode-tools.md` |
| Retomar trabajo y preparar traspasos | `references/continuity.md` |
| Consultar origen y licencia | `references/sources-and-license.md` |

Cargar primero `SKILL.md` y solo las referencias necesarias para la tarea.
Ejemplos de peticiones:

```text
Usa $ecc-workflow para investigar este fallo, corregirlo y verificar la regresión.
Usa $ecc-workflow para revisar este diff. Entrega hallazgos con evidencia.
Usa $ecc-workflow para implementar esta función y comprobar su integración.
```

La invocación con `$ecc-workflow` requiere que el entorno tenga esa skill
disponible. Guardar este repositorio en GitHub no la instala por sí solo.
En Work Mode, solicitar su incorporación mediante el mecanismo de skills
disponible en la sesión, usando la carpeta completa como fuente. No copiar el
repositorio entero a la configuración global.

Con un checkout accesible también se puede pedir explícitamente:

```text
Lee skills/ecc-workflow/SKILL.md de este repositorio y aplica ese flujo a la tarea.
Carga únicamente las referencias que necesites.
```

Este uso directo no requiere el CLI de ECC ni ejecutar `install.sh`.
Las reglas del proyecto y las instrucciones de la sesión siguen siendo aplicables.
Un cambio pequeño requiere una comprobación pequeña; un fallo de comportamiento
requiere una regresión pertinente. Los umbrales de pruebas los determina el proyecto.

### Copia selectiva para Codex

El módulo `skill-ecc-workflow` permite copiar únicamente esta skill usando el
instalador del checkout. Instalar las dependencias y revisar primero el plan
y sus destinos:

```bash
npm ci --ignore-scripts
node scripts/install-apply.js --target codex --modules skill-ecc-workflow --dry-run
node scripts/install-apply.js --target codex --modules skill-ecc-workflow
```

Este módulo no tiene dependencias. El instalador copia la carpeta de la skill a
`~/.codex/skills/ecc-workflow` y mantiene su manifiesto de instalación; no instala
hooks ni la configuración global de ECC. Este comando corresponde a Codex y
no sustituye el mecanismo de skills de ChatGPT Work Mode.

## Qué se activa

La skill no contiene ejecutables ni dependencias de runtime. No instala hooks,
servidores MCP, agentes de Claude ni modelos; tampoco inicia procesos en segundo
plano, actualizaciones, resúmenes externos o captura de conversaciones.

Los componentes originales siguen presentes en este fork y mantienen su propio
comportamiento cuando se instalan o ejecutan expresamente. Usar `ecc-workflow`
no desactiva un runtime ECC instalado previamente. Los conectores, la delegación
y la persistencia se usan conforme a las herramientas y permisos de cada sesión.

## Corrección del registro de claves

El código original de `scripts/hooks/post-bash-command-log.js` podía guardar
valores de `API_KEY` y de opciones `--api-key` sin filtrar. Este fork añade
redacción para esas formas y sus variantes, con pruebas de regresión de la
función y de los modos `audit` y `cost` que escriben en disco.

El contrato de stdout conserva el payload original para encadenar hooks: la
redacción se aplica al registro persistente. No es un saneador universal de
cualquier secreto incrustado en cualquier lenguaje de shell, ni modifica logs
ya existentes. La adaptación Work Mode no utiliza ese registro de comandos.

## Verificar este checkout

Desde la raíz del repositorio, con Node.js 18 o posterior:

```bash
npm ci --ignore-scripts
node tests/scripts/post-bash-command-log.test.js
node tests/hooks/bash-hook-dispatcher.test.js
node scripts/ci/validate-skills.js --strict
node scripts/ci/validate-install-manifests.js
npm run catalog:check
npm run command-registry:check
```

`npm test` ejecuta los validadores y la suite completa del proyecto.
Una prueba local no equivale a una ejecución de CI remota ni demuestra que todos
los adaptadores de ECC funcionen en ChatGPT.

## Procedencia y mantenimiento

- Repositorio original: <https://github.com/affaan-m/ECC>.
- Base: `ef648e01899ba3e8dc6371642deaaf64b4477775`, ECC 2.2.3.
- Adaptación inicial: 2026-10-06.
- Licencia MIT y atribución originales conservadas en [`LICENSE`](../LICENSE).

La fuente mantenida de esta adaptación vive en `skills/ecc-workflow/`. Una copia
instalada en un entorno de usuario debe actualizarse expresamente desde una
revisión comprobada; no existe sincronización automática con GitHub.

Al incorporar cambios upstream, revisar los conflictos, conservar las pruebas
de regresión y verificar el catálogo y los manifiestos. Los instaladores que
apuntan a `affaan-m/ECC` o al paquete oficial `ecc-universal` no distribuyen los
cambios propios de este fork. No se ha publicado un paquete npm de esta adaptación.
