// Source-backed image studies and the single native 3D homepage exhibit.

import type { ModelAsset } from "@/features/lesson/contracts/model-asset";
import type { EvidenceStudyData } from "@/features/lesson/media/evidence-types";

export const redFujiStudy: EvidenceStudyData = {
  image: "/images/showcase/great-wave/red-fuji.jpg",
  alt: "Hokusai’s Red Fuji woodblock print, with a red-brown mountain, pale horizontal clouds and dark trees at its foot.",
  width: 1200,
  height: 827,
  title: "One mountain. A whole way of seeing.",
  credit: "Hokusai · South Wind, Clear Sky · ca. 1830–32 · The Met, JP9 · CC0",
  record: "https://www.metmuseum.org/art/collection/search/36490",
  details: [
    {
      id: "mountain",
      label: "The mountain",
      x: 72,
      y: 43,
      crop: [650, 150, 450, 400],
      title: "A mountain that fills the view.",
      explanation:
        "Trace the long diagonal edge and the pale marks near the summit. The mountain holds most of the composition, while the smaller repeated forms give it scale.",
    },
    {
      id: "clouds",
      label: "The clouds",
      x: 28,
      y: 30,
      crop: [120, 80, 500, 350],
      title: "A different rhythm in the sky.",
      explanation:
        "The pale horizontal cloud bands repeat across the blue. Compare their short, level shapes with the mountain’s long slope.",
    },
    {
      id: "trees",
      label: "The trees",
      x: 43,
      y: 80,
      crop: [250, 450, 500, 350],
      title: "Small marks, a large landscape.",
      explanation:
        "Look at the repeated dark tree shapes along the base. Their changing density gives the foot of the mountain a different texture from the open sky.",
    },
  ],
};

export const moonModel: ModelAsset = {
  id: "nasa-moon",
  title: "The Moon, from another angle",
  institution: "NASA’s Goddard Space Flight Center",
  model: "/models/moon.glb",
  poster: "/images/home/moon-poster.jpg",
  record: "https://svs.gsfc.nasa.gov/14959/",
  license: "NASA media usage guidelines; credit retained",
  description:
    "Turn a model of the Moon using imagery from NASA’s Lunar Reconnaissance Orbiter. This version wraps a color map onto a sphere; it does not model surface topography.",
  context:
    "Viewer lighting is illustrative, not a simulation of the Moon’s current phase. Camera presets are relative inspection angles, not claims of a geographic orientation.",
  views: [
    {
      label: "First view",
      yaw: 0,
      pitch: 75,
      distance: 105,
      explanation:
        "Start with one view of the lunar surface. Drag to turn the model, or open the camera controls.",
    },
    {
      label: "Turn it around",
      yaw: 180,
      pitch: 75,
      distance: 105,
      explanation:
        "Compare the patterns on the opposite side of the model. You can keep turning and zooming at your own pace.",
    },
    {
      label: "Look closer",
      yaw: 45,
      pitch: 65,
      distance: 70,
      explanation:
        "Inspect the light and dark surface patterns. This is a color map wrapped on a sphere, rather than raised terrain.",
    },
  ],
};
