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
    <section className="home-entrance">
      <motion.div
        className="entrance-art"
        initial={false}
        animate={still ? { scale: 1 } : { scale: [1, 1.025] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <Image src="/images/home-panorama-v2.webp" alt="" fill priority sizes="100vw" />
      </motion.div>
      <div className="entrance-shade" />
      <div className="page-width entrance-content">
        <h1>Where will your curiosity take you?</h1>
        <Form action="/explore" className="home-discovery-form">
          <div className="search-composer entrance-search">
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
          <div className="entrance-filters">
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
      className="exhibition-preview page-width discovery-studio"
      id="experience-preview"
      aria-label="Try interactive history"
    >
      <div className="exhibition-introduction">
        <div>
          <h2>History you can get your hands on.</h2>
          <p>Follow the connection. Look closer. Find something you hadn't noticed.</p>
        </div>
      </div>
      <div className="discovery-demo-tabs" role="tablist" aria-label="Ways to explore">
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
        className="discovery-demo-panel exhibit-preview"
        data-demo={selected}
        tabIndex={0}
      >
        <div className="discovery-demo-art" key={selected}>
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
          <div className="discovery-demo-copy">
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
