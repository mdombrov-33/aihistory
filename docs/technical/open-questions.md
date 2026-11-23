# Open technical details

These are unresolved details, not permission to change accepted direction. Resolve ordinary implementation choices in code; ask the user when behavior, scope, cost, or a substantive tradeoff changes. Product choices stay in [product questions](../product/open-questions.md).

The [implementation plan](../implementation-plan.md) records target service interfaces, storage, audio and execution order. Current prepared lesson contracts already exist; [architecture](architecture.md#prepared-and-persisted-contracts) distinguishes them from the remaining production work. Resolve these integration gaps without restarting frontend scaffolding.

## Before persisted content and account integration

- Compatible backend/workflow/auth package pins and container digests, plus M00 service setup proof. Frontend package/lock/runtime setup already exists.
- Mapping prepared v2 content and indexed guest positions to versioned persisted records and stable passage IDs; validate date/calendar support, revisions, authorized assets and readiness against the existing renderer.
- Guest-to-account import/conflict UX; the initial plan keeps namespaces separate and preserves recoverable data.

## Learning capability expansion

- Which [exploration candidates](learning-engine.md#directions-still-to-explore) deserve the next implemented mechanic after reviewing the four new lessons?
- Named GLB-part acquisition, units, licensing and segmentation for richer assemblies; current procedural primitives do not solve arbitrary model preparation.
- Domain-model validation, datasets and calibrated numerical error for additional simulations. Broad subject scope is accepted; individual scientific models still need proof.

## Before enabling live generation or public writes

- Stage inputs/outputs, provider-operation reconciliation, bounded retries/concurrency/timeouts, workflow-version retirement.
- Finite monetary caps, question quotas, pricing reconciliation, and operations without reliable cost bounds. User cancellation/allowance treatment remains open.
- Retrieval chunking/query limits, ranking tuning, cache invalidation, sharing-token/session details, trusted client-address handling, counter cleanup.
- Moderation thresholds, contextual-check bounds/failure behavior, report handling; trace storage/redaction/retention and a small calibrated live evaluation path.
- Verify actual model availability, provider terms, measured story cost, media/source reuse rights, and selected narration/sound assets. Voice and visual choices require design iteration.

Deployment questions remain in the [parked deployment record](../deployment/decisions.md). This file is not an implementation plan or backlog.
