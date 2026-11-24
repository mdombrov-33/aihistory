// Navigation data passed from the server route to the player controls.
export type StoryNavigation = {
  index: number;
  chapter: number;
  title: string;
  screens: { title: string; passage: number }[];
}[];
