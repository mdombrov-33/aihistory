"use client";

// Coordinates the active lesson screen, reading position, narration and guest progress.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookOpen, Check, MessageCircle, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { ChapterMenu } from "./chapter-menu";
import { ReadingControls } from "./reading-controls";
import { ScreenNavigation } from "./screen-navigation";
import type { StoryNavigation } from "./navigation-types";
import { Brand } from "@/components/app/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { addBookmark, saveProgress } from "@/state/guest/actions";
import { useJourney } from "@/state/guest/store";
import type { StorySummary } from "@/features/lesson/contracts/catalog";
import type { Lesson } from "@/features/lesson/contracts/lesson";
import type { ModelAsset } from "@/features/lesson/contracts/model-asset";
import { SoundControls } from "@/features/settings/sound-controls";
import { SceneStage } from "../scenes/scene-stage";
import type { SceneAssetSize } from "../scenes/scene-types";
import type { SceneProgram } from "../contracts/scene";
import { useNarration } from "./use-narration";

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
    <ReadingControls
      mode={mode}
      playing={narration.playing}
      onRead={() => {
        narration.stop();
        setMode("read");
      }}
      onListen={() => setMode("listen")}
      onPlay={narration.play}
    />
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
          <ChapterMenu
            story={story}
            navigation={navigation}
            currentChapter={scene.chapter}
            index={index}
            passageStart={beat.passageStart}
            chapterStart={firstScene}
            onNavigate={narration.stop}
          />
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
      <ScreenNavigation
        chapter={story.chapters[scene.chapter].title}
        screen={chapterScreen + 1}
        count={chapterScreens.length}
        previous={
          beatIndex > 0
            ? { label: "Back", onClick: () => turn(program.beats[beatIndex - 1].passageStart) }
            : {
                href: previousLink,
                onClick: narration.stop,
                label:
                  index > 0
                    ? lesson.scenes[index - 1].chapter === scene.chapter
                      ? "Previous screen"
                      : "Previous chapter"
                    : "Overview",
              }
        }
        next={
          lastBeat
            ? {
                href: nextLink,
                onClick: leaveScene,
                label: last ? "Finish & sources" : "Next: " + nextTitle,
              }
            : {
                onClick: () => turn(program.beats[beatIndex + 1].passageStart),
                label: "Next: " + nextTitle,
              }
        }
      />
    </main>
  );
}
