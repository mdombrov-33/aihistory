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
    <div className="create-layout">
      <section>
        <form
          className="form-stack"
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
          <div className="form-field">
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
            <p id="question-help" className="field-hint">
              Start with a question. A place, a period or a perspective helps give it shape.
            </p>
          </div>
          <div className="form-field">
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
          <p className="form-note">
            A local design preview. No generation, payment or provider call takes place.
          </p>
        </form>
        <section className="create-matches">
          <h2>There may already be a way in.</h2>
          <p className="form-note">
            Prepared stories related to your words. This preview uses a simple text match.
          </p>
          {matches.length ? (
            matches.map((story) => (
              <Link key={story.slug} href={`/stories/${story.slug}`} className="match-link">
                <div className="match-image">
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
            <p className="form-note mt-4">
              No prepared story matches yet. Your question can still be saved.
            </p>
          )}
        </section>
      </section>
      <aside className="create-preview">
        <h2>One question. A world to explore.</h2>
        <p>A new story should give your question a shape you can move through.</p>
        <ol className="plan-list">
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
        <div className="preview-notice">
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
