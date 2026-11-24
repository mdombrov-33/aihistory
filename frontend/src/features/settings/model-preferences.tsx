"use client";

// Supported task preferences are local configuration previews, never raw provider credentials.

import { useJourney, updateJourney } from "@/state/guest/store";
import type { ProductState } from "@/state/guest/product";
import { Label } from "@/components/ui/label";
import { PreviewNote } from "@/components/app/feature-page";

const choices = {
  writing: [
    ["default", "App recommendation"],
    ["openai", "OpenAI · writing and explanations"],
    ["openrouter", "OpenRouter · supported text models"],
  ],
  imagery: [
    ["default", "App recommendation"],
    ["openai", "OpenAI · illustrations"],
  ],
  narration: [
    ["default", "App recommendation"],
    ["gemini", "Gemini · narration"],
  ],
} as const;

export function ModelPreferences() {
  const { product } = useJourney();

  return (
    <section className="mt-9 border-t border-rule pt-7" id="generation-preferences">
      <h2 className="text-2xl">Generation preferences</h2>
      <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-muted-foreground">
        Use the app’s recommendations or choose a supported provider by task. Your choice never
        enables paid work or changes an allowance.
      </p>
      <div className="mt-5 grid max-w-[640px] gap-5">
        {(["writing", "imagery", "narration"] as const).map((task) => (
          <div key={task} className="grid gap-2">
            <Label htmlFor={`model-${task}`}>
              {task === "writing"
                ? "Research & writing"
                : task === "imagery"
                  ? "Illustrations"
                  : "Narration"}
            </Label>
            <select
              id={`model-${task}`}
              value={product.models[task]}
              onChange={(e) => {
                const value = e.target.value;

                updateJourney((s) => ({
                  ...s,
                  product: {
                    ...s.product,
                    models: { ...s.product.models, [task]: value } as ProductState["models"],
                  },
                }));
              }}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
            >
              {choices[task].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <PreviewNote>
        Preferences are stored locally. Available model IDs and account access will be checked when
        generation is connected. Provider credentials are never entered here.
      </PreviewNote>
    </section>
  );
}
