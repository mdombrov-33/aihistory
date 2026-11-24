# Current state

## Product direction

Interactive learning across subjects is the accepted scope; history has no required priority. Engine and example exploration precedes the next homepage redesign. Current HISTORY branding and history-only visual references remain legacy placeholders. [Learning engine](technical/learning-engine.md) records working additions and ideas still to explore.

## Implemented frontend

The Next.js/React package in `frontend/` is the only application. Shared docs, agent guidance and design references stay at the repository root. The [frontend navigation guide](../frontend/DEVELOPMENT.md#start-here) maps the consolidated `features/lesson/` engine, controls, content, guest state and test suites. Installed versions and runnable commands live in [package.json](../frontend/package.json) and [development](technical/development.md). The root [Makefile](../Makefile) provides `make dev`, `make format`, `make check`, `make test` and `make verify` shortcuts over the existing tools. Deployment is deferred.

| Area | Working local behavior | Boundary |
| --- | --- | --- |
| Discovery | Multi-topic hub, catalog, local search/filters, detail/source pages and related prepared stories | No PostgreSQL/vector retrieval or live recommendation service |
| Lessons | Nine v2 lessons, 68 screens, 15 content families and 26 teaching presets; image inspection, maps, source switching, processes, chronology, native local 3D, editorial image reveals, schematic assemblies with optional part motion, lens/pendulum experiments, harmonic sound, reversible packet travel and build/test Boolean networks | Prepared JSON/media; no live composer or publication/readiness service |
| Playback | Chapter/screen navigation, complete reading, optional interruptible browser speech and synthesized background sound | Production narration, measured subtitles and coordinated audio remain planned |
| Guest activity | Device-local progress, exact paragraph bookmarks, separate whole-story Save, paginated My space and saved questions | Indexed positions in browser storage; no account synchronization or stable revision mapping |
| Preferences | Worlds, Parchment, Forest and Mineral themes; larger text, reduced motion and sound preferences | Rendered accessibility/audio verification remains pending |
| Service previews | Auth/verification/recovery, new-question/status, contextual question and report UI where shown | No actual login, generation/answer job, report delivery, payment or community write |

The [scene guide](technical/scenes.md) owns renderer details and the prepared examples; the [authoring guide](technical/lesson-authoring.md) is the entry point for adding lessons without topic-specific frontend code. Historical media and source packets retain credits, rights and provenance. The prepared work made no paid provider calls.

## Verification boundary

Formatting/lint/types, 35 browser-independent content/rendering/model/contrast/framing contracts, production build and built-HTML checks have passed. Documentation checks include root product/design context, local links/headings/navigation and README emptiness. Concrete cleanup evidence and remaining acceptance gaps live in the [implementation tracker](implementation-plan.md#current-frontend-handoff).

Browser journeys are authored but execution/capture failed in this environment. Earlier localhost binding returned `listen EPERM`; an existing server later became reachable, but Chromium launch failed with a macOS MachPort permission error and the browser access host remained unavailable. Current desktop/mobile, interactive states, themes, enlarged text and sound remain unverified. The independent source review’s two clipping/framing findings were resolved; its rendered disposition remains `recapture`; source checks do not establish subject completeness or visual approval.

## Current phase

The user reviewed and accepted both exploration slices for now: the first four cross-subject lessons, then reversible packet travel and editable Boolean construction. The later case/prediction/arrangement experiment and its three lessons/covers were rejected and removed. The accepted nine-lesson baseline at `f3c2fb3` is retained; two existing screens now exercise a small visual extension. [Visual exploration research](references/visual-exploration.md) now guides candidate additions; [earlier general-mechanics research](references/general-interaction-engine.md) is background, with its build order superseded. Favor simple visually led discovery; lesson subjects vary broadly and do not constrain capabilities. The Great Wave now offers an optional revealable composition guide; user review found its educational payoff unclear and calls for a better example before expansion. The camera has a paused shutter-motion schematic; user review found playback smooth but captions too fast, so the explanation now stays fixed and the illustrative cycle is slower. No package, new lesson or homepage cover was added. The homepage remains deferred. Prepared frontend review and repository alignment precede remaining M00 backend setup and M01–M09 production integration. Existing UI is reused. PostgreSQL/Drizzle, Better Auth, Mastra/Inngest, live providers, production audio, synchronized accounts, private/public sharing, community services and Premium remain future work. See [the technical map](technical/decisions.md) and [product questions](product/open-questions.md).

The rejected Vite prototype, unused legacy media/components and obsolete concept build gates are removed. Useful concept/source references remain illustrative; latest user feedback outranks them. [DESIGN.md](../DESIGN.md) records the current visual system, with review still open. README remains empty.
