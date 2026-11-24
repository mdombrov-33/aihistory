"use client";

// Panoramic question entry: real catalog search and a direct route to the interactive showcases.

import Form from "next/form";
import Image from "next/image";
import { Search, ArrowRight, ArrowDown, SlidersHorizontal } from "lucide-react";
import { topics } from "@/content/catalog/catalog";
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

export function HomeEntrance() {
  return (
    <section className="relative isolate overflow-hidden bg-art-ink text-on-art">
      <Image
        src="/images/home/discovery-landscape.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#10182015_0%,#10182055_36%,#101820d9_100%)]" />
      <div className="mx-auto max-w-[1540px] px-5 pb-12 pt-16 sm:px-9 sm:pb-14 sm:pt-20 lg:px-14 lg:pt-24">
        <h1 className="mb-7 text-center text-[clamp(30px,3.4vw,48px)] leading-[1.12] text-on-art">
          Where will your curiosity take you?
        </h1>
        <Form action="/explore" className="mx-auto max-w-[880px]">
          <div className="flex items-stretch gap-2.5 sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground sm:left-5"
                aria-hidden="true"
              />
              <Label htmlFor="home-question" className="sr-only">
                What would you like to understand?
              </Label>
              <Input
                id="home-question"
                name="q"
                placeholder="What would you like to understand?"
                className="h-14 w-full rounded-xl border-input bg-card pl-12 pr-3 text-base text-foreground placeholder:text-muted-foreground sm:h-16 sm:pl-14 sm:text-lg"
              />
            </div>
            <Button type="submit" className="h-14 rounded-xl px-4 text-base sm:h-16 sm:px-7">
              <span className="hidden sm:inline">Explore</span>
              <span className="sr-only sm:hidden">Explore lessons</span>
              <ArrowRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-on-art" aria-hidden="true" />
              <Select name="topic" defaultValue="all">
                <SelectTrigger
                  aria-label="Topic"
                  className="min-h-11 min-w-[155px] rounded-full border-[#f7efdf66] bg-art-ink/70 text-on-art"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <a
              href="#moon-showcase"
              className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-on-art underline-offset-4 hover:underline"
            >
              Try something below <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </Form>
      </div>
    </section>
  );
}
