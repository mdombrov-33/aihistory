export type EvidenceStudyData = {
  image: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  credit: string;
  record: string;
  details: {
    id: string;
    label: string;
    x: number;
    y: number;
    crop: [number, number, number, number];
    title: string;
    explanation: string;
  }[];
};

// The Met's public-domain scan and collection commentary, object JP1847.
// Positions and detail crops refer to the original image coordinate system.
export const greatWaveStudy: EvidenceStudyData = {
  image: "/images/archive/great-wave.jpg",
  alt: "Hokusai’s woodblock print: a curling blue wave above three boats, with Mount Fuji in the distance.",
  width: 1200,
  height: 807,
  title: "Look beyond the wave.",
  credit: "Hokusai · The Great Wave · ca. 1830–32 · The Met, JP1847",
  record: "https://www.metmuseum.org/art/collection/search/45434",
  details: [
    {
      id: "boats",
      label: "The people",
      x: 75,
      y: 87,
      crop: [710, 580, 330, 220],
      title: "People, not just scenery.",
      explanation:
        "Look into the boats: small figures bend beneath the wave. Compare their scale with the water around them. The human presence is easy to miss when the wave takes all your attention.",
    },
    {
      id: "fuji",
      label: "Mount Fuji",
      x: 64,
      y: 67,
      crop: [600, 430, 330, 220],
      title: "A mountain made small.",
      explanation:
        "The triangle in the distance is Mount Fuji. Hokusai places it inside the hollow of the wave, playing with perspective so the mountain appears small beside the water close to us.",
    },
    {
      id: "blue",
      label: "The blue palette",
      x: 35,
      y: 32,
      crop: [255, 140, 330, 220],
      title: "Color has a history, too.",
      explanation:
        "The Met describes Hokusai’s landscape palette of indigo and imported Prussian blue. Compare the dark outlines with the lighter areas. A material choice can lead into a wider story of exchange.",
    },
  ],
};
