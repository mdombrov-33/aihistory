// Registry of supported teaching presets, their spatial layouts and required inputs.
export const compositionIds = [
  "layer-reveal",
  "assembly-motion",
  "cinematic-opening",
  "panorama-explore",
  "image-story",
  "portrait-study",
  "detail-study",
  "document-desk",
  "quotation-focus",
  "source-dialogue",
  "comparison-gallery",
  "map-overview",
  "map-route",
  "map-change",
  "timeline-gallery",
  "chronology-ribbon",
  "process-workbench",
  "object-gallery",
  "object-guided",
  "synthesis-board",
  "process-traveler",
  "construction-bench",
  "assembly-explorer",
  "experiment-bench",
  "sound-studio",
  "system-workbench",
] as const;

export type CompositionId = (typeof compositionIds)[number];

type Definition = {
  name: string;
  purpose: string;
  families: readonly string[];
  layout: "split" | "portrait" | "focus" | "map" | "process" | "object" | "summary";
  framing: "cover" | "contain";
  requirement: string;
};

export const compositions: Record<CompositionId, Definition> = {
  "layer-reveal": {
    name: "Reveal a visual guide",
    purpose: "Uncover an editorial layer while keeping the original artwork in place.",
    families: ["illustrated"],
    layout: "split",
    framing: "cover",
    requirement:
      "A registered source image, bounded source-coordinate guide marks and an explicit editorial description.",
  },
  "assembly-motion": {
    name: "Watch the object work",
    purpose: "Play or scrub one named-part movement in a supplied schematic.",
    families: ["assembly"],
    layout: "split",
    framing: "contain",
    requirement:
      "Named geometry, validated transform tracks, a duration and concise phase descriptions.",
  },
  "process-traveler": {
    name: "Travel through a process",
    purpose: "Inspect a moving entity and reconstruct each state change.",
    families: ["traveler"],
    layout: "split",
    framing: "contain",
    requirement:
      "Registered transition model, bounded inputs, named routes and local checkpoint feedback.",
  },
  "construction-bench": {
    name: "Build and test",
    purpose: "Connect supplied components and test their behavior against a goal.",
    families: ["construction"],
    layout: "split",
    framing: "contain",
    requirement:
      "Bounded components, typed ports, a complete target truth table and explicit draft diagnostics.",
  },
  "assembly-explorer": {
    name: "Take it apart",
    purpose: "Explore the parts and their relationship to a whole.",
    families: ["assembly"],
    layout: "split",
    framing: "contain",
    requirement: "Named schematic geometry, separation vectors and an explanation for each part.",
  },
  "experiment-bench": {
    name: "Change and observe",
    purpose: "Explore a mathematical model by changing its inputs.",
    families: ["experiment"],
    layout: "split",
    framing: "contain",
    requirement: "A supported model, bounded parameters, sources and explicit assumptions.",
  },
  "sound-studio": {
    name: "Shape a sound",
    purpose: "Connect a visible waveform with a deliberately activated sound.",
    families: ["sound"],
    layout: "split",
    framing: "contain",
    requirement:
      "A fundamental, four bounded harmonics and explained presets; hearing is optional.",
  },
  "system-workbench": {
    name: "Follow the signal",
    purpose: "Change inputs and inspect a connected logical system.",
    families: ["system"],
    layout: "split",
    framing: "contain",
    requirement:
      "A small validated acyclic graph with supported gates, inputs and explanatory nodes.",
  },
  "cinematic-opening": {
    name: "Cinematic opening",
    purpose: "Enter a setting through one strong image and a focused question.",
    families: ["illustrated", "photograph"],
    layout: "split",
    framing: "cover",
    requirement:
      "Landscape artwork or photograph. Text stays beside the source so meaningful artwork remains visible.",
  },
  "panorama-explore": {
    name: "Explore a place",
    purpose: "Discover how spatial details relate to the story.",
    families: ["place"],
    layout: "split",
    framing: "cover",
    requirement: "A wide source with at least two accurately placed inspection points.",
  },
  "image-story": {
    name: "Image and narrative",
    purpose: "Connect a substantial narrative with a visual that supports it.",
    families: ["illustrated", "photograph"],
    layout: "split",
    framing: "cover",
    requirement:
      "A strong image with an intentional focal point; the full source stays inspectable.",
  },
  "portrait-study": {
    name: "Portrait exhibit",
    purpose: "Examine a tall object or portrait without a giant empty landscape frame.",
    families: ["evidence", "photograph"],
    layout: "portrait",
    framing: "cover",
    requirement: "A portrait-oriented source, its identity, date and limits.",
  },
  "detail-study": {
    name: "Guided close looking",
    purpose: "Move from an original to meaningful magnified details.",
    families: ["illustrated", "place"],
    layout: "split",
    framing: "cover",
    requirement: "Inspection points with explicit crop regions in the real image.",
  },
  "document-desk": {
    name: "Document desk",
    purpose: "Read the material source alongside interpretation and context.",
    families: ["evidence"],
    layout: "portrait",
    framing: "contain",
    requirement: "A legible source image and its collection record; no invented text.",
  },
  "quotation-focus": {
    name: "A source speaks",
    purpose: "Pause over a short, attributed primary-source passage.",
    families: ["evidence"],
    layout: "focus",
    framing: "contain",
    requirement:
      "An accurately transcribed quotation, attribution and interpretive limit; an image is optional.",
  },
  "source-dialogue": {
    name: "Two sources in conversation",
    purpose: "Switch between two distinct sources and compare their views or functions.",
    families: ["comparison"],
    layout: "split",
    framing: "cover",
    requirement:
      "Two independently identified sources with a meaningful comparison; a large switcher and whole-source inspection remain available.",
  },
  "comparison-gallery": {
    name: "Comparison gallery",
    purpose: "Switch between large visual sources without implying an invented before/after.",
    families: ["comparison"],
    layout: "split",
    framing: "cover",
    requirement:
      "Two images, their actual dates and an explicit comparison question; switch sources instead of shrinking both.",
  },
  "map-overview": {
    name: "Geographic overview",
    purpose: "Locate people or events before explaining their relationships.",
    families: ["atlas"],
    layout: "map",
    framing: "contain",
    requirement:
      "Verified approximate coordinates and a scale appropriate to the available geography.",
  },
  "map-route": {
    name: "Trace a connection",
    purpose: "Follow a documented or clearly schematic connection in stages.",
    families: ["atlas"],
    layout: "map",
    framing: "contain",
    requirement: "Ordered locations and an explicit statement of what the line represents.",
  },
  "map-change": {
    name: "A changing network",
    purpose: "Compare geographically grounded states over time.",
    families: ["atlas"],
    layout: "map",
    framing: "contain",
    requirement:
      "At least two named states with evidence and valid location references; no invented borders.",
  },
  "timeline-gallery": {
    name: "Timeline gallery",
    purpose: "Explore dated objects or events with changing, correctly credited media.",
    families: ["timeline"],
    layout: "split",
    framing: "cover",
    requirement: "Different dated images; dates identify objects or events explicitly.",
  },
  "chronology-ribbon": {
    name: "Chronology without filler",
    purpose: "Understand an order or a gap without making up an image for every date.",
    families: ["timeline"],
    layout: "process",
    framing: "contain",
    requirement: "At least two qualified dates and event explanations. Images are optional.",
  },
  "process-workbench": {
    name: "Process workbench",
    purpose: "Investigate connected stages and what changes at each one.",
    families: ["journey"],
    layout: "process",
    framing: "contain",
    requirement:
      "An evidence-grounded sequence; selecting a step must reveal a specific operation.",
  },
  "object-gallery": {
    name: "Object in the round",
    purpose: "Meet an actual three-dimensional artifact and inspect its form.",
    families: ["object"],
    layout: "object",
    framing: "contain",
    requirement:
      "A registered, licensed local model with source context and usable fallback poster.",
  },
  "object-guided": {
    name: "Guided object inspection",
    purpose: "Connect a physical feature to its historical function.",
    families: ["object"],
    layout: "split",
    framing: "contain",
    requirement: "At least two authored camera views and explanations that match visible features.",
  },
  "synthesis-board": {
    name: "Connect the explanation",
    purpose: "Bring several ideas together and return to the lesson’s question.",
    families: ["journey"],
    layout: "summary",
    framing: "contain",
    requirement: "A small set of concrete conclusions, each developed earlier in the lesson.",
  },
};
