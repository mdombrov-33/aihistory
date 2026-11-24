# Current state

The Next.js application in `frontend/` is a local-first interactive learning frontend. It runs with bundled content and browser storage, without credentials or backend services. Deployment is deferred.

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

Review the connected frontend and its interactive states, then resume [service integration](implementation-plan.md#service-integration). [The implementation tracker](implementation-plan.md#execution-tracker) records remaining acceptance. Commercial terms, synchronization and real services remain separate.

Use [frontend navigation](../frontend/DEVELOPMENT.md#start-here) to find code, [product navigation](design.md) for behavior and [technical navigation](technical/decisions.md) for implementation constraints. Commands and verification scopes live in [development](technical/development.md).

## Verification boundary

Static checks, browser-independent contracts, production compilation and generated-HTML checks pass for the current frontend. Browser journeys are authored; current rendered desktop/mobile, interactive and audio verification remains outstanding because browser access is unavailable in the agent environment. Source checks do not establish visual acceptance.
