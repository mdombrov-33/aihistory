"use client";

// Free-text contextual inquiry searches prepared context and preserves the current lesson.

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Source = { name: string; supports: string; url: string };

export function LessonQuestions({
  context,
  sources,
  sourceLink,
  identity,
}: {
  context: string[];
  sources: readonly Source[];
  sourceLink: string;
  identity: string;
}) {
  const [question, setQuestion] = useState(""),
    [result, setResult] = useState<{
      question: string;
      passages: string[];
      sources: Source[];
    } | null>(null);

  const [service, setService] = useState("");

  const [pending, setPending] = useState(false),
    [error, setError] = useState("");

  async function ask(value: string, allSources = false) {
    const query = value.trim();

    if (query.length < 4) {
      setError("Write a question with a little more detail.");

      return;
    }

    setPending(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 250));

    const words = query
      .toLowerCase()
      .split(/\W+/)
      .filter(
        (s) =>
          s.length > 3 &&
          !["what", "where", "does", "this", "that", "with", "about", "chapter", "story"].includes(
            s,
          ),
      );

    const relevant = allSources
      ? [...sources]
      : sources.filter((s) =>
          words.some((w) => (s.name + " " + s.supports).toLowerCase().includes(w)),
        );

    const passages =
      value === "What connects this chapter to the story?"
        ? context.slice(0, 2)
        : context.filter((p) => words.some((w) => p.toLowerCase().includes(w))).slice(0, 2);

    setResult({ question: query, passages, sources: relevant.slice(0, 3) });
    setPending(false);
  }

  return (
    <div key={identity} className="mt-5">
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
      >
        <Label htmlFor="lesson-question">Ask about this lesson</Label>
        <Textarea
          id="lesson-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={600}
          minLength={4}
          required
          rows={3}
          placeholder="What does this detail help explain?"
        />
        <Button disabled={pending} className="justify-self-start">
          {pending ? "Looking in the prepared context…" : "Find relevant context"}
          <Search />
        </Button>
      </form>
      <div className="question-presets mt-4 grid gap-2">
        {["What connects this chapter to the story?", "Where can I examine the evidence?"].map(
          (q) => (
            <Button
              key={q}
              className="h-auto min-h-11 justify-start whitespace-normal text-left"
              variant="outline"
              disabled={pending}
              onClick={() => {
                setQuestion(q);
                void ask(q, q.startsWith("Where"));
              }}
            >
              {q}
            </Button>
          ),
        )}
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm">
          {error}
        </p>
      ) : null}
      <div aria-live="polite" aria-busy={pending}>
        {result ? (
          <section className="answer-panel mt-5 border-t border-rule pt-5">
            <h3 className="font-heading text-xl">
              {result.passages.length || result.sources.length
                ? "Relevant prepared context"
                : "This question needs a new answer."}
            </h3>
            <p className="mt-2 break-words text-sm font-semibold">{result.question}</p>
            {result.passages.map((p, i) => (
              <p key={i} className="mt-4 text-sm leading-relaxed">
                {p}
              </p>
            ))}
            {result.sources.length ? (
              <ul className="mt-4 grid gap-4">
                {result.sources.map((source) => (
                  <li key={source.url} className="text-sm leading-relaxed">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      {source.name}
                    </a>
                    <p className="mt-1">{source.supports}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            {!result.passages.length && !result.sources.length ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The saved context does not establish an answer. Live follow-up generation is not
                connected; you can keep this question for a new lesson.
              </p>
            ) : null}
            <Link
              href={sourceLink}
              className="mt-4 flex min-h-11 items-center text-sm text-primary"
            >
              Inspect the sources
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href={`/create?q=${encodeURIComponent(result.question)}`}
              className="flex min-h-11 items-center text-sm text-primary"
            >
              Follow this as a new question
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </section>
        ) : null}
      </div>
      <details className="mt-5 border-t border-rule pt-3">
        <summary className="min-h-11 cursor-pointer text-xs text-muted-foreground">
          Try answer recovery states
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setService(
                "The sample question allowance is used. Prepared context and the library remain available.",
              )
            }
          >
            Allowance used
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setService(
                "The answer service could not finish. Your question and lesson position are preserved. Retry when the service is available.",
              )
            }
          >
            Answer error
          </Button>
          {service ? (
            <Button variant="ghost" onClick={() => setService("")}>
              Dismiss preview state
            </Button>
          ) : null}
        </div>
        {service ? <output className="mt-3 block text-sm">{service}</output> : null}
      </details>
      <p className="mt-5 border-t border-rule pt-4 text-xs leading-relaxed text-muted-foreground">
        This searches prepared text, not a generated answer.{" "}
        <Link href="/account/membership" className="text-primary underline underline-offset-4">
          Question allowances
        </Link>{" "}
        apply only when live answers are connected.
      </p>
    </div>
  );
}
