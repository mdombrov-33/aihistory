"use client";

// Editable outline and deterministic preparation/recovery states without provider calls.

import { formText } from "@/lib/forms";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Circle, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJourney, updateJourney } from "@/state/guest/store";
import { getStory, stories } from "@/content/catalog/catalog";
import { initialOutline, normalizeOutline } from "./creation-plan";
import { PreviewNote } from "@/components/app/feature-page";
import { SharingControls } from "@/features/discovery/sharing-controls";

type Stage = "outline" | "preparing" | "opening" | "ready" | "failed";

export function CreationStatus({ id, share }: { id: string; share?: string }) {
  const { creations, product } = useJourney();
  const creation = creations.find((c) => c.id === id);
  const [sharing, setSharing] = useState(false);

  if (!creation)
    return (
      <section className="max-w-[600px] py-8">
        <h2 className="text-3xl">That question isn’t on this device.</h2>
        <p className="mt-4 text-muted-foreground">
          Saved questions belong to this browser. Start another question or return to your library.
        </p>
        <Button asChild className="mt-6">
          <Link href="/create">
            Start a question
            <ArrowRight />
          </Link>
        </Button>
      </section>
    );

  if (
    share !== undefined &&
    (product.sharing[id]?.token !== share || product.sharing[id]?.visibility !== "link")
  )
    return (
      <section className="max-w-[600px] py-8">
        <h2 className="text-3xl">This preview link is no longer available.</h2>
        <p className="mt-4 text-muted-foreground">
          The local link was revoked or replaced. Open your saved question from My space.
        </p>
        <Button asChild className="mt-5">
          <Link href="/my-space?view=requests">Back to My space</Link>
        </Button>
      </section>
    );

  const stage = creation.previewStage;
  const outline = creation.outline.length ? creation.outline : initialOutline;

  const sample =
    getStory(creation.sampleSlug ?? "") ??
    stories.find((s) => s.topic === product.interests[0]) ??
    stories[0];

  function setStage(value: Stage) {
    updateJourney((s) => ({
      ...s,
      creations: s.creations.map((c) =>
        c.id === id
          ? { ...c, previewStage: value, status: value === "ready" ? "ready" : "preparing" }
          : c,
      ),
    }));
  }

  const ready = stage === "ready" || stage === "opening";

  return (
    <div className="grid items-start gap-10 pb-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,.8fr)]">
      <section className="min-w-0">
        <h2 className="break-words text-3xl">{creation.question}</h2>
        <p className="mt-3 break-words text-base text-muted-foreground">{creation.scope}</p>
        {stage === "outline" ? (
          <form
            className="mt-7 grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();

              const data = new FormData(e.currentTarget);

              const next = normalizeOutline(outline.map((_, i) => formText(data, "chapter-" + i)));

              if (next.length !== outline.length) return;

              updateJourney((s) => ({
                ...s,
                creations: s.creations.map((c) =>
                  c.id === id ? { ...c, outline: next, previewStage: "preparing" } : c,
                ),
              }));
            }}
          >
            <div>
              <h3 className="font-heading text-2xl">Give the question a shape.</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This editable outline is a planning template, not a researched lesson. Change the
                chapter titles or continue to explore preparation.
              </p>
            </div>
            {outline.map((title, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={`chapter-${index}`}>Chapter {index + 1}</Label>
                <Input
                  id={`chapter-${index}`}
                  name={`chapter-${index}`}
                  required
                  maxLength={140}
                  defaultValue={title}
                />
              </div>
            ))}
            <Button className="justify-self-start">
              Try preparation preview
              <ArrowRight />
            </Button>
          </form>
        ) : (
          <section className="mt-7" aria-live="polite">
            <h3 className="font-heading text-2xl">
              {stage === "failed"
                ? "This part needs another try."
                : stage === "ready"
                  ? "A complete result, in preview."
                  : stage === "opening"
                    ? "The opening is ready to explore."
                    : "From question to explanation."}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {stage === "failed"
                ? "The sample media stage could not complete. Your outline and saved question are preserved. A retry continues from this point."
                : ready
                  ? "This is a sample delivery state. Open an existing library lesson to see how a ready chapter works; no new lesson has been generated."
                  : "Preparation will show meaningful milestones instead of an invented percentage. You can leave this page and return from My space."}
            </p>
            <ol className="mt-5 grid gap-0 border-t border-rule">
              {[
                "Research and evidence",
                "Chapter design",
                "Media and narration",
                "Delivery checks",
              ].map((item, index) => {
                const done =
                  stage === "ready" || (ready && index < 2) || (stage === "failed" && index < 2);

                return (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-rule py-4 text-sm"
                  >
                    {done ? (
                      <Check className="size-4 text-primary" aria-label="Complete in preview" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span>{item}</span>
                    {stage === "failed" && index === 2 ? (
                      <span className="ml-auto text-muted-foreground">Needs retry</span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              {stage === "preparing" ? (
                <Button onClick={() => setStage("opening")}>
                  Preview opening ready
                  <ArrowRight />
                </Button>
              ) : stage === "opening" ? (
                <Button onClick={() => setStage("ready")}>
                  Preview complete delivery
                  <ArrowRight />
                </Button>
              ) : stage === "failed" ? (
                <Button onClick={() => setStage("preparing")}>
                  <RotateCcw />
                  Retry preparation preview
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/guide">
                    Plan your next step
                    <ArrowRight />
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={() => setStage("outline")}>
                Edit outline
              </Button>
            </div>
          </section>
        )}
        <details className="mt-7 border-y border-rule py-4">
          <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">
            Explore preparation states
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["outline", "preparing", "opening", "ready", "failed"] as const).map((value) => (
              <Button
                key={value}
                variant="outline"
                aria-pressed={stage === value}
                onClick={() => setStage(value)}
              >
                {value === "opening"
                  ? "Opening ready"
                  : value === "failed"
                    ? "Recoverable error"
                    : value.charAt(0).toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </details>
        <PreviewNote>
          Saved on this device. No job is running and no allowance or payment is consumed.
          Preparation states are interactive examples.
        </PreviewNote>
      </section>
      <aside className="min-w-0">
        <section className="rounded-2xl border border-rule bg-card p-5">
          <h2 className="text-2xl">Before you begin</h2>
          <dl className="mt-5 grid gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Length</dt>
              <dd className="mt-1">A focused introduction · final length follows the outline</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Creation allowance</dt>
              <dd className="mt-1">No allowance is used in this preview</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Visibility</dt>
              <dd className="mt-1">
                {product.sharing[id]?.visibility ?? "Private"} · local preview
              </dd>
            </div>
          </dl>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/account/membership">View membership & usage</Link>
          </Button>
        </section>
        <section className="mt-7">
          <h2 className="text-2xl">An example you can open</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {sample.title} is an existing library lesson, separate from your question.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href={`/stories/${sample.slug}/play/0`}>
              Open example chapter
              <ArrowRight />
            </Link>
          </Button>
        </section>
        <Button className="mt-6" variant="ghost" onClick={() => setSharing(!sharing)}>
          <Share2 />
          Sharing & publication
        </Button>
        {sharing ? <SharingControls id={id} ready={stage === "ready"} /> : null}
        <Link
          href="/my-space?view=requests"
          className="mt-4 flex min-h-11 items-center text-sm text-primary"
        >
          Back to saved questions
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </aside>
    </div>
  );
}
