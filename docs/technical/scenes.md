# Scene contracts and rendering

Use for the prepared data protocol, composition and validation. [Frontend](frontend.md) owns playback/sound; [learning engine](learning-engine.md) owns interactive models.

## Working system

- [Bundle schema](../../frontend/src/features/lesson/contracts/bundle.ts) defines versioned summaries, narratives, sources, licensed images/models and explicit scene programs.
- [Scene schema](../../frontend/src/features/lesson/contracts/scene.ts) and [composition registry](../../frontend/src/features/lesson/contracts/compositions.ts) define supported families, teaching purposes, framing and required inputs.
- [SceneFrame](../../frontend/src/features/lesson/scenes/scene-frame.tsx) selects responsive spatial behavior; [SceneStage](../../frontend/src/features/lesson/scenes/scene-stage.tsx) dispatches family renderers.
- [Player](../../frontend/src/features/lesson/player/player.tsx) owns navigation, Read/Listen and paragraph bookmarks. A beat covers contiguous narrative paragraphs; a paragraph is not automatically a screen.
- `/screen-gallery` renders registered examples through the same components, mounting only the selected example.

Content selects supported structures, never React, arbitrary CSS or executable strings. Families describe data/interaction; compositions describe teaching tasks over shared layouts. There are no lesson-slug layout branches.

## Media and layout rules

- Image-led screens put a full-height visual beside the narrative. Portrait assets narrow the visual column; registered dimensions define source proportions. Cover/focal framing supports previews; whole-source inspection uses contain.
- All image inspection targets must fit initial framing, even when cover needs to back off. Numbered targets have a reachable legend. Selected detail panels/crops stay at the image; Close/Escape restores trigger focus.
- Editorial reveal geometry stays aligned through pan/zoom and enlargement and participates in framing. It is identified as a reading aid, never a hidden scan.
- Comparisons and timeline galleries switch between large images with a shared inspection toolbar; selection feedback stays beside the control. Independent sources are not an invented before/after pair.
- Geographic projections fit the measured canvas. Generalized Natural Earth data serves broad views; close connections use an identified local schematic when the coastline is unsuitable. Exact tracks, local geography and historical borders need separately sourced geometry. Degenerate point states must remain finite.
- Openings use an image/narrative split. Artwork text overlays need a supported safe-area contract.
- Processes/chronologies need no filler image. Changing explanation stays in the same region as controls; synthesis reconnects developed conclusions.
- Local licensed GLB records supply posters, rights, camera views and retry/enlargement paths. Native 3D shares page ground and exposes compact camera tools on demand.
- Bounded desktop scenes have a scrollable reading pane. Phones, short windows and larger text use natural flow. Every assigned paragraph remains reachable; narration is optional.
- [Workbenches](learning-engine.md#authoring-and-runtime-rules) keep manipulation, result and feedback together. Motion starts still and offers reduced-motion poses.

## Complete prepared stories

Canonical bundles and executable registration live in [content/lessons](../../frontend/src/content/lessons/). Choose a relevant existing bundle as an example; inspect the registry and `/screen-gallery` rather than maintain a separate inventory here. Follow the [authoring guide](lesson-authoring.md) to add content.

Source packets retain claim limits and asset rights: [Pompeii](../references/pompeii-showcase.md), [photography](../references/photography-showcase.md), [telegraphy](../references/signal-showcase.md), [printmaking](../references/great-wave-showcase.md). They support those subjects, not a required catalog focus.

## Enforcement and limits

Validation checks family/preset compatibility, reading coverage, unique IDs, source/chapter indices, registered media/dimensions, crop bounds, model/camera references and map states. Reusing a primary image/object needs an editorial `reuseReason`; nested comparisons also need purposeful reuse. No quota forces maps, 3D or new imagery into a lesson.

The catalog sync script derives client metadata from registered bundles. Full narratives remain server content, passed to the relevant player/gallery. Structural validation does not establish subject accuracy, usable camera views or visual quality. [Architecture](architecture.md#prepared-and-persisted-contracts) distinguishes this authoring seam from persisted production content.

## Verification

Run `make catalog` after registration, then `make verify` for static checks, contracts, build and generated HTML. Contracts cover bundle/registry validity, model behavior, framing, geography, themes and state. Run `make test-browser` for rendered navigation, manipulation, accessibility and recovery. Current execution limits live in [status](../status.md#verification-boundary).
