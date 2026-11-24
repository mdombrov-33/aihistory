"use client";

// Coordinates the active lesson screen, reading position, narration and guest progress.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookOpen, Check, MessageCircle, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { LessonQuestions } from "./lesson-questions";
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
    <div className="scene-audio scene-evidence-credit min-w-0 [&_small]:block [&_small]:text-[11px] [&_small]:leading-[1.5] [&_small]:text-muted-foreground">
      <Link
        className="scene-source-link [&_svg]:w-4.5 [&_svg]:h-4.5 hover:text-(--scene-gold)"
        href={sourceLink}
        onClick={narration.stop}
      >
        {source?.name ?? "Chapter sources"}
        <ArrowRight />
      </Link>
    </div>
  );

  const reading = (
    <section className="scene-reading" aria-label="Chapter narrative">
      <div className="scene-reading-tools mx-0 gap-4 flex items-center mt-[-9px] mb-1 min-h-[35px] text-muted-foreground text-[12px] max-[760px]:gap-3 max-[760px]:-mt-2 [&_>_span]:mr-auto [&_>_span]:tabular-nums [&_button]:gap-1.5 [&_button]:inline-flex [&_button]:items-center [&_button]:text-[12px] [&_button]:min-h-9">
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
            <div className="full-chapter-text gap-[25px] grid [&_p]:text-[19px] [&_p]:leading-[1.8] [&_button]:mt-3">
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
              <SheetDescription>
                Ask freely, explore relevant prepared context, or keep a question for later.
              </SheetDescription>
            </SheetHeader>
            <LessonQuestions
              key={story.slug + index}
              identity={story.slug + index}
              context={[scene.deck, ...scene.text]}
              sources={lesson.sources}
              sourceLink={sourceLink}
            />
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
            <article
              key={p}
              id={"passage-" + p}
              className="passage py-4.5 px-0 [scroll-margin-top:30px] relative max-[760px]:py-[17px] [&_p]:text-[20px] [&_p]:leading-[1.8] max-[760px]:[&_p]:text-[19px]"
              data-current={p === passage}
            >
              <p>{text}</p>
              <button
                className="scene-passage-bookmark absolute -right-2.5 top-[-9px] grid place-items-center text-foreground [&_svg]:w-3.5 [&_svg]:h-3.5 aria-pressed:text-(--scene-gold)"
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
        <output className="scene-finished block text-[13px] text-(--scene-gold) pt-2.5">
          Story finished. Revisit your bookmarks in My space.
        </output>
      ) : null}
    </section>
  );

  return (
    <main
      id="main-content"
      className="scene-player [&_button]:[-webkit-tap-highlight-color:transparent] [&_button]:min-w-11 [&_button]:min-h-11 [&_a]:[-webkit-tap-highlight-color:transparent] [&_svg]:shrink-0"
      data-scene-type={beat.type}
      data-reading-fit={journey.largerText ? "flow" : "scene"}
      data-mode={mode}
    >
      <header className="scene-header py-0 px-6 gap-6 flex items-center [border-bottom:1px_solid_var(--border)] border-rule max-[760px]:px-3 max-[760px]:gap-3">
        <Brand compact />
        <Link className="scene-story-name" href={"/stories/" + story.slug}>
          {story.title}
        </Link>
        {modeControls}
        <div className="scene-header-tools gap-1 ml-0 flex items-center shrink-0 max-[760px]:gap-0 max-[760px]:[justify-self:end] max-[760px]:col-[2] max-[760px]:row-[1] max-[1100px]:[&_span]:hidden max-[760px]:[&_svg]:w-[19px] max-[760px]:[&_svg]:h-[19px]">
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
      <nav
        ref={chapterStrip}
        className="story-chapter-strip py-0 px-6 gap-1 flex items-stretch overflow-x-auto [border-block:1px_solid_var(--line-soft)] bg-muted [scrollbar-width:thin] max-[760px]:px-2 max-[760px]:min-h-11.5 [&_a]:py-2 [&_a]:px-4 [&_a]:gap-[9px] [&_a]:flex [&_a]:items-center [&_a]:shrink-0 [&_a]:text-[13px] [&_a]:text-muted-foreground max-[760px]:[&_a]:px-3 max-[760px]:[&_a]:text-[12px]"
        aria-label="Chapters"
      >
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
