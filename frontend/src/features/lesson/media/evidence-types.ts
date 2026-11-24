// Reusable source-image and detail-region input for an evidence exhibit.
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
