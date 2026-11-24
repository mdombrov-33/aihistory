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
    <main
      id="main-content"
      className="screen-gallery page-width py-14 mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <header className="gallery-intro max-w-[850px] mb-9 [&_h1]:text-[clamp(34px,_5vw,_64px)] [&_h1]:leading-[1.05] [&_h1]:mb-5 [&_p]:text-[20px] [&_p]:text-muted-foreground [&_p]:leading-[1.6]">
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
