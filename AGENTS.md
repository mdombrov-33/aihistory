# Agent guide

Build a mobile-first interactive learning web app across subjects. The Next.js application lives in `frontend/`; shared documentation lives in `docs/`. Read [status](docs/status.md) for current service boundaries and the [implementation plan](docs/implementation-plan.md#execution-tracker) for next work. Deployment is deferred.

From the root: `make install`, `make dev`, `make check`, `make test`, `make verify`. Browser journeys run separately with `make test-browser`; documentation uses `make docs-check`. Run `make` for all commands and read [development](docs/technical/development.md) for their scopes.

## Read by task

| Task | Read |
| --- | --- |
| Find frontend engine, controls, state or feature code | [Frontend navigation](frontend/DEVELOPMENT.md#start-here) |
| Product behavior or scope | [Product map](docs/design.md); follow its relevant topic |
| Next feature, implementation order or handoff | [Implementation plan](docs/implementation-plan.md#execution-tracker) |
| Modules, APIs, schemas, persistence or retrieval | [Architecture and data](docs/technical/architecture.md) |
| Screens, scenes, maps, playback or sound | [Frontend](docs/technical/frontend.md); [visual system](DESIGN.md) for design work |
| Interactive models and capability expansion | [Learning engine](docs/technical/learning-engine.md) |
| Agents, prompts, research, media or recovery | [Generation](docs/technical/generation.md) |
| Identity, sharing, moderation, limits or spending | [Security and cost](docs/technical/security-and-cost.md) |
| Setup, tooling or verification | [Development](docs/technical/development.md) |
| Unresolved technical choices | [Open questions](docs/technical/open-questions.md) |
| Domain terminology | [Glossary](GLOSSARY.md) |
| Documentation maintenance | [Harness rules](docs/harness.md) |

## Working rules

- Read task-relevant references, not the whole tree. The [technical index](docs/technical/decisions.md) is the stack map.
- State current rules in their topical source; replace superseded guidance. Keep history in Git and volatile inventory in code. Open questions are not commitments.
- Keep README.md empty. Treat visual references as illustrative, not final designs or factual evidence.
- Local work is independent of AWS provisioning. Read [deployment](docs/deployment/decisions.md) only when deployment resumes.
- Keep credentials/private data out of tracked files and routine logs. Prepared-data work must not silently call paid providers.
- Verify changed behavior and report only checks actually run. Keep unfinished task state in the implementation plan; update status when capabilities change. Commit only when requested.
