// Server route for screen-gallery; composes prepared data and feature views.

import { preparedStories } from "@/content/lessons/registry";
import { compositionIds } from "@/features/lesson/contracts/compositions";
import { ScreenGallery } from "@/features/lesson/scenes/screen-gallery";

export const metadata = { title: "Screen gallery" };

export default function GalleryPage() {
  const examples = compositionIds.map((id) => {
    for (const bundle of preparedStories)
      for (const [index, program] of bundle.programs.entries()) {
        const beat = program.beats.find((b) => b.composition === id);

        if (beat)
          return {
            beat,
            story: bundle.summary.title,
            slug: bundle.summary.slug,
            index,
            scene: bundle.lesson.scenes[index],
            assets: bundle.assets,
            models: bundle.models,
            sources: bundle.lesson.sources,
          };
      }

    throw new Error("Composition needs an actual example: " + id);
  });

  return (
    <main id="main-content" className="screen-gallery page-width">
      <header className="gallery-intro">
        <h1>A story has more than one shape.</h1>
        <p>
          {compositionIds.length} reusable compositions. Each example below is a real screen from a
          prepared lesson, using the same renderer you meet inside it.
        </p>
      </header>
      <ScreenGallery examples={examples} />
    </main>
  );
}
