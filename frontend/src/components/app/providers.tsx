"use client";

import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { MotionConfig } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useJourney } from "@/lib/journey-store";
import { themeOptions } from "@/content/theme-options";

const themes = themeOptions.map((option) => option.value);

function ThemeChrome() {
  const { theme } = useTheme();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
    });
    return () => cancelAnimationFrame(frame);
  }, [theme]);
  return (
    <Toaster
      theme={theme === "parchment" || theme === "mineral" ? "light" : "dark"}
      richColors
      position="bottom-right"
    />
  );
}
export function Providers({ children }: { children: React.ReactNode }) {
  const preferences = useJourney();
  return (
    <ThemeProvider
      key={themes.join(":")}
      attribute="class"
      themes={themes}
      defaultTheme="worlds"
      enableSystem={false}
      enableColorScheme={false}
      storageKey="history-worlds:theme:v1"
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion={preferences.reduceMotion ? "always" : "user"}>
        <TooltipProvider delayDuration={250}>
          <div
            data-motion={preferences.reduceMotion ? "reduced" : "full"}
            data-reader={preferences.largerText ? "large" : "comfortable"}
          >
            {children}
          </div>
          <ThemeChrome />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
