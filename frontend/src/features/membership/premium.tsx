"use client";

// Plan comparison and review with device-local sample selection, never a real purchase.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, BookOpen, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJourney, updateJourney } from "@/state/guest/store";
import { PreviewNote } from "@/components/app/feature-page";
import { safeDestination } from "@/lib/navigation";

const benefits = {
  free: [
    "Explore the public library",
    "Read, listen and inspect sources",
    "Save your place and passage bookmarks",
    "Use every appearance and accessibility setting",
  ],
  premium: [
    "Everything in the public library",
    "A personal guide for your questions",
    "Create lessons around your interests",
    "Ask follow-up questions as you explore",
  ],
};

export function PremiumSelection() {
  const { product } = useJourney();

  const [plan, setPlan] = useState<"free" | "premium">(
    product.membership === "free" ? "free" : "premium",
  );

  return (
    <div className="pb-6">
      <div className="mb-9 max-w-[66ch] text-base leading-relaxed text-muted-foreground">
        Some questions lead to another. Keep exploring the library for free, or look at a more
        personal way to learn.
      </div>
      <fieldset className="grid gap-4 md:grid-cols-2">
        <legend className="sr-only">Select a learning plan</legend>
        {(["free", "premium"] as const).map((value) => (
          <label
            key={value}
            className="relative grid cursor-pointer content-start gap-5 rounded-2xl border border-rule bg-card p-6 has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl">{value === "free" ? "Free" : "Premium"}</h2>
              <input
                type="radio"
                name="plan"
                value={value}
                checked={plan === value}
                onChange={() => setPlan(value)}
                className="size-5 accent-primary"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">
                {value === "free" ? "A world open to everyone." : "Follow your own questions."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {value === "free" ? "Always free" : "Price and included allowances to be announced"}
              </p>
            </div>
            <ul className="grid gap-4 border-t border-rule pt-5">
              {benefits[value].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </label>
        ))}
      </fieldset>
      <div
        className="mt-6 flex flex-wrap items-center justify-between gap-5 border-y border-rule py-5"
        aria-live="polite"
      >
        <div>
          <p className="font-semibold">
            {plan === "free" ? "Free library access" : "Premium preview selected"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {plan === "free"
              ? "Start with any lesson. No membership needed."
              : "Review the experience before any commercial terms are settled."}
          </p>
        </div>
        <Button asChild>
          <Link href={plan === "free" ? "/explore" : "/premium/review"}>
            {plan === "free" ? "Explore the library" : "Review Premium"}
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid items-start gap-7 md:grid-cols-[1fr_1fr]">
        <div>
          <Route className="mb-4 size-6 text-primary" aria-hidden="true" />
          <h2 className="text-2xl">Learning that has a next step.</h2>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
            Make a trail around a question, choose what interests you and keep your own notes. Your
            guide connects lessons without making a curriculum compulsory.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/guide">
              Try the learning guide
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="border-t border-rule pt-5">
          <BookOpen className="mb-4 size-6 text-primary" aria-hidden="true" />
          <h2 className="text-2xl">The library stays open.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Public lessons, sources and accessibility do not depend on Premium. If new creation is
            paused or your allowance runs out, the learning you already have stays available.
          </p>
        </div>
      </div>
      <PreviewNote>
        Premium is a product preview. No price, purchase, subscription or paid allowance is active.
      </PreviewNote>
    </div>
  );
}

export function PremiumReview({ next }: { next?: string }) {
  const router = useRouter(),
    { product } = useJourney();

  return (
    <div className="grid gap-8 pb-8 lg:grid-cols-[1.35fr_1fr]">
      <section>
        <h2 className="text-2xl">Your questions, connected.</h2>
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
          Explore the proposed Premium membership, personal learning guide and creation allowance
          states. The preview lets you see how they fit together.
        </p>
        <ul className="mt-6 grid gap-4">
          {benefits.premium.map((item) => (
            <li key={item} className="flex gap-3 text-sm">
              <Check className="size-4 text-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <Button asChild variant="ghost" className="mt-6">
          <Link href="/premium">Change selection</Link>
        </Button>
      </section>
      <section className="rounded-2xl border border-rule bg-card p-6">
        <h2 className="text-2xl">Premium preview</h2>
        <dl className="mt-5 grid gap-4 text-sm">
          <div className="flex justify-between gap-5">
            <dt>Price</dt>
            <dd>Not set</dd>
          </div>
          <div className="flex justify-between gap-5">
            <dt>Payment today</dt>
            <dd>None</dd>
          </div>
          <div className="flex justify-between gap-5">
            <dt>Renewal</dt>
            <dd>Not scheduled</dd>
          </div>
        </dl>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            updateJourney((s) => ({
              ...s,
              product: {
                ...s.product,
                membership: "premium",
                usage: { lessons: 0, questions: 0, paused: false },
              },
            }));
            router.push(safeDestination(next, "/account/membership"));
          }}
        >
          Use Premium preview
          <ArrowRight />
        </Button>
        {!product.profile ? (
          <Link
            className="mt-4 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
            href="/sign-in?next=%2Fpremium%2Freview"
          >
            Try the account preview first
          </Link>
        ) : null}
        <PreviewNote>
          This changes a sample membership on this device. No payment details are collected and no
          purchase is made.
        </PreviewNote>
      </section>
    </div>
  );
}
