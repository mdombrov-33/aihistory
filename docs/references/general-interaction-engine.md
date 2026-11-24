# Reusable mechanics for a cross-subject learning engine

Researched 2026-11-23. **Research and recommendations only:** no engine changes, new lessons, packages or paid services. [Current capabilities](../technical/learning-engine.md) remain authoritative; task state belongs in the [implementation plan](../implementation-plan.md#interactive-learning-exploration).

**Disposition after the user review:** the subsequent case/prediction/arrangement implementation was rejected as confusing and puzzle-heavy, then removed at the user's request. This report is retained as background research; its implementation ordering is superseded by [visual exploration](visual-exploration.md). Its studies and tool capabilities do not justify exposing every mechanic, a multi-panel workspace, or exercise-driven defaults. The earlier player, image interaction and packet/logic additions remain the accepted baseline.

## Finding

Build a composable vocabulary of learner actions, backed by explicit subject rules and evidence. The largest missing capability is connecting an action to a useful observation, explanation and next attempt across different media. Adding more subject-specific viewers alone will not provide this.

Business, games, studios, films and books are possible lesson subjects, not engine boundaries. “Almost any question” is a coverage ambition to test, not a claim that one simulator can model any subject. Some requests need an annotated explanation or source comparison; others need a reviewed computational model, a supplied asset or real-world practice that a browser cannot reproduce.

The ten groups below are our design synthesis, not an established exhaustive taxonomy. They are independent of screen layouts. One mechanic can use several renderers, and one renderer can participate in several learning tasks. H5P demonstrates a broad content-type approach and validates configurable library inputs through semantics; it is a useful comparison, not a recommendation to embed its full plugin system. [H5P types](https://h5p.org/content-types-and-applications), [semantics](https://h5p.org/semantics).

## What the repository already supports

Inspected the [scene schema](../../frontend/src/features/player/scene-schema.ts), [composition registry](../../frontend/src/story/compositions.ts), [learning schemas](../../frontend/src/features/learning/schema.ts), [packet model](../../frontend/src/features/learning/packet-model.ts), [construction model](../../frontend/src/features/learning/construction-model.ts) and [session state](../../frontend/src/features/learning/session.tsx).

- **Good foundation:** prepared data, strict validation, 15 families/24 presets, local source assets, image details, source switching, maps, chronology and native 3D. New content does not require slug-specific React.
- **Useful but narrow computational semantics:** experiments accept thin-lens or pendulum models; traveler accepts IPv6 Hop Limit; editable construction accepts ideal Boolean networks. Their boundaries are intentional. Renaming labels does not turn them into a business, biological or narrative model.
- **Mostly separate interactions:** components manage their own parameters/checkpoints/drafts. There is no general prediction → attempt → observation → explanation record, linked selection protocol, saved baseline comparison or learner evidence workspace.
- **Presentation is ahead of instructional composition:** chronology/process selects authored steps, evidence displays an authored interpretation, comparison switches sources. Those are not yet editable sequences, branching consequences or learner-built arguments.
- **Linear reading contract:** beats cover narrative passages once in order. A branching activity should initially remain inside a beat, preserving the main reading path. Branching the entire lesson would require explicit narrative/position validation and compatibility work.

No new browser verification was attempted for this research. Earlier model checks and unresolved rendered checks retain their recorded boundaries.

## Ten transferable mechanic groups

All examples here are proposed transfer probes, not completed lessons or sourced claims about a real person/company.

| Mechanic | Learner action and useful result | Cross-subject transfer | Present support / missing contract |
| --- | --- | --- | --- |
| **1. Inspect and reveal layers** | Select a region, component or passage; isolate a layer; get an attached explanation with its context preserved. | Anatomy, architecture, interfaces, paintings, literary passages. | Image pins/crops and 3D selection exist. Missing shared semantic selection across text/diagrams/layers and asset-defined visibility groups. A cutaway still needs actual interior data. |
| **2. Compare controlled alternatives** | Save a baseline, change one factor, toggle or align the result, identify what changed. | Two translations, product offers, material treatments, policy scenarios, film edits. | Large source switching exists. Missing state snapshots, declared correspondence and a difference summary; synchronization only when units/coordinates actually match. |
| **3. Link representations** | Select one entity, interval or subset; highlight its corresponding parts in other views. | Paragraph ↔ argument, transaction ↔ ledger/chart, place ↔ event, sound ↔ waveform. | Individual labs have related outputs, but no shared ID/selection mapping. Need app-owned bindings; correlation/links must not imply causation. |
| **4. Trace and replay a process** | Advance, rewind and inspect a changing entity or state; compare the event before and after a transition. | A service request, digestion, production workflow, algorithm, a character's evolving knowledge. | Packet replay is computed; process/timeline are authored steps. Missing a bounded authored-state trace and additional registered domain models. |
| **5. Intervene and observe** | Change a meaningful input, predict a result, run a controlled comparison and examine the response. | Materials, ecosystems, camera behavior, operational capacity, game movement. | Three narrow numerical/audio models work. Need a model registry with units, ranges, assumptions, observable outputs and independent fixtures; no agent-authored formulas accepted by default. |
| **6. Arrange, connect and allocate** | Order items, classify them, connect components, place parts or distribute a finite resource; inspect constraints and revise. | Sentence structure, causal arguments, workflows, molecule kits, production schedules, resource allocation. | Boolean draft/validation is a useful precedent. Missing typed sequence/slot/group/resource drafts and registered validators. Several arrangements may be valid; a list may define a partial order rather than one reference answer. |
| **7. Decide with persistent consequences** | Choose an action, inspect how available information/resources/options change, then revisit a decision. | Negotiation, ecological stewardship, editorial choices, ethical dilemmas, troubleshooting. | Not implemented. Need a bounded state graph, choice preconditions, authored consequences, explicit terminal/continuation states and replay. Authored hypothetical consequences are not empirical predictions. |
| **8. Investigate and support an explanation** | Gather observations, attach evidence to claims, mark contradictions or uncertainty, revise a conclusion. | Literature, product research, historical inquiry, diagnosis of a fictional system, media literacy. | Evidence records are displayed, not assembled by learners. Need stable claim/evidence IDs, relationships, source locators and feedback that permits supported alternatives. No automatic numerical “truth score” for interpretations. |
| **9. Compose and transform media** | Reorder segments, alter timing, mix layers or rearrange a composition; immediately see/hear the result. | Language, music, animation, visual design, filmmaking, communication. | Harmonic synthesis exists; generic media composition does not. Need bounded tracks/items, transforms, timebase, play/stop/seek, text alternatives and source assets. Previewing changes is distinct from judging artistic quality. |
| **10. Explore space and scale** | Move between meaningful viewpoints, spatial layers or levels of scale; locate features and retain orientation. | Buildings, landscapes, machinery, cells, molecules, stage/blocking. | Maps, orbit cameras and guided 3D views exist. Missing spatial navigation/level relationships and specialist data adapters. Panoramas are not geometry; increased zoom cannot reveal unrecorded detail. |

### Shared teaching loops, rather than more standalone widgets

Prediction, practice and explanation belong across these groups. A small common activity contract could support:

1. **Observe → change → explain:** immediate response with a prompt naming what to inspect.
2. **Predict → test → compare:** keep the prediction and initial conditions visible alongside the result.
3. **Worked example → complete a step → try independently:** remove help deliberately, rather than hide every step behind clicks.
4. **Attempt → diagnose → hint → revise:** identify a specific failed constraint or counterexample; preserve the learner's draft.
5. **Claim → evidence → alternative interpretation:** show supporting passages and what remains unresolved.

These are proposals for composition. They do not imply mandatory quizzes, grading or an activity on every screen. Reading, a well-chosen diagram and optional exploration remain first-class responses.

## What learning research supports, and its limits

These original papers, frameworks and research syntheses inform the proposals; none validates an automatically generated engine across all subjects.

| Source and evidence type | Finding within its studied scope | Proposed implication |
| --- | --- | --- |
| [Chi & Wylie, 2014, ICAP](https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf), framework/synthesis | Distinguishes manipulating supplied material from generating explanations and substantive co-construction. Responsive UI is not automatically its highest engagement category; overt actions do not guarantee the hypothesized cognition. | Specify the inference an action helps the learner make. Click counts, completion and an AI reply do not prove learning. |
| [Podolefsky, Moore & Perkins, 2014 revision](https://arxiv.org/abs/1306.6544), simulation design framework | Connects affordances, constraints, cues and feedback to guided exploration. Its Energy Skate Park interview is illustrative, not a universal effectiveness experiment. | Start from a meaningful state, stage complexity, expose consequences and provide reset. Extending this to non-science content is our hypothesis to test. |
| [Schwartz & Bransford, 1998, A Time for Telling](https://aaalab.stanford.edu/papers/time_for_telling.pdf), three classroom studies | College students analyzed contrasting psychology cases, then received explanation; later predictions improved relative to specified comparison groups. Analysis alone did not replace the explanation. | Offer compare → notice → explain; do not require discovery or guessing before every requested answer. |
| [Renkl et al., 2002](https://doi.org/10.1080/00220970209599510), field/laboratory experiments; [paper copy](https://www.davidlewisphd.com/courses/EDD8121/readings/2002-Renkl_et_al.pdf) | Progressively omitting worked steps improved near transfer in the studied structured tasks; broad far transfer was not established. | Support demonstration → complete a step → independent attempt, with help recoverable. Reveal buttons alone are not this instructional sequence. |
| [Shute, 2008, Focus on Formative Feedback](https://myweb.fsu.edu/vshute/pdf/shute%202008_b.pdf), research synthesis | Supports task-specific, manageable feedback; timing findings depend on learner/task and are mixed. | Acknowledge an action immediately, but allow deliberate Check before judging a draft. Explain the failed constraint or counterexample rather than interrupt each edit. |
| [Klahr & Nigam, 2004](https://www.fi.uu.nl/publicaties/literatuur/2004_klahr_learning_paths_early_science_instruction.pdf), study of 112 children | Direct instruction led more children to acquire a procedure for unconfounded experiments; those who acquired it transferred comparably across the studied instructional paths. | Do not default unfamiliar learners into blank sandboxes. Keep demonstration, hints and direct explanation available. This does not discredit all inquiry. |

Coverage, usable interaction and learning effectiveness require separate evaluation. A later learning pilot should ask learners to explain or apply the idea to a new case; enjoyment and use statistics alone cannot establish transfer. No such evaluation was run here.

## Runtime and authoring shape

Extend the existing player incrementally. Keep content family and spatial composition distinct, then add the minimum shared activity state needed by the first cross-family use case. Do not replace the app with a universal canvas or one unrestricted JSON interpreter.

| Layer | Responsibility | Boundary |
| --- | --- | --- |
| Learning intent | What should become understandable; which observation would demonstrate the explanation? | Selected from the question and audience, not a topic-to-widget lookup. |
| Subject/evidence packet | Entities, sources, relationships, claims, units, assets and qualifications. | Schema validity cannot establish factual correctness. |
| Mechanic | Permitted learner actions, draft/state shape and the observation/feedback cycle. | Reusable across subjects; no subject-specific slug branches. |
| Semantic model | Registered evaluator, finite authored trace, bounded scenario graph or cited interpretive rubric. | State what kind of answer it produces. A renderer supplies no domain truth. |
| Presentation adapter | Text/SVG/chart/map/3D/audio/video layout and controls. | Preserve usable framing, local response and alternate input. |

Proposed manifest fields for each capability: version, supported actions, required data/assets, parameter bounds, allowed state/draft shape, feedback mode, supported adapters, fallback and example IDs. Give the composer only supported entries and representative examples. IDs such as `select-entity`, `set-parameter`, `connect`, `advance`, `submit-prediction` and `reset` would be validated events, not callback code in lesson data.

Use semantic IDs to map selections between views. Preserve per-activity drafts, predictions and explicitly saved baselines under a content/model version; compute outputs from those inputs. Parameter edits invalidate obsolete results. Rewind reconstructs prior state; it does not reverse audio/network side effects. Playback never restores as active. Keep existing state formats intact until a reviewed versioned addition is needed.

Finite choices and transitions can be data-defined without a separate implementation for every topic: an authored transition table can declare a hypothetical consequence; a generic ordering validator can check prerequisite pairs. For more expressive scenarios, allow only registered condition/effect operators with bounded typed parameters. Do not accept arbitrary formulas, JavaScript, shaders or unbounded recursion. Continuous physical or economic behavior still requires a reviewed domain model.

XState documents guarded transitions, named reusable guard implementations and side-effect-free state transition evaluation. That is a useful runtime reference, not a requirement to install it: a small pure reducer may suffice for the first finite activity. Persisting live actors can restart invocations, so a raw actor snapshot is not automatically a safe lesson resume format. [Guards](https://stately.ai/docs/xstate/v5/guards), [pure transitions](https://stately.ai/docs/xstate/v5/pure-transitions), [persistence](https://stately.ai/docs/xstate/v5/persistence).

### Four feedback modes must remain distinguishable

- **Computed:** a registered evaluator returns a result and assumptions. Correctness is relative to that model and validated range.
- **Observed:** a supplied dataset/record/clip shows a result. Filtering it does not establish a causal effect.
- **Authored scenario:** prepared choices lead to explicitly hypothetical consequences. Replay reveals the authored alternatives, not what would certainly happen in life.
- **Interpretive:** a rubric and cited evidence explain strengths, omissions and plausible alternatives. Open-ended model-generated feedback is future integration, not an authoritative answer key or a current capability.

The app can verify structure, completion or a constraint without grading an interpretation. More interaction is not a justification for inventing a determinate answer.

## Library findings and dependency decisions

These are verified capabilities from official documentation; proposed uses are ours. No installation is recommended merely to increase the package count. Compatibility, license terms and representative mobile cost must be checked before any selected integration.

| Tool | Verified value | Recommendation for this engine |
| --- | --- | --- |
| Existing React/SVG, Three/R3F, React Flow, Tone/Rapier | Already power the current prepared mechanics. React Flow offers connection-validation hooks. [Validation](https://reactflow.dev/examples/interaction/validation). | Reuse for shared feedback, snapshots, finite choices, text evidence and small arrange/connect tasks. Graph rendering is separate from domain validation. |
| Vega-Lite / Vega | Variable and selection parameters drive filtering, encodings and linked views; Vega signals also react to UI/API updates. [Parameters](https://vega.github.io/vega-lite/docs/parameter.html), [signals](https://vega.github.io/vega/docs/signals/). | Strong candidate when linked data views justify it. Prefer app-owned templates populated with validated fields/data. Default Vega expression execution generates functions; interpreter support changes that tradeoff but is not permission for unrestricted generated specs. [Interpreter](https://vega.github.io/vega/usage/interpreter/). |
| XState / Ink | XState supplies explicit transition machinery. Ink separates authored narrative from a runtime exposing content and choices, with saved story state. [Ink runtime](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md). | Compare only if finite branching outgrows our reducer. Neither supplies truthful consequences, evidence checks or a general scientific evaluator. Avoid two competing scenario runtimes initially. |
| Konva | 2D shapes/groups, events, dragging, transforms and React integration. [Documentation](https://konvajs.org/docs/). | Candidate for a genuinely spatial composition editor. Native DOM/SVG is enough for small card ordering/grouping tasks. |
| Native media / WaveSurfer | WebVTT describes time-aligned captions, chapters and metadata; WaveSurfer offers waveform regions, timelines and other audio visualization plugins. [WebVTT working specification](https://www.w3.org/TR/webvtt1/), [WaveSurfer](https://wavesurfer.xyz/). | Useful for a synchronized media/annotation adapter. Neither provides a full editing engine or assessment semantics. Start with seekable prepared segments before an editor. |
| Rive / Phaser | Rive binds properties to elements in an authored animation asset; Phaser Arcade handles simple 2D game physics with rectangle/circle shapes. [Rive](https://rive.app/docs/runtimes/react/data-binding), [Phaser](https://docs.phaser.io/phaser/concepts/physics/arcade). | Optional presentation/practice adapters. Rive needs authored files; Phaser needs game rules and assets. Neither is the general lesson protocol, and neither needs to be installed for initial shared mechanics. |
| OpenSeadragon / Mol* | Specialist high-resolution image and molecular structure capabilities were already researched. [Earlier report](next-interactions.md). | Asset-gated adapters, not prerequisites for broad interaction coverage. |

H5P and Bret Victor's original explorable-explanation prototypes are design references. The latter emphasizes changing assumptions in context, concrete examples and contextual information while retaining a readable argument; it is an influential design demonstration, not a controlled proof that every explanation benefits from interactivity. [Original essay](https://worrydream.com/ExplorableExplanations/).

## Composer selection and coverage tests

Proposed composer sequence:

1. Identify the explanatory task: structure, mechanism, change over time, difference, tradeoff, procedure, interpretation or skill. A question may need more than one.
2. Gather evidence and determine which observations/models/assets actually exist.
3. Choose the simplest mechanic that exposes the important relationship. Explain its learning purpose in the storyboard; plain explanation can be the right choice.
4. Specify learner action, observable response, feedback mode, assumptions, accessible alternative and fallback.
5. Connect activities only where learner state matters; do not require every screen to use every shared feature.
6. Validate data, references, state transitions and feedback fixtures; then inspect actual desktop/mobile/short-window states. A model-generated solution and its own generated answer key are not independent validation.

These probes would test coverage without committing the engine to their topics:

| Request | Candidate composition | Failure to catch |
| --- | --- | --- |
| Why does this poem admit two readings? | Passage selection + evidence + comparison. | Treating one supported reading as the single answer. |
| How does a request move through a service? | State trace + linked diagram/log. | Merely advancing paragraphs without exposing state. |
| How do I choose between two suppliers? | Evidence comparison + bounded decision scenario. | Presenting authored outcomes as market forecasts. |
| Why does a particular game room guide attention? | Spatial inspection + visibility/landmark layers. | Requiring a full game engine when a sourced plan suffices. |
| How does editing change a scene's meaning? | Reorder prepared segments + compare baseline. | Claiming an objective artistic score. |
| How does an enzyme interact with a molecule? | Structure selection + supplied representations + explanation. | Inventing dynamics from a static structure. |
| What makes a website hierarchy readable? | Arrange groups + preview + qualitative rubric. | Equating pixel matching with successful communication. |
| How does a plant move water? | Authored process trace + qualified scale links. | Reusing an unrelated packet or pendulum evaluator. |
| Why do these data support different conclusions? | Linked selection + evidence qualification. | Treating correlation or filtering as causal intervention. |
| Can I repair this workflow? | Partial-order construction + counterexample. | Rejecting a valid alternative sequence. |
| What does this unfamiliar term mean? | Concise explanation + optional annotated example. | Forcing a multi-step activity to access a simple answer. |
| Can I learn this hands-on physical skill here? | Demonstration + observation prompts + explicit scope. | Claiming a browser task proves real-world proficiency. |

For each new mechanic, propose three small fixtures from unrelated domains using the same contract and renderer. These need not be three full lessons. Follow with a small number of coherent, source-backed lessons that combine mechanics; measure whether an agent can author them without renderer edits. Do not claim a percentage of “all questions covered” from this diagnostic set.

Acceptance should cover deterministic replay/reset, stale-feedback invalidation, valid alternative answers, incomplete/invalid states, versioned restore, missing assets/model fallback and realistic content lengths. Use real narrow/short panes: controls, changed visual and immediate feedback must remain mutually discoverable. Dragging needs a click/tap alternative as well as keyboard access; the repository's 44px target policy exceeds the WCAG 2.2 AA 24px minimum and must not be confused with it. [Dragging](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Earlier proposed order, superseded after review

1. **Shared activity loop, saved baseline and linked selection.** Exercise it with an existing model plus a source/text activity. This tests cross-family composition before adding a heavyweight viewer.
2. **General arrange/relate tasks and finite scenarios.** These unlock substantial non-numerical explanations without pretending every subject has equations. Keep their content/feedback contracts separate where their semantics differ.
3. **Evidence workspace and timed-media adapter.** Support interpretive inquiry and composition, rather than force humanities/media into quizzes or scientific simulations.
4. **Specialist adapters and additional domain models when a selected question needs them.** Curated assets and verified semantics precede package installation.

This earlier order is retained to explain the research, not to restart the removed experiment. Current prioritization is in [visual exploration](visual-exploration.md). Keep the existing engine and examples usable, notify the user before a dependency addition, and leave the homepage deferred until mechanics/examples are selected.

## Research boundary

Official documentation verifies that candidate tools expose the named capabilities; it does not establish integration quality, learning outcomes or automatic generation reliability. The capability audit is source inspection, not rendered testing. No packages were installed, datasets acquired, lesson code changed, live generation invoked or new mechanic declared complete.
