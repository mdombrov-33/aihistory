"use client";

// Scopes persisted mechanic parameters and typed construction drafts to a lesson beat.

import { createContext, useContext, type ReactNode } from "react";
import { z } from "zod";
import {
  constructionDraftSchema,
  type Construction,
  type ConstructionDraft,
} from "../interactions/logic/construction-model";
import { useJourney, updateJourney } from "@/state/guest/store";

const Scope = createContext<string | null>(null);

export function LearningSession({ scope, children }: { scope: string; children: ReactNode }) {
  return <Scope value={scope}>{children}</Scope>;
}

export function useLearningState<T extends Record<string, number | boolean | string | number[]>>(
  schema: z.ZodType<T>,
  defaults: T,
): [T, (update: Partial<T>) => void] {
  const scope = useContext(Scope);
  const journey = useJourney();
  const result = schema.safeParse(scope ? journey.labs[scope] : undefined);
  const value = result.success ? result.data : defaults;

  const change = (update: Partial<T>) => {
    if (!scope) return;

    updateJourney((current) => {
      const previous = schema.safeParse(current.labs[scope]);
      const next = schema.parse({ ...(previous.success ? previous.data : defaults), ...update });

      const entries = Object.entries(current.labs)
        .filter(([key]) => key !== scope)
        .slice(-99);

      return { ...current, labs: { ...Object.fromEntries(entries), [scope]: next } };
    });
  };

  return [value, change];
}

export function useConstructionState(
  construction: Construction,
): [ConstructionDraft, (next: ConstructionDraft) => void] {
  const scope = useContext(Scope);
  const journey = useJourney();

  const defaults: ConstructionDraft = {
    version: 1,
    edges: construction.initialEdges,
    inputs: Object.fromEntries(
      construction.nodes.filter((n) => n.kind === "input").map((n) => [n.id, false]),
    ),
  };

  const stored = constructionDraftSchema.safeParse(
    scope ? journey.constructions[scope] : undefined,
  );

  const ids = new Set(construction.nodes.map((n) => n.id));

  const compatible =
    stored.success &&
    stored.data.edges.every((e) => ids.has(e.from) && ids.has(e.to)) &&
    Object.keys(stored.data.inputs).every((id) => defaults.inputs[id] !== undefined);

  const value = compatible ? stored.data : defaults;

  const change = (next: ConstructionDraft) => {
    if (!scope) return;

    const validated = constructionDraftSchema.parse(next);

    updateJourney((current) => ({
      ...current,
      constructions: {
        ...Object.fromEntries(
          Object.entries(current.constructions)
            .filter(([key]) => key !== scope)
            .slice(-99),
        ),
        [scope]: validated,
      },
    }));
  };

  return [value, change];
}
