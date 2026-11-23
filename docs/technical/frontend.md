# Frontend and player

Use for screens, scene renderers, maps, interaction, narration, and sound. Follow [experience requirements](../product/experience.md) for pacing, mobile behavior, accessibility, and sensitive material. Visual references are illustrative; design remains iterative.

## Current implementation boundary

The installed frontend and its reusable authoring seam are described in [composed lesson scenes](scenes.md). Next.js/React, Tailwind/shadcn, Lucide, Motion, d3-geo, next-themes, image inspection and native 3D and the [learning workbenches](learning-engine.md) work with prepared content. Server requests, TanStack Query, actual accounts, generated narration and the production playback/data services below remain selected implementation direction rather than completed features.

## Foundations and scene families

The implemented mixed-form player, schema boundary and prepared demonstration are documented in [composed lesson scenes](scenes.md). This is the current player implementation reference.

- React/Next.js and TypeScript; Tailwind tokens/styles; selected shadcn/ui controls; Lucide React icons; Motion for React with reduced-motion support.
- Build custom story renderers. Generation supplies validated data, not executable frontend code.
- Current families: illustrated image, place, atlas, evidence, comparison, timeline, journey/process, object, photograph, assembly, experiment, sound, system, traveler and construction. The 24 presets include openings and synthesis. Richer decisions and additional domain models remain extensions; generation must use only supported capabilities.
- The prepared author selects a supported composition, registered artwork/model, framing/focal point and supported interaction data. Themes and typography are app-owned; richer per-story visual/audio direction belongs to future validated contract extensions. Components enforce readability, spacing, contrast, and reachable controls. New interaction mechanics require supported components.
- Use the same content/IDs on mobile and desktop with renderer-owned responsive arrangements: focused maps/detail panels, document enlargement, suitable vertical timelines, and readable diagram alternatives. Do not shrink desktop mockups into phone layouts.
- Current narratives render plain-text paragraphs with app-owned typography. Production rich text should support paragraphs, emphasis, lists, quotations and links through restricted react-markdown. Disable embedded HTML; restrict elements/URL protocols. Layout, assets, citations, and interactions remain structured fields. Narration scripts are plain text.

## Geography and precise visuals

- Use d3-geo projections with React-owned SVG regions, routes, labels, markers, and interactions. Implement touch targets, label placement, focused zoom, and appropriate geometry complexity.
- Start broad maps with locally stored, versioned Natural Earth 1:110m land/coastlines; record theme/version/provenance. Data is public domain and generalized. The prepared renderer uses labelled local-position schematics for close connections instead of magnifying this coarse coastline; actual local maps require finer sourced geometry.
- Historical borders, historical names, and period-specific geographic changes need separate evidence/data. Modern base geography is not historical validation. Use explicitly identified schematics when reliable geometry is unavailable.
- Generate expressive artwork separately from factual annotations and interactive regions. Correct code-rendered labels cannot repair inaccurate underlying geography.

## Server data and creation status

Planned service behavior; current creation saves a question locally and explicitly starts no job.

- Keep initial public pages server-rendered. Use TanStack Query for interactive requests, mutations, browser caching, and invalidation; PostgreSQL stays authoritative.
- Scope private caches by account and clear them on identity/access changes. Paid creation requests do not automatically retry; reconnect through the existing request/job ID.
- Poll creation state about every two seconds while the screen is visible and the job is active; stop at terminal state and fetch on return. Refresh reconnects to the existing job.
- Display actual milestones and chapter readiness, not invented percentages. See [structured API errors](architecture.md#api-contracts) for recovery behavior.

## Playback controller

Production controller requirements below extend the current screen/paragraph navigation and interruptible browser speech. Measured media timing, coordinated cues and persisted production positions are not implemented.

- One controller coordinates narration, subtitles, music, effects, scene events, and position.
- Use a React reducer for discrete transitions: play/pause, chapter changes, seek, Read/Listen. Use narrow contexts for state/commands and refs for audio/imperative handles.
- Keep frequent clock updates local to controls/subtitles; do not rerender the whole illustrated scene for every tick.
- Scenes report interactions to the controller. Changing chapters stops previous narration; source inspection pauses it and preserves position. Switching Read/Listen keeps place. All sound starts through deliberate learner action.
- Decision options/explanations and the documented outcome are prepared in chapter data. Selection reveals context/tradeoffs instantly, identifies hypothetical consequences, and saves interaction progress separately from shared content. New model calls belong to [follow-up answers](generation.md#follow-up-answers).

## Narration and sound

- Reuse short narration passages generated from finalized scripts. Associate audio with scene, script revision, voice, and settings; reopening reuses assets rather than generating again.
- Show exact spoken text as passage-level subtitles, synchronized to passage boundaries. Concise designed scene text is separate; the full explanation is also readable. Word-by-word highlighting is deferred.
- Start with reusable music/ambience/effects whose licenses are verified. Story creative direction chooses appropriate assets; selection and narrator voice are refined during design iteration. Custom music/effect generation is a later option.
- Tie cues to scene entry, passage start, geographic reveals, and decisions. The controller ducks backgrounds during narration, fades transitions, pauses all layers through main Pause, and seeks without replaying all earlier one-shot effects.
- Provide master mute and separate narration/music/environment-effects controls and remember preferences. Generation selects supported sound options; the controller owns playback/volume.

## Progress and loading

- Save story version, chapter, passage, audio position, and relevant interaction state. Guests use best-effort browser local storage; accounts also persist to PostgreSQL for cross-device resume.
- Save periodically and on pause/navigation, not every audio tick. Explicit multiple bookmarks are separate from automatic resume position. Returning waits for deliberate playback activation.
- Prioritize current-scene media, then preload next-scene essentials within permissions and suitable device/connection resources.
- Audio failure preserves position and offers fetching the existing asset again or continued reading; it never triggers paid regeneration.

## Primary references

[D3 paths](https://d3js.org/d3-geo/path), [Natural Earth](https://www.naturalearthdata.com/downloads/110m-physical-vectors/), [data terms](https://www.naturalearthdata.com/about/terms-of-use/), [react-markdown](https://github.com/remarkjs/react-markdown), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/mutations).
