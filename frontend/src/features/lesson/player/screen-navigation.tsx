"use client";

// Previous/next screen controls and the current chapter position.

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Destination = { label: string; href?: string; onClick: () => void };

export function ScreenNavigation({
  previous,
  next,
  chapter,
  screen,
  count,
}: {
  previous: Destination;
  next: Destination;
  chapter: string;
  screen: number;
  count: number;
}) {
  return (
    <footer className="scene-footer story-navigation">
      {previous.href ? (
        <Button asChild variant="outline">
          <Link href={previous.href} onClick={previous.onClick}>
            <ArrowLeft />
            <span>{previous.label}</span>
          </Link>
        </Button>
      ) : (
        <Button variant="outline" onClick={previous.onClick}>
          <ArrowLeft />
          <span>{previous.label}</span>
        </Button>
      )}
      <div className="story-position text-center text-[12px] text-muted-foreground max-[760px]:hidden [&_strong]:block [&_strong]:text-foreground [&_strong]:font-medium [&_strong]:mb-[3px]">
        <strong>{chapter}</strong>
        <span>
          Screen {screen} of {count}
        </span>
      </div>
      {next.href ? (
        <Button asChild className="scene-next" data-primary-action="true">
          <Link href={next.href} onClick={next.onClick}>
            <span>{next.label}</span>
            <ArrowRight />
          </Link>
        </Button>
      ) : (
        <Button className="scene-next" data-primary-action="true" onClick={next.onClick}>
          <span>{next.label}</span>
          <ArrowRight />
        </Button>
      )}
    </footer>
  );
}
