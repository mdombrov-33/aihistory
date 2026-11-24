# Architecture and data

Use for module boundaries, API contracts, schemas, persistence, and retrieval. Product behavior is defined in the [product map](../design.md).

## Application boundaries

One application package in `frontend/`. The Next.js frontend exists; the generation-worker entry point and backend services remain planned:

| Location | Responsibility / implementation state |
| --- | --- |
| `frontend/src/app/` | Existing Next.js pages; application HTTP/JSON handlers planned |
| `frontend/src/features/lesson/` | Reusable lesson engine: contracts, player controls, scene renderers, mechanics and media viewers |
| `frontend/src/features/` (other folders) | Discovery, creation/account previews and Settings |
| `frontend/src/features/lesson/contracts/` | Existing prepared bundle/model/composition contracts; persisted records planned |
| `frontend/src/content/` | Canonical lessons/server registry, light summary catalog, discovery data and geography |
| `frontend/src/state/guest/` | One device-local guest store, with separate schema, persistence and actions |
| `frontend/src/components/`, `frontend/src/styles/`, `frontend/src/lib/` | Shared app/UI components, global foundations and generic helpers |
| `frontend/src/generation/` | Planned Mastra agents, tools, prompts and Inngest workflows |
| `frontend/src/server/` | Planned database, auth, storage and application services |

The [frontend navigation guide](../../frontend/DEVELOPMENT.md#start-here) maps engine entry points, controls, state, data and style ownership. Component types stay with their owner; shared lesson types derive from the validated bundle schema, and `src/types/` holds external declarations.

The table uses repository-relative paths and distinguishes existing code from future service boundaries. Planned worker/server modules retain the selected single-package arrangement; creating them remains later implementation work. Share services and story definitions between web/worker; browser imports must not expose database code or credentials. TypeScript is the initial application language; add Python only for a concrete processing/library need.

Next.js serves initial public pages and short requests. Background generation survives browser disconnection through the [generation workflow](generation.md).

## API contracts

These are production integration requirements. Current pages read prepared local content; guest activity uses browser storage. No application API, TanStack Query data layer or authenticated worker is connected.

- Use Route Handlers with shared Zod request/response validation. Handlers authenticate, validate, and call application services; services own business rules shared with workers.
- The browser uses a small typed HTTP client with TanStack Query. Request identity and paid-operation safety follow [security and cost](security-and-cost.md#spending-and-allowances).
- Use structured errors: stable code, safe explanation, affected job/stage, permitted recovery action. Keep internal diagnostics in restricted logs.
- Distinguish evidence gaps, missing media, exhausted allowances, and uncertain paid operations. Recovery must use the error contract rather than infer behavior from provider text.

## Persistence and content

PostgreSQL/Drizzle persistence is planned. Current lesson shape and validation are implemented in [prepared-story v2](../../frontend/src/features/lesson/contracts/bundle.ts), [scene-schema](../../frontend/src/features/lesson/contracts/scene.ts) and [the scene guide](scenes.md).

- PostgreSQL/pgvector is the application database; use Drizzle ORM and reviewed, versioned Drizzle Kit SQL migrations.
- Use relational records for stories/versions, ownership, assets, evidence, jobs, bookmarks, and application state. Store each chapter's scene/narration/interaction/presentation content in validated JSONB; track readiness separately.
- Zod validates external requests and generated content; derive shared TypeScript types where appropriate. Validate asset/evidence references independently of document shape.
- Account progress writes require expected revisions; preserve the local candidate on conflict. Keep guest/account namespaces separate until import UX is defined.
- Chapters, scenes, and narration passages have stable IDs. Progress/bookmarks reference IDs plus story version, never array positions. Preserve IDs for the same content across wording changes/insertions; material restructuring needs an explicit position mapping or a clear fallback to chapter start.
- Distinguish schema versions from content revisions. The [production record requirements](#production-records) define persistence invariants; migrations and revision mappings remain to be implemented.

## Prepared and persisted contracts

| Concern | Working frontend | Production integration requirement |
| --- | --- | --- |
| Presentation | Versioned bundles, registered scene capabilities, local images/models and explicit beat programs | Reuse these capability rules; define a versioned persistence envelope and compatibility mapping |
| Position | Authored scene/beat IDs; narrative paragraph ranges; guest progress/bookmarks store scene/passage indices | Version-scoped stable chapter/scene/passage IDs and explicit revision mappings |
| Evidence | Source lists, credits, provenance and research packets | Structured claims, retained supporting passages, ownership and claim/evidence links |
| Media | Public bundled assets; browser speech/synth sound preview | Authorized asset IDs, ranges, ready narration and measured timing |
| Delivery | Complete prepared bundles with structural validation | Persisted draft/readiness states, progressive chapter delivery and durable generation jobs |

The prepared format version is not a content revision or proof of production readiness. Do not replace the working renderer with a second backend-specific template. Richer decisions, relationship exploration and additional scientific models need supported extensions beyond the [current learning mechanics](learning-engine.md); [M05](../implementation-plan.md#m05-complete-scene-vocabulary) owns that work.

## Subject records and evidence

- Keep lesson-level concepts, entities, relationships, quantities and substantive claims linked to their support. Register computational model IDs, units, assumptions and validated inputs; events and calendar dates apply where relevant. Narration references claims; maps/timelines use the same structured values instead of independently generating repeated facts.
- Identify fact, interpretation, reconstruction, and hypothetical material. Consistency does not establish correctness; use the [evidence checks](generation.md#checks-and-delivery).
- Where calendar dates are relevant, support BCE/CE, ranges, approximation, and day/year/century precision. Retain readable labels, structured ordering/filter values, and calendar context where relevant. Timeline layout must not imply unsupported precision.
- Ordinary app events use timestamps. The production record rules specify BCE/CE ordering and qualified date labels; calendar conversion support and implementation verification remain outstanding.
- Retain supporting passages, source title/author, URL, retrieval date, and claim/chapter/scene links. Preserve the evidence used by each story version for citations, follow-ups, and corrections.

## Local assets and reuse

- Production-generated images, narration and larger source extracts use ignored `.local/assets/`, with staging writes under `.local/tmp/`. Apply server-created keys, byte limits, checksum verification and atomic rename before marking references ready. Remove only verified unreferenced/orphan data. Current prepared assets and their provenance ship under `frontend/public/`. PostgreSQL holds IDs, ownership, production inputs, and story references.
- Resolve asset IDs through an authorized storage module; reject path traversal/invalid ranges and stream bounded allowed content types. Private responses use private/no-store caching. Keep physical storage independent of the content format.
- Reuse completed assets when prompt/script, references, model, voice/style/settings, and production version match, subject to access, subject/visual context, and license constraints.
- Regenerate only affected passages/assets when inputs change; layout edits can reuse artwork. Reuse is a lookup, not a guarantee of identical model outputs. Private assets stay within their permitted scope.

## Retrieval

Current discovery uses the prepared catalog and simple local text matching. Production retrieval below is planned.

Use PostgreSQL full-text search plus pgvector; separate two collections:

| Collection | Indexed content and purpose |
| --- | --- |
| Story discovery | Title, central question, summary, chapter headings, subject, learning question and scope; time/place where relevant |
| Evidence passages | Retained source text with provenance and claim/chapter links for answers |

- Combine discovery keyword/vector rankings with reciprocal rank fusion. Apply visibility and requested subject/scope constraints and relevant period/place constraints during retrieval.
- Similarity yields candidates, not request equivalence or factual support. Match the explanatory question and assumed knowledge; a shared topic or era alone does not justify reuse.
- Use OpenAI `text-embedding-3-small`, initially 1,536 dimensions. Record model/dimensions; use matching query/index configuration and deliberately reindex changes.
- Start with exact vector search; add approximate indexes when measured performance warrants it. Follow-up retrieval is scoped to the authorized story version.

## Production records

These contracts are planned integration requirements. Reuse prepared presentation rules within a versioned persistence envelope; schema format and content revision are distinct.

| Record | Required invariant |
| --- | --- |
| Story/version/chapter | Ownership and visibility, playable revision, ordered chapter JSONB and separate readiness/hash |
| Entity/claim/evidence | Version-scoped IDs; fact/interpretation/reconstruction/hypothetical classification; retained source passages, locators and claim links |
| Model/scene | Registered capability version, bounded parameters/units, assumptions, source/asset refs and complete accessible reading |
| Narration | Stable passage ID, plain script and revision/hash, matching subtitle text, ready audio ref and measured duration |
| Asset/use | Owner, MIME/size/duration, source/rights, content hash, production-input fingerprint and authorized version/scene use |
| Progress/bookmark | Owner/version and stable chapter/scene/passage position; resume revision for compare-and-swap, separate bookmark identity |
| Job/outbox/operation | Job kind, unique actor/kind/request ID with input hash, durable event identity and unique logical operation key |
| Reservation/rate bucket | Separate money and creation/question allowances, integer USD micro-units, atomic state transitions, bounded windows/cleanup |
| Discovery/evidence index | Distinct content scopes, source hash, embedding model/dimensions and authorized version |
| Share/community | Hashed revocable tokens, version-scoped unique ratings/likes, bounded writes and moderation state |

Generate Better Auth tables from the pinned configuration into Drizzle's migration history. Keep Mastra-owned runtime storage in its own schema with adapter-owned, restart-safe initialization. Application services own authorization and business rules; call Drizzle inside those modules rather than adding generic per-table repositories.

Use UUIDs for application content/job/asset records and the actual opaque Better Auth user-ID type. A player bundle contains only authorized ready content, evidence summaries and resolvable asset IDs, without private traces or machine paths.

Calendar values retain source label/calendar, precision, qualifier and supported bounds. Durations have explicit units. Sort CE year `y` as `y` and BCE year `y` as `1-y`; zero is internal ordering, never a displayed year. Preserve unsupported calendars without inventing conversions or midpoint precision.

## Planned HTTP surface

Routes are provisional internal interfaces, not existing endpoints. Authenticate from session/share context, never a submitted owner ID.

| Operation | Result / boundary |
| --- | --- |
| Story detail and version/chapter GET | Authorized ready content; pending chapters report readiness |
| Asset GET/HEAD | Authorize version use first; bounded streaming and single byte ranges |
| Progress GET/PUT | Account-owned position; PUT requires expected revision |
| Bookmark list/add/delete | Account ownership and position validation against the referenced version |
| Creation POST/status/retry | Verified actor, allowance/budget and request identity; return/reconnect to the same job |
| Discovery/related GET | Authorized retrieval with bounded query/result sizes |
| Contextual question POST/status | Separate allowance and durable answer job; owner-only answer/evidence |
| Sharing/publication/community writes | Ownership, readiness, token policy, moderation and operation-specific limits |

Shared Zod envelopes carry success or stable error `code`, `safeMessage`, optional job/stage, `recoveryAction` and retry time. Use meaningful HTTP status codes; inaccessible private records must not disclose existence. Cookie-authenticated writes need origin/session/CSRF protection. Paid mutations never auto-retry blindly.

## Planned service boundaries

`src/server/` owns validated configuration, database, content/asset reads, progress, creation/usage and retrieval. `src/generation/` owns workflow/task/prompt implementations and outbox dispatch. Next-only session/header helpers stay web-facing; shared worker modules must run independently of Next's request runtime. Enforce browser import restrictions and share pure contracts across web/worker.

## Primary references

[Drizzle migrations](https://orm.drizzle.team/docs/migrations), [Zod](https://zod.dev/), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [pgvector](https://github.com/pgvector/pgvector), [embeddings](https://developers.openai.com/api/docs/models/text-embedding-3-small).
