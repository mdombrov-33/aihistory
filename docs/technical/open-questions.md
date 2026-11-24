# Open technical details

Resolve ordinary implementation choices in code. Keep questions here only when an unresolved boundary affects scope, behavior, cost or correctness. Product choices live in [product questions](../product/open-questions.md); the [implementation plan](../implementation-plan.md) owns execution order.

## Persistence and identity

- Compatible backend/workflow/auth releases and container images; verify peers, exports and a provider-free worker smoke path at integration time.
- Prepared content and indexed guest positions mapped to stable, versioned persisted IDs; revision conflicts and guest-to-account import UX.
- Chapter readiness, evidence ownership and authorized asset serving integrated with the existing renderer.

## Live services

- Provider-operation reconciliation, bounded retries/concurrency/timeouts and workflow-version retirement.
- Finite monetary caps, separate question/creation quotas, price reconciliation, cancellation and allowance treatment.
- Retrieval chunk/query limits, ranking evaluation, identity-scoped cache invalidation and sharing-token revocation.
- Moderation thresholds, failure behavior, report/correction handling and trusted client-address policy.
- Private trace storage/redaction/retention and a budgeted, calibrated live evaluation path.
- Actual model access, provider terms, measured creation cost, reusable media rights and narration/sound assets.

## Capability expansion

Named model parts, units, pivots, licensing and datasets for [new mechanics](learning-engine.md#capability-expansion). A viewer alone does not supply a validated simulation or source packet.

[Deployment](../deployment/decisions.md) stays deferred.
