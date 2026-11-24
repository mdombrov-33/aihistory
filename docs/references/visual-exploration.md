# Visual exploration: additions worth trying

Researched **2026-11-23**. This report records recommendations, not blanket dependency approval. The first two now have prepared implementations for review: an editorial composition reveal in the Great Wave lesson and schematic shutter motion in the camera lesson. The remaining directions are proposals. The accepted image hotspots, drag/zoom, native 3D, packet traveler and Boolean builder remain the baseline. The rejected inquiry, arrangement and prediction-puzzle experiment does not define the next direction. Subjects are unrestricted.

**Start with a generous visual and one obvious gesture:** slide to uncover, tap to move, drag to look around, or scrub to watch change. Explanation can follow the visible effect. A score, prediction form, evidence tray or control dashboard should not be the default entry experience. This is a product recommendation from the latest feedback, not a claim that a library guarantees engagement.

## Priority and cost

| Priority | Addition | First gesture and payoff | Dependency decision |
| --- | --- | --- | --- |
| 1 | Layer reveal / registered-image curtain | Slide a handle; see an outer surface give way to its aligned interior or another documented view | Native DOM/CSS/SVG first |
| 2 | A moving 3D object | Tap Play; see named parts perform one intelligible motion | Installed model-viewer or Three/R3F/Drei |
| 3 | Panorama / short linked tour | Drag to look around; tap an arrow into the next viewpoint | Photo Sphere Viewer only after assets exist |
| 4 | Deep visual inspection | Pinch into detail that genuinely exists in the source | OpenSeadragon only when tiling solves a measured need |
| Supporting | Visual time scrubbing | Slide through clearly labeled stages | Native range plus prepared media |
| Later | Reactive illustration / geographic terrain | Change one visual property or tilt a landform | Rive / MapLibre only for an asset-led example |

The existing [manifest](../../frontend/package.json) already includes model-viewer, Three.js, R3F, Drei and image pan/zoom. The next step needs better prepared visuals and a small presentation extension more than a broad installation round.

## 1. Reveal a layer, or sweep between aligned views

**Learner experience:** drag one large handle across a leaf illustration to uncover its internal structure, or across two registered photographs to inspect a documented change. Keep a useful initial split visible, with short labels directly beside the exhibit. “Peel” can instead mean tapping one outer layer to hide it; the first prototype should choose one interaction.

CSS clipping can restrict the visible portion of an element, including with SVG shapes. Two absolutely aligned images and an inset clip provide a curtain; SVG groups provide authored layers. A native range input supplies bounded numeric control. These browser features require no viewer package. [CSS Masking specification](https://www.w3.org/TR/css-masking-1/#the-clip-path), [HTML range specification](https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range)). R3F is useful only when depth, real geometry or a movable section matters; it adds unnecessary rendering cost for a flat reveal.

**Required assets:** matched dimensions, a shared coordinate system, deliberate crop/framing, layer order, labels and rights/provenance for every layer. Photographs require actual image registration and an explanation of viewpoint, date and imaging modality. A thermal view versus visible light needs its own capture and interpretation. The existing independent-artwork switcher is a different interaction: unrelated Great Wave and Red Fuji prints must not become a before/after curtain. Hiding an exterior never reconstructs an absent interior.

**Mobile/accessibility:** give the handle a 44px target and an explicit “Reveal interior” label; retain keyboard range operation and “Show exterior/interior” buttons. Avoid competing pan and reveal gestures initially. Reduced motion should change the clip directly, without easing or automatic sweeping. Supply descriptions of both states. Native APIs add no third-party runtime license; image and illustration rights still apply.

**First prototype:** use an accepted existing artwork with a clearly editorial SVG highlight/annotation layer registered to that image. Expose one reveal control inside the shared player. This tests the visual pleasure and legibility without inventing an underlying scan. A separately authored two-layer schematic can follow; no package is needed.

## 2. Let a 3D object do something

**Learner experience:** tap Play on a clearly framed mechanism; its parts move together through one cycle. A wind-up mechanism, flower opening or hinged joint are possible briefs, not acquired assets. Pause or scrub lets the learner inspect the relationship after the motion has made it interesting.

Installed model-viewer already supports named animation selection, playback speed, one-shot playback and paused animation frames. Use it for a supplied GLB with a baked animation. Installed Three.js returns animation clips from GLTFLoader; its AnimationMixer supports explicit time seeking, and Drei wraps it with `useAnimations`. Use R3F when selecting individual parts or combining authored transforms with existing schematic geometry matters. Neither route needs a new animation library. [model-viewer animation examples](https://modelviewer.dev/examples/animation/), [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html), [Drei useAnimations](https://drei.docs.pmnd.rs/abstractions/use-animations).

**Required assets:** an inspected scene hierarchy with actual stable node/mesh names, correct pivots and axes, identifiable animation clips and durations, a reviewed motion description, camera/poster and rights record. Validate that every declared mesh and clip exists. The current local `telegraph.glb` has one unnamed node, one mesh and zero animations; it cannot supply a separately moving lever. [NativeObject](../../frontend/src/components/media/native-object.tsx) currently exposes camera behavior, and the prepared model contract needs extension before authored animation controls can appear. The existing [assembly canvas](../../frontend/src/features/learning/assembly-canvas.tsx) uses separate schematic primitives, which can support an original motion demonstration after deliberate authoring; they are not a segmented museum scan.

**Tradeoffs:** model-viewer is [Apache-2.0](https://github.com/google/model-viewer/blob/master/LICENSE); [Three.js](https://github.com/mrdoob/three.js/blob/dev/LICENSE) and [Drei](https://github.com/pmndrs/drei/blob/master/LICENSE) are MIT. Keep their notices and separate asset credits. Texture memory, geometry and decoder requirements still need a representative mobile test. Render only the active exhibit; retain a poster and text fallback. R3F's on-demand rendering saves idle work, but animation mutations require invalidation. [Performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

Provide HTML Play/Pause and frame controls; never require precise dragging of a tiny 3D part. Start paused, avoid automatic camera flights, and offer discrete poses for reduced motion. First prototype an original, explicitly named two- or three-part schematic with one reviewed motion; seek a richer licensed animated GLB separately.

## 3. Look around a place, then move to another viewpoint

**Learner experience:** swipe around a greenhouse or observatory panorama, then tap a visible doorway arrow to arrive at a second viewpoint. This is environmental discovery with a minimal interface. Keep optional explanations attached to a few visible features.

Photo Sphere Viewer supplies spherical viewing beyond the current flat-image zoom. Its VirtualTour plugin links panorama nodes, supports manually positioned or GPS-based arrows and can obtain nodes asynchronously. It adds meaningful tour plumbing; building the equivalent directly in installed Three.js would leave that behavior app-owned. [Viewer setup](https://photo-sphere-viewer.js.org/guide/), [VirtualTour documentation](https://photo-sphere-viewer.js.org/plugins/virtual-tour.html).

**Required assets:** licensed equirectangular panoramas or a supported cubemap, correct crop/orientation metadata, readable resolution, thumbnails, node IDs, link bearings and authored arrival directions. A normal photograph is not a full panorama. A two-viewpoint tour needs coherent locations and credits for both; no suitable local set has been established here. The plugin cannot generate missing views or guarantee a geometrically faithful walk.

**Tradeoffs:** [MIT runtime](https://github.com/mistic100/Photo-Sphere-Viewer/blob/main/LICENSE), with Three.js dependency and viewer/plugin CSS; panorama rights remain separate. Limit preload and cache against actual mobile texture cost. Keyboard controls default to fullscreen; enabling global “always” handling can conflict with player navigation. Provide focus-scoped HTML turn/zoom controls and destination buttons. Touch gestures can trap page scrolling; the library offers two-finger rotation, but a deliberate enlarged exploration mode may better preserve the simple swipe. Disable autorotation and rotating transitions for reduced motion. [Configuration](https://photo-sphere-viewer.js.org/guide/config.html).

First prepare two credited still viewpoints and test their framing and obvious destination button using current components. That checks the tour content, not spherical rendering. Install PSV only after the panorama packet passes review.

## 4. Zoom into genuine detail

**Learner experience:** pinch into a specimen, painting or technical drawing until an otherwise invisible detail becomes readable; tap one highlighted region to understand it. Maintain the overview and a quick return to the whole.

OpenSeadragon's value is on-demand tiled image loading and image-anchored overlays. It supports DZI and IIIF; large originals can be converted locally into a tile pyramid. Existing Hokusai images are only 1200px wide; the photography assets have a maximum axis of 1200px. Existing pan/zoom is sufficient for those assets. [Tile preparation](https://openseadragon.github.io/examples/creating-zooming-images/), [overlays](https://openseadragon.github.io/examples/ui-overlays/), [IIIF integration](https://openseadragon.github.io/examples/tilesource-iiif/).

**Required assets:** a genuinely detailed licensed original, dimensions, tiles/manifest, region coordinates and provenance; a physical scale bar additionally needs verified calibration. Leaf-to-cell-to-organelle usually requires separate sourced views and explicit relationships, not increasingly enlarged pixels. No calibrated specimen or tile packet was acquired during this research.

The [BSD three-clause license](https://openseadragon.github.io/license/) requires notices and forbids implied contributor endorsement. Local static tiles fit prepared playback; external IIIF adds service availability and cross-origin requirements. Many tile files and caching become operational costs. Keep overlays large enough to tap, provide HTML zoom/region/reset controls, preserve page scrolling and use immediate region jumps under reduced motion. First inspect a candidate original and its deepest useful crop with current pan/zoom; adopt OSD only when loading cost or usable detail justifies it.

## Supporting possibilities

**Visual time scrubbing:** use one range to move through a flower's prepared stages, a changing coastline or a documented time-lapse. Authored images/SVG states offer deterministic, readable stops; label actual dates or “stage,” and do not imply continuous measured change between sparse observations. Native video seeking uses `currentTime` and asynchronous seeking; codec/keyframe structure and device decoding can make repeated scrubbing less immediate. [HTML media specification](https://html.spec.whatwg.org/multipage/media.html#dom-media-currenttime-dev). Supply licensed frames or video, stage/time mapping, poster and descriptions. Test a few prepared stages first, with keyboard Previous/Next, no autoplay and no transition under reduced motion. No package is necessary; media/codec rights require their own review.

**Rive, optional:** drag one value and watch an illustrated diaphragm open. React data binding connects code to properties already authored in a `.riv` file; it does not create the illustration or a scientific model. [Data binding](https://rive.app/docs/runtimes/react/data-binding). Its [React](https://github.com/rive-app/rive-react/blob/main/LICENSE) and [WASM runtime](https://github.com/rive-app/rive-wasm/blob/master/LICENSE) are MIT; the editor/service and asset rights are separate. WASM/renderer loading adds cost. [Web runtime](https://rive.app/docs/runtimes/web/web-js). Require a commissioned/licensed file, named bindings and static fallback; expose the value through HTML, pause idle animation and use still states for reduced motion. Try the illustration in SVG first.

**MapLibre terrain, later:** tap “Tilt” to see a mountain pass in relief. Its terrain example uses raster DEM data and explicit exaggeration; the library supplies rendering, not elevation or a geographic explanation. [Terrain example](https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/). Require licensed DEM/basemap tiles, attribution, coverage/resolution and reviewed coordinates. [BSD three-clause source license](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt) does not license tile services or promise free hosting. GPU/network cost and gesture conflicts make this a later choice. Provide HTML view controls, a flat fallback and instant camera changes for reduced motion. Prototype the learning moment with prepared relief/flat images first.

## Recommended next slice and verification boundary

Implemented the first slice for review: one layer-reveal example and one named-part motion demonstration using installed rendering. Keep the exhibit dominant, its first action visible and explanation short and adjacent. Select either panorama or deep zoom only after a concrete asset packet proves the need. Review desktop/mobile framing, keyboard operation, page scrolling, reduced motion and loading/fallback behavior before expanding the capability registry.

Official documentation, source licenses and the repository seams were inspected. No package was installed, asset acquired, paid provider called or browser/performance/accessibility test run. Library capability is not asset generation, scientific validation or evidence of visual approval.
