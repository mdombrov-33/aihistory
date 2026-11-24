# Local implementation plan

The Next.js prepared-content app lives in `frontend/`; shared docs and repo tooling remain at the root. This plan owns remaining work and acceptance evidence; [status](status.md) owns the concise capability snapshot. Accepted behavior and technology live in the [product map](design.md) and [technical references](technical/decisions.md). Deployment stays deferred.

Reuse the implemented frontend and validated lesson contracts. The production milestones below add persistence, identity, generation and service integration; their target files and endpoints are not claims that those services exist. Keep prepared work usable without provider keys and never infer live acceptance from a preview.

## Execution tracker

States describe acceptance of each row's scope. Frontend work was brought forward before the backend; its presence does not satisfy the end-to-end production milestones.

| Scope | State | Evidence / remaining acceptance |
| --- | --- | --- |
| Prepared frontend | implemented; review pending | Eight v2 lessons, 13 families, 22 presets, discovery/detail/player/sources, guest activity, Settings and explicit service previews. See [scene guide](technical/scenes.md). |
| [M00 Local baseline](#m00-local-baseline) | in_progress | Frontend package/lock/Oxc/TS/Next setup and repo runtime pin exist. Database, Mailpit, worker and Inngest setup/smoke proof remain. |
| [M01 Content and persistence](#m01-content-and-persistence) | not_started | Reuse current presentation contracts; add versioned identity, evidence, readiness, storage and authorized database reads. Depends on M00. |
| [M02 Working chapter and player](#m02-working-chapter-and-player) | not_started | Integrate the existing player with persisted content and real audio. Frontend interactions already exist; production playback acceptance does not. Depends on M01. |
| [M03 Accounts and saved places](#m03-accounts-and-saved-places) | not_started | Connect current auth/personal-space previews to real identity and synchronized activity. Depends on M02. |
| [M04 Prepared creation workflow](#m04-prepared-creation-workflow) | not_started | Durable jobs, reservations, recovery and provider-free workflow adapters; current question saving is only local. Depends on M03. |
| [M05 Complete scene vocabulary](#m05-complete-scene-vocabulary) | not_started | Persist/validate current capabilities and add supported decision/relationship mechanics. Depends on M04. |
| [M06 Live provider integration](#m06-live-provider-integration) | not_started | Bounded research/media/narration, real account access, measured cost and quality. Depends on M05 and live prerequisites. |
| [M07 Discovery and contextual questions](#m07-discovery-and-contextual-questions) | not_started | Replace local text matching and question preview with authorized retrieval and grounded answers. Depends on M04–M05; M06 for live checks. |
| [M08 Sharing and community](#m08-sharing-and-community) | not_started | Private/link/public transitions, ratings, likes, comments, report delivery and moderation. Depends on M03–M04 and M07. |
| [M09 Local product verification](#m09-local-product-verification) | not_started | Full local browser/API/database/audio/recovery verification. Depends on M08. |

`not_started` → `in_progress` → `passing`; use `blocked` only for an identified prerequisite. Record actual evidence before marking passing. A pending provider prerequisite does not block independent prepared work.

## Current frontend handoff

Updated 2026-11-23. The active task is the cross-subject engine exploration and example review; backend milestones retain their remaining acceptance gates.

- The [v2 bundle and renderer](technical/scenes.md) are the prepared authoring baseline. Nine prepared lessons contain 68 screens. New lessons supply structured data and registered assets, with no topic-specific React or executable generated layout.
- Full-height media, local detail feedback, source switching, adaptive map framing and compact 3D controls are implemented. The latest layout review is still pending; presets and examples are editable, not visually approved templates.
- Guest activity is local and indexed by scene/passage. Production stable IDs, version mappings, account isolation and synchronization still require M01–M03 work.
- **Desktop fit:** the page frame is bounded, but the reading pane can scroll. Verify the accepted complete-screen reading target against actual content without clipping or shrinking it.
- **Completion gap:** the current player records completion through the final **Finish & sources** action. Product direction is completion upon reaching the closing recap, with sources optional. Preserve that requirement when changing the player; this cleanup does not alter behavior.
- Browser speech and synthesized background sound are temporary. Real narration, measured subtitle timing and coordinated media playback remain M02/M06 acceptance work.
- Next: review the [learning engine exploration](#interactive-learning-exploration), then explore a broader homepage; missing service flows, personal-guide scope and the [Premium offer](product/account-and-offer.md). Prices, entitlements and production readiness are not established by the showcase UI.

### Verification evidence

Before the learning extension, the frontend iteration passed `pnpm --dir frontend check`, all 11 browser-independent `pnpm --dir frontend test:scenes` contracts and `pnpm --dir frontend build`. Built-HTML checking passed for 12 pages, 27 image uses, 24 font references and 201 links. The browser suite lists 42 cases across desktop/mobile; listing is not execution. Contracts cover registered content/assets/models, rendering, rejection boundaries, theme contrast, hotspot framing and map projections.

Rendered browser/audio verification remains unresolved: server binding returned `listen EPERM 127.0.0.1:3000`, and Chromium capture failed to launch. The [latest independent review](references/frontend-review.md) returned `recapture`, requesting current player/gallery, short-window, enlarged-text, theme, selected/error and keyboard-focus evidence. User screenshots remain the actual failure evidence until new renders are checked.

### Repository cleanup

Removed the rejected Vite prototype and its separate dependencies, unused illustrative spacesuit inspector, retired lesson artwork/Apollo assets, unused duplicate image-dimension index and obsolete design-build gates. Retained current runtime media, source packets and referenced research assets, licenses/provenance, illustrative design references and the latest review. The `frontend/` Next.js package is the only application; README remains empty. About 190 MiB of obsolete files were removed. The Florence image remains because authentication still uses it, and the Pompeii casts photograph remains because the research packet references it. No UI behavior or historical lesson text changed. Cleanup verification passed: `pnpm --dir frontend check`, all 11 scene contracts, `pnpm --dir frontend build`, the built-HTML check and `node scripts/check-docs.mjs` (31 Markdown files, now including PRODUCT/DESIGN). A static scan resolved all 53 local media references. Browser/layout/audio verification was not rerun or claimed by this cleanup.

## Interactive learning exploration

Accepted 2026-11-23: subject scope is interactive learning broadly, with no required history focus or protected historical showcase. The user authorized package installation, engine experimentation and new lessons. Sequence: implement engine/examples, align documentation, then explore the homepage. The history-only homepage comp round was paused; it is not an approved new homepage direction.

The [learning engine](technical/learning-engine.md) is the canonical record of capabilities, library research and ideas still to explore. The first slice adds schema-validated assemblies, thin-lens/pendulum experiments, harmonic sound and fixed Boolean networks. New code is isolated under `frontend/src/features/lesson/interactions/`, integrated through shared scene contracts. Heavy viewers are lazy; sound/playback is deliberate. Parameters survive local reload, and narrow graphs reflow. No live generation, paid research or generated media is introduced by this slice.

Four new two-chapter lessons provide six screens each: The camera, opened up; A swing in time; Shape a sound; Signals and decisions. Original SVG cover diagrams carry provenance; supporting references and idealizations are explicit. Eight bundles now exercise 13 families, 22 presets and 62 screens. Existing history bundles remain usable regression examples, with no priority over future subjects. Existing routes/storage keys and HISTORY UI branding remain compatible placeholders; final branding and homepage composition are deferred.

Verification: 20 browser-independent contracts pass, including lens edge cases, normalized harmonics, complete gate truth tables, graph rejection, separation bounds, dependency layout and an actual Rapier integration comparison within 3% of the small-angle prediction. The numerical test caught conflicting body constraints before handoff; the revolute joint now owns the pendulum constraints. An independent source review found mobile ancestor clipping and unstable assembly framing. Its follow-up scored both resolved in source, including reprojection with zero clipped assembly vertices across five separation states and four aspect ratios; its rendered disposition remains `recapture`. Final formatting/lint/types and production build passed. Built-HTML validation passed for 16 pages, 47 image uses (including original SVG covers), 32 font references and 293 internal links. Documentation validation passed for 34 Markdown files; README remains empty. Browser discovery lists 64 cases, including seven new learning cases in each device project; listing is not execution.

User review on 2026-11-23 accepted the four examples as fine for now and authorized committing this slice. Further interaction exploration comes next; the homepage stays deferred. Independent rendered verification remains **recapture**. The user started a local server, but this shell could not reach it, and its test runner attempted a blocked localhost bind (`listen EPERM`). CUA reported an unavailable browser host and native Chrome inspection timed out. Browser cases exist for restoration/reset, lens regimes, sound opt-in/stop, logical propagation, pendulum reset and mobile width; they were not executed. User acceptance does not establish automated browser or audio test results.

Next exploration: [process travel, build/test and specialist viewers](references/next-interactions.md). Research recommends process travel and editable logic first, reusing installed packages. These recommendations now have a second prepared implementation slice below; asset-dependent viewers remain later candidates. The user asked to be notified if installation is needed. The accepted first slice was committed as `48d3e7d` (`feat(learning): add interactive labs and cross-subject showcases`).

### Process travel and Boolean construction

The second exploration slice adds `traveler`/`process-traveler` and `construction`/`construction-bench`, using installed packages. A packet’s journey adds four screens; Signals and decisions adds two construction screens. The collection is now nine lessons, 68 screens, 15 families and 24 presets. All render from prepared data with no slug branches. No packages, paid calls or remote runtime data were added.

The packet model reconstructs bounded IPv6 Hop Limit traces, including separate receive/forward events, route changes, deterministic rewind and the destination’s zero-limit boundary. The builder separates incomplete/invalid drafts from executable graphs, checks the complete target truth table, accepts equivalent correct wiring and clears old results on edits. Typed versioned drafts persist separately from flat lab parameters; playback/results are not persisted.

User screenshot feedback exposed settings below an independently scrolled-away diagram. Both new families now use a shared fixed-stage workbench: controls scroll in a separate region, beside the stage in wide panes and below it in narrow panes. Source review also identified fit-scaled tiny builder labels and undersized handles. Builder nodes now use a responsive grid at 1:1 zoom, an independently scrolling drawing and separated 44px connection targets. The user subsequently checked both additions and accepted them for now, authorizing this slice’s commit. Automated rendered verification remains pending.

Verification: 25 browser-independent contracts and final formatting/lint/types passed. Final production build passed; built-HTML checking passed for 17 prerendered pages, 52 image uses, 34 font references and 316 internal links. Documentation checking passed for 35 Markdown files. Browser discovery lists 74 cases; listing is not execution. The reviewer scored the original tiny-label and small-target source findings resolved, then found feedback clipping in short panes and unexpected React Flow autopanning. Feedback now has its own full-prose scroll region, the builder drawing can shrink its viewport, and connection/focus autopanning is disabled. The follow-up scored both integration findings resolved in source. Browser tests include independent stage/control scrolling but cannot run here: the runner fails at localhost binding (`listen EPERM`); native Chrome navigation timed out and the browser host is unavailable. Current reviewer disposition is `recapture`, not visual approval. The first independent source pass found no additional model/restoration issues. Homepage work stays deferred.

### Research into general interaction mechanics

Research completed 2026-11-23 at the user's request. [Findings](references/general-interaction-engine.md) audit contracts, official tool capabilities and learning evidence. Business, games, film and books are example subjects, not restrictions on engine vocabulary. Its subsequent case/prediction/arrangement experiment was rejected by the user; the proposed build order is superseded by the visual exploration direction below. Keep the report as background evidence, not instructions to restart that experiment. Earlier [viewer/model research](references/next-interactions.md) remains supporting work.

### Removed experiment and visual exploration direction

At the user's request, removed the uncommitted `inquiry`/`arrangement` renderers, schemas, state hooks/storage field, styles, presets and tests; removed The same scene, two stories; Behind a simple promise; A room that teaches and their covers/provenance. Restored the frontend files to accepted commit `f3c2fb3` (`feat(learning): add packet traveler and logic construction`). Existing guest progress is not reset; older schema parsing ignores the removed experiment's unknown storage field. The collection is again nine lessons, 68 screens, 15 families and 24 presets, with earlier image, model, experiment, packet and Boolean behavior retained.

User screenshots rejected abstract puzzle tasks, duplicate selections, competing panels and schematic covers dominating the new examples. [Experience direction](product/experience.md#journey-and-pacing) now explicitly favors a subject-led visual and an obvious main gesture. [Visual exploration research](references/visual-exploration.md) compares reveal layers/aligned curtains, object animation, panorama tours, real deep zoom and secondary media options against primary docs, assets, licenses and accessibility needs. The rollback itself added no replacement mechanic, library, dataset or paid call. The user subsequently authorized the two small visual extensions below; homepage redesign remains deferred.

Rollback verification: `pnpm --dir frontend check`, all 25 `test:scenes` contracts and production build passed. Built-HTML checking passed for 17 prerendered pages, 52 image uses, 34 font references and 316 internal links. Source comparison confirmed no frontend diff from `f3c2fb3`, and no remaining removed-experiment references in frontend source/config/tests. Documentation checking covers 37 Markdown files. Current browser interaction/layout verification remains outstanding: an existing localhost server was reachable, but Chromium launch failed with a macOS MachPort permission error and the browser access host was unavailable. Restoring the accepted source is not fresh rendered approval.

### Small visual exploration slice

Implemented for review after the user selected the simpler direction. The existing Great Wave opening (`/stories/great-wave-made-by-hand/play/0`) starts unmarked and offers one slider/Show guide action to reveal editorial composition outlines. Source-coordinate marks stay aligned through pan/zoom and enlargement; their full extent participates in initial framing. They are clearly a reading aid, not an underlying scan. The camera’s second screen (`/stories/camera-opened-up/play/1`) is a named-part shutter-motion schematic with Play/Pause, seek and reset next to the object. It begins still; reduced motion offers discrete poses. The movement is an original sliding-plate illustration, not a claim to reproduce a real shutter mechanism or exposure duration.

Both reuse the image/narrative split. No side workbench, puzzle, required prediction or new cover/lesson was added. The schema extends two existing families with `layer-reveal` and `assembly-motion`: nine lessons, 68 screens, 15 families and 26 presets. Prepared data supplies bounded SVG geometry or transform keyframes; unknown fields, duplicate channels, unordered keys and missing parts are rejected. Motion frames its complete envelope once, stops on hide/unmount and never persists active playback. No dependency or provider call was added.

Verification: 28 browser-independent contracts pass, covering shutter return/static parts/motion envelope, invalid motion/reveal data, guide framing and all earlier contracts. Final formatting/lint/types and production build pass. Built-HTML checking passes for 17 prerendered pages, 52 image uses, 34 font references and 316 internal links; documentation validation passes for 37 Markdown files with README empty. Independent source review identified cropped guide geometry and a 32px slider target; both are fixed (guide points constrain framing; target is 44px). Browser discovery lists 82 cases, including eight desktop/mobile cases for reveal/enlargement, playback/seek/reset, reduced-motion still poses and narrow/short layouts; listing is not execution. A fresh Impeccable `first-viewport` capture failed to launch Chrome/Chromium; no new rendered interaction, mobile, WebGL or visual approval is claimed. Independent finish disposition remains **recapture**. Homepage review remains a later task.

### Motion pacing feedback

User review on 2026-11-24 found the camera movement generally smooth and Play/Pause useful, but phase captions changed too quickly to read. The explanation now stays identical across the whole cycle and while seeking; only the short phase heading changes. Automatic playback does not announce each phase through a live region. The camera cycle is eight seconds rather than five; this remains an illustrative timing, not an exposure claim. The user found the Great Wave reveal’s educational payoff unclear: retain it as an unproven example, and select a more useful layer/structure relationship before expanding the mechanic. No replacement reveal example is implemented by this correction. Formatting/lint/types, all 28 browser-independent contracts, production build, built-HTML and documentation checks pass. The browser test now asserts a stable explanation during playback and seek; it remains unexecuted. A new capture attempt still failed to launch Chrome/Chromium. Independent source review supports this pacing correction; rendered disposition remains `recapture`.

## Frontend organization

Authorized 2026-11-24 after a read-only import-graph and primary-doc research audit. Preserve badge, card, checkbox, dropdown-menu, separator and react-markdown exactly as requested. Consolidate the lesson engine under `features/lesson/`: contracts, player/control modules, individual scene-family renderers, mechanics with their own calculations/schemas, reusable media and shared interaction infrastructure. Group canonical lesson bundles/server registry, light catalog, discovery data and geography under `content/`. Keep one guest store, separating schema/defaults, persistence/subscription and actions while preserving the existing storage key/envelope.

Extracted existing family renderers from the large dispatcher and Read/Listen, chapter menu and Back/Next controls from the player. Shared narrative/catalog types now derive from the bundle schema. Handwritten source modules have purpose comments; generated data, vendor code and UI primitives are excluded. Styles have explicit owners and their exact rule order is preserved; no CSS Modules conversion or selector purge is implied. Split contract and browser test directories, retain the runner, update tooling and all linked paths, and expand [frontend development](../frontend/DEVELOPMENT.md#start-here) into the entry-point guide. Retain the separate generated summary index, referenced images, model provenance and required Draco decoder. Remove only the orphan Oswald license; the Oswald font no longer ships. No package installation, product redesign or feature removal.

Verification passed: formatting/lint/types; all 30 browser-independent contracts, including legacy guest-envelope defaults, shared-snapshot actions, persistence and denied-storage behavior; production build; built HTML (17 prerendered pages, 52 image uses, 34 font references, 316 internal links); and documentation validation (37 Markdown files, README empty). Compared all seven original CSS rule streams in their original order, all nine canonical lesson JSON bundles, active public media, protected UI primitives and dependency files against `0996753`: they are unchanged apart from file ownership/comments and the separately disclosed orphan license removal. All six extracted calculation bodies and every guest-store/action body match the originals after helper renames. The client import graph still excludes complete lesson bundles/registry. Browser discovery finds the same 82 cases; a targeted Great Wave navigation run could not start its server because binding `127.0.0.1:3000` returned `listen EPERM`. No rendered regression approval is claimed. Changes remain uncommitted.

## Root development commands

Added at the user’s request on 2026-11-24: a root Makefile with self-documenting help, lockfile install, dev/build/start, format/static checks, contract/browser testing, browser installation, catalog sync, documentation/HTML validation and generated-output cleanup. `make verify` runs static/docs checks, browser-independent contracts and production build/HTML validation sequentially; browser journeys remain explicit. `.NOTPARALLEL` protects the shared Next.js generated type files from concurrent Make targets. No package/toolchain change or automatic browser installation. Development guides and bootstrap output point to these shortcuts; README remains empty.

Verification: default help and alternate-directory help work; remaining recipes were dry-run checked. `make format` passed, then `make verify` passed static/docs checks, all 30 contracts, production build and built-HTML validation (17 pages, 52 image uses, 34 font references, 316 internal links). The initial verify correctly rejected formatting in two guest-state files before formatting was applied. Bootstrap shell syntax and diff whitespace checks pass. Installation, dev/start, browser download, browser execution and clean are dry-run only, not executed.

## Automatic blank-line readability

User screenshot on 2026-11-24 showed that Oxfmt alone left consecutive functions and other sections visually cramped. `make format` now runs Oxfmt followed by a syntax-aware blank-line pass using the installed TypeScript parser. It separates module headers/imports, functions/types, multiline declarations and control-flow/return blocks while keeping short related declarations together, preserving comments/import order and skipping UI wrappers/declarations. The normal read-only format check enforces the same policy. Applied to the handwritten frontend and test/config files; no dependencies were added. Oxc editor formatting alone still runs Oxfmt, so `make format` is the complete project command.

Verification: all 35 contracts pass, including five spacing fixtures covering the user’s module/function case, control-flow groups, comment attachment, TSX/string preservation, idempotence and invalid-syntax rejection. `make format` repeats with zero changes. Formatting/spacing checks, type-aware lint, TypeScript, documentation validation and diff whitespace checks pass. Protected UI wrappers and the lockfile are unchanged; package changes only wire the two formatting commands. No browser result or new production build is implied by this source-spacing correction.

## Repository layout and first commit

The app package lives in `frontend/`: source, public media, tests, app-specific scripts/configuration and its pnpm manifest/lockfile. Repo-level docs, agent/design guidance, the Node pin, design references and shared documentation tooling remain at the root. [Frontend development](../frontend/DEVELOPMENT.md) points back to the shared guides. Use `pnpm --dir frontend <script>` from the root or run `pnpm <script>` inside `frontend/`; no additional workspace orchestrator is introduced.

The root `.gitignore` covers nested dependencies/builds/test output, environment files and credentials, local runtime data, installed agent tools and transient design-tool output. Safe `.env.example` templates, app/media provenance, lockfiles, curated design references and current surface briefs remain versionable. The linked visual comparison and latest review were moved out of tool runtime folders into `design-explorations/full-app-flow/` and `docs/references/frontend-review.md`; the comparison references its PNG files rather than embedding duplicate base64 images. Staging and committing remain user actions.

Relocation verification passed: frozen offline install, `pnpm --dir frontend check`, all 11 scene contracts, production build, built-HTML validation (12 pages, 27 image uses, 24 font references, 201 internal links), and documentation validation (33 Markdown files). Ignore assertions passed for 12 excluded and 13 retained paths; the initial commit candidates contain 243 files totaling about 48.4 MiB, with no individual file above 50 MiB. Nothing was staged or committed. Browser verification remains pending as described above.

## Compatibility and local configuration

Installed frontend versions are authoritative in `frontend/package.json` and `frontend/pnpm-lock.yaml`; reuse that setup. [Stack compatibility](references/stack-compatibility.md) is dated research for the remaining backend/test packages and container digests, not an instruction to repin the working frontend.

The [generation integration findings](references/generation-integration.md) record a real unresolved gate: cached Mastra manifests/changelogs do not establish a coherent stable core/CLI/integration/storage package set. In particular, the observed core 1.85.0 candidate cannot satisfy the observed CLI core floor 1.85.1. Resolve published peers before accepting the manifest; never copy those mixed snapshots as proven pins. Keep the selected frameworks and single-project layout.

Planned local service endpoints, configurable if already occupied. Only the Next frontend has a current startup command:

| Process | Address | Owner |
| --- | --- | --- |
| Next web/API | `127.0.0.1:3000` | `frontend/src/app/` |
| Mastra worker | `127.0.0.1:4111/inngest/api` | `frontend/src/generation/mastra/index.ts` |
| Inngest dev server/UI | `127.0.0.1:8288` | Pinned local CLI |
| PostgreSQL development | `127.0.0.1:55432` | Compose volume `history_dev` |
| PostgreSQL integration tests | `127.0.0.1:55433` | Separate Compose test profile/volume |
| Mailpit SMTP / inbox | `127.0.0.1:11025` / `127.0.0.1:18025` | Compose; no external relay |

Use the existing `frontend/` package, repo `.node-version`, exact `packageManager`, `frontend/pnpm-lock.yaml`, strict TS configuration, and an explicit worker type-check configuration where required. No monorepo/build orchestrator is needed. Check typed-lint/Next compatibility with the chosen TS compiler; verify every candidate peer rather than selecting latest tags blindly.

- Planned startup from `frontend/`: pinned `next dev`; `mastra dev --dir src/generation/mastra`; `inngest-cli dev -u http://localhost:4111/inngest/api`. Verify the chosen releases' CLI behavior. The worker's reserved `/api` prefix rules make `/api/inngest` unsuitable for this documented integration.
- `frontend/scripts/dev.mjs` will supervise processes, forward signals, and stop children on exit. Dependency startup waits for health. Normal shutdown preserves database/media; destructive reset is a separate explicit command.
- When backend setup is added, `.env.example` will contain safe local placeholders; ignored `.env.local` will contain a generated local auth secret and optional live credentials. Generate missing local secrets once without overwriting existing configuration. Load the same environment into host processes; validate it centrally with Zod.
- `GENERATION_MODE=prepared` is the default. Prepared mode must construct no live provider client and work with provider keys absent. Local Inngest is explicit development mode with matching app ID/base URL; it needs no cloud account.
- Live spending defaults to disabled. Require finite configured per-operation/job/day/month caps and rate profiles before live mode can pass preflight. Configuration of a cap is not evidence of a measured story cost.
- Separate application tables from Mastra-owned storage in a `mastra` schema in the same database. Drizzle owns app/auth SQL history; the pinned Mastra adapter owns its schema initialization. Prove initialization/restart idempotence and avoid competing migration owners.

## File and module interfaces

This table describes remaining service interfaces and integration responsibilities. The existing `frontend/src/features/lesson/contracts/`, `frontend/src/features/` and route modules are reused; `frontend/src/server/` and `frontend/src/generation/` are planned. Prefer small interfaces that own meaningful behavior; call Drizzle directly inside the owning module rather than create a generic repository layer for each table.

| Location | Interface and invariants |
| --- | --- |
| `frontend/src/features/lesson/contracts/{schemas,dates,validation}.ts` | Pure Zod schemas/types, date ordering, structural/cross-reference/capability validation. No React, filesystem, credentials, or database imports. |
| `frontend/src/server/config.ts` | Validated application configuration; explicit prepared/live modes and missing-config errors. |
| `frontend/src/server/db/{schema,migrations}/` | Drizzle schema and one reviewed SQL history, including auth schema generated from pinned Better Auth configuration. |
| `frontend/src/server/stories/` | `getDetail(actor,id)`, `getChapterBundle(actor,versionId,chapterId)`, visibility changes; owns authorization and ready-version reads. |
| `frontend/src/server/assets/` | `putForJob(jobScope,input)` and `openForRead(actor,versionId,assetId,range?)`; owns authorization, bounded streaming, hashes, metadata, atomic local writes. |
| `frontend/src/server/progress/` | Read/save progress with revision checks; add/list/delete multiple bookmarks. App state stays separate from chapter content. |
| `frontend/src/server/creation/` | `submit(actor,input,requestId)`, `getJob(actor,id)`, bounded resume; owns request deduplication, reservation, job/outbox transaction. |
| `frontend/src/server/usage/` | Reserve/reconcile paid operations and allowances transactionally. Unknown provider outcomes remain reserved. |
| `frontend/src/server/retrieval/` | Visibility-filtered discovery and story-version-scoped evidence retrieval; owns embedding configuration/version checks. |
| `frontend/src/generation/mastra/index.ts` | Registers agents/workflows, local Inngest integration, separate Mastra storage/tracing. |
| `frontend/src/generation/{workflows,tasks,prompts}/` | Durable stage implementation and detailed prompt builders; prepared/live adapters are actual alternative implementations at this interface. |
| `frontend/src/generation/dispatch.ts` | Short outbox delivery loop; sends committed events only. It never schedules or runs generation stages independently of Inngest. |
| `frontend/src/features/lesson/player/` | Reducer, scoped contexts, audio controller, renderer registry, transcript, source/chapter panels, progress integration. |
| `frontend/src/features/{library,creation,account}/` | Route-specific interactive UI using the typed HTTP client; no worker/database imports. |

Keep Next-only session/header helpers under web-facing modules. Do not blanket-import Next's `server-only` sentinel into shared modules that the independent worker must execute. Enforce browser import restrictions with lint/build checks; share pure contracts, not provider/runtime modules.

## Content contracts

The working prepared format is version `2`, defined in [prepared-story.ts](../frontend/src/features/lesson/contracts/bundle.ts) and [scene-schema.ts](../frontend/src/features/lesson/contracts/scene.ts). Reuse its presentation/capability rules. The production records below add persistent identity, structured evidence, audio and readiness; they are not a second implemented player schema. Define an explicit persisted envelope/version and migration mapping in M01 rather than silently downgrading prepared bundles or equating a format version with a story revision. Use UUIDs for database content/job/asset IDs and opaque Better Auth user IDs; retain or map authored stable IDs across revisions.

| Contract | Initial fields and rules |
| --- | --- |
| `TemporalValue` | Discriminated calendar date or elapsed duration. Durations carry explicit units, not invented calendar eras. Calendar dates retain human label, source calendar, precision, qualifier (`exact`, `circa`, `before`, `after`, `range`), explicit bounds where supported. Year values use positive year + BCE/CE. Internal sortable year maps CE `y` to `y`, BCE `y` to `1-y`; zero is an internal ordering coordinate, never a displayed historical year. Preserve unsupported calendar labels; do not invent a conversion or exact midpoint. |
| `LearningEntity` | ID, concept/object/process/person/place/event kind, supported label, optional subject-specific time/location/quantity data and claim refs. Coordinates require latitude/longitude validation and provenance/precision. |
| `Claim` | ID, statement, fact/interpretation/reconstruction/hypothetical classification, evidence refs and uncertainty/dispute note. Facts require supporting references; validity of refs does not prove support. |
| `EvidencePassage` | ID, source ID, retained text, locator, extraction/content hash, retrieval date; claim/chapter links remain explicit. |
| `InteractionModel` | Registered model/capability version, parameters with units/ranges, assumptions and supporting claims; learner state is separate from shared content. Existing workbench schemas remain authoritative for the prepared input. |
| `NarrationPassage` | ID, plain script, claim refs, script revision/hash, narration asset ref once ready. Subtitle text derives from this script. Duration is measured from media, not guessed from text length. |
| `Scene` | Stable ID, discriminant, structured content, narration passage refs, claim/asset refs, supported presentation choices, sound cues, accessible explanation. No raw HTML or executable code. |
| `ChapterDocument` | Schema version, stable chapter ID, purpose/title, ordered scenes/passages, cross-reference inventory. Relational readiness is separate from document content. |
| `PlayerBundle` | Authorized version/chapter content plus referenced subject records, evidence summaries, ready manifest, and resolvable asset IDs. Never exposes local file paths or private job traces. |
| `PlaybackPosition` | Version/chapter/scene/passage IDs, offset milliseconds, Read/Listen mode, relevant decision selections. Bookmark identity is independent of resume identity. |

Use the implemented 13-family discriminated union and 22-preset registry as the current capability set. The prepared schema supports images/place inspection, maps, evidence, comparisons, timelines, processes, native objects, photographs and the four [learning workbench families](technical/learning-engine.md). It does not support general decision options or relationship nodes/edges yet. Generation must receive the actual capability set; unsupported kinds fail validation.

M05 adds grounded decision and relationship mechanics through reviewed schema/component extensions. Decisions need a question, stable option IDs, option-specific explanations and a documented outcome, with hypothetical alternatives labelled. Relationships need sourced nodes/edges and a readable alternative. Existing timeline/comparison/process renderers are reused.

Themes and typography are currently app-owned. The prepared author selects registered media, composition, framing/focal points and supported interactions, never arbitrary CSS, palette or font code. Any additional presentation choices need a validated extension. Production maps/timelines should use shared sourced entities/dates; registered coordinates alone do not establish subject accuracy.

Validation separates shape, reference existence/ownership, renderer capability, evidence support, and media readiness. Drafts can contain pending media refs; a ready chapter cannot. A complete generated story needs all planned chapters/recap ready; learner completion is triggered by reaching the recap.

## Database and storage contracts

Introduce tables incrementally through the relevant milestones:

| Records | Constraints |
| --- | --- |
| Better Auth tables | Generated from pinned auth config, reviewed into Drizzle's single migration history. Reuse actual user-ID type; do not maintain a competing hand-written auth schema. |
| `stories`, `story_versions` | Ownership, private/link-shared/public visibility, selected playable version, blueprint and contract versions. New personal stories default private; explicit system-seeded public development content is identified as such. |
| `chapters` | Key `(story_version_id, chapter_id)`, order, JSONB document, readiness/revision/hash. Delivered content is stable; correction mapping is explicit. |
| `entities`, `claims`, `sources`, `evidence_passages`, `claim_evidence` | Version-scoped subject IDs and provenance; joins prevent attaching another private version's evidence. |
| `assets`, `asset_uses` | Content/storage hashes, production-input fingerprint, MIME/size/duration, owner, rights/source metadata, authorized version/scene use. Reuse requires matching scope and inputs. |
| `progress`, `bookmarks` | Owner + version; progress revision for compare-and-swap updates; many bookmarks with exact positions. |
| `generation_jobs`, `job_outbox`, `provider_operations` | Typed job kind (`story_creation` or `follow_up`), unique `(actor_id, kind, request_id)` plus input hash; durable event ID; unique logical operation key; accepted workflow/prompt/model/schema versions. |
| `usage_reservations`, `allowance_reservations`, `rate_buckets` | Integer USD micro-units, atomic reservation/reconciliation; allowances separate from provider cost. Finite windows/expiry and cleanup. |
| `story_search`, `evidence_embeddings` | Separate discovery/evidence rows, source hash and embedding model/dimensions, vector(1536); exact search initially. |
| `share_tokens`, `questions`, community records | Added only when their milestones need them; token hashes, bounded question usage, version-scoped unique ratings/likes. |

Store local blobs under ignored `.local/assets/`; staging writes under `.local/tmp/`. Use server-created storage keys, byte limits, checksum verification, temporary writes plus atomic rename, and committed asset metadata before reference readiness. Clean abandoned temporary/orphan files through a scoped maintenance operation, never by deleting referenced files by age.

Asset GET/HEAD authorizes the story-version use before opening a file, supports single byte ranges for audio seeking, sets allowed content types, and streams bounded data. Reject path traversal and invalid ranges; private responses use private/no-store caching initially. Public Natural Earth base geometry can be separately bundled with version/rights records.

Progress writes use expected record revision; stale writes cannot overwrite remote state silently. Preserve the local candidate on conflict. Guest/account storage remains separated; guest-import/conflict UX remains an explicit design choice, not automatic attachment of shared-browser history.

## HTTP contracts

Initial route names are internal/provisional; they do not choose the final product noun. IDs are server-validated. Actor identity comes from the authenticated session or verified share context, never a submitted owner field.

| Request | Result and protection |
| --- | --- |
| `GET /api/stories/:id` | Authorized detail/readiness; public access only for public content or valid sharing context. |
| `GET /api/stories/:id/versions/:v/chapters/:c` | Ready `PlayerBundle`; pending chapters return structured readiness, not malformed content. |
| `GET/HEAD /api/assets/:id?versionId=:v` | Authorized media/byte range; ID alone grants no private access. |
| `GET/PUT /api/progress/:versionId` | Account-only progress; PUT carries expected revision. Guests persist locally. |
| `GET/POST /api/bookmarks`, `DELETE /api/bookmarks/:id` | Account-only, ownership checked; positions validated against the referenced version. |
| `POST /api/creations` | Verified actor + allowance/budget; body includes question/scope/supported settings, request ID. Returns 202 with existing/new job ID and status URL. |
| `GET /api/creations/:id`, `POST /api/creations/:id/retry` | Owner-only; refresh/retry resumes the same job under current bounded state, never blind paid replay. |
| `GET /api/library/search`, `GET /api/stories/:id/related` | Public/authorized retrieval, requested filters, finite query/embedding limits. |
| `POST /api/stories/:id/questions`, `GET /api/questions/:id` | Verified account + separate question allowance and request identity. POST queues a bounded answer and returns 202 with question/status IDs; owner-only GET returns status or grounded answer/evidence refs. |
| Share/publication/community writes | Owner/verified-account guards, token policy, moderation/rate limits; added in M08. |

Success/error responses use shared Zod envelopes. Errors include stable `code`, `safeMessage`, optional `jobId`/`stage`, `recoveryAction`, and `retryAfterMs` where relevant. Use 400/401/403/404/409/422/429/503 appropriately; inaccessible private content should not disclose its existence. Browser mutation clients do not automatically retry paid work. Apply session/origin/CSRF protections to cookie-authenticated writes, not just auth endpoints.

## M00 Local baseline

**Files:** frontend package/lock/TS configuration, repo runtime pin, `compose.yaml`, `.env.example`, ignore rules, Oxc/Vitest/Playwright config, `frontend/scripts/dev.mjs`, `frontend/src/app/`, `frontend/src/generation/mastra/index.ts`, central configuration.

1. Reuse the installed frontend configuration. Resolve the remaining backend compatibility gate and pin its exact stable packages/image digests. Keep one project. Choose `pg` as the PostgreSQL driver; resolve its exact compatible release with auxiliary packages.
2. Establish Compose development/test database and Mailpit isolation, safe environment creation, and persistent local volumes. No paid credentials required.
3. Add a local Mastra/Inngest fixture smoke workflow to the existing Next application. Verify the custom worker directory and route, storage initialization, explicit finite retries, restart behavior, and no outbound provider traffic.
4. Establish the agreed pnpm scripts plus explicit local dependency/migration/seed/integration-test helpers. Keep `check` read-only and include the existing documentation checker. Verify deliberate temporary Hooks/type errors are caught; remove the probes afterward.

**Accept when:** a clean local setup can install from lockfile, start/stop repeatably, render the shell, reach database/Mailpit/Inngest, run lint/format/types/tests and Next/worker builds, and complete the fixture smoke workflow without provider keys. Browser tests use isolated test data. Record exact versions/commands and update [development](technical/development.md); generated files alone do not pass this milestone.

## M01 Content and persistence

**Files:** `frontend/src/features/lesson/contracts/`, `frontend/src/server/db/`, `frontend/src/server/{stories,assets}/`, read routes, `data/fixtures/working-chapter/`, migration/seed/integration checks.

Implement the initial contracts and migrations, generated auth schema ownership, atomic local assets, ready-chapter validation, and authorized reads. Author a narrow development source packet with inspectable evidence and a versioned geometry/asset manifest. Choose the topic during authoring; no subject or era restriction is implied.

Persist a representative chapter from the current prepared bundles, exercising an image, map/inspection interaction and closing recap using supported scene families. Keep the other bundles available; do not introduce a second topic-specific player or require an unsupported decision kind. Include complete reading text and correctly transcribed, licensed/original spoken audio before the listening acceptance check; synthetic tones may test transport but do not substitute for narration acceptance. Record all asset rights/provenance. Existing concept mockups are not verified source material or automatically production assets.

**Accept when:** seed is idempotent; reload reads real PostgreSQL/local files; invalid kinds/refs/coordinates/date bounds and inaccessible assets are rejected; media ranges work; tests cover 1 BCE/1 CE ordering, approximate/range preservation, version-scoped evidence, and stable positions after a scene insertion. A missing asset prevents ready status.

## M02 Working chapter and player

**Files:** `frontend/src/features/lesson/player/`, scene renderers, player/detail routes, reusable typography/controls, playback tests and browser journey.

Connect the existing responsive player and scene registry to the persisted bundle. Use the reducer for discrete transitions, refs for audio handles, and small clock subscribers. Start with HTML media elements for narration/music routed through one Web Audio context and gain controls; short effects can use decoded buffers. Create/resume audio through deliberate interaction, handle rejected play promises, and clean up stale callbacks on scene changes/unmount.

The engine uses actual media time for subtitle/reveal timing. Sound cues respond to semantic events; main Pause stops all layers, narration ducks backgrounds, and seeks avoid replaying prior one-shot effects. Use generation/transport tokens so a late load from an old scene cannot restart audio. Test React development double-mount cleanup.

Reuse the current text/source/chapter panels, map interactions and guest bookmarks/progress. Add production transcript/timing, restricted Markdown where needed, stable positions and recap-based completion. Decision feedback follows the supported extension in M05. Initial progress saves every five seconds and on pause/navigation, independently of the high-frequency audio clock.

**Accept when:** a phone-sized browser can start deliberately, Read/Listen at the same place, inspect sources without losing position, inspect/revisit a supported interaction, bookmark/reload/resume, and recover from missing audio through Retry/Read. Verify keyboard/focus, reduced motion, legible enlarged text, bounded loading, no overlapping narration or unsolicited sound. Review on an actual phone when available; record the gap if only emulation was possible. Iterate visual design rather than approve screenshots as permanent templates.

Audio implementation references: [media elements through Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource), [user activation and audio controls](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

## M03 Accounts and saved places

**Files:** Better Auth configuration/Route Handler, account UI, `frontend/src/server/progress/`, progress/bookmark routes and isolation tests.

Implement email/password verification/reset through Mailpit, Google OAuth when local credentials are configured, database-backed sessions, account-bound query caches, and centralized story/asset authorization. Use library-supported session/cookie/origin controls and test revocation/reset; do not hand-roll cryptography. Missing OAuth configuration must not become a fake success; the email path remains locally testable.

Persist account progress/bookmarks with revision checks, stable content IDs, bounded saves, identity-scoped local namespaces, and logout cache clearing. Preserve guest data separately while import UX is unsettled.

**Accept when:** two accounts cannot read/mutate each other's private content, jobs, assets, or bookmarks; unverified accounts cannot create/ask live questions; verification/reset links work locally with no external email; signed-in progress survives another browser session; stale writes preserve recoverable data and explicit bookmarks are not overwritten by playback.

## M04 Prepared creation workflow

**Files:** creation/usage/outbox modules, generation dispatch entry, Mastra workflow v1, prepared task adapters, job polling UI, crash/replay fixtures.

The creation transaction deduplicates `(actor,requestId)`, checks payload consistency, reserves allowance, and inserts the job plus outbox event atomically. A leased dispatcher sends durable events to local Inngest with stable event identity and retries delivery. It owns no generation-stage scheduling. Add it to local process supervision when introduced.

Workflow stages use saved prepared outputs through the same contracts, checks, asset writes, and publication path as live work. Define `queued/running/waiting_retry/needs_reconciliation/completed/failed` job statuses plus separate stage/chapter readiness. Complete chapters remain immutable within the delivered revision.

Provider operations move `reserved → dispatched → succeeded/known_failed/uncertain`, then reconcile. A unique logical operation key plus transactional state transitions prevents concurrent dispatch. Unknown outcomes never release budget or trigger blind re-dispatch. Reserve budget/slots before effects; complete/release allowances once under terminal job state.

Retrying a definitively stopped job whose user slot was released must recheck and reserve available allowance before resuming the same logical job; it cannot spend a released slot without reservation or consume two completed creations. A completed job returns its existing result.

Configure finite workflow/nested-workflow transport retries explicitly (initial target: two retries); separately cap repair/provider attempts and retry only where known safe. Test the actual chosen SDK's counting semantics. Store compact IDs/results in checkpoints, not media blobs. Retain workflow/prompt/model/schema versions and stable step IDs.

**Accept when:** one submission creates one job/reservation; refresh reconnects; a ready opening plays while later chapters prepare; poll stops appropriately; closing the browser does not stop work. Kill/restart worker and test duplicate delivery, concurrent reservations, crash after effect-before-commit, and old/new workflow paths. Finished artifacts remain stable, uncertain cost remains reserved, failed incomplete jobs release user slots only after definitive stop, and prepared mode sends no provider traffic.

## M05 Complete scene vocabulary

**Files:** shared capability/production-content contracts, existing scene registry/renderers, decision/relationship extensions, accessible alternatives and prepared fixtures.

Reuse the 13 implemented content families and 22 teaching presets. Integrate their persisted evidence/asset identity and capability versioning, and add grounded decisions and richer relationship mechanics through supported data/components. Do not rebuild timeline/comparison renderers or introduce topic-specific view branches. Validate labels/dates/claims against shared records and preserve mobile inspection and complete reading.

**Accept when:** the current families plus supported decision/relationship mechanics render validated persisted content, have readable keyboard/touch alternatives and survive navigation/bookmark resume. Unsupported schema/capability versions fail clearly. Current source inspection, maps, processes and native objects remain working.

## M06 Live provider integration

**Prerequisites:** resolved compatible package set; accessible credentials/models; finite experiment limits/pricing snapshot; private diagnostic retention/redaction configured. Until then, prepared development remains available and this milestone is blocked only for live work.

Implement the existing selected providers through typed task adapters: Tavily research, Mastra text tasks, optional OpenRouter for supported text models, OpenAI image/embedding clients where needed, Gemini narration, and moderation. The [integration findings](references/generation-integration.md#selected-providers-existence-versus-access) verify documentation existence, not this account's access. Fail preflight explicitly on unavailable models. Capture supported settings by task and snapshot chosen configuration on jobs; advanced settings expose supported IDs/capabilities, never raw backend keys or silent paid fallback.

Write detailed stage prompts and typed builders with delimited evidence/inputs, budgets, schema requirements, and error criteria. Research emits a retained evidence pack; planning emits the shared blueprint; composition emits chapter drafts; evidence checks emit claim-linked findings; media tasks emit assets; readiness emits a report for the same revision.

Check support before expensive media. Bounded repairs target affected content/dependencies. Reuse only matching authorized assets; narration regeneration is per changed passage. Validate intended script/subtitle identity, decode/duration and nonempty audio; listen to samples to verify spoken fidelity—matching metadata alone cannot prove speech accuracy. Select narrator/music during design iteration with verified reuse rights.

Use metadata-first restricted traces linked to app artifacts, no credentials/full private prompts in routine telemetry. Bound diagnostic retention and purge independently of evidence/spending. Before real provider calls, test allow/deny budgets, error classification and reconciliation with fixtures.

**Accept when:** a budgeted narrow question outside the prepared fixture produces a coherent opening and complete story through the real stages, with sources, consistent art direction, usable narration/read path, measured costs, and honest readiness. Inspect factual/visual/audio failures and add small targeted regression cases; do not infer quality from schema success. If observed cost/quality misses the current limits, record the result and revise deliberately before more spend.

## M07 Discovery and contextual questions

**Files:** search/evidence indexes, embedding adapters, retrieval module, library/detail/related UI, question route/panel and allowance accounting.

Build full-text plus exact-vector retrieval with reciprocal rank fusion, public/authorized filters, distinct discovery/evidence collections, model/dimension/source-hash checks, and bounded query/result sizes. Start evidence chunks at natural source sections/paragraphs with configurable token caps; record chunking version and locator. Tune from observed retrieval failures rather than changing content to match rankings.

Questions use current scene, outline, relevant authorized evidence, and bounded extra research; answers include resolvable references. Use a follow-up workflow/job kind with the existing outbox/recovery/operation controls and question allowance, not creation slots. Keep provider/research calls outside the short HTTP request; the panel polls the question status while preserving the player position. Out-of-scope inquiry offers a related direction/new story without modifying the current story. Prepared explanations stay guest-accessible; new answers require verification and separate allowance.

**Accept when:** lexical names and related questions find relevant candidates without leaking private/unlisted records; a shared subject or era alone does not force reuse; wrong embedding configurations fail clearly. Answer tests cover missing/disputed evidence, broad scope, injection, exhausted quota, and cross-version/private passages. Source support and answer correctness remain separately assessed. Save query/answer artifacts privately; public suggestions must not expose private prompts.

Prepared tests use explicit fixture vectors/answers and establish filtering, contracts, and recovery only. They do not establish live semantic relevance or answer quality; record those checks separately when M06 is available.

## M08 Sharing and community

**Files:** token/publication modules and routes, detail-page community UI, version-scoped ratings/likes/comments/reports, moderation adapters and rate limits.

Implement explicit private/link/public transitions. Store hashes of random sharing tokens; revoke/rotate deliberately and keep link-shared content out of library search. Public listing requires a complete checked version, authorized assets, accurate scope, and moderation. Separate asset credits from support for substantive claims.

Enforce one editable rating and removable like per account/public version, sample counts, and configured provisional category labels. Check new/edited comments before public visibility; deletion remains author-controlled. Moderation handles educational context, bounded ambiguous checks, and explicit failure/revision states without a routine owner approval queue. Reports retain reason, version/chapter/claim/comment anchors and confirm receipt without promising a correction. Report volume alone must not establish factual error.

**Accept when:** anonymous playback and deliberate link sharing work; token revocation and guessed IDs do not leak content; only ready/public content is discoverable; duplicate writes, unsafe edits, spam/rate limits and uncertain moderation are handled consistently. Test historical violence context alongside abusive comments. Final category names, report resolution policy and account-hub grouping remain product decisions; do not silently invent them.

## M09 Local product verification

Verify from a fresh local setup: frozen install, safe idempotent setup/migrations/seed, `pnpm --dir frontend check`, isolated PostgreSQL integration tests, Next/worker builds, and complete browser journeys. Exercise prepared mode without any provider keys and live mode only within its configured experiment budget.

Review phone usability, sound controls/seek/resume, all scene families, source provenance, access isolation, concurrency/recovery, and diagnostic cleanup. Record measured bottlenecks/costs and remaining defects. Update authoritative setup/config documentation and current state; retire planned-command placeholders once scripts exist.

**Accept when:** each preceding milestone has actual evidence and remaining gaps are stated. This proves a working local product path, not deployment readiness or settled Premium pricing. Billing, exact commercial quotas, personal-guide/trail scope, final brand/visual assets, and other [open product choices](product/open-questions.md) need their own subsequent work; they are not silently included as finished features here.

## Handoff

Current task and evidence live in [Current frontend handoff](#current-frontend-handoff) and the [execution tracker](#execution-tracker). Review the cross-subject engine/examples and their rendered gaps before the next homepage exploration. Reuse the implemented frontend package and v2 authoring seam when resuming remaining M00 service setup and M01–M09 production integration. Resume from the actual source and recorded checks rather than the original planning-only state.
