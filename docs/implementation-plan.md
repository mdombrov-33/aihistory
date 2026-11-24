# Implementation plan

This is the single remaining-work tracker. [Status](status.md) owns current service boundaries; topical documents own requirements. Reuse the existing app, select one scoped task and update this file in place.

## Execution tracker

| Scope | State | Remaining acceptance |
| --- | --- | --- |
| Premium, membership and account flows | frontend implemented | Rendered phone/desktop and keyboard review; commercial terms and real services remain separate |
| Learning guide and task-specific provider preferences | frontend implemented | Rendered trail/edit/reorder, private-note and preference journeys |
| Request outline, preparation, recovery and sharing | frontend implemented | Rendered connected state/reload/revocation journeys; real jobs/publication remain separate |
| Contextual inquiry, community drafts and discovery controls | frontend implemented | Rendered inquiry/rating/edit/filter journeys; generated answers and public writes remain separate |
| M00–M09 service integration | planned | Real persistence, identity, generation and public services |

States describe actual scope, not production readiness. Browser-dependent acceptance remains open until exercised. Current source/build checks and contracts pass; browser execution is unavailable in the agent environment.

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

## Frontend review

Exercise plan selection/return paths, usage/cancellation, trail creation/edit/reorder/notes, question/outline/retry/revocation, profile/recovery/verification, community edit/cancel and contextual inquiry. Include reload, keyboard/focus, all themes, enlarged text, narrow/short windows and empty/error states. Use `make verify` and `make test-browser`; [development](technical/development.md#verification) defines their scope.

Source review corrections cover non-submitting Cancel edit, complete recovery destinations and shared profile validation with isolated corrupt-profile recovery. Rendered review remains open; static checks do not approve layouts. No new asset or dependency is required by this frontend pass.

## Service integration

The frontend runs independently of these milestones. [Architecture](technical/architecture.md) owns data/API boundaries, [generation](technical/generation.md) owns durable work and [development](technical/development.md) owns setup/verification. Resolve installed package compatibility from release metadata at integration time; manifests and lockfiles become authoritative.

### M00 Local baseline

Add isolated Compose PostgreSQL/pgvector and Mailpit, safe local environment configuration, Mastra worker and local Inngest process supervision to the existing app. Resolve compatible stable packages and image pins. Prepared mode needs no provider keys and constructs no live clients.

Accept when clean setup/start/stop and a fixture-only workflow survive restart with no provider traffic; database, inbox, worker, lint/types and builds are reachable and checked.

### M01 Content and persistence

Map prepared bundles into versioned records, stable scene/passage IDs, evidence and authorized asset storage. Preserve the renderer and guest data. Drizzle owns app/auth migrations; the Mastra adapter owns its separate schema.

Accept when representative existing content loads from the database, ready content has valid references/media, revisions preserve or explicitly map positions and private records/assets stay isolated.

Depends on M00.

### M02 Working chapter and player

Connect persisted content and real narration to the existing controller. Implement measured passage timing, subtitles, pause/seek/resume and coordinated sound. Keep complete reading and accessible media failure recovery. Check completion behavior against the closing recap requirement.

Accept through a real browser/API/storage/audio path, including reload, inspection, navigation, reduced motion and reading without audio.

Depends on M01.

### M03 Accounts and saved places

Integrate Better Auth, local verification/reset mail and configured Google OAuth. Add account-isolated progress/bookmarks with revision conflicts and cache clearing. Preserve guest data separately while import policy is unresolved.

Accept when independent accounts cannot access each other's content/activity, verification and recovery work, saved positions survive another session and stale writes remain recoverable.

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

Accept when integrated behavior has evidence and remaining limitations are explicit. Deployment and unresolved commercial/personal-guide scope remain separate.

Depends on M08.

## Active handoff

Frontend product flows are implemented for user review and remain uncommitted. Open `/preview` to navigate them. Source fixes are reviewed; final static/contract/build checks are the acceptance evidence available here. Browser journeys and rendered review remain pending because server binding and browser launch are unavailable. Continue with rendered review before production service integration.
