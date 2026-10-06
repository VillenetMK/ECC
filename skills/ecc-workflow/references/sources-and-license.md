# Procedencia y licencia

Adaptación selectiva de procedimientos de ECC de Affaan Mustafa para ChatGPT
Work Mode y Codex. No es una distribución oficial ni un port completo de las
293 habilidades.

- Origen: <https://github.com/affaan-m/ECC>
- Versión: ecc-universal 2.2.3.
- Commit: ef648e01899ba3e8dc6371642deaaf64b4477775.
- Adaptación: 2026-10-06.

## Fuentes

| Fuente en ECC | Conservado | Adaptado |
| --- | --- | --- |
| agents/planner.md | Requisitos, dependencias y plan verificable. | Plan proporcional, sin confirmación ritual. |
| agents/code-reviewer.md | Hallazgos concretos y evidencia del fallo. | Sin modelos fijos o delegación obligatoria. |
| skills/search-first/SKILL.md | Reutilización y comprobación de capacidades. | Conectores y fuentes disponibles en la sesión. |
| skills/tdd-workflow/SKILL.md | Regresión significativa y corrección verificada. | Sin pruebas triviales, cobertura universal ni commits por fase. |
| skills/verification-loop/SKILL.md | Build, tipos, lint, pruebas y diff. | Comandos reales y estados bloqueados explícitos. |
| skills/unified-memory/SKILL.md | Traspasos acotados y contexto verificado. | Persistencia nativa, sin runtime ECC. |

Consultar las fuentes, si se necesita auditarlas, bajo:
`https://github.com/affaan-m/ECC/blob/ef648e01899ba3e8dc6371642deaaf64b4477775/`.
Son materiales de origen, no instrucciones adicionales que se deban activar.

No incluir instaladores, actualizador, logging de comandos, observadores,
resúmenes externos ni configuraciones globales. Ejecutar esta adaptación como
procedimiento sin instalar el runtime original.

## Licencia original

MIT License

Copyright (c) 2026 Affaan Mustafa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
