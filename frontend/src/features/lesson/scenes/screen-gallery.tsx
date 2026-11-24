"use client";

// Renders one real prepared example of each supported composition for inspection.

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { compositions } from "@/features/lesson/contracts/compositions";
import { SceneStage } from "./scene-stage";
import type { SceneAssetSize } from "./scene-types";
import type { SceneBeat } from "../contracts/scene";
import type { ModelAsset } from "@/features/lesson/contracts/model-asset";
import type { LessonScene, Source } from "@/features/lesson/contracts/lesson";

type Example = {
  beat: SceneBeat;
  story: string;
  slug: string;
  index: number;
  scene: LessonScene;
  assets: SceneAssetSize[];
  models: ModelAsset[];
  sources: Source[];
};

export function ScreenGallery({ examples }: { examples: Example[] }) {
  const [selected, setSelected] = useState(0);
  const e = examples[selected];
  const definition = compositions[e.beat.composition];

  return (
    <>
      <div
        className="gallery-selector py-5 gap-2 flex flex-wrap [border-block:1px_solid_var(--border)] [&_button]:py-2.5 [&_button]:px-3.5 [&_button]:min-h-11 [&_button]:rounded-[6px] [&_button]:bg-secondary [&_button]:text-foreground [&_button]:text-[15px]"
        aria-label="Screen compositions"
      >
        {examples.map((example, i) => (
          <button
            key={example.beat.composition}
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            {compositions[example.beat.composition].name}
          </button>
        ))}
      </div>
      <section
        className="gallery-description [&_h2]:text-[30px] [&_h2]:mb-3 [&_p]:max-w-[75ch] [&_p]:text-[17px] [&_p]:leading-[1.6] [&_svg]:w-4.5"
        aria-live="polite"
      >
        <div>
          <h2>{definition.name}</h2>
          <p>{definition.purpose}</p>
          <p className="gallery-requirement">{definition.requirement}</p>
        </div>
        <Link href={`/stories/${e.slug}/play/${e.index}?passage=${e.beat.passageStart}`}>
          Open in {e.story}
          <ArrowUpRight />
        </Link>
      </section>
      <div className="scene-player gallery-scene [&_button]:[-webkit-tap-highlight-color:transparent] [&_button]:min-w-11 [&_button]:min-h-11 [&_a]:[-webkit-tap-highlight-color:transparent] [&_svg]:shrink-0">
        <SceneStage
          key={e.beat.id}
          {...e}
          audio={null}
          onInspect={() => {}}
          reading={
            <section className="scene-reading">
              <div className="scene-reading-tools mx-0 gap-4 flex items-center mt-[-9px] mb-1 min-h-[35px] text-muted-foreground text-[12px] max-[760px]:gap-3 max-[760px]:-mt-2 [&_>_span]:mr-auto [&_>_span]:tabular-nums [&_button]:gap-1.5 [&_button]:inline-flex [&_button]:items-center [&_button]:text-[12px] [&_button]:min-h-9">
                <span>{e.story}</span>
              </div>
              <h1>{e.beat.title}</h1>
              <div className="scene-passages">
                {e.scene.text.slice(e.beat.passageStart, e.beat.passageEnd + 1).map((text) => (
                  <div
                    className="passage py-4.5 px-0 [scroll-margin-top:30px] relative max-[760px]:py-[17px] [&_p]:text-[20px] [&_p]:leading-[1.8] max-[760px]:[&_p]:text-[19px]"
                    key={text}
                  >
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>
          }
        />
      </div>
      <p className="gallery-footnote text-[14px] mt-5 text-muted-foreground">
        The examples are authored JSON. Live lesson generation is not connected. A valid composition
        still needs subject accuracy, interaction and visual review.
      </p>
    </>
  );
}
