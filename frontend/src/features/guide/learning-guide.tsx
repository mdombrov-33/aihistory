"use client";

// Personal learning trails, chosen interests and private notes stored on the device.

import { formText } from "@/lib/forms";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowRight, Plus, Trash2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { stories, topics, getStory } from "@/content/catalog/catalog";
import { useJourney, updateJourney } from "@/state/guest/store";
import type { Trail } from "@/state/guest/product";
import { guideSuggestions, moveLesson } from "./model";
import { PreviewNote } from "@/components/app/feature-page";

export function LearningGuide({ initialTrail, add }: { initialTrail?: string; add?: string }) {
  const { product, progress, creations } = useJourney();
  const [active, setActive] = useState(initialTrail ?? "");
  const [remove, setRemove] = useState(false);
  const [copyText, setCopyText] = useState("");
  const trail = product.trails.find((t) => t.id === active) ?? product.trails[0];
  const seed = add ? getStory(add) : undefined;
  const suggestions = guideSuggestions(stories, product.interests, trail?.lessons ?? []);

  function change(update: (value: Trail) => Trail) {
    if (trail)
      updateJourney((s) => ({
        ...s,
        product: {
          ...s.product,
          trails: s.product.trails.map((t) =>
            t.id === trail.id ? { ...update(t), updatedAt: Date.now() } : t,
          ),
        },
      }));
  }

  function addLesson(slug: string) {
    if (trail && trail.lessons.length >= 30) {
      toast("This trail is full. Start another trail or remove a lesson.");

      return;
    }

    change((t) => ({
      ...t,
      lessons: t.lessons.includes(slug) ? t.lessons : [...t.lessons, slug].slice(0, 30),
    }));
  }

  return (
    <div className="grid items-start gap-10 pb-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,1fr)]">
      <div className="min-w-0">
        {product.trails.length ? (
          <div className="mb-6 grid gap-2">
            <Label htmlFor="active-trail">Your learning trails</Label>
            <select
              id="active-trail"
              value={trail?.id ?? ""}
              onChange={(e) => {
                setActive(e.target.value);
                setRemove(false);
                setCopyText("");
              }}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base"
            >
              {product.trails.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {trail ? (
          <section aria-label="Current learning trail">
            <h2 className="break-words text-3xl">{trail.title}</h2>
            <p className="mt-3 max-w-[60ch] break-words text-base leading-relaxed text-muted-foreground">
              {trail.question}
            </p>
            {seed && !trail.lessons.includes(seed.slug) ? (
              <Button
                variant="outline"
                className="mt-5 h-auto min-h-11 whitespace-normal text-left"
                onClick={() => addLesson(seed.slug)}
              >
                Add {seed.title} to this trail
                <Plus />
              </Button>
            ) : null}
            <ol className="mt-7 border-t border-rule">
              {trail.lessons.length ? (
                trail.lessons.map((slug, index) => {
                  const story = getStory(slug);

                  if (!story) return null;

                  const done = progress[slug]?.finished;

                  return (
                    <li
                      key={slug}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-rule py-5"
                    >
                      <div className="flex min-w-0 gap-3 sm:gap-4">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                          {done ? <Check className="size-4" aria-label="Finished" /> : index + 1}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/stories/${slug}`}
                            className="font-heading text-xl leading-tight hover:text-primary"
                          >
                            {story.title}
                          </Link>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {story.topic} · {story.minutes} min
                          </p>
                          <Link
                            className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-primary"
                            href={`/stories/${slug}/play/${progress[slug]?.scene ?? 0}?passage=${progress[slug]?.passage ?? 0}`}
                          >
                            {done ? "Revisit" : progress[slug] ? "Continue" : "Start lesson"}
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                      </div>
                      <div className="grid sm:flex">
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={index === 0}
                          aria-label={`Move ${story.title} up`}
                          onClick={() =>
                            change((t) => ({ ...t, lessons: moveLesson(t.lessons, index, -1) }))
                          }
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={index === trail.lessons.length - 1}
                          aria-label={`Move ${story.title} down`}
                          onClick={() =>
                            change((t) => ({ ...t, lessons: moveLesson(t.lessons, index, 1) }))
                          }
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${story.title} from trail`}
                          onClick={() =>
                            change((t) => ({ ...t, lessons: t.lessons.filter((v) => v !== slug) }))
                          }
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="py-8 text-sm leading-relaxed text-muted-foreground">
                  Your trail is open. Add a suggested lesson, or browse the library for a first
                  step.
                </li>
              )}
            </ol>
            <section className="mt-6" aria-label="Questions in your learning trail">
              <h3 className="text-xl">Questions you’re following</h3>
              {trail.questions.length ? (
                trail.questions.map((id) => {
                  const question = creations.find((c) => c.id === id);

                  return question ? (
                    <div
                      key={id}
                      className="mt-3 flex items-start justify-between gap-3 border-b border-rule py-3"
                    >
                      <Link
                        href={`/creations/${id}`}
                        className="min-h-11 text-sm leading-relaxed text-primary"
                      >
                        {question.question}
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Remove question: ${question.question}`}
                        onClick={() =>
                          change((t) => ({ ...t, questions: t.questions.filter((q) => q !== id) }))
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ) : null;
                })
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a saved question to connect your own lesson plans to this trail.
                </p>
              )}
              {creations
                .filter((c) => !trail.questions.includes(c.id))
                .slice(0, 3)
                .map((c) => (
                  <Button
                    key={c.id}
                    variant="outline"
                    className="mt-3 h-auto min-h-11 w-full justify-start whitespace-normal text-left text-sm"
                    onClick={() =>
                      change((t) => ({ ...t, questions: [...t.questions, c.id].slice(0, 30) }))
                    }
                  >
                    <Plus />
                    {c.question}
                  </Button>
                ))}
              <Link href="/create" className="mt-2 flex min-h-11 items-center text-sm text-primary">
                Follow a new question
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </section>
            <details className="mt-6 border-t border-rule pt-3">
              <summary className="min-h-11 cursor-pointer text-sm">
                Edit trail name and question
              </summary>
              <form
                key={trail.id}
                className="mt-3 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();

                  const data = new FormData(e.currentTarget),
                    title = formText(data, "title").trim(),
                    question = formText(data, "question").trim();

                  if (!title || !question) {
                    toast("Keep a name and question for this trail.");

                    return;
                  }

                  change((t) => ({ ...t, title, question }));
                  toast.success("Trail updated");
                }}
              >
                <Label htmlFor="edit-trail-title">Name this trail</Label>
                <Input
                  id="edit-trail-title"
                  name="title"
                  defaultValue={trail.title}
                  required
                  maxLength={120}
                />
                <Label htmlFor="edit-trail-question">Question for this trail</Label>
                <Textarea
                  id="edit-trail-question"
                  name="question"
                  defaultValue={trail.question}
                  required
                  maxLength={600}
                />
                <Button className="justify-self-start" variant="outline">
                  Save trail details
                </Button>
              </form>
            </details>
            <form
              key={trail.id}
              className="mt-6 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();

                const data = new FormData(e.currentTarget);

                change((t) => ({ ...t, notes: formText(data, "notes") }));
                toast.success("Notes saved on this device");
              }}
            >
              <Label htmlFor="trail-notes">Your private notes</Label>
              <Textarea
                id="trail-notes"
                name="notes"
                defaultValue={trail.notes}
                maxLength={3000}
                rows={4}
                placeholder="What connected? What would you like to look at next?"
              />
              <Button className="justify-self-start" variant="outline">
                Save notes
              </Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={async () => {
                  const text = [
                    trail.title,
                    ...trail.lessons.map((slug) => {
                      const s = getStory(slug);

                      return s ? `${s.title}: ${location.origin}/stories/${slug}` : "";
                    }),
                  ]
                    .filter(Boolean)
                    .join("\n");

                  try {
                    await navigator.clipboard.writeText(text);
                    toast("Reading list copied. Private notes and progress are excluded.");
                  } catch {
                    setCopyText(text);
                  }
                }}
              >
                <Copy />
                Copy reading list
              </Button>
              <Button variant="ghost" onClick={() => setRemove(true)}>
                <Trash2 />
                Delete trail
              </Button>
            </div>
            {copyText ? (
              <div className="mt-3 grid gap-2">
                <Label htmlFor="copy-reading-list">Copy this reading list</Label>
                <Textarea
                  id="copy-reading-list"
                  readOnly
                  value={copyText}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            ) : null}
            {remove ? (
              <div className="mt-4 rounded-xl border border-rule p-4">
                <p className="text-sm">
                  Delete this trail and its private notes? Your saved lessons and progress stay.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateJourney((s) => ({
                        ...s,
                        product: {
                          ...s.product,
                          trails: s.product.trails.filter((t) => t.id !== trail.id),
                        },
                      }));
                      setRemove(false);
                      setActive("");
                    }}
                  >
                    Delete trail and notes
                  </Button>
                  <Button variant="outline" onClick={() => setRemove(false)}>
                    Keep trail
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="py-5">
            <h2 className="text-3xl">A question can become a path.</h2>
            <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
              Start with something you want to understand. Add lessons, arrange them your way and
              keep the connections you notice. There is no required order or deadline.
            </p>
          </section>
        )}
        <details open={!product.trails.length} className="mt-8 border-y border-rule py-4">
          <summary className="min-h-11 cursor-pointer font-semibold">
            Start a new learning trail
          </summary>
          <form
            className="mt-4 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();

              if (product.trails.length >= 30) {
                toast("Keep up to 30 trails on this device. Remove one to start another.");

                return;
              }

              const data = new FormData(e.currentTarget),
                title = formText(data, "title").trim(),
                question = formText(data, "question").trim();

              if (!title || !question) return;

              const id = crypto.randomUUID();

              updateJourney((s) => ({
                ...s,
                product: {
                  ...s.product,
                  trails: [
                    {
                      id,
                      title,
                      question,
                      lessons: seed ? [seed.slug] : [],
                      questions: [],
                      notes: "",
                      updatedAt: Date.now(),
                    },
                    ...s.product.trails,
                  ],
                },
              }));
              setActive(id);
              e.currentTarget.reset();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="trail-title">Trail name</Label>
              <Input
                id="trail-title"
                name="title"
                required
                maxLength={120}
                placeholder="How images tell a story"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trail-question">The question you’re following</Label>
              <Textarea
                id="trail-question"
                name="question"
                required
                maxLength={600}
                defaultValue={seed?.question ?? ""}
                placeholder="What makes an image feel full of movement?"
                rows={3}
              />
            </div>
            {seed ? (
              <p className="text-sm text-muted-foreground">Starts with {seed.title}.</p>
            ) : null}
            <Button className="justify-self-start">
              Create learning trail
              <Plus />
            </Button>
          </form>
        </details>
        <PreviewNote>
          Trails, interests and private notes are saved on this device. Recommendations use only the
          interests you choose. Copying a reading list excludes your notes and progress.
        </PreviewNote>
      </div>
      <aside className="min-w-0 space-y-8">
        <section>
          <h2 className="text-2xl">What interests you?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Choose the subjects you want to see more of. You can change or clear them.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Button
                key={topic}
                variant="outline"
                className="h-auto min-h-11 whitespace-normal text-left text-sm aria-pressed:border-primary aria-pressed:bg-secondary"
                aria-pressed={product.interests.includes(topic)}
                onClick={() =>
                  updateJourney((s) => ({
                    ...s,
                    product: {
                      ...s.product,
                      interests: s.product.interests.includes(topic)
                        ? s.product.interests.filter((v) => v !== topic)
                        : [...s.product.interests, topic],
                    },
                  }))
                }
              >
                {topic}
              </Button>
            ))}
          </div>
          {product.interests.length ? (
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() =>
                updateJourney((s) => ({ ...s, product: { ...s.product, interests: [] } }))
              }
            >
              Clear chosen interests
            </Button>
          ) : null}
        </section>
        <section>
          <h2 className="text-2xl">A possible next step</h2>
          <div className="mt-2">
            {suggestions.map(({ story, reason }) => (
              <article key={story.slug} className="border-b border-rule py-5">
                <div className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-card">
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
                    <Link
                      href={`/stories/${story.slug}`}
                      className="font-heading text-xl hover:text-primary"
                    >
                      {story.title}
                    </Link>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{reason}</p>
                  </div>
                </div>
                {trail ? (
                  <Button variant="ghost" className="mt-3" onClick={() => addLesson(story.slug)}>
                    <Plus />
                    Add to trail
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/explore">
              Find another lesson
              <ArrowRight />
            </Link>
          </Button>
        </section>
      </aside>
    </div>
  );
}
