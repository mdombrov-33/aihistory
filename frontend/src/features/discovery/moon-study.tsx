"use client";

// Sourced lunar model in the existing native viewer, with small relative camera presets.

import { useState } from "react";
import { Rotate3D } from "lucide-react";
import { MuseumObject } from "@/features/lesson/media/museum-object";
import { moonModel } from "@/content/discovery/home-studies";

export function MoonStudy() {
  const [view, setView] = useState(0);

  return (
    <section
      id="moon-showcase"
      className="grid scroll-mt-7 items-center gap-8 py-16 sm:gap-12 sm:py-24 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.45fr)]"
      aria-labelledby="moon-title"
    >
      <div className="min-w-0">
        <h2 id="moon-title" className="max-w-[14ch] text-[clamp(32px,3.5vw,54px)] leading-[1.08]">
          There’s always another side to a question.
        </h2>
        <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
          Turn the Moon in your hands. Look for the patterns you wouldn’t notice from a single
          picture.
        </p>
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Moon viewpoints">
          {moonModel.views.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setView(i)}
              aria-pressed={view === i}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-foreground hover:bg-muted aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            >
              {i === 1 ? <Rotate3D className="size-4" aria-hidden="true" /> : null}
              {item.label}
            </button>
          ))}
        </div>
        <p
          className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted-foreground"
          aria-live="polite"
        >
          {moonModel.views[view].explanation}
        </p>
        <p className="mt-6 max-w-[46ch] text-xs leading-relaxed text-muted-foreground">
          NASA lunar imagery on a sphere. Surface relief and the Moon’s current phase are not
          simulated.
        </p>
      </div>
      <div className="h-[420px] min-w-0 overflow-hidden rounded-2xl border border-rule bg-background sm:h-[520px] lg:h-[590px]">
        <MuseumObject model={moonModel} view={moonModel.views[view]} />
      </div>
    </section>
  );
}
