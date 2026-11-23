"use client";
import { createContext, useContext, type ReactNode } from "react";
import { z } from "zod";
import { useJourney, updateJourney } from "@/lib/journey-store";
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
