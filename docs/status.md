# Current state

The Next.js application in `frontend/` is a local-first interactive learning frontend. It runs with bundled content and browser storage, without credentials or backend services. Deployment is deferred.

## Available

- Discovery homepage with question entry, local continuation, image inspection, a Moon viewer, a flat connection map and prepared lesson links.
- Explore with local text search, topic filtering, sorting and URL pagination; lesson overview, player, chapters and sources.
- Shared data-driven scene rendering, media inspection and interactive models. The [scene guide](technical/scenes.md) and [engine guide](technical/learning-engine.md) describe the supported contracts.
- Device-local progress, whole-lesson saves, exact passage bookmarks and saved questions in My space.
- Theme, reading, reduced-motion and sound preferences in Settings. Browser speech and synthesized background sound are temporary playback implementations.
- Account, recovery, verification, creation/status, contextual-question and report screens are previews. They do not authenticate, deliver mail, run generation, take payment or publish community writes.

## Next work

The [implementation plan](implementation-plan.md#next-feature-premium-selection) starts with Premium offer/plan selection and the missing product flows. Prices, allowances and entitlements require product decisions; no checkout or billing integration exists. Backend integration follows the frontend flow work.

Use [frontend navigation](../frontend/DEVELOPMENT.md#start-here) to find code, [product navigation](design.md) for behavior and [technical navigation](technical/decisions.md) for implementation constraints. Commands and verification scopes live in [development](technical/development.md).

## Verification boundary

Static checks, browser-independent contracts, production compilation and generated-HTML checks pass for the current frontend. Browser journeys are authored; current rendered desktop/mobile, interactive and audio verification remains outstanding because browser access is unavailable in the agent environment. Source checks do not establish visual acceptance.
