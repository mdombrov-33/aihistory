# Generation and evidence

Use for agents, prompts, research, composition, provider calls, validation, and recovery. Data/provenance records live in [architecture](architecture.md); enforced tool and spending boundaries live in [security and cost](security-and-cost.md).

## Workflow and shared blueprint

The frontend composes versioned prepared bundles through the [scene contracts](scenes.md). The [authoring guide](lesson-authoring.md) describes evidence/media-first storyboarding and validation; `/screen-gallery` renders registered examples.

This is a content-ingestion seam, not a working generation service. An agent can author the supported JSON without changing lesson-specific React. Live research, automatic image/model acquisition, claim-linked checking, production versioning, readiness and durable jobs below remain future implementation. Model registration now exists as local bundle data; automatic model finding, rights checks and optimization do not.

Use Mastra with its supported Inngest integration. Mastra defines agents/workflows; Inngest owns durable step results/retry scheduling. Implement and verify the local development integration before hosted plans; no Mastra/Inngest worker currently runs in this repo.

1. **Research:** bounded search/reading, supporting passages, claims, gaps, disagreement.
2. **Plan:** one shared blueprint containing subject scope, assumed knowledge, learning outcomes, relevant entities, evidence/uncertainty and computational model assumptions; chronology where useful; learning goals and chapter connections; visual treatment, palette, typography choices, recurring assets, narrator and sound direction.
3. **Compose/check:** scene content and narration grounded in evidence and supported components; check written claims before expensive media.
4. **Produce media:** explicit image/audio tasks, prioritizing the opening chapter with bounded parallelism and asset reuse.
5. **Validate/deliver:** release coherent ready chapters progressively; delivered scenes remain stable. A story is generation-complete only when every required chapter passes.

Agents make investigative/creative choices within stages; application code controls progression and budgets. Writing may request more research within budget. Separate roles need not use separate models. The blueprint coordinates chapters without freezing product design.

## Composing interactions

Use the [learning engine capability contracts](learning-engine.md). The agent selects a mechanic and supported model, bounded inputs, meaningful investigations, explanations and sources. Application code evaluates rules consistently; dragging a control does not call an LLM. New equations or runtime behavior need reviewed model code and validation before entering the capability registry. Source quality, model correctness, asset structure and rendered usability are distinct checks. Generated pictures do not replace computed plots, geometry or real datasets.

## Prompts and inputs

- Keep detailed, versioned repository instructions for research, planning, writing, evidence checking, art, and narration; use typed builders rather than scattered prompt strings.
- Specify role/purpose, inputs, evidence policy, allowed tools, constraints, output schema, and completion/error criteria.
- Delimit input sections and source excerpts clearly with source IDs/provenance. Separate trusted instructions from untrusted user/source text; delimiters are not a security boundary.
- Validate outputs with shared schemas. Record prompt versions on jobs; preserve the corresponding execution paths for in-flight work.

## Research and source quality

- Initial tools: Tavily Search + Extract. Choose queries, read actual sources, and investigate gaps under call/time/retry/spend limits.
- Select sources appropriate to the subject: textbooks and research for scientific models, official documentation for technical systems, scholarship/archives/museums for historical or artistic questions. Contextualize primary sources; age or institution alone does not establish truth.
- Cross-check central/disputed claims against genuinely independent sources where possible. Preserve uncertainty/disagreement; do not equate a URL count with verification.
- Treat snippets and generated summaries as leads. Retain supporting source passages through the [evidence records](architecture.md#subject-records-and-evidence).

## Checks and delivery

- Compare substantive written claims with retained evidence before artwork/narration production. Flag unsupported claims, contradictions, misleading quotations, and missing uncertainty; retain claim/evidence-linked findings.
- Repair through targeted research/rewriting within fixed attempt/time/spend limits. Qualify unresolved material, remove it only if the explanation remains coherent, or block the chapter.
- Readiness checks cover supported structures, valid navigation/IDs, resolvable evidence/assets, usable required media, complete interaction data, subtitles, and full reading text.
- Failed chapters remain preparing/failed while ready chapters stay usable. Generation completion is distinct from the learner reaching the closing recap.
- Schema validity, citations, model-check approval, and shared facts do not establish subject correctness. Use traces and observed failures to improve checks.

## Recovery and versioning

- PostgreSQL owns canonical job status, approved content, asset references, spending, and allowance reservations. Inngest execution checkpoints do not replace those records.
- Recovery reuses saved results/assets and reconciles uncertain external operations before further paid work. Use provider idempotency/reconciliation where supported; external effects are not automatically exactly-once.
- Pin workflow, prompt, model configuration, and schema versions on jobs. Stable step IDs preserve compatible work; renaming can repeat effects.
- For incompatible changes, route new jobs to a new version and retain old execution paths until active jobs finish. Test resumed and fresh runs when workflow code changes. Version labels alone do not preserve old semantics.

## Local workflow integration

Use a separately supervised Mastra worker and local Inngest development server within the existing package. Resolve compatible published releases by checking engines, peer ranges, exports and integration routes, then run a provider-free fixture smoke test. Cached upstream manifests are not verified installation pins. Keep process addresses configurable and inspect the chosen integration's reserved route rules.

Create jobs, request deduplication, allowance reservations and outbox events in one application transaction. A short leased dispatcher delivers committed events with stable identities; it never independently schedules generation stages. The authorized application status API reads canonical database records; diagnostic realtime updates may supplement it.

Operations move through reserved, dispatched and succeeded/known-failed/uncertain states under a unique logical key. Unknown effects retain reservations until reconciled. Configure finite transport retries separately from repair/provider attempts; initial transport target is two retries, subject to actual SDK counting semantics. Keep checkpoints compact rather than storing media blobs. Retry of a stopped job rechecks any released allowance; completed work reuses its result.

Test crash after saved results, during a stage and after a fake external effect before commit. Verify finished chapters stay stable, dispatch deduplicates, spend remains reconciled and workflow versions preserve resumability.

## Provider defaults

These are selected defaults, not verified integrations or claims of best quality. Confirm model availability, capabilities, exact SDK versions, and pricing before live use; no provider pricing quote or creation count is guaranteed by this document.

| Task | Initial default |
| --- | --- |
| Research, planning, story composition | OpenAI `gpt-6.2-sol` |
| Generated illustrations/reference edits | OpenAI `gpt-image-2.6-sunburst` |
| Scripted narration | Gemini `gemini-3.8-flash-tts`; actual voice remains open |

Use Mastra direct-provider integrations, optional OpenRouter for supported text models, and small media API integrations where needed. Keep models configurable by stage under supported capabilities/budgets; credentials stay server-side. Bound per-asset retries; not every scene needs a new image. Embedding defaults are in [retrieval](architecture.md#retrieval).

## Follow-up answers

Provide current scene, story outline, and relevant retained passages from the authorized story version. Retrieve other chapters when useful; allow bounded extra research if evidence is insufficient. Include inspectable references and uncertainty. Offer a related direction/new story for broader inquiries; never silently expand scope or regenerate the lesson. [Account and allowance checks](security-and-cost.md#identity-and-access) apply before paid work.

## Tracing

Reuse Mastra's native tracing, logger and span-derived metrics from worker integration; verify APIs and storage support against the installed release before configuring them. Native capabilities cover agent/workflow/tool/model execution, while [backend observability](development.md#backend-observability) owns HTTP, database, process and dispatch diagnostics. Correlate request/job/stage and trace context without installing competing instrumentation or duplicating token/cost metrics. Mastra's estimated cost does not replace the application spending ledger or provider reconciliation.

Record model/prompt versions, safe source/tool metadata, usage/cost estimate, timings and failures. Inputs/outputs are potentially private: filter before export/storage and keep raw content capture disabled until a restricted policy exists. Detailed trace storage, sampling, redaction, retention and calibrated live evaluation remain [open](open-questions.md); routine diagnostic privacy is defined in [security and cost](security-and-cost.md#diagnostics).

## Primary references

[Mastra agents](https://mastra.ai/docs/agents/overview), [Inngest integration](https://mastra.ai/integrations/deploy/inngest), [workflow versioning](https://www.inngest.com/docs/durable-execution/guides-and-advanced/versioning), [tracing](https://mastra.ai/docs/observability/overview), [Tavily](https://docs.tavily.com/documentation/api-credits), [text model](https://developers.openai.com/api/docs/models/gpt-6.2-sol), [image model](https://developers.openai.com/api/docs/models/gpt-image-2.6-sunburst), [speech](https://aistudio.google.com/docs/speech-generation).

[Mastra logging/correlation](https://mastra.ai/docs/observability/logging), [execution tracing](https://mastra.ai/docs/observability/tracing/overview), [automatic metrics and storage support](https://mastra.ai/docs/observability/metrics/overview).
