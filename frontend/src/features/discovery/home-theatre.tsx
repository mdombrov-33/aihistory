"use client";

// Discovery homepage composed from prepared topics, lessons and inspectable media.

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Form from "next/form";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Search, Box, Route, FileImage } from "lucide-react";
import { topics } from "@/content/catalog/catalog";
import { useJourney } from "@/state/guest/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RouteStudy } from "./route-study";
import { MuseumObject } from "@/features/lesson/media/museum-object";
import { EvidenceStudy } from "@/features/lesson/media/evidence-study";
import { greatWaveStudy } from "@/content/discovery/evidence-studies";
import type { SceneBeat } from "@/features/lesson/contracts/scene";

export function HomeEntrance() {
  const prefersReduced = useReducedMotion();
  const { reduceMotion } = useJourney();
  const still = prefersReduced || reduceMotion;

  return (
    <section className="home-entrance px-0 relative isolate bg-background text-on-art flex-col justify-center pb-[55px] min-h-[224px] pt-0 block max-[1100px]:min-h-[225px] max-[760px]:justify-start max-[760px]:pb-[35px] max-[760px]:min-h-[260px]">
      <motion.div
        className="entrance-art [&_img]:[object-position:center_48%] max-[760px]:[&_img]:[object-position:70%_center]"
        initial={false}
        animate={still ? { scale: 1 } : { scale: [1, 1.025] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <Image src="/images/home-panorama-v2.webp" alt="" fill priority sizes="100vw" />
      </motion.div>
      <div className="entrance-shade absolute top-0 right-0 bottom-0 left-0 z-[-2] [background:linear-gradient(0deg,_var(--background)_0%,_transparent_45%),_linear-gradient(90deg,_#10182066,_#101820f0_27%,_#101820e8_70%,_#10182044)]" />
      <div className="page-width entrance-content mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)] px-0 pt-[21px] pb-[25px] text-center max-[760px]:pt-7 max-[760px]:pb-5.5 [&_h1]:m-auto [&_h1]:tracking-[-0.03em] [&_h1]:text-[clamp(35px,_3.3vw,_51px)] [&_h1]:max-w-none [&_h1]:leading-[1.1] max-[760px]:[&_h1]:m-0 max-[760px]:[&_h1]:text-[35px] max-[760px]:[&_h1]:max-w-[360px] max-[760px]:[&_h1]:text-left [&_>_p]:my-6 [&_>_p]:mx-0 [&_>_p]:text-on-art [&_>_p]:text-[20px] [&_>_p]:leading-[1.6] [&_>_p]:max-w-[52ch] max-[760px]:[&_>_p]:my-5.5 max-[760px]:[&_>_p]:text-[17px] max-[760px]:[&_>_p]:max-w-[35ch] max-[390px]:[&_>_p]:text-[16px]">
        <h1>Where will your curiosity take you?</h1>
        <Form action="/explore" className="home-discovery-form m-auto max-w-[850px]">
          <div className="search-composer entrance-search [&_input]:text-foreground [&_>_svg]:absolute [&_>_svg]:left-[19px] [&_>_svg]:top-[17px] [&_>_svg]:w-[23px] [&_>_svg]:h-[23px] [&_>_svg]:text-foreground max-[760px]:[&_>_svg]:left-[13px] max-[760px]:[&_>_svg]:top-4 max-[760px]:[&_>_svg]:w-4.5 max-[760px]:[&_>_svg]:h-4.5">
            <Search aria-hidden="true" />
            <Label htmlFor="home-question" className="sr-only">
              What would you like to understand?
            </Label>
            <Input id="home-question" name="q" placeholder="What would you like to understand?" />
            <Button type="submit">
              Find a story
              <ArrowRight />
            </Button>
          </div>
          <div className="entrance-filters gap-[15px] flex items-center justify-center max-[760px]:gap-[7px] max-[760px]:justify-start max-[760px]:flex-wrap [&_>_a]:py-2.5 [&_>_a]:px-[15px] [&_>_a]:gap-2 [&_>_a]:min-h-11 [&_>_a]:flex [&_>_a]:items-center [&_>_a]:text-art-accent [&_>_a]:text-[13px] max-[760px]:[&_>_a]:py-2 max-[760px]:[&_>_a]:px-1 max-[760px]:[&_>_a]:gap-[5px] max-[760px]:[&_>_a]:text-[11px]">
            <Select name="topic" defaultValue="all">
              <SelectTrigger aria-label="Topic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem value={topic} key={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="era" defaultValue="all">
              <SelectTrigger aria-label="Time period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All eras</SelectItem>
                <SelectItem value="ancient">Ancient</SelectItem>
                <SelectItem value="medieval">Medieval</SelectItem>
                <SelectItem value="early-modern">Early modern</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
            <a href="#experience-preview">
              See how it works
              <ArrowDown />
            </a>
          </div>
        </Form>
      </div>
    </section>
  );
}

export function ExperiencePreview({ map }: { map: Extract<SceneBeat, { type: "atlas" }>["map"] }) {
  const [selected, setSelected] = useState("object");

  const examples = [
    {
      id: "route",
      title: "Follow a route",
      icon: Route,
      story: "The shape of a signal",
      heading: "Connections change what can travel.",
      body: "Explore the Atlantic connection and the onward networks that made it useful.",
      href: "/stories/shape-of-a-signal/play/1",
    },
    {
      id: "evidence",
      title: "Examine the evidence",
      icon: FileImage,
      story: "The Great Wave, made by hand",
      heading: "Look beyond the wave.",
      body: "Explore an original Edo-period print from The Met.",
      href: "/stories/great-wave-made-by-hand",
    },
    {
      id: "object",
      title: "Turn an object",
      icon: Box,
      story: "The shape of a signal",
      heading: "A vast network begins with a small movement.",
      body: "Explore an early telegraph key from the Smithsonian. Connect an operator's physical action to the problem of carrying a message.",
      href: "/stories/shape-of-a-signal/play/0",
    },
  ];

  const example = examples.find((item) => item.id === selected)!;

  return (
    <section
      className="exhibition-preview page-width discovery-studio mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
      id="experience-preview"
      aria-label="Try interactive history"
    >
      <div className="exhibition-introduction gap-10 flex items-end justify-between mb-6.5 max-[760px]:block [&_h2]:text-[clamp(30px,_3.6vw,_52px)] max-[760px]:[&_h2]:text-[32px] [&_p]:mt-3.5 [&_p]:text-[18px] [&_p]:leading-[1.55] [&_p]:text-muted-foreground max-[760px]:[&_p]:text-[16px] [&_>_span]:text-[13px] [&_>_span]:text-muted-foreground [&_>_span]:whitespace-nowrap max-[760px]:[&_>_span]:hidden">
        <div>
          <h2>History you can get your hands on.</h2>
          <p>Follow the connection. Look closer. Find something you hadn't noticed.</p>
        </div>
      </div>
      <div
        className="discovery-demo-tabs mx-0 gap-3 flex mt-7.5 mb-6 flex-wrap max-[760px]:gap-1.5 max-[760px]:flex-nowrap [&_button]:py-2.5 [&_button]:px-4.5 [&_button]:gap-[9px] [&_button]:flex [&_button]:items-center [&_button]:min-h-12 [&_button]:rounded-[8px] [&_button]:text-muted-foreground max-[760px]:[&_button]:py-2 max-[760px]:[&_button]:px-2.5 max-[760px]:[&_button]:gap-1.5 max-[760px]:[&_button]:text-[12px] max-[760px]:[&_button]:flex-1 max-[760px]:[&_button]:justify-center [&_svg]:w-[19px] [&_svg]:h-[19px] max-[760px]:[&_svg]:w-[17px] max-[760px]:[&_svg]:shrink-0"
        role="tablist"
        aria-label="Ways to explore"
      >
        {examples.map((item) => (
          <button
            key={item.id}
            id={"demo-" + item.id}
            role="tab"
            aria-selected={selected === item.id}
            aria-controls="discovery-demo-panel"
            tabIndex={selected === item.id ? 0 : -1}
            onKeyDown={(event) => {
              const i = examples.indexOf(item);

              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();

                const next = examples[(i + (event.key === "ArrowRight" ? 1 : 2)) % 3];

                setSelected(next.id);
                requestAnimationFrame(() => document.getElementById("demo-" + next.id)?.focus());
              }
            }}
            onClick={() => setSelected(item.id)}
          >
            <item.icon />
            {item.title}
          </button>
        ))}
      </div>
      <div
        id="discovery-demo-panel"
        role="tabpanel"
        aria-labelledby={"demo-" + selected}
        className="discovery-demo-panel exhibit-preview grid grid-cols-[minmax(0,_66%)_minmax(260px,_34%)] items-stretch min-h-[560px] [border-block:1px_solid_var(--line-soft)] max-[760px]:flex max-[760px]:min-h-0 max-[760px]:flex-col"
        data-demo={selected}
        tabIndex={0}
      >
        <div
          className="discovery-demo-art min-w-0 min-h-[560px] bg-surface-deep max-[760px]:min-h-0"
          key={selected}
        >
          {selected === "route" ? (
            <RouteStudy map={map} />
          ) : selected === "evidence" ? (
            <EvidenceStudy
              study={greatWaveStudy}
              action={
                <Button asChild>
                  <Link href={example.href}>
                    Enter the print’s story
                    <ArrowRight />
                  </Link>
                </Button>
              }
            />
          ) : (
            <MuseumObject objectId="telegraph" />
          )}
        </div>
        {selected !== "evidence" ? (
          <div className="discovery-demo-copy py-10 px-[clamp(24px,_3vw,_48px)] flex flex-col items-start justify-center max-[760px]:px-2 max-[760px]:pt-7 max-[760px]:pb-8 [&_>_svg]:w-[23px] [&_>_svg]:h-[23px] [&_>_svg]:text-primary [&_h3]:text-[clamp(28px,_2.7vw,_42px)] [&_h3]:leading-[1.1] [&_h3]:mb-6 max-[760px]:[&_h3]:text-[33px] max-[760px]:[&_h3]:max-w-[20ch]">
            <div className="demo-description">
              <h3>{example.story}</h3>
              <p>{example.body}</p>
            </div>
            <Button asChild>
              <Link href={example.href}>
                Enter this chapter
                <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
