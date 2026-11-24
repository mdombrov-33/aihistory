# Current state

The frontend phase is complete for now. The Next.js application in `frontend/` is the working baseline for backend integration, using bundled content and browser storage without credentials or backend services. Deployment is deferred.

## Available

- Discovery homepage with question entry, local continuation, image inspection, a Moon viewer, a flat connection map and prepared lesson links.
- Explore with local text search, topic filtering, sorting and URL pagination; lesson overview, player, chapters and sources.
- Shared data-driven scene rendering, media inspection and interactive models. The [scene guide](technical/scenes.md) and [engine guide](technical/learning-engine.md) describe the supported contracts.
- Device-local progress, whole-lesson saves, exact passage bookmarks and saved questions in My space.
- Theme, reading, reduced-motion and sound preferences in Settings. Browser speech and synthesized background sound are temporary playback implementations.
- Premium comparison/review, sample membership/usage/cancellation, local account/profile, verification and password recovery flows.
- Personal learning guide with chosen interests, editable/reorderable trails, saved questions, private notes and reading-list copy. Task-specific provider preferences live in Settings.
- Question-to-outline and preparation/retry states, local sharing/revocation, personal ratings/likes/comment drafts and report receipts. Player Ask searches prepared context and offers broader-question/recovery paths.
- These product flows persist device-local preview data. They do not authenticate, send mail, generate lessons/answers, charge money, enforce server access or publish community content. `/preview` links to the flows.

## Next work

Begin backend implementation with [M00a: operational logging and observability](implementation-plan.md#m00a-observability-foundation), then add the local runtime and follow the [service integration milestones](implementation-plan.md#service-integration). Preserve the existing screens, renderer and provider-free prepared mode while connecting real persistence, accounts and durable workflows. Further frontend redesign is deferred; make UI changes when an integrated behavior requires them. Commercial terms remain unresolved.

Use [frontend navigation](../frontend/DEVELOPMENT.md#start-here) to find code, [product navigation](design.md) for behavior and [technical navigation](technical/decisions.md) for implementation constraints. Commands and verification scopes live in [development](technical/development.md).

## Verification boundary

Static checks, browser-independent contracts, production compilation and generated-HTML checks pass for the frontend baseline. Browser journeys are authored; rendered desktop/mobile, interactive and audio verification remains outstanding because browser access was unavailable. Carry those checks into integration acceptance; they do not block starting the backend. Source checks do not establish visual acceptance.
