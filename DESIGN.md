# Frontend visual system

A mobile-first learning app with expressive subject imagery and quiet, recognizable controls. [Product requirements](docs/design.md) own behavior; [status](docs/status.md) owns service availability.

## Foundation

- [theme.css](frontend/src/styles/theme.css) owns semantic palette values. Worlds, Parchment, Forest and Mineral are selected in Settings. Components use background, foreground, card, primary, muted, input and ring roles rather than private palettes.
- Source Sans 3 carries body/UI text; Zilla Slab carries headings. Both are self-hosted. Artwork retains its own colors. Paper and schematic surfaces use their matching material/annotation tokens.
- Tailwind utilities own ordinary layout, spacing, typography and state. Shared components own repeated variants. Keep coordinated viewport, drawing and viewer CSS beside its feature; [frontend styling rules](frontend/DEVELOPMENT.md#dependency-and-maintenance-rules) explain its global cascade.
- Provide visible keyboard focus, reachable controls, touch targets of at least 44px, scalable text and reduced-motion alternatives. Preserve substantial explanation and readable line lengths.

## Discovery and task screens

The homepage combines panoramic question entry, real local continuation, a Moon model, numbered artwork inspection, a flat geographic comparison and a curated collection. Keep feedback beside its interaction. Image detail explanations open inside the exhibit with close/Escape support. Give each medium a suitable frame.

Task screens use compact headings, direct labels and familiar controls. Explore and My space use small thumbnails beside readable lesson text. Search/topic controls and pagination work together; time/place filters are contextual. My space separates lessons, passage bookmarks and questions. Ask prioritizes the question and optional focus, then related material. Settings uses compact theme swatches and direct section labels. Authentication has a direct form on phones and a separate decorative illustration on desktop.

The lesson overview uses a cinematic banner, clear premise, Start/Resume action and supporting chapters/sources. Premium selection uses an accessible plan comparison and separate review; account membership shows sample usage and cancellation. The guide pairs an ordered learning trail with chosen interests and private notes. Creation uses an editable outline and clear preparation/recovery states. Follow [offer requirements](docs/product/account-and-offer.md); visual polish must not imply working billing or settled entitlements.

## Player and media

[SceneFrame](frontend/src/features/lesson/scenes/scene-frame.tsx) owns composition; [scene contracts](docs/technical/scenes.md) define supported content and framing. Keep strong media and complete narrative visible together. Portrait sources narrow their exhibit; comparisons switch between large images. Images use registered proportions and focal points, with whole-source inspection available. Initial framing keeps annotation targets reachable. Selected details appear at the image with focus restoration.

Maps fit measured canvases and use sourced geometry or an identified schematic. Native 3D shares the page ground; camera tools expand on demand. Workbenches keep manipulation, observable output and explanation together; controls remain accessible alongside canvas. Source credits and model assumptions stay inspectable.

Desktop frames are bounded; mobile, short windows and enlarged text reflow. Keep reading complete rather than shrinking or clipping it. Artwork text overlays require a supported safe-area contract. One player controller owns navigation, reading/listening and bookmarks; narration is optional.

## Verification

Check phone/desktop layouts, short windows, themes, enlarged text, selected/error/loading states, keyboard/focus, reduced motion and sound as applicable. Contracts and builds establish technical behavior, not rendered visual quality. [Status](docs/status.md#verification-boundary) records the current verification gap. Generated comps are illustrative; runtime media must have provenance.
