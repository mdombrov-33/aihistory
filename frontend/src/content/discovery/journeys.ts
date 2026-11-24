// Approximate city centers for comparing geography on the homepage map.

export type MapJourney = {
  id: string;
  from: { name: string; coordinates: [number, number] };
  to: { name: string; coordinates: [number, number] };
  title: string;
  explanation: string;
};

export const mapJourneys: readonly MapJourney[] = [
  {
    id: "atlantic",
    from: { name: "New York", coordinates: [-74.006, 40.7128] },
    to: { name: "London", coordinates: [-0.1276, 51.5072] },
    title: "Across the North Atlantic.",
    explanation:
      "Follow the arc from the east coast of North America to western Europe. The shortest path on a sphere appears curved when we flatten the Earth into this map.",
  },
  {
    id: "pacific",
    from: { name: "San Francisco", coordinates: [-122.4194, 37.7749] },
    to: { name: "Tokyo", coordinates: [139.6917, 35.6895] },
    title: "One ocean, on both sides of the map.",
    explanation:
      "The connection continues across the left and right edges. Those edges meet on Earth: Tokyo and San Francisco face the same Pacific Ocean.",
  },
  {
    id: "indian",
    from: { name: "Cape Town", coordinates: [18.4241, -33.9249] },
    to: { name: "Singapore", coordinates: [103.8198, 1.3521] },
    title: "From southern Africa to Southeast Asia.",
    explanation:
      "Trace the connection across the Indian Ocean. Compare its position and length with the North Atlantic connection: a different pair of cities brings a different part of the world into view.",
  },
];
