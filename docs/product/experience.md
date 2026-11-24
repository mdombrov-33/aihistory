# Learning experience

## Intended experience

This document records product direction. [Status](../status.md) identifies implemented behavior and previews; [scene contracts](../technical/scenes.md) describe the current renderer.

The learner asks a question or chooses a library item, then explores a coherent explanation of a subject. They can change inputs, inspect structures, trace processes and connect observed results with an explanation. The story is composed inside the website from supported scene and interaction forms; it is not a standalone generated site or a generic chat/essay.

Aim for an expressive interactive learning experience: expressive typography, substantial imagery, purposeful motion, and clear interaction. Keep the tone curious, thoughtful, welcoming, and occasionally dramatic, without sounding like a classroom lecture or a constant trailer.

## Journey and pacing

1. **Enter:** ask a question, browse examples, or resume a story.
2. **Find a fit:** show a few relevant existing stories before offering a new one. If the request is broad, offer a few concrete angles rather than a long questionnaire.
3. **Preview:** show the proposed focus, scope, outline, approximate length, and whether a new-creation allowance applies. The outline is informative; approval is not required.
4. **Begin:** prepare the opening and let the learner start when it is ready. Do not autoplay a shared story.
5. **Explore:** follow a coherent main path, jump or revisit chapters, and investigate optional details without losing place.
6. **Close:** recap the answer and main connections. Reaching the closing recap marks the story finished; opening sources is optional.

Target roughly 15–20 minutes for the production main path, commonly 4–6 short chapters. The current prepared showcases demonstrate the authoring/rendering system; their duration is not acceptance of the production pacing or audio target. This is an editorial target, not a timer or mandatory length. Keep narrow topics concise; optional exploration can extend a session.

The main path should build 2–3 clear learning outcomes. A chapter advances one explanatory purpose. Use interaction only when it helps understanding: experiments, explorable assemblies, sound, connected systems, worked examples, maps, timelines or source comparisons. The [learning engine](../technical/learning-engine.md) distinguishes implemented mechanics from proposals. Avoid repetitive mandatory quizzes, scores, and XP as the default.

The 2026-11-23 review rejected the case/prediction/arrangement experiment as confusing and puzzle-heavy. Favor visually led discovery with an obvious main action: numbered image details, drag/zoom, layer reveals, guided object motion or a readable process trace. Keep the subject, its response and a concise explanation together. Advanced tasks may serve a particular lesson, but should not become the default interface or require learning a control panel before understanding the subject. Lesson imagery and covers should express the subject; schematic figures are appropriate selectively, not the catalog's default identity.

At meaningful points, pause for the learner to inspect or continue. Do not require a click for every sentence and do not advance while the learner is interacting. Future decision scenes state their assumptions and distinguish modeled consequences from documented outcomes; historical decisions also explain what people could know at the time.

## Questions and detours

Answer ordinary follow-up questions in the current story without making the learner wait for a full new creation. Keep a follow-up anchored to the scene, story, and relevant subject context. Offer a short contextual detour or a separate new story when the learner chooses a broader inquiry. Keep the original story intact.

## Narration and sound

Sound is a substantial part of the intended experience. Optional off-screen narration should coordinate with concise visible text, visuals and synchronized subtitles. A sound experiment uses deliberate listening; mathematical or technical work need not adopt a cinematic trailer treatment. Provide a complete reading view with the same explanation; no essential fact is audio-only. Let learners switch between Listen and Read at the same chapter/beat.

Provide master mute and separate narration, music, and environment/effects controls, plus pause/replay. Remember preferences. Start sound only after a deliberate action. Keep the scene stable during interaction, and make playback controls reachable without obscuring the artwork. A strong default narrator is expected; voice choice and production details remain open.

## Art direction and factual precision

Art direction may vary substantially between stories while navigation and controls remain recognizable. Visuals should feel composed with the story, not like generic interchangeable cards.

Keep subject information trustworthy. Equations, units, parameters, labels, connections, dates and geographic features must match their supporting model or evidence. State the assumptions and scope of simplified simulations. Distinguish documented fact, interpretation, reconstruction, and hypothetical material. The production method is an implementation question.

Concept images in `docs/visuals/` show possible compositions, not final layouts or verified subject illustrations. User-provided screenshots in `visuals/references/` are the design ambition, not source material for factual claims.

## Mobile and access

Accepted on 2026-11-23: ordinary desktop playback should fit a complete scene, its active reading and navigation into the viewport without page scrolling. Compose/paginate content to fit rather than shrinking text, clipping paragraphs or reducing the explanation. Small windows, enlarged text and accessibility settings can use natural flow; mobile also permits natural reading flow. The current renderer uses a bounded desktop frame with a scrollable reading pane. Whole-screen reading fit remains an acceptance check; source checks do not establish it. Mobile, short-window and enlarged-text flow are implemented strategies awaiting rendered verification.

Design mobile-first: one focused scene, readable text, touch-friendly controls, and dismissible panels for details, questions, and chapters. Let complex maps/documents open for closer inspection. Wider screens can expand the composition; do not shrink desktop mockups into phone layouts.

First-release accessibility direction: keyboard navigation, screen-reader labels, scalable text, strong contrast, captions/transcripts, reduced motion, and text descriptions for maps/diagrams. Important meaning must not depend on color, animation, or sound alone. Honor device motion preferences and offer lower-intensity alternatives for distressing visuals where practical.

## Sources and difficult material

Put readable sources at the end, grouped by chapter or question. Identify author/institution, source type, what each source supports, and a relevant passage/link where available. Mark primary sources and separate asset credits from support for substantive claims. Keep citations out of the main artwork. Distinguish “generated with sources” from actual human review; sources and ratings alone are not fact-checking.

Address sensitive, traumatic or contested subjects with relevant context and perspectives. Do not hide a subject or important evidence; do not make suffering spectacle. When a story includes distressing material, show a concise context note before playback and offer text/lower-intensity presentation where practical.

When a request lacks enough scope or usable evidence, briefly explain the limitation and offer a narrowing question or nearby useful angle. If a section fails to prepare, identify it and offer retry while preserving usable sections and the learner's place; do not present an incomplete story as complete.
