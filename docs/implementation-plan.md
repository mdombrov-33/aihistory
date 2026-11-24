# Implementation plan

This is the single remaining-work tracker. [Status](status.md) owns current service boundaries; topical documents own requirements. Reuse the existing app, select one scoped task and update this file in place.

## Execution tracker

| Scope | State | Next action |
| --- | --- | --- |
| Frontend screens and local product flows | complete for now | Preserve as the integration baseline; further design work deferred |
| M00a backend observability | next | Structured logging, request context, boundary errors, operational metrics/traces and local inspection |
| M00b local backend runtime | planned | Isolated dependencies, configuration and provider-free worker workflow using the observability foundation |
| M01–M09 service integration | planned | Persist content/activity, connect identity and durable jobs, then retrieval and public services |

Frontend completion covers the local preview scope, not production services or a full rendered verification pass. Source/build checks and contracts pass. Carry outstanding browser and audio checks into the relevant integration milestone rather than reopening a standalone design phase.

## Premium selection

Routes `/premium` and `/premium/review` compare the free library and proposed Premium benefits, review a choice and apply a device-local sample membership. `/account/membership` demonstrates usage, exhausted/paused allowances and cancellation. Prices and commercial quotas remain unresolved in [offer questions](product/open-questions.md#premium-and-accounts). No checkout, purchase or paid entitlement exists.

## Connected frontend flows

| Entry | Implemented behavior |
| --- | --- |
| `/preview` | Navigation to product flows and state examples |
| `/account` | Local profile, validation, verification, password recovery and sign-out; no credentials stored |
| `/guide` | Chosen interests, explainable suggestions, editable/reorderable trails, saved questions, private notes and public reading-list copy |
| `/create` → `/creations/[id]` | Related lessons, editable outline and deliberate preparation/opening/complete/error preview states; retry retains the plan |
| Creation sharing panel | Private/link/public intent, local link revocation and readiness-gated submission preview |
| Lesson overview | Guide entry, personal ratings/likes, editable local comments and report receipts |
| Player Ask | Free-text search of prepared context, sources, unsupported-question detour and answer recovery/limit examples |
| Settings | Supported task-specific provider preferences, appearance, sound and reading |
| Explore | Topic/duration filters, local ratings, labelled sample publication order and URL pagination |

Learning-guide and model-preference screens are part of the frontend. The [account requirements](product/account-and-offer.md) own their behavior. Sample UI state never authorizes payment, access or provider calls.

## Integration regression coverage

Exercise plan selection/return paths, usage/cancellation, trail creation/edit/reorder/notes, question/outline/retry/revocation, profile/recovery/verification, community edit/cancel and contextual inquiry. Include reload, keyboard/focus, all themes, enlarged text, narrow/short windows and empty/error states. Use `make verify` and `make test-browser`; [development](technical/development.md#verification) defines their scope.

Keep these journeys as regression coverage while replacing local previews with services. Rendered review remains outstanding; static checks do not approve layouts. Preserve local data and recovery destinations during migration.

## Service integration

The frontend runs independently of these milestones. [Architecture](technical/architecture.md) owns data/API boundaries, [generation](technical/generation.md) owns durable work and [development](technical/development.md) owns setup/verification. Resolve installed package compatibility from release metadata at integration time; manifests and lockfiles become authoritative.

### M00 Local baseline

Implement in this order; [backend observability](technical/development.md#backend-observability) owns the logging/telemetry contract.

#### M00a Observability foundation

Initialize application-owned Pino logging and OpenTelemetry before feature services. Add validated log/telemetry configuration, process/build metadata, isolated request context and a shared HTTP/error boundary. Emit one structured completion event per request, correlate logs with traces, and capture request rate/errors/duration plus process health. Provide local inspection of metrics and traces without hosted accounts; keep heavy collectors/viewers in an optional Compose profile. Use a diagnostic route and fake dependency to verify the foundation before a database or AI service is required.

Accept when concurrent requests retain separate IDs, success/4xx/5xx paths produce the expected single completion event, production-format output is valid JSON, secret-bearing inputs/errors are excluded, and a request's slow/failing dependency is visible in its trace. Metrics must use bounded route labels. Verify exporter failure does not fail requests, buffers are bounded and graceful shutdown flushes telemetry. Add reproducible local inspection commands to the Makefile/development guide.

#### M00b Local runtime and worker

Add isolated Compose PostgreSQL/pgvector and Mailpit, safe local environment configuration, Mastra worker and local Inngest process supervision to the existing app. Resolve compatible stable packages and image pins. Prepared mode needs no provider keys and constructs no live clients. Extend M00a diagnostics to database connectivity, worker lifecycle and workflow dispatch/recovery. Reuse Mastra's native execution tracing/logging/metrics with compatible correlation and privacy settings; do not build a parallel AI tracing system.

Accept when clean setup/start/stop and a fixture-only workflow survive restart with no provider traffic; database, inbox, worker, lint/types and builds are reachable and checked. Follow one request/job across web, dispatch and worker diagnostics without logging its private payload.

### M01 Content and persistence

Map prepared bundles into versioned records, stable scene/passage IDs, evidence and authorized asset storage. Preserve the renderer and guest data. Drizzle owns app/auth migrations; the Mastra adapter owns its separate schema.

Accept when representative existing content loads from the database, ready content has valid references/media, revisions preserve or explicitly map positions and private records/assets stay isolated.

Depends on M00.

### M02 Working chapter and player

Connect persisted content and real narration to the existing controller. Implement measured passage timing, subtitles, pause/seek/resume and coordinated sound. Keep complete reading and accessible media failure recovery. Check completion behavior against the closing recap requirement.

Accept through a real browser/API/storage/audio path, including reload, inspection, navigation, reduced motion and reading without audio.

Depends on M01.

### M03 Accounts and saved places

Integrate Better Auth, local verification/reset mail and configured Google OAuth. Persist account profile, interests, learning trails, private notes and supported provider preferences alongside account-isolated progress/bookmarks. Add revision conflicts and cache clearing. Preserve guest data separately while import policy is unresolved; never silently upload private local notes or questions.

Accept when independent accounts cannot access each other's content/activity/guide, verification and recovery work, saved positions and guide edits survive another session and stale writes remain recoverable. Provider preferences never expose credentials to the browser.

Depends on M02.

### M04 Prepared creation workflow

Implement authenticated idempotent submission, allowance/cost reservations, transactional outbox and durable workflow stages using saved provider-free outputs. The dispatcher delivers events; Inngest schedules stages. Ready chapters remain stable while later chapters prepare.

Accept duplicate submission, refresh, worker restart, concurrent reservations and effect-before-commit interruption tests. Reconcile unknown provider outcomes; release failed creation slots only after work definitively stops. Prepared execution sends no paid requests.

Depends on M03.

### M05 Complete scene vocabulary

Integrate persisted evidence/assets and capability versions with existing renderers. Add supported decision/relationship mechanics only for a concrete teaching need, with validated contracts and accessible alternatives.

Accept persisted content through the same renderer, unsupported capability rejection and stable navigation/bookmarks. No topic-specific layout branches.

Depends on M04.

### M06 Live provider integration

Implement configured research/text/media/narration/moderation adapters and versioned prompts. Require accessible models, finite spend/time/retry limits, restricted diagnostics and price reconciliation before live experiments. Check evidence before expensive media; reuse authorized assets.

Accept a budgeted non-fixture question through opening and complete delivery with inspectable sources, usable reading/audio, measured cost and assessed factual/visual quality. Resolve failures before expanding spend.

Depends on M05 and live prerequisites.

### M07 Discovery and contextual questions

Add authorized full-text/vector discovery and version-scoped evidence retrieval. Ground follow-ups in current context and retained sources; use separate question allowances and durable answer jobs. Preserve the lesson during broader detours.

Accept retrieval/filtering, private-data isolation, missing/disputed evidence, unavailable allowance and injection tests. Fixture checks do not prove live relevance or answer quality.

Depends on M04–M05; live evaluation depends on M06.

### M08 Sharing and community

Add private/link/public transitions, revocable sharing, public readiness checks, version-scoped ratings/likes/comments and contextual reports/moderation. Keep publication distinct from link sharing.

Accept revocation, guessed-ID isolation, duplicate writes, unsafe edits, rate limits and moderation failure paths. Public listing requires checked complete content and authorized assets.

Depends on M03–M04 and M07.

### M09 Local product verification

Exercise clean setup, real browser/API/database/audio journeys, permissions, budgets, recovery and diagnostic cleanup. Test prepared mode with keys absent and live mode only within explicit limits. Update setup and current-state docs from actual results.

Accept when integrated behavior has evidence and remaining limitations are explicit. Deployment and unresolved commercial terms remain separate; the personal learning guide is included in product scope.

Depends on M08.

## Active handoff

Start M00a with [backend observability](technical/development.md#backend-observability) and [diagnostic privacy](technical/security-and-cost.md#diagnostics). Inspect the manifests and working tree, verify compatible logging/OpenTelemetry packages and implement the diagnostic request/dependency path. Then continue to M00b [local setup](technical/development.md#planned-backend-environment), [application boundaries](technical/architecture.md#application-boundaries) and the [generation workflow](technical/generation.md). Keep prepared mode usable without credentials or provider traffic; do not provision cloud infrastructure.

The frontend is finished for now. `/preview` provides the screen/state map for integration. Browser and audio checks remain part of milestone acceptance, not a prerequisite for starting M00.
