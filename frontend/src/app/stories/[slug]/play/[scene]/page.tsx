// Server route for stories/[slug]/play/[scene]; composes prepared data and feature views.

import { notFound } from "next/navigation";
import { getStory } from "@/content/catalog/catalog";
import { getLesson } from "@/content/lesson-access";
import { getPreparedStory } from "@/content/lessons/registry";
import { Player } from "@/features/lesson/player/player";
import { buildSceneProgram } from "@/features/lesson/player/scene-programs";

export const metadata = { title: "Inside the story" };

export default async function PlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; scene: string }>;
  searchParams: Promise<{ passage?: string }>;
}) {
  const { slug, scene } = await params;
  const story = getStory(slug);
  const lesson = getLesson(slug);
  const index = Number(scene);

  if (!story || !lesson || !/^\d+$/.test(scene) || !lesson.scenes[index]) notFound();

  const requested = Number((await searchParams).passage ?? 0);

  const initialPassage =
    Number.isInteger(requested) && requested >= 0 && requested < lesson.scenes[index].text.length
      ? requested
      : 0;

  const programs = lesson.scenes.map((_, i) => buildSceneProgram(story, lesson, i));

  return (
    <Player
      key={`${slug}-${index}-${initialPassage}`}
      story={story}
      lesson={lesson}
      index={index}
      initialPassage={initialPassage}
      assets={getPreparedStory(slug)?.assets}
      models={getPreparedStory(slug)?.models}
      program={programs[index]}
      navigation={lesson.scenes.map((s, i) => ({
        index: i,
        chapter: s.chapter,
        title: s.title,
        screens: programs[i].beats.map((beat) => ({
          title: beat.title,
          passage: beat.passageStart,
        })),
      }))}
    />
  );
}
