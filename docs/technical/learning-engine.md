# Interactive learning engine

Use for model behavior, runtime constraints and capability expansion. [Scenes](scenes.md) owns composition and bundle validation; [frontend navigation](../../frontend/DEVELOPMENT.md#start-here) maps controls and implementation.

## Supported mechanics

The [scene contract](../../frontend/src/features/lesson/contracts/scene.ts), [composition registry](../../frontend/src/features/lesson/contracts/compositions.ts) and [interaction dispatcher](../../frontend/src/features/lesson/interactions/interaction-stage.tsx) are authoritative. Select supported structured data; lesson slugs never choose renderers.

| Mechanic | Behavior | Model boundary |
| --- | --- | --- |
| Image inspection/reveal | Numbered details, source crops, pan/zoom and editorial SVG guides | Registered image coordinates; no inferred hidden scan |
| Assembly | Select/separate parts, rotate/zoom, clip supplied geometry and play bounded transform tracks | Supplied schematic primitives; no automatic GLB segmentation or mechanical solver |
| Thin lens / pendulum | Ray construction and real/virtual/focal states; Rapier pendulum with small-angle comparison | Registered equations, units, ranges and assumptions; not a general simulator |
| Harmonic sound | Additive harmonics, frequency, waveform, explained presets and deliberate listening | Stationary mixture; not faithful instrument synthesis |
| Boolean systems/construction | Trace fixed networks or wire supplied components and test all input combinations | Ideal acyclic logic; no voltages, memory or propagation delay |
| Process travel | Reversible packet events, authored route comparison and initial Hop Limit changes | Registered IPv6 forwarding rule; no live routing or transport simulation |

Each named mechanic under [interactions](../../frontend/src/features/lesson/interactions/) owns its schema, calculation and visible controls. Heavy viewers load lazily. [Shared infrastructure](../../frontend/src/features/lesson/shared/) owns range/button controls, fixed-stage workbenches, scoped state and recovery. Installed package versions live in the manifest/lockfile; rendering uses Three.js/R3F/Drei, Rapier, Tone and React Flow where applicable.

## Authoring and runtime rules

1. Start from a learning question and the visible effect the learner should understand. Put the subject, one obvious gesture and nearby explanation first.
2. Select a registered model and supported composition. Supply bounded inputs, units, source references and complete reading through the [authoring contract](lesson-authoring.md). New runtime behavior needs implemented code and meaningful validation.
3. Validate ranges, IDs, references, graph arity/cycles and capability compatibility before rendering. Lesson data contains no executable equations, shader strings or arbitrary layout code.
4. Keep simulation rules, observations, assumptions and interpretation distinguishable. Schema validity alone cannot establish subject correctness.
5. Keep the visible stage available while controls/feedback scroll. Reflow graphs for narrow panes; readable labels and connection targets take priority over fitting a desktop diagram into a phone.
6. Persist parameters and input selections in device-local version-scoped learning state. Boolean construction uses its own typed/versioned draft, separate from flat lab parameters. Invalid saved IDs fall back to authored defaults. Results clear after edits; active audio/simulation playback is transient.
7. Reset restores authored parameters. Start simulations/audio deliberately. Stop audio on unmount, tab hiding, page exit or narration start; honor master mute. Pendulum parameter changes pause/reset it.
8. Motion starts still, frames its full envelope and stops on hide/unmount. Reduced motion uses discrete poses. Keep explanations readable throughout a cycle; an illustrative cycle is not a measured physical duration.

A cutaway needs actual geometry; a rendering library supplies no domain correctness. Preserve explicit idealizations and source support.

## Capability expansion

Add a viewer only when a concrete asset/model and teaching task need it. Candidates remain proposals:

| Need | Candidate / prerequisite |
| --- | --- |
| High-resolution source/specimen inspection | OpenSeadragon; licensed detailed original, tiles/manifest, region coordinates and calibrated scale if claimed |
| Molecular structure | Mol* / MolViewSpec; curated scientific structure data and reviewed annotations |
| Place exploration | Photo Sphere Viewer; licensed panoramas, meaningful viewpoints, phone/fallback navigation |
| Rich object motion | Named model nodes, correct pivots/units, licensed geometry and animation clips |
| Aligned image comparison | Source registration and meaningful relationship; an editorial guide must be identified as such |
| Geometry, reactive illustration or coding | Mafs/JSXGraph, Rive or Pyodide only for a supported model/task; authored assets or execution isolation as applicable |

Use installed components first. Any new dependency needs compatibility, license, loading and input/accessibility review. Notify the user when installation is needed. Scientific/educational content licenses are separate from library licenses; PhET commercial use needs its own licensing check.

## Verification

Test model behavior at meaningful boundaries: lens focal states, normalized harmonic output, complete Boolean truth tables, invalid drafts, deterministic packet rewind and pendulum comparison against the stated approximation. Rendering contracts cover prepared inputs and framing. Browser checks cover manipulation, restoration/reset, independent scrolling, keyboard/touch operation, loading/retry and deliberate audio. [Development](development.md#verification) defines commands; [status](../status.md#verification-boundary) records current execution limits.

## Primary references

[R3F](https://r3f.docs.pmnd.rs/getting-started/installation), [pointer events](https://r3f.docs.pmnd.rs/api/events), [Rapier joints](https://rapier.rs/docs/user_guides/javascript/joints/), [React integration](https://github.com/pmndrs/react-three-rapier), [Tone](https://tonejs.github.io/), [React Flow](https://reactflow.dev/examples/interaction/computing-flows), [OpenSeadragon](https://openseadragon.github.io/), [Mol*](https://molstar.org/), [panorama tours](https://photo-sphere-viewer.js.org/plugins/virtual-tour.html), [PhET licensing](https://phet.colorado.edu/en/licensing/).
