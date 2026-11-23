"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { compositions } from "@/story/compositions";
import { SceneStage, type SceneAssetSize } from "./scene-stage";
import type { SceneBeat } from "./scene-schema";
import type { ModelAsset } from "@/story/model-asset";
import type { LessonScene, Source } from "@/content/lessons";
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
      <div className="gallery-selector" aria-label="Screen compositions">
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
      <section className="gallery-description" aria-live="polite">
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
      <div className="scene-player gallery-scene">
        <SceneStage
          key={e.beat.id}
          {...e}
          audio={null}
          onInspect={() => {}}
          reading={
            <section className="scene-reading">
              <div className="scene-reading-tools">
                <span>{e.story}</span>
              </div>
              <h1>{e.beat.title}</h1>
              <div className="scene-passages">
                {e.scene.text.slice(e.beat.passageStart, e.beat.passageEnd + 1).map((text) => (
                  <div className="passage" key={text}>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>
          }
        />
      </div>
      <p className="gallery-footnote">
        The examples are authored JSON. Live lesson generation is not connected. A valid composition
        still needs subject accuracy, interaction and visual review.
      </p>
    </>
  );
}
