# Implementation plan

This is the single remaining-work tracker. [Status](status.md) describes the running app; topical product/technical documents own specifications. Reuse the existing frontend. Work on one scoped feature at a time; update this file in place rather than append a work log.

## Execution tracker

| Priority | Scope | State | Completion criterion |
| --- | --- | --- | --- |
| F01 | [Premium selection](#next-feature-premium-selection) | next | Learners can understand the offer, select an option and see an honest next step |
| F02 | Membership and usage states | planned | Account surfaces explain access, remaining allowance and exhausted/paused creation without blocking free playback |
| F03 | Request, outline and creation flow | planned | A question leads through related lessons, a focused outline and coherent preparation/recovery states |
| F04 | Missing account and library states | planned | Existing previews have complete empty/error/guest paths and preserve the learner's destination |
| M00–M09 | [Service integration](#service-integration) | planned | Real persistence, identity, generation and public services replace the corresponding previews |

States: `next`, `in_progress`, `blocked`, `done`. Mark done only after the feature's checks pass; remove completed detail once current behavior is documented. Keep unresolved product choices in [product questions](product/open-questions.md), not a parallel backlog.

## Next feature: Premium selection

**Goal:** give learners a clear place to compare free access with the proposed Premium offer and choose how to continue.

**Start with:** [account and offer](product/account-and-offer.md), [visual system](../DESIGN.md), the shared navigation/account/settings components and current routes. There is no Premium route or payment service yet.

**Scope:**

- Add an offer/plan-selection page and discoverable links from appropriate account/settings entry points. Use the current app identity and theme system.
- Explain what remains free, what Premium is intended to add, and how creation allowances differ from public-library playback.
- Provide an obvious selected state, keyboard/touch interaction and a usable phone layout. Preserve the intended destination through sign-in or return navigation.
- Surface unresolved prices/quantities as explicit product decisions. Choose provisional presentation with the user before treating commercial terms as settled.
- Keep any unconnected purchase/activation action clearly a preview. Selection must not claim a paid membership, reserve a real allowance or open a payment session.

**Accept when:** entry/exit links work; selection is visible and accessible across themes; free playback remains available; guest and signed-in-intent states make sense; no fake payment or activation success appears. Run applicable static/build checks and exercise the phone/desktop selection journey in a real browser when available.

**Outside this slice:** payment-provider integration, checkout, subscription webhooks, real entitlement enforcement and live generation.

## Following frontend features

### F02 Membership and usage

Define free/Premium access from the offer decisions. Present current membership, renewal/cancellation intent, separate creation/question allowances and exhausted/paused states. Preserve browsing, reading and saved content when creation is unavailable. Use explicit fixture states until a service exists; do not infer entitlements from device-local UI selection.

Accept when the learner can understand access and recovery from each state, with no silent paid upgrade. Real billing/enforcement depends on the later authenticated service boundary.

### F03 Request to creation

Extend Ask beyond saving a local question: discover related existing lessons, narrow scope when useful, preview an outline, then show chapter readiness and recoverable failures. Keep existing usable chapters and the learner's place. An outline is informative rather than an approval gate.

Accept the frontend slice with deterministic fixture states, honest preview copy, working navigation and error recovery. Real submission, durable jobs, paid effects and status polling depend on service integration.

### F04 Account and library completeness

Audit account entry/verification/recovery, My space, saved items, sharing/reporting and community entry points against [library](product/library.md) and [account requirements](product/account-and-offer.md). Implement concrete missing states rather than redesign accepted screens. Decide guest import and personal-trail scope before presenting them as features.

Accept when the chosen flow has usable empty/loading/error/success states, safe return destinations and no claims of disconnected services. Live identity, sharing and writes remain in their service milestones.

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

Ready for F01 Premium selection. Supporting-screen changes and documentation cleanup remain uncommitted for review. No Premium route, membership activation or billing exists. Documentation validation and diff whitespace checks pass; application files were unchanged during the documentation cleanup. Current rendered verification limits live in [status](status.md#verification-boundary).

Replace this handoff when work resumes with the active behavior, unfinished checks, blocker if any and next action. Retain only information needed to continue.
