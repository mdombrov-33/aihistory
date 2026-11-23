# Interactive History — Working Glossary

Shared language for the product. The name and some learner-facing terms are provisional; see [`docs/product/open-questions.md`](docs/product/open-questions.md).

## Language

**Learner**:
The person exploring historical material to develop their own understanding. The initial primary learner is a curious adult with little prior knowledge of the requested subject.

**Experience**:
A temporary internal term for a coherent interactive story about a historical question or subject, combining explanation, visuals, interactions, and supporting evidence. The public-facing noun is undecided.
_Avoid_: Generated website

**Library**:
A discoverable collection of existing historical experiences that learners can explore and revisit.
_Avoid_: Cache

**Scene**:
A coherent part of an experience organized around an explanatory purpose, combining historical content with visual elements and meaningful interactions.

**Chapter**:
A narrative section of an experience that develops one part of its central historical question.

**Beat**:
A stage of explanation or exploration within a scene. In the prepared frontend, a beat is one navigable screen covering one or more contiguous narrative paragraphs; it selects a family, composition and media/interaction data. It is not automatically one paragraph.

**Claim**:
A substantive assertion about history whose supporting evidence can be inspected. A claim may express a historical fact or an interpretation.

**Story**:
The preferred provisional learner-facing word for a guided historical journey. Use “lesson” where it reads more naturally; neither term is a final brand decision.

**Personal history guide**:
The proposed account-based space that connects a learner's chosen interests, bookmarks, stories, and optional trails over time. Exact features and Premium boundaries remain open.

**Story version**:
An identifiable content revision used by evidence records, playback, bookmarks, and progress. It is separate from the schema version that describes the data format.

**Narration passage**:
A short scripted audio unit with matching subtitles and a stable identifier. Its full text also supports reading mode.

**Evidence passage**:
Retained source text with provenance that can support a historical claim. This is distinct from narration or a generated summary.

**Blueprint**:
The shared internal historical, narrative, and creative plan used to compose a story's chapters.

**Content family**:
The structured data/interaction kind understood by the renderer. Nine are implemented: illustrated, place, atlas, evidence, comparison, timeline, journey, object and photograph. This is distinct from a spatial layout or teaching preset.

**Composition / teaching preset**:
A named teaching task with supported families, framing and input requirements. The 18 registry entries use a smaller set of shared responsive layouts; they do not authorize generated JSX/CSS.

**Prepared bundle**:
The complete version-2 JSON input used by the current frontend: story summary, chapters/narratives, sources, registered assets/models and beat programs. Structural validity does not prove factual accuracy or production readiness. It is distinct from a future persisted story version or prepared workflow execution.

**Prepared workflow mode**:
The planned provider-free production workflow path using saved task inputs/outputs through real persistence and recovery. Current bundled frontend content does not imply this worker exists.
