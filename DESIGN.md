# Worlds frontend

A mobile-first interactive learning app opens into focused explanations across subjects. HISTORY is a legacy placeholder; the final name is open. [Product map](docs/design.md) owns behavior; [status](docs/status.md) records implementation limits. The visual system is an iteration for review, not a final approved design.

## Visual foundation

Use the semantic Tailwind/shadcn roles in [theme.css](frontend/src/styles/theme.css), the palette source of truth. Four selectable themes ship: Worlds (navy/amber), Parchment (warm light), Forest (deep green/gold) and Mineral (pale stone/slate/cobalt). Components inherit background, foreground, card, primary/primary-foreground, muted-foreground, input and ring roles rather than carrying their own palettes. Tailwind utilities are the default for ordinary component styling; shared variants own repeated controls/cards. Global CSS holds tokens and document defaults. Keep custom CSS beside the feature when a coordinated viewport, viewer integration or drawing needs it.

Expressive artwork uses its own dark material and ivory annotation roles. Paper documents/drawings pair paper-material with paper-ink, paper-muted, paper-line and paper-accent. These fixed material roles belong on their matching surface. Palette contrast tests cover role pairs; rendered accessibility still needs verification.

Self-hosted Source Sans 3 carries UI/body text; Zilla Slab carries headings. Use installed shadcn/Radix primitives and Lucide icons. Interactive targets are at least 44px, visible keyboard focus follows the theme, and dialogs restore focus. Respect reduced motion and larger reading text. Use substantial prose with readable line lengths; preserve content instead of squeezing it to satisfy a fixed viewport.

## Hub and supporting screens

The current history-led hub is an implementation record, not the brief for the next homepage. The accepted next sequence is engine/examples, documentation alignment, then a broader homepage exploration. The map/evidence/model row has no protected status.

The hub leads with environmental search, a continuation/featured strip and a multi-topic gallery. Its demonstration offers geography, a real artwork study and native 3D. Each demonstration gets a suitable composition: a wide empty canvas is not a universal media frame. The evidence study uses a public-domain Hokusai print with image-relative markers, magnified details, attached credit and full-size inspection.

Auth, account, creation and settings use the same identity with calmer compositions. Auth artwork cannot dictate page height. Google and email controls remain explicit previews until identity is connected. Prepared creation records a local question; it does not pretend a generation job is running.

## Player structure

The shared [SceneFrame](frontend/src/features/lesson/scenes/scene-frame.tsx), [family renderers](frontend/src/features/lesson/scenes/scene-stage.tsx) and [frame stylesheet](frontend/src/features/lesson/scenes/layout.css) own composition. The [scene guide](docs/technical/scenes.md) owns supported families and authoring. The [26 composition definitions](frontend/src/features/lesson/contracts/compositions.ts) name teaching tasks over shared image/narrative, portrait, map, process, object and synthesis layouts. Image-led screens use full-height media beside the reading; weak shallow strips and simultaneous tiny source pairs are retired. `/screen-gallery` demonstrates each using real story data. Mobile, short windows and larger-text mode reflow deliberately. Compact controls/captions sit outside image content, map details stay outside geographic surfaces, and source comparisons switch one large image at a time. Selected image details appear directly at the artwork, with close/Escape focus restoration.

Images use actual proportions from bundle metadata. Landscape image/story panes fill their column through cover framing and optional focal points; tall sources get a narrower exhibit, while whole-source inspection deliberately uses contain. Initial framing keeps every annotation target visible. Detail studies open a source crop with its explanation at the image instead of splitting the exhibit into an original, crop and separate essay. Repeated primary images and objects require an editorial reason in the bundle. Factual maps/labels use code and source data. The map fits its measured canvas; local connections use an explicit schematic when the broad world coastline is unsuitable. Openings keep prose beside the artwork until a supported safe text-area contract exists. Historical images, modern photographs and reconstructions are identified by their actual treatment. Reconstruction style does not establish historical accuracy. 3D uses one native viewer on the homepage, in lessons and in expanded inspection; source attribution remains part of the app. Lesson models are local bundle records, and guided views apply data-authored camera positions. The viewer shares the page ground, with a subtle gesture hint and camera controls that expand on demand.

One controller owns Read/Listen, chapters, passage position and bookmarks. Learning does not wait for narration. Browser speech and synthesized background sound are temporary previews. Model-generated content selects supported data structures; it does not author executable layout.

## Review boundary

The user’s latest screenshots and feedback outrank older comps or source-only review. Earlier Worlds/player concepts remain illustrative family references. Static correctness, schema checks and a successful build do not establish visual quality. Fresh desktop/mobile and interaction captures remain outstanding because the task cannot bind localhost or reach its browser host. Impeccable finish disposition remains `recapture`; no visual approval is claimed.

## Learning workbenches

The [learning engine](docs/technical/learning-engine.md) extends the same player identity with assemblies, lens/pendulum experiments, harmonic sound and Boolean systems. Keep the manipulation, result and explanatory feedback together in the visual pane. Controls use semantic tokens and keyboard-accessible HTML alongside canvas. Graphs reflow vertically in narrow panes. Original technical diagrams are identified as schematics. No new raster art or replacement visual world was introduced by this slice; rendered acceptance remains open.
