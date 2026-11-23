# Interactive learning engine

The product now targets learning across subjects. History is one possible subject, not a required starting point or showcase. This document records the current exploration, reusable mechanics and remaining ideas; the [implementation plan](../implementation-plan.md#interactive-learning-exploration) owns task status. The user accepted the first examples for now; further interaction exploration comes next, with the homepage still deferred.

## Working capabilities

All examples use the existing prepared-bundle seam and shared player. No lesson slug chooses a renderer. The two exploration slices add six families/compositions to the existing registry: **15 families and 24 presets** in total. Schema version 2 remains a prepared format; consumers must use the updated capability registry. This is an additive local extension, not a persisted-content migration or a live generation service.

| Family / composition | Working behavior | Boundary |
| --- | --- | --- |
| `traveler` / `process-traveler` | Rewind a packet trace, compare authored routes and change initial Hop Limit with state rebuilt deterministically | Registered IPv6 forwarding rule only; no live traffic, routing discovery or transport/retry simulation |
| `construction` / `construction-bench` | Connect supplied Boolean components, inspect incomplete/invalid drafts and test all input combinations | Fixed component inventory, two or three inputs, one output and acyclic ideal Boolean logic |
| `assembly` / `assembly-explorer` | Select named geometric parts, separate them, rotate/zoom and clip a section through supplied geometry | Original schematic primitives, not automatic segmentation or interior reconstruction of arbitrary GLBs |
| `experiment` / `experiment-bench` | Thin-lens ray construction with real/virtual/focal states; pendulum length/gravity controls, Rapier playback and a separate small-angle prediction | Two registered mathematical models, not a universal scientific simulator |
| `sound` / `sound-studio` | Four additive harmonics, frequency control, explained presets, waveform and deliberate audio playback | Stationary harmonic mixtures, not faithful instrument synthesis or a hearing test |
| `system` / `system-workbench` | Toggle inputs and trace AND/OR/NOT networks, with live output and component explanations | Ideal acyclic Boolean logic; no electrical solver, propagation delay or memory |

Implementation starts at [schema](../../frontend/src/features/learning/schema.ts), [calculations](../../frontend/src/features/learning/models.ts) and [stage integration](../../frontend/src/features/learning/learning-stage.tsx). These modules live under `frontend/src/features/learning/`; shared scene/presentation contracts stay in their established player/story modules. Controls, local state and visual error handling are shared. Scientific constants, equations and semantic models are application code; lesson data selects supported capabilities and parameters.

## Examples to open

| Lesson | Start | What to investigate |
| --- | --- | --- |
| [A packet’s journey](../../frontend/src/content/showcases/a-packets-journey.json) | `/stories/a-packets-journey/play/0` | Receive/forward events, route comparisons and the zero-limit destination case |
| [The camera, opened up](../../frontend/src/content/showcases/camera-opened-up.json) | `/stories/camera-opened-up/play/0` | Disassembly, component roles, thin-lens focusing and virtual images |
| [A swing in time](../../frontend/src/content/showcases/a-swing-in-time.json) | `/stories/a-swing-in-time/play/0` | A physical pendulum versus its small-angle prediction |
| [Shape a sound](../../frontend/src/content/showcases/shape-a-sound.json) | `/stories/shape-a-sound/play/0` | Relative harmonics, waveform and optional listening |
| [Signals and decisions](../../frontend/src/content/showcases/signals-and-decisions.json) | `/stories/signals-and-decisions/play/0` | Input combinations and connected gates; construction starts at `/stories/signals-and-decisions/play/6` |

The first four workbench lessons started with two chapters and six screens each. The packet lesson adds two chapters/four screens, and the logic lesson now has a third chapter/two construction screens. They are concise prepared experiments, with original geometric cover diagrams, supporting sources and explicit model assumptions. They join the collection rather than delete usable history examples. Existing examples have no priority in future showcase selection. All nine bundles use the same player; their 68 screens are not evidence of autonomous lesson generation or approved visual quality.

## Authoring and runtime rules

1. Define what the learner should understand, what they can change and which observable result supports the explanation.
2. Select a supported family/preset and registered model. Supply its data, source indices and complete reading through the [authoring guide](lesson-authoring.md). An agent can compose supported data; a new scientific rule needs a reviewed implementation and tests before the agent can use it.
3. Validate ranges, units, unique IDs, graph arity/references/cycles and capability compatibility before rendering. Unsupported code, arbitrary expressions, shader strings and unknown fields are rejected. Equation validation and factual review are separate from schema validity.
4. Keep manipulation and its explanation together. Traveler and construction share a fixed-stage workbench with an independently scrolling control deck: wide panes place it beside the stage, narrow panes below. The entire exhibit must not scroll away while changing a parameter. Builder nodes stay at 1:1 scale with 44px connection targets; the drawing can scroll, rather than shrink labels. Short panes retain full feedback prose in its own scroll region. Connection/focus autopanning is disabled because the outer diagram scroller owns navigation. Preserve keyboard-operable controls and textual output when canvas/audio is unavailable. Narrow graph panes reflow by dependency depth; they do not just shrink the desktop graph.
5. Load heavy viewers only for the active mechanic. The sound engine loads on deliberate Play. A single lesson renders only its active beat. Model/source descriptions identify idealizations, finite geometry and off-canvas results.
6. Construction drafts use a separate typed/versioned `constructions` state entry with bounded edges and Boolean inputs, rather than unchecked nested strings in the flat lab store. Unknown saved component/input IDs fall back to authored defaults. Test results are transient and clear after a wiring edit or scene change. Store parameters and input selections in device-local, version-scoped learning state. Never persist active audio or simulation playback. Reset restores authored parameters. Audio stops on scene unmount, tab hiding, page exit or narration start; master mute applies. Pendulum playback begins paused and parameter changes pause/reset it.

The libraries do not supply subject correctness. A cutaway cannot reveal absent geometry, a logic gate is not an electrical circuit, and a rigid-body engine is not a fluid or biological solver. The next additions should make those capabilities explicit rather than accept arbitrary generated code.

## Library choices and research

The manifest and lockfile are authoritative for installed versions. This slice uses Three.js with React Three Fiber/Drei for assemblies, React Three Rapier for the pendulum, Tone.js for opt-in synthesis and React Flow for system views. The underlying Rapier package is a development dependency for independent numerical verification. These packages were installed after user authorization; no live media/research provider is invoked by lesson playback.

No new dependencies were needed for packet travel or construction.

Primary documentation: [R3F React compatibility](https://r3f.docs.pmnd.rs/getting-started/installation), [pointer events](https://r3f.docs.pmnd.rs/api/events), [Three.js clipping](https://threejs.org/examples/webgl_clipping_stencil.html), [Rapier joints](https://rapier.rs/docs/user_guides/javascript/joints/), [React integration](https://github.com/pmndrs/react-three-rapier), [Tone.js](https://tonejs.github.io/), [React Flow computation](https://reactflow.dev/examples/interaction/computing-flows).

## Directions still to explore

These ideas are retained proposals, not implemented features or commitments to install every library. The [next-interaction research](../references/next-interactions.md) checks the next candidates against official documentation and the current code. Its first two recommendations are now implemented for review, using installed dependencies; deep-zoom and molecular viewers need curated data before integration. Notify the user when a new dependency is needed.

| Direction | Example | Candidate / missing work |
| --- | --- | --- |
| Richer 3D assemblies | Separate a mechanism with linked motion; isolate a structure in a sourced model | Named GLB parts, authored transforms/cameras and licensed assets; current primitives do not provide this pipeline |
| Follow other processes | Travel with a photon or trace an algorithm | Packet travel now supplies the first registered model; each additional domain needs its own reviewed transitions and source packet |
| Scale travel | Leaf → cell → internal structures | Explicit scale relationships, datasets and semantic transitions; more zoom alone does not add information |
| Molecular exploration | Protein structures, binding sites, supplied trajectories | [Mol*](https://molstar.org/) and its declarative MolViewSpec; scientific data acquisition and review |
| Virtual microscope | Investigate a high-resolution specimen | [OpenSeadragon](https://openseadragon.github.io/), tiled image preparation and annotations |
| Virtual field trips | An observatory, ecosystem or laboratory | [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/plugins/virtual-tour.html), licensed panoramas and meaningful viewpoints |
| Mathematical construction | Drag geometry, explore vectors or a graphical proof | [Mafs](https://mafs.dev/guides/interaction/movable-points) or [JSXGraph](https://www.jsxgraph.org/share/); integrate only when a specific model needs them |
| Interactive worked examples | Step through an algorithm or calculation; reveal a useful hint | A data/state contract and explanatory progression; a coding runtime is a separate capability |
| Build in more domains | Connect an electrical circuit or construct a mechanism | Boolean construction now works; voltages, memory, mechanisms and editable component inventories remain separate extensions |
| Prediction and decisions | Predict an effect, test it and explain the difference | Reusable local feedback and transparent assumptions; no required quiz/score layer |
| Reactive illustration | A visual responds to variables or stages | [Rive](https://rive.app/docs/runtimes/react/data-binding); requires authored animation assets |
| Coding experiments | Run a small Python example | [Pyodide](https://pyodide.org/en/stable/usage/webworker.html); execution isolation, resource limits and package loading need separate design |

[PhET](https://phet.colorado.edu/en/licensing/) is a useful interaction reference. Its current commercial-use terms require a commercial license, so it is not silently embedded as a free product dependency.

## Verification boundary

The contract suite exercises numerical lens cases, harmonic behavior, complete Boolean truth tables, graph rejection, prepared integration and the existing player contracts. Browser tests cover state restoration, controls, audio opt-in/stop, simulation reset and mobile width. Run the actual commands in [development](development.md); authored browser cases are not executed evidence. Current results and environment limits belong in the [implementation tracker](../implementation-plan.md#interactive-learning-exploration).
