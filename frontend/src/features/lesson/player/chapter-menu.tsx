"use client";

// Chapter and screen destinations for the player’s navigation drawer.

import Link from "next/link";
import { List, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import type { StorySummary } from "@/features/lesson/contracts/catalog";
import type { StoryNavigation } from "./navigation-types";

export function ChapterMenu({
  story,
  navigation,
  currentChapter,
  index,
  passageStart,
  chapterStart,
  onNavigate,
}: {
  story: StorySummary;
  navigation: StoryNavigation;
  currentChapter: number;
  index: number;
  passageStart: number;
  chapterStart: (chapter: number) => number;
  onNavigate: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" aria-label="Chapters" onClick={onNavigate}>
          <List />
          <span>
            Chapters {currentChapter + 1}/{story.chapters.length}
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
        <nav
          className="chapter-menu gap-2 grid [&_a]:py-[15px] [&_a]:px-3 [&_a]:gap-3.5 [&_a]:rounded-[7px] [&_a]:flex [&_a]:items-center [&_a]:text-[17px]"
          aria-label="Story chapters"
        >
          <Accordion type="single" collapsible defaultValue={"chapter-" + currentChapter}>
            {story.chapters.map((chapter, c) => (
              <AccordionItem
                value={"chapter-" + c}
                key={chapter.title}
                className="chapter-destination py-3 px-0 [border-bottom:1px_solid_var(--line-soft)] [&_ol]:[list-style:none] [&_ol]:pt-2 [&_ol]:pr-0 [&_ol]:pb-0 [&_ol]:pl-[35px]"
              >
                <AccordionTrigger>
                  {String(c + 1).padStart(2, "0")} {chapter.title}
                </AccordionTrigger>
                <AccordionContent>
                  <SheetClose asChild>
                    <Link
                      href={"/stories/" + story.slug + "/play/" + chapterStart(c)}
                      aria-current={c === currentChapter ? "step" : undefined}
                      onClick={onNavigate}
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
                                  n.index === index && screen.passage === passageStart
                                    ? "page"
                                    : undefined
                                }
                                onClick={onNavigate}
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
  );
}
