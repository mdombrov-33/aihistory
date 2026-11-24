# Maintaining the agent workspace

## Document ownership

| Information | Canonical location |
| --- | --- |
| Entry points and global work rules | [AGENTS.md](../AGENTS.md) |
| Working app and service boundaries | [Status](status.md) |
| Next feature, remaining work and active handoff | [Implementation plan](implementation-plan.md) |
| User-visible behavior | [Product map](design.md) → relevant `product/` document |
| Architecture, contracts and implementation rules | [Technical map](technical/decisions.md) → relevant `technical/` document |
| Code entry points and folder ownership | [Frontend guide](../frontend/DEVELOPMENT.md) |
| Visual identity | [DESIGN.md](../DESIGN.md) |
| Unsettled choices | Product or technical open questions; remove resolved entries |
| Commands, versions, fields and registered content | Makefile, manifests, configuration and source code |
| Supporting claims and media rights | Source packets and asset provenance |

## Working loop

1. Inspect the working tree and current state. Read only the topical documents needed for the task; follow their code pointers.
2. Select one feature from the implementation plan. Define observable behavior, scope and applicable checks before editing. Record a blocker only when a real prerequisite prevents progress.
3. Update the owning document when behavior or a constraint changes. Replace superseded guidance instead of appending another account of the change.
4. Run relevant checks from [development](technical/development.md#verification); report actual results and unresolved gaps. For documentation changes, run `make docs-check` and inspect the diff.
5. If work remains, replace the active handoff with the unfinished behavior, checks, blocker and next action. Close completed tasks without retaining a session diary. Commit only when requested.

Keep the root guide short and route specialized work through links. Git holds development history. Documentation describes the current system and intended behavior: omit approval chronology, rejected alternatives, old test totals, lesson/preset counts and repeated tooling failures. Keep source retrieval dates, licenses, schema versions and substantive technical constraints where they affect correctness.

Use the existing checks and task tracker. Add automation or additional instruction files only to address a recurring failure. External course notes are background reading; the repository must contain everything needed to resume work.
