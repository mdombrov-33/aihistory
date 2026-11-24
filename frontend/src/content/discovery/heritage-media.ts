// Credited local media selections used by discovery and source presentation.
// The homepage demonstration uses this reviewed collection record.
// Lesson-specific models and camera views are registered in prepared bundles.
export const museumObjects = {
  telegraph: {
    title: "A message begins with a movement",
    institution: "Smithsonian · National Museum of American History",
    model: "/models/telegraph.glb",
    record:
      "https://3d.si.edu/object/3d/morse-vail-telegraph-key:ed99f44d-3c60-4111-b666-e2908e1b64ef",
    poster: "/images/objects/telegraph.jpg",
    description:
      "Turn the Morse–Vail telegraph key, made in 1844. Inspect the small physical instrument behind a much larger communication network.",
    context:
      "An early land-line instrument, shown for comparison. This is not an instrument identified as having operated the Atlantic cable.",
    prompts: [
      {
        title: "An operator makes a signal",
        text: "The key belongs to a practical system for sending coded electrical signals. Communication needs a person who can encode a message as well as a connection that can carry it.",
      },
      {
        title: "A key is not the whole network",
        text: "This earlier land-line key introduces the physical act of signalling. Submarine cables presented additional problems of insulation, testing and interpreting signals over long distances.",
      },
    ],
  },
} as const;

export type MuseumObjectId = keyof typeof museumObjects;
