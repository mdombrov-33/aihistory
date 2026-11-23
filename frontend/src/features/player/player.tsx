"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Headphones,
  List,
  MessageCircle,
  Pause,
  Play,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { Brand } from "@/components/app/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { addBookmark, saveProgress, useJourney } from "@/lib/journey-store";
import type { StorySummary } from "@/content/catalog";
import type { Lesson } from "@/content/lessons";
import type { ModelAsset } from "@/story/model-asset";
import { SoundControls } from "@/features/settings/sound-controls";
import { SceneStage, type SceneAssetSize } from "./scene-stage";
import type { SceneProgram } from "./scene-schema";
import { useNarration } from "./use-narration";

export type StoryNavigation = {
  index: number;
  chapter: number;
  title: string;
  screens: { title: string; passage: number }[];
}[];

export function Player({
  story,
  lesson,
  index,
  initialPassage,
  program,
  navigation,
  assets,
  models,
}: {
  story: StorySummary;
  lesson: Lesson;
  index: number;
  initialPassage: number;
  program: SceneProgram;
  navigation: StoryNavigation;
  assets?: readonly SceneAssetSize[];
  models?: readonly ModelAsset[];
}) {
  const scene = lesson.scenes[index];
  const [passage, setPassage] = useState(initialPassage);
  const [mode, setMode] = useState<"read" | "listen">("read");
  const [answer, setAnswer] = useState("");
  const journey = useJourney();
  const heading = useRef<HTMLHeadingElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const chapterStrip = useRef<HTMLElement>(null);

  const beatIndex = Math.max(
    0,
    program.beats.findIndex((b) => passage >= b.passageStart && passage <= b.passageEnd),
  );
  const beat = program.beats[beatIndex];
  const narration = useNarration(
    scene.text.slice(beat.passageStart, beat.passageEnd + 1),
    passage - beat.passageStart,
    journey.sound,
    (n) => setPassage(beat.passageStart + n),
    (s) => toast(s),
  );
  const lastBeat = beatIndex === program.beats.length - 1;
  const last = index === lesson.scenes.length - 1;
  const finished = last && passage === scene.text.length - 1;
  useEffect(() => {
    saveProgress(story.slug, index, passage, finished);
  }, [story.slug, index, passage, finished]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
  }, [beat.id]);
  useEffect(() => {
    const strip = chapterStrip.current;
    const current = strip?.querySelector<HTMLElement>('[aria-current="step"]');
    if (strip && current)
      strip.scrollLeft =
        current.offsetLeft - strip.offsetLeft - (strip.clientWidth - current.clientWidth) / 2;
  }, [scene.chapter]);
  const firstScene = (chapter: number) => lesson.scenes.findIndex((s) => s.chapter === chapter);
  const marked = (p: number) =>
    journey.bookmarks.some((b) => b.story === story.slug && b.scene === index && b.passage === p);
  const bookmark = (p: number) => {
    const saved = addBookmark(story.slug, index, p, scene.title + " · Passage " + (p + 1));
    toast(saved ? "Passage bookmarked in My space" : "This passage is already bookmarked");
  };
  const turn = (p: number) => {
    narration.stop();
    const next = Math.max(0, Math.min(scene.text.length - 1, p));
    const changesScene = next < beat.passageStart || next > beat.passageEnd;
    setPassage(next);
    requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        (changesScene ? stage.current : heading.current)?.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
      }
    });
  };
  const nextLink =
    index < lesson.scenes.length - 1
      ? "/stories/" + story.slug + "/play/" + (index + 1)
      : "/stories/" + story.slug + "/sources";
  const previousLink =
    index > 0
      ? "/stories/" +
        story.slug +
        "/play/" +
        (index - 1) +
        "?passage=" +
        Math.max(0, lesson.scenes[index - 1].text.length - 1)
      : "/stories/" + story.slug;
  const sourceLink = "/stories/" + story.slug + "/sources";
  const leaveScene = () => {
    narration.stop();
    if (last && lastBeat) saveProgress(story.slug, index, scene.text.length - 1, true);
  };
  const source = lesson.sources[scene.sources[0]];
  const chapterScreens = navigation
    .filter((n) => n.chapter === scene.chapter)
    .flatMap((n) => n.screens.map((screen) => ({ ...screen, index: n.index })));
  const chapterScreen = chapterScreens.findIndex(
    (screen) => screen.index === index && screen.passage === beat.passageStart,
  );
  const nextTitle = lastBeat ? lesson.scenes[index + 1]?.title : program.beats[beatIndex + 1].title;
  const modeControls = (
    <div className="story-mode-controls">
      <div className="reading-modes" aria-label="Reading and listening">
        <button
          aria-pressed={mode === "read"}
          onClick={() => {
            narration.stop();
            setMode("read");
          }}
        >
          <BookOpen />
          <span>Read</span>
        </button>
        <button
          aria-pressed={mode === "listen"}
          onClick={() => {
            setMode("listen");
          }}
        >
          <Headphones />
          <span>Listen</span>
        </button>
      </div>
      {mode === "listen" ? (
        <button
          className="story-play"
          aria-label={narration.playing ? "Pause narration" : "Play narration"}
          onClick={narration.play}
        >
          {narration.playing ? <Pause /> : <Play />}
          <span>{narration.playing ? "Pause" : "Play"}</span>
        </button>
      ) : null}
    </div>
  );
  const audio = (
    <div className="scene-audio scene-evidence-credit">
      <Link className="scene-source-link" href={sourceLink} onClick={narration.stop}>
        {source?.name ?? "Chapter sources"}
        <ArrowRight />
      </Link>
    </div>
  );
  const reading = (
    <section className="scene-reading" aria-label="Chapter narrative">
      <div className="scene-reading-tools">
        <Sheet>
          <SheetTrigger asChild>
            <button onClick={narration.stop}>
              <BookOpen />
              Full text
            </button>
          </SheetTrigger>
          <SheetContent className="player-sheet full-text-sheet">
            <SheetHeader>
              <SheetTitle>{story.chapters[scene.chapter].title}</SheetTitle>
              <SheetDescription>
                Complete chapter text. Return to any passage without waiting for narration.
              </SheetDescription>
            </SheetHeader>
            <div className="full-chapter-text">
              {lesson.scenes.flatMap((section, sectionIndex) =>
                section.chapter === scene.chapter
                  ? section.text.map((text, p) => (
                      <article key={section.id + ":" + p}>
                        {p === 0 ? <h3>{section.title}</h3> : null}
                        <p>{text}</p>
                        <SheetClose asChild>
                          {sectionIndex === index ? (
                            <Button variant="ghost" onClick={() => turn(p)}>
                              Read from this point
                              <ArrowRight />
                            </Button>
                          ) : (
                            <Button asChild variant="ghost">
                              <Link
                                href={
                                  "/stories/" +
                                  story.slug +
                                  "/play/" +
                                  sectionIndex +
                                  "?passage=" +
                                  p
                                }
                              >
                                Read from this point
                                <ArrowRight />
                              </Link>
                            </Button>
                          )}
                        </SheetClose>
                      </article>
                    ))
                  : [],
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <button onClick={narration.stop}>
              <MessageCircle />
              Ask
            </button>
          </SheetTrigger>
          <SheetContent className="player-sheet">
            <SheetHeader>
              <SheetTitle>Follow a question.</SheetTitle>
              <SheetDescription>Prepared contextual answers for this preview.</SheetDescription>
            </SheetHeader>
            <div className="question-presets">
              {[
                {
                  question: "What connects this chapter to the story?",
                  answer: scene.deck + " " + scene.text[scene.text.length - 1],
                },
                {
                  question: "Where can I examine the evidence?",
                  answer: lesson.sources.map((s) => s.name + ": " + s.supports).join(" "),
                },
              ].map((q) => (
                <button key={q.question} onClick={() => setAnswer(q.answer)}>
                  {q.question}
                </button>
              ))}
            </div>
            {answer ? (
              <div className="answer-panel" aria-live="polite">
                <p>{answer}</p>
                <Link href={sourceLink}>Inspect the sources</Link>
              </div>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
      <h1 ref={heading} tabIndex={-1}>
        {beat.title}
      </h1>
      <div className="scene-passages">
        {scene.text.slice(beat.passageStart, beat.passageEnd + 1).map((text, n) => {
          const p = beat.passageStart + n;
          return (
            <article key={p} id={"passage-" + p} className="passage" data-current={p === passage}>
              <p>{text}</p>
              <button
                className="scene-passage-bookmark"
                aria-label={"Keep passage " + (p + 1)}
                aria-pressed={marked(p)}
                onClick={() => bookmark(p)}
              >
                {marked(p) ? <Check /> : <Bookmark />}
              </button>
            </article>
          );
        })}
      </div>
      {finished ? (
        <output className="scene-finished">
          Story finished. Revisit your bookmarks in My space.
        </output>
      ) : null}
    </section>
  );
  return (
    <main
      id="main-content"
      className="scene-player"
      data-scene-type={beat.type}
      data-reading-fit={journey.largerText ? "flow" : "scene"}
      data-mode={mode}
    >
      <header className="scene-header">
        <Brand compact />
        <Link className="scene-story-name" href={"/stories/" + story.slug}>
          {story.title}
        </Link>
        {modeControls}
        <div className="scene-header-tools">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" aria-label="Chapters" onClick={narration.stop}>
                <List />
                <span>
                  Chapters {scene.chapter + 1}/{story.chapters.length}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="player-sheet">
              <SheetHeader>
                <SheetTitle>Your journey</SheetTitle>
                <SheetDescription>
                  {story.title} · {story.chapters.length} chapters
                </SheetDescription>
              </SheetHeader>
              <nav className="chapter-menu" aria-label="Story chapters">
                <Accordion type="single" collapsible defaultValue={"chapter-" + scene.chapter}>
                  {story.chapters.map((chapter, c) => (
                    <AccordionItem
                      value={"chapter-" + c}
                      key={chapter.title}
                      className="chapter-destination"
                    >
                      <AccordionTrigger>
                        {String(c + 1).padStart(2, "0")} {chapter.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <SheetClose asChild>
                          <Link
                            href={"/stories/" + story.slug + "/play/" + firstScene(c)}
                            aria-current={c === scene.chapter ? "step" : undefined}
                            onClick={narration.stop}
                          >
                            Start chapter <ArrowRight />
                          </Link>
                        </SheetClose>
                        <ol>
                          {navigation
                            .filter((n) => n.chapter === c)
                            .flatMap((n) =>
                              n.screens.map((screen) => (
                                <li key={n.index + ":" + screen.passage}>
                                  <SheetClose asChild>
                                    <Link
                                      href={
                                        "/stories/" +
                                        story.slug +
                                        "/play/" +
                                        n.index +
                                        "?passage=" +
                                        screen.passage
                                      }
                                      aria-current={
                                        n.index === index && screen.passage === beat.passageStart
                                          ? "page"
                                          : undefined
                                      }
                                      onClick={narration.stop}
                                    >
                                      {screen.title}
                                    </Link>
                                  </SheetClose>
                                </li>
                              )),
                            )}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </nav>
              <Button asChild variant="outline">
                <Link href={"/stories/" + story.slug}>
                  Story overview
                  <ArrowRight />
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            aria-label="Bookmark this passage"
            aria-pressed={marked(passage)}
            onClick={() => bookmark(passage)}
          >
            {marked(passage) ? <Check /> : <Bookmark />}
          </Button>
          <Button asChild variant="ghost" className="header-source">
            <Link href={sourceLink} onClick={narration.stop} aria-label="Sources">
              <BookOpen />
              <span>Sources</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" aria-label="Sound settings" onClick={narration.stop}>
                <Settings2 />
              </Button>
            </SheetTrigger>
            <SheetContent className="player-sheet">
              <SheetHeader>
                <SheetTitle>Set the atmosphere.</SheetTitle>
                <SheetDescription>Sound begins only when you choose to listen.</SheetDescription>
              </SheetHeader>
              <SoundControls />
              <Button asChild variant="outline">
                <Link href="/settings">
                  All settings
                  <ArrowRight />
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <nav ref={chapterStrip} className="story-chapter-strip" aria-label="Chapters">
        {story.chapters.map((chapter, c) => (
          <Link
            key={chapter.title}
            href={"/stories/" + story.slug + "/play/" + firstScene(c)}
            aria-current={c === scene.chapter ? "step" : undefined}
            onClick={narration.stop}
          >
            <span>{String(c + 1).padStart(2, "0")}</span>
            {chapter.title}
          </Link>
        ))}
      </nav>
      <div key={beat.id} ref={stage} className="scene-stage">
        <SceneStage
          assets={assets}
          models={models}
          slug={story.slug}
          scene={scene}
          beat={beat}
          reading={reading}
          audio={audio}
          sources={lesson.sources}
          onInspect={narration.stop}
        />
      </div>
      <footer className="scene-footer story-navigation">
        {beatIndex > 0 ? (
          <Button variant="outline" onClick={() => turn(program.beats[beatIndex - 1].passageStart)}>
            <ArrowLeft />
            <span>Back</span>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href={previousLink} onClick={narration.stop}>
              <ArrowLeft />
              <span>
                {index > 0
                  ? lesson.scenes[index - 1].chapter === scene.chapter
                    ? "Previous screen"
                    : "Previous chapter"
                  : "Overview"}
              </span>
            </Link>
          </Button>
        )}
        <div className="story-position">
          <strong>{story.chapters[scene.chapter].title}</strong>
          <span>
            Screen {chapterScreen + 1} of {chapterScreens.length}
          </span>
        </div>
        {lastBeat ? (
          <Button asChild className="scene-next" data-primary-action="true">
            <Link href={nextLink} onClick={leaveScene}>
              <span>{last ? "Finish & sources" : "Next: " + nextTitle}</span>
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button
            className="scene-next"
            data-primary-action="true"
            onClick={() => turn(program.beats[beatIndex + 1].passageStart)}
          >
            <span>Next: {nextTitle}</span>
            <ArrowRight />
          </Button>
        )}
      </footer>
    </main>
  );
}
