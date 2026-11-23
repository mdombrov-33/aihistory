# Lesson composition and prepared content

Use for the working scene protocol and renderer. [Frontend](frontend.md) owns playback/sound direction; [generation](generation.md) owns the future workflow. Visual references remain illustrative. The latest rejected screenshots outrank earlier comps.

## Working system

[Composition definitions](../../frontend/src/story/compositions.ts) are the single registry of **22 presets**, each with a teaching purpose, supported content family, spatial layout, framing and input requirements. `/screen-gallery` renders an actual lesson example of every preset through the same components used by the player. It mounts only the selected example.

[SceneFrame](../../frontend/src/features/player/scene-frame.tsx) selects spatial behavior; [SceneStage](../../frontend/src/features/player/scene-stage.tsx) renders 13 content families: illustrated image, place, atlas, evidence, comparison, timeline, process/journey, object, photograph, assembly, experiment, sound and system. [Player](../../frontend/src/features/player/player.tsx) owns navigation, Read/Listen and exact paragraph bookmarks. There are no slug-specific lesson layouts or legacy fallback rotations.

The 22 presets describe teaching tasks, backed by a smaller set of shared spatial layouts. They no longer force eighteen unrelated arrangements. Image-led screens, source comparisons and place inspection use a full-height visual beside the narrative. Portrait assets automatically narrow the visual column. Maps use a dedicated full-height canvas. Image-free quotations, chronology, processes and synthesis retain their own reading structures.

- Image previews fill their exhibit using cover framing and optional focal points. Whole-source inspection remains available through Fit whole image and enlargement. Document desks can retain contain framing and a paper margin. Registered dimensions determine the real source proportions.
- Image-relative inspection points constrain initial framing: all 44px targets must fit in the visible window, even if that requires backing off from cover. Compact numbered pins replace oversized labels; a separate legend keeps every detail reachable. Selecting a detail opens an attached panel over the image, with an actual source crop where supplied. Close/Escape restores focus to the trigger. The response is never appended below the narrative.
- Comparisons use one large image and source selector, with one inspection toolbar. The selected source explanation stays beside that selector. Timeline galleries use the same principle. Independent sources are not presented as an invented before/after.
- Map projections fit the measured canvas rather than a fixed-ratio SVG strip. Natural Earth 1:110m is reserved for broad geographic views. Connections spanning less than eight degrees on both axes use a labelled local-position schematic without a false magnified coastline. This is a presentation fallback, not finer geographic evidence. Exact tracks or historical borders still require separate sourced geometry. Coincident/single-point states retain a finite projection.
- Cinematic openings currently use the safe image/narrative split. Background text overlays are deferred until a supported safe-area contract can protect meaningful artwork; focal points alone cannot establish a safe text area.
- Processes and chronological sequences can explain something without filler imagery. Their changing explanation stays in the same visual region as its controls. Synthesis uses previously developed conclusions.
- Local licensed GLB models are registered in the bundle. Native 3D shares the page ground and shows a small drag/zoom hint. Camera tools expand on demand; guided camera choices remain compact, with optional view explanations. Posters, retry, enlargement and collection records remain available.
- Ordinary desktop uses bounded scenes and a scrollable reading pane. Mobile, short windows and enlarged text allow natural flow; every paragraph assigned to a screen remains visible. Enlarged text is 23px in the reading pane. Narration is optional and interruptible.

The [learning engine](learning-engine.md) owns workbench behavior, model assumptions and future ideas. These families extend the same frames and authoring contract rather than introducing a parallel lesson app.

## Complete prepared stories

[Prepared-story v2](../../frontend/src/story/prepared-story.ts) accepts summary, chapters/narratives, sources, licensed image metadata, model records and explicit scene programs. [Scene schema](../../frontend/src/features/player/scene-schema.ts) restricts data to supported fields; no React, arbitrary CSS or executable strings are accepted as layout. This is a prepared authoring protocol, separate from the future persisted production contract.

Eight examples, all using the same renderer:

| Bundle | Chapters / screens | Character |
| --- | --- | --- |
| [The camera, opened up](../../frontend/src/content/showcases/camera-opened-up.json) | 2 / 6 | Schematic assembly and thin-lens experiments |
| [A swing in time](../../frontend/src/content/showcases/a-swing-in-time.json) | 2 / 6 | Rapier pendulum and model comparisons |
| [Shape a sound](../../frontend/src/content/showcases/shape-a-sound.json) | 2 / 6 | Harmonic synthesis and visible signal recipes |
| [Signals and decisions](../../frontend/src/content/showcases/signals-and-decisions.json) | 2 / 6 | Live Boolean networks and local feedback |
| [Pompeii](../../frontend/src/content/showcases/pompeii.json) | 3 / 10 | Street inspection, viewpoint map, work, later records and research |
| [Photography](../../frontend/src/content/showcases/invention-of-photography.json) | 3 / 10 | Portrait, fragile negative, copying process and photographic evidence |
| [The shape of a signal](../../frontend/src/content/showcases/shape-of-a-signal.json) | 3 / 10 | Actual key in 3D, quotation, network states and historical watercolors |
| [The Great Wave, made by hand](../../frontend/src/content/showcases/great-wave-made-by-hand.json) | 3 / 8 | Real prints, exact source details, collaborative making and comparison |

The four historical examples each have over 1,000 narrative words; the four newer workbench lessons are shorter, with substantial reading and time for experiments. Screens cover one or more contiguous paragraphs; a paragraph is not automatically a new screen. The original five fixtures, their content/program adapters and the standalone illustrative spacesuit route are retired. Existing guest data is not erased, but retired stories are hidden from the current collection and account lists.

[Authoring guide](lesson-authoring.md) is the agent entry point. Source packets: [Pompeii](../references/pompeii-showcase.md), [photography](../references/photography-showcase.md), [signals](../references/signal-showcase.md), [printmaking](../references/great-wave-showcase.md).

## Enforcement and limits

Validation checks family/preset compatibility, reading coverage, unique IDs, source/chapter indices, registered images, declared dimensions, crop bounds, model references, guided camera requirements and map-state references. Repeating a primary scene image or object requires an editorial `reuseReason`. Nested comparison/timeline uses also need purposeful review; there is no artificial quota forcing 3D, maps or new pictures into every lesson.

Images/models stay local. The catalog sync script emits metadata for client discovery; complete narratives remain server content, passed only to the relevant player/gallery route. Import a new bundle in [the registry](../../frontend/src/content/prepared-stories.ts), then run `node frontend/scripts/sync-prepared-catalog.mjs`.

Live research, automatic acquisition/optimization, claim-to-evidence checking, generation jobs, publication/readiness and paid narration remain unimplemented. Schema validity does not establish subject accuracy, usable camera angles or visual quality. Prepared examples establish the authoring seam, not autonomous research-to-publication.

## Verification

`pnpm --dir frontend test:scenes` checks all registered bundles, the 22 compositions, server rendering, local models, rejection boundaries, pagination, theme contrast roles, initial hotspot framing and adaptive map projections. `pnpm --dir frontend check`, `pnpm --dir frontend build`, `node frontend/scripts/check-frontend-build.mjs` and `node scripts/check-docs.mjs` cover their named scopes. Browser journeys cover the new collection but execution remains blocked by `listen EPERM` on localhost; current rendered desktop/mobile and sound checks remain outstanding. Impeccable remains `recapture`.
