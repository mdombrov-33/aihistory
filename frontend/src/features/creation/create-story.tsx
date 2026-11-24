"use client";

// Focused question entry, optional scope and related prepared lessons; saves locally without starting a job.

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { stories } from "@/content/catalog/catalog";
import { updateJourney } from "@/state/guest/store";

const examples = [
  { label: "Business", question: "Why can a growing business run out of cash?" },
  { label: "Movies", question: "How does editing change the way a film scene feels?" },
  { label: "Nature", question: "How do trees move water from their roots to their leaves?" },
];

export function CreateStory({ initialQuestion }: { initialQuestion: string }) {
  const [question, setQuestion] = useState(initialQuestion.slice(0, 600));
  const [scope, setScope] = useState("");
  const questionInput = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const terms = question
    .toLowerCase()
    .split(/\W+/)
    .filter((s) => s.length > 3);

  const matches = terms.length
    ? stories
        .map((story) => ({
          story,
          score: terms.filter((t) =>
            `${story.title} ${story.question} ${story.description}`.toLowerCase().includes(t),
          ).length,
        }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((s) => s.story)
    : stories.filter((s) =>
        ["shape-a-sound", "great-wave-made-by-hand", "shape-of-a-signal"].includes(s.slug),
      );

  return (
    <div className="create-layout grid items-start gap-10 pb-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.7fr)] lg:gap-16">
      <section className="min-w-0">
        <form
          className="form-stack grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();

            const trimmed = question.trim();

            if (trimmed.length < 12) {
              questionInput.current?.setCustomValidity(
                "Write a question with at least 12 characters.",
              );
              questionInput.current?.reportValidity();

              return;
            }

            const id = crypto.randomUUID();

            updateJourney((s) => ({
              ...s,
              creations: [
                {
                  id,
                  question: trimmed,
                  scope: scope.trim() || "A focused introduction",
                  status: "preparing",
                  previewStage: "outline",
                  outline: [],
                  sampleSlug: matches[0]?.slug,
                  createdAt: Date.now(),
                },
                ...s.creations,
              ],
            }));
            router.push(`/creations/${id}`);
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="story-question">What would you like to understand?</Label>
            <Textarea
              ref={questionInput}
              id="story-question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                e.target.setCustomValidity("");
              }}
              required
              minLength={12}
              maxLength={600}
              rows={4}
              placeholder="How does a film make a scene feel tense?"
              aria-describedby="question-help"
              className="min-h-36 bg-background text-base leading-relaxed"
            />
            <div className="flex justify-between gap-4 text-xs text-muted-foreground">
              <p id="question-help">A question or topic is enough to start.</p>
              <span>{question.length}/600</span>
            </div>
          </div>
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="mb-2 text-sm text-muted-foreground">Try a question</legend>
            {examples.map((example) => (
              <Button
                key={example.label}
                type="button"
                variant="outline"
                className="px-3 text-sm"
                onClick={() => {
                  setQuestion(example.question);
                  questionInput.current?.setCustomValidity("");
                  questionInput.current?.focus();
                }}
              >
                {example.label}
              </Button>
            ))}
          </fieldset>
          <div className="grid gap-2">
            <Label htmlFor="scope">
              Anything to focus on?{" "}
              <span className="font-normal text-muted-foreground">Optional</span>
            </Label>
            <Input
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              maxLength={200}
              placeholder="For beginners, a particular example, a different perspective…"
              className="h-11 bg-background text-base"
            />
          </div>
          <div className="border-t border-rule pt-5">
            <Button type="submit" className="w-full sm:w-auto">
              Preview lesson outline
              <ArrowRight />
            </Button>
            <p className="mt-3 max-w-[60ch] text-xs leading-relaxed text-muted-foreground">
              Saved on this device. Lesson generation isn’t connected yet; no job or payment starts.
            </p>
          </div>
        </form>
      </section>
      <aside className="create-matches min-w-0 border-t border-rule pt-6 lg:border-t-0 lg:pt-0">
        <h2 className="text-2xl">Explore while you’re here</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {terms.length
            ? "Prepared lessons related to your question."
            : "A few lessons you can open right now."}
        </p>
        <div className="mt-3">
          {matches.length ? (
            matches.map((story) => (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                className="match-link grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 border-b border-rule py-4 hover:text-primary"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
                  <Image
                    src={
                      story.slug === "shape-a-sound"
                        ? "/images/home/piano-strings.webp"
                        : story.image
                    }
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg leading-tight">{story.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {story.minutes} min · {story.topic}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="py-5 text-sm leading-relaxed text-muted-foreground">
              No prepared lesson matches yet. You can still keep your question.
            </p>
          )}
        </div>
        <Link
          href="/explore"
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-primary"
        >
          Browse all lessons
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}
