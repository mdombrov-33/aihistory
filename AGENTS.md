# Agent guide

Build a mobile-first interactive learning web app across subjects. The Next.js application lives in `frontend/`; shared documentation lives in `docs/`. Run app commands from `frontend/` or use `pnpm --dir frontend <script>` from the repo root. Current work is local-first; deployment is deferred. Read [status](docs/status.md) for what actually exists before choosing commands or work.

## Read by task

| Task | Read |
| --- | --- |
| Product behavior or scope | [Product map](docs/design.md); follow its relevant topic |
| Implementation order, current task, acceptance evidence | [Implementation plan](docs/implementation-plan.md#execution-tracker) |
| Modules, APIs, schemas, persistence, retrieval | [Architecture and data](docs/technical/architecture.md) |
| Screens, scenes, maps, playback, sound | [Frontend](docs/technical/frontend.md) |
| Learning mechanics, simulation models, cross-subject examples | [Learning engine](docs/technical/learning-engine.md) |
| Agents, prompts, research, media generation, recovery | [Generation](docs/technical/generation.md) |
| Identity, sharing, moderation, request limits, spending | [Security and cost](docs/technical/security-and-cost.md) |
| Local setup, Oxc, tests, verification | [Development](docs/technical/development.md) |
| Unresolved technical choices | [Open questions](docs/technical/open-questions.md) |
| Domain terminology | [Glossary](GLOSSARY.md) |
| Harness maintenance | [Documentation rules](docs/harness.md) |

## Working rules

- Read the relevant references, not the entire documentation tree. [Technical index](docs/technical/decisions.md) is the compact stack map.
- Preserve accepted decisions in their topical source; replace superseded guidance. Open questions are not commitments.
- Keep README.md empty. Treat visual references as illustrative, not final designs or factual evidence.
- Keep local work independent of AWS provisioning. Read [deployment](docs/deployment/decisions.md) only when the user resumes that work.
- Keep credentials/private data out of tracked files and routine logs. Prepared-data work must not silently call paid providers.
- Verify the changed behavior and report only checks actually run. Keep task state/evidence in the implementation plan and phase/available commands in status.
