"use client";

// Sample membership, usage and cancellation states, separate from paid entitlements.

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJourney, updateJourney } from "@/state/guest/store";
import { sampleAllowances, remainingUsage } from "./model";
import { PreviewNote } from "@/components/app/feature-page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function Membership() {
  const { product } = useJourney();
  const [cancel, setCancel] = useState(false);
  const premium = product.membership !== "free";

  function sample(state: "available" | "exhausted" | "paused") {
    updateJourney((s) => ({
      ...s,
      product: {
        ...s.product,
        usage: {
          lessons: state === "exhausted" ? sampleAllowances.lessons : 0,
          questions: state === "exhausted" ? sampleAllowances.questions : 0,
          paused: state === "paused",
        },
      },
    }));
  }

  return (
    <div className="pb-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <section>
          <h2 className="text-3xl">{premium ? "Premium" : "Free library"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.membership === "canceling"
              ? "Cancellation preview · no real renewal was scheduled."
              : premium
                ? "Sample membership · no renewal scheduled."
                : "Public lessons, sources and saved reading."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={premium ? "/create" : "/premium"}>
                {premium ? "Follow a new question" : "Explore Premium"}
                <ArrowRight />
              </Link>
            </Button>
            {premium ? (
              <Button
                variant="outline"
                onClick={() =>
                  product.membership === "canceling"
                    ? updateJourney((s) => ({
                        ...s,
                        product: { ...s.product, membership: "premium" },
                      }))
                    : setCancel(true)
                }
              >
                {product.membership === "canceling"
                  ? "Keep Premium preview"
                  : "Cancel preview membership"}
              </Button>
            ) : null}
          </div>
        </section>
        <section className="rounded-2xl border border-rule p-6">
          <h2 className="text-2xl">Sample monthly usage</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Illustrative allowances for exploring the interface, not an offer or an entitlement.
          </p>
          <dl className="mt-5 grid gap-5">
            {(["lessons", "questions"] as const).map((kind) => (
              <div
                key={kind}
                className="flex items-center justify-between gap-4 border-t border-rule pt-4"
              >
                <dt>{kind === "lessons" ? "New lessons" : "Follow-up questions"}</dt>
                <dd className="text-sm tabular-nums">
                  {premium ? remainingUsage(product.usage[kind], sampleAllowances[kind]) : 0} of{" "}
                  {premium ? sampleAllowances[kind] : 0} remaining
                </dd>
              </div>
            ))}
          </dl>
          <output className="mt-5 block text-sm">
            {product.usage.paused
              ? "New creation is paused. Your library and trails remain available."
              : premium && product.usage.lessons >= sampleAllowances.lessons
                ? "The sample lesson allowance is used. Keep exploring your library or review your options."
                : premium
                  ? "The sample allowance is available. No credits are consumed in this preview."
                  : "A creation allowance has not been assigned to the Free offer."}
          </output>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/explore">Return to the library</Link>
          </Button>
        </section>
      </div>
      <details className="mt-8 border-t border-rule py-4">
        <summary className="min-h-11 cursor-pointer text-sm text-muted-foreground">
          Try usage states
        </summary>
        <div className="mt-3 flex flex-wrap gap-3">
          {(["available", "exhausted", "paused"] as const).map((state) => (
            <Button key={state} variant="outline" onClick={() => sample(state)}>
              {state === "available"
                ? "Available allowance"
                : state === "exhausted"
                  ? "Limit reached"
                  : "Creation paused"}
            </Button>
          ))}
        </div>
      </details>
      <PreviewNote />
      <Dialog open={cancel} onOpenChange={setCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave the Premium preview?</DialogTitle>
            <DialogDescription>
              Your lessons, bookmarks and learning trails stay on this device. There is no payment
              or real subscription to cancel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancel(false)}>
              Keep it
            </Button>
            <Button
              onClick={() => {
                updateJourney((s) => ({
                  ...s,
                  product: { ...s.product, membership: "canceling" },
                }));
                setCancel(false);
              }}
            >
              Confirm cancellation preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
