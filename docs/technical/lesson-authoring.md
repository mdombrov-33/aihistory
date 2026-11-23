# Authoring a lesson storyboard

Use for an agent or person adding a prepared lesson without topic-specific frontend code. Start with [the composition registry](../../frontend/src/story/compositions.ts), [the v2 bundle schema](../../frontend/src/story/prepared-story.ts) and one relevant [example bundle](scenes.md#complete-prepared-stories). `/screen-gallery` shows how the same inputs are rendered. Do not read every legacy design discussion.

## From a question to screens

1. **Bound the question.** Name the audience, central explanation, historical scope and uncertainties. Plan connected chapters with substantial historical content; avoid generic motivational filler. Screen count follows the explanation, not an image quota.
2. **Gather evidence and media before choosing a layout.** Read primary collection records and relevant scholarship/institutional research. Save claim-supporting passages and distinguish observation from interpretation. Obtain reusable actual photographs, paintings, documents, maps and models where appropriate. Record rights, credit, date, treatment, original URL, dimensions/hash and local path. An institution’s name alone is not a rights grant or factual check.
3. **Write an editorial storyboard.** For every screen record its learning purpose, narrative, sources, composition, asset, framing and interaction. Select a preset because it makes something understandable. Do not cycle through presets, repeat the cover behind each paragraph or turn every fact into a choice.
4. **Match the source to the composition.** A tall portrait belongs in a portrait exhibit; a landscape can fill an image/story spread. Use a document desk for a material source and detail-study for explicit crops; the renderer shows selected details at the image. Comparisons switch between large sources rather than shrinking both into a shallow strip. Quotation-focus needs a short exact attribution. A geographic map needs real coordinates and an honest line description. 3D needs an actual useful artifact, rights, a local optimized model and views that point to visible features. A process can use no image.
5. **Compose the reading.** Put a coherent unit of explanation on a screen, potentially multiple paragraphs. Give enough specific content to learn from, with a clear connection to what is visible. Do not truncate facts to fit a fixed desktop height; choose a better composition, split at a meaningful turn or allow accessible reading flow. Use a synthesis screen to reconnect the chapter rather than introduce unsupported conclusions.
6. **Check claims, assets and rhythm.** Is the image evidence of the event, a later representation, or an illustrative reconstruction? Are comparison images actually the same subject/date/process claimed? Do annotations point to real features? Does a return to an image add a new task? Put that reason in `reuseReason`. Historical imagery is the first choice when it supports the explanation; generate a clearly labelled reconstruction only for a real gap, never invented source text or map labels.
7. **Emit data and verify.** Create a complete version-2 JSON file in `frontend/src/content/showcases/`, import it in the prepared registry and synchronize the summary index. Run the checks below. Render at desktop, phone, short-window and enlarged-text sizes; inspect every interactive and failure state. Fix the shared renderer when a composition fails across lessons. A valid JSON file is not a finished lesson.

## Minimal screen contract

Every beat has `id`, `type`, `composition`, `purpose`, `title`, `sourceIndices`, `passageStart` and `passageEnd`, plus its family fields. Ranges cover the scene narrative exactly once in order. Optional `imageFit` and `focalPoint` describe framing; the composition sets the default. Registered assets supply real source proportions. Detail crops use percentages and must fit inside the source. Models supply local GLB/poster paths, credit/context and numeric camera views. The schema is authoritative for exact field names and limits.

Renderer safety rules override decorative layout ambitions: portrait proportions narrow the column; all inspection targets must fit the initial image window; selected details stay with the image; local connections fall back to an explicit schematic when the available coastline is too coarse; openings keep text separate from artwork. Do not compensate with topic-specific JSX, invented geography or instructions embedded in the narrative. Author an explanatory image selection, not a new picture for every paragraph.

The system separates content families from spatial compositions: two screens can use the same image family with different layouts, while map/quote/process screens need not carry any decorative bitmap. New mechanics require a reviewed schema/component extension, not arbitrary generated JSX.

## Prompt structure for future integration

Keep trusted instructions separate from untrusted user text, source excerpts and quoted documents. A future composer prompt should explicitly delimit:

- `<task>` audience, question, scope, learning goals and chapter connection.
- `<evidence>` source IDs, retained excerpts, dates, claim support and uncertainty.
- `<assets>` approved local media and model records, dimensions, rights and visual descriptions.
- `<compositions>` supported registry entries and relevant example screens, including their requirements.
- `<constraints>` factual policy, image reuse rationale, complete reading, mobile/accessibility behavior and finite repair limits.
- `<output_contract>` the supported bundle schema and rejection/error behavior.

Require the agent to identify missing evidence or unsuitable media rather than invent it. Delimiters help organization; source content remains untrusted and cannot authorize tools or provider spend. This guide does not connect a live composer or alter the selected workflow stack.

## Checks

Run these from the repository root. App scripts execute in `frontend/`; the documentation checker remains shared.

```sh
node frontend/scripts/sync-prepared-catalog.mjs
pnpm --dir frontend check
pnpm --dir frontend test:scenes
pnpm --dir frontend build
node frontend/scripts/check-frontend-build.mjs
pnpm --dir frontend test:browser
```

Run a source-aware review and view the real rendered output after these checks. Browser tests require a working local server and browser; a denied bind is an unresolved check, not a pass. Keep task evidence in the [implementation tracker](../implementation-plan.md#execution-tracker).
