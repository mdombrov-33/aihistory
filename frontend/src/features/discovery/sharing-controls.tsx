"use client";

// Personal creation visibility and revocation previews, with no public publication service.

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJourney, updateJourney } from "@/state/guest/store";

export function SharingControls({ id, ready }: { id: string; ready: boolean }) {
  const { product } = useJourney();
  const current = product.sharing[id];
  const visibility = current?.visibility ?? "private";
  const [manual, setManual] = useState("");

  function select(value: "private" | "link" | "public") {
    updateJourney((s) => ({
      ...s,
      product: {
        ...s.product,
        sharing: {
          ...s.product.sharing,
          [id]: { visibility: value, token: crypto.randomUUID(), submitted: false },
        },
      },
    }));
    setManual("");
  }

  return (
    <section className="mt-4 rounded-xl border border-rule p-4">
      <h3 className="font-heading text-xl">Who can open it?</h3>
      <fieldset className="mt-3 grid gap-1">
        <legend className="sr-only">Creation visibility preview</legend>
        {(
          [
            ["private", "Private", "Only your local account preview."],
            ["link", "Anyone with a link", "A revocable, device-local link preview."],
            ["public", "Submit to the library", "Separate review before public discovery."],
          ] as const
        ).map(([value, label, description]) => (
          <label
            aria-label={label}
            key={value}
            className="flex min-h-11 cursor-pointer items-start gap-3 py-3"
          >
            <input
              type="radio"
              name={`visibility-${id}`}
              checked={visibility === value}
              onChange={() => select(value)}
              className="mt-1 size-4 accent-primary"
            />
            <span>
              <span className="block text-sm font-semibold">{label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      {visibility === "link" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const url = `${location.origin}/creations/${encodeURIComponent(id)}?share=${encodeURIComponent(current?.token ?? "")}`;

              try {
                await navigator.clipboard.writeText(url);
                toast("Local preview link copied. It only opens on this device.");
              } catch {
                setManual(url);
              }
            }}
          >
            Copy preview link
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              select("private");
              toast("Preview link revoked");
            }}
          >
            Revoke link
          </Button>
        </div>
      ) : visibility === "public" ? (
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
            {ready
              ? "Complete content, sources, media rights and moderation will be checked before listing."
              : "Finish the preparation preview before trying public submission."}
          </p>
          <Button
            className="mt-3"
            disabled={!ready || current?.submitted}
            onClick={() =>
              updateJourney((s) => ({
                ...s,
                product: {
                  ...s.product,
                  sharing: {
                    ...s.product.sharing,
                    [id]: {
                      visibility: "public",
                      token: current?.token ?? crypto.randomUUID(),
                      submitted: true,
                    },
                  },
                },
              }))
            }
          >
            {current?.submitted ? "Submission preview saved" : "Preview public submission"}
          </Button>
        </div>
      ) : null}
      {manual ? (
        <Input
          aria-label="Copy local preview link"
          className="mt-3"
          readOnly
          value={manual}
          onFocus={(e) => e.target.select()}
        />
      ) : null}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Visibility controls demonstrate the flow on this device. They do not publish content or
        enforce access on a server.
      </p>
    </section>
  );
}
