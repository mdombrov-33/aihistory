"use client";

// Question-entry preview that saves device-local preparation data.

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Compass, Info, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { stories } from "@/content/catalog/catalog";
import { updateJourney } from "@/state/guest/store";

export function CreateStory({ initialQuestion }: { initialQuestion: string }) {
  const [question, setQuestion] = useState(initialQuestion.slice(0, 600));
  const [scope, setScope] = useState("A focused introduction");
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
        .slice(0, 2)
        .map((s) => s.story)
    : stories.slice(0, 2);

  return (
    <div className="create-layout px-0 gap-[65px] grid grid-cols-[minmax(0,_1fr)_minmax(300px,_0.8fr)] pt-2.5 pb-15 max-[1050px]:gap-[35px] max-[760px]:gap-7.5 max-[760px]:flex max-[760px]:flex-col">
      <section>
        <form
          className="form-stack gap-5.5 grid [&>[data-slot=button]]:w-full"
          onSubmit={(e) => {
            e.preventDefault();

            const id = crypto.randomUUID();

            updateJourney((s) => ({
              ...s,
              creations: [
                {
                  id,
                  question: question.trim(),
                  scope: scope.trim(),
                  status: "preparing",
                  createdAt: Date.now(),
                },
                ...s.creations,
              ],
            }));
            router.push(`/creations/${id}`);
          }}
        >
          <div className="form-field gap-[9px] grid">
            <Label htmlFor="story-question">What would you like to understand?</Label>
            <Textarea
              id="story-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              minLength={12}
              maxLength={600}
              rows={5}
              placeholder="How did people exchange ideas before the modern world?"
              aria-describedby="question-help"
            />
            <p id="question-help" className="field-hint text-[14px] text-muted-foreground">
              Start with a question. A place, a period or a perspective helps give it shape.
            </p>
          </div>
          <div className="form-field gap-[9px] grid">
            <Label htmlFor="scope">Where should the story focus?</Label>
            <Input
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <Button type="submit">
            Save question & preview the flow
            <ArrowRight />
          </Button>
          <p className="form-note text-[14px] leading-[1.5] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:[text-underline-offset:4px]">
            A local design preview. No generation, payment or provider call takes place.
          </p>
        </form>
        <section className="create-matches mt-9.5 [&_h2]:text-[26px] [&_h2]:mb-5">
          <h2>There may already be a way in.</h2>
          <p className="form-note text-[14px] leading-[1.5] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:[text-underline-offset:4px]">
            Prepared stories related to your words. This preview uses a simple text match.
          </p>
          {matches.length ? (
            matches.map((story) => (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                className="match-link py-4 px-0 gap-4.5 flex items-center [border-bottom:1px_solid_var(--line-soft)] [&_h3]:text-[20px] [&_p]:text-muted-foreground [&_p]:text-[14px] [&_p]:mt-1.5 [&_>_svg]:ml-auto [&_>_svg]:w-4.5"
              >
                <div className="match-image overflow-hidden relative w-22.5 [aspect-ratio:1.25] rounded-[6px] shrink-0">
                  <Image src={story.image} alt="" fill sizes="90px" />
                </div>
                <div>
                  <h3>{story.title}</h3>
                  <p>{story.question}</p>
                </div>
                <ArrowRight />
              </Link>
            ))
          ) : (
            <p className="form-note mt-4 text-[14px] leading-[1.5] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:[text-underline-offset:4px]">
              No prepared story matches yet. Your question can still be saved.
            </p>
          )}
        </section>
      </section>
      <aside className="create-preview p-7.5 bg-card rounded-[12px] [align-self:start] max-[760px]:p-[25px] max-[760px]:w-full [&_h2]:text-[27px] [&_p]:my-4.5 [&_p]:mx-0 [&_p]:text-muted-foreground">
        <h2>One question. A world to explore.</h2>
        <p>A new story should give your question a shape you can move through.</p>
        <ol className="plan-list my-6.5 mx-0 p-0 gap-5.5 [list-style:none] grid [&_li]:gap-3.5 [&_li]:flex [&_svg]:w-5 [&_svg]:h-6 [&_svg]:text-primary [&_strong]:block [&_small]:text-muted-foreground [&_small]:text-[15px]">
          <li>
            <Compass />
            <div>
              <strong>A clear scope</strong>
              <small>
                A focused route through the topic, with room to follow what interests you.
              </small>
            </div>
          </li>
          <li>
            <Layers3 />
            <div>
              <strong>Chapters that connect</strong>
              <small>Scenes, maps, documents and choices that build an explanation together.</small>
            </div>
          </li>
          <li>
            <BookOpen />
            <div>
              <strong>Evidence you can inspect</strong>
              <small>A separate source trail beneath the visual world.</small>
            </div>
          </li>
        </ol>
        <div className="preview-notice my-6 mx-0 py-3.5 px-4.5 gap-3 bg-secondary rounded-[8px] text-[14px] text-muted-foreground flex items-start [&_svg]:w-4.5 [&_svg]:mt-0.5">
          <Info />
          <p>
            This screen previews the product flow. Live research, generation and cost controls
            belong to a later implementation stage.
          </p>
        </div>
      </aside>
    </div>
  );
}
