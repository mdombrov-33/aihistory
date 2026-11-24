"use client";

// Theme, reading, motion and sound preferences backed by device-local guest state.

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { themeOptions } from "@/features/settings/theme-options";
import { useJourney, updateJourney } from "@/state/guest/store";
import { clearJourney } from "@/state/guest/actions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { SoundControls } from "./sound-controls";

const subscribeToMount = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function Preferences() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToMount, clientSnapshot, serverSnapshot);
  const selectedTheme = mounted ? theme : undefined;
  const preferences = useJourney();

  return (
    <div className="settings-layout grid items-start gap-8 pb-12 lg:grid-cols-[160px_minmax(0,800px)] lg:gap-12">
      <nav
        className="settings-sections flex gap-1 overflow-x-auto border-b border-rule pb-2 lg:sticky lg:top-6 lg:grid lg:border-0 [&_a]:flex [&_a]:min-h-11 [&_a]:shrink-0 [&_a]:items-center [&_a]:rounded-lg [&_a]:px-3 [&_a]:text-sm [&_a:hover]:bg-muted"
        aria-label="Settings sections"
      >
        <a href="#appearance">Appearance</a>
        <a href="#sound">Sound</a>
        <a href="#reading">Reading & motion</a>
        <a href="#device">This device</a>
      </nav>
      <div className="settings-content grid min-w-0 gap-10 [&_h2]:text-2xl [&_section]:scroll-mt-6">
        <section
          id="appearance"
          className="settings-section [&_h2]:mb-2 [&_>_p]:mb-5 [&_>_p]:text-sm [&_>_p]:leading-relaxed [&_>_p]:text-muted-foreground"
        >
          <h2>Appearance</h2>
          <p>Choose a palette. Artwork keeps its original colours.</p>
          <div className="theme-options grid grid-cols-2 gap-3" aria-label="Colour theme">
            {themeOptions.map((option) => (
              <button
                className="theme-option grid min-w-0 content-start gap-3 rounded-xl border border-border bg-card p-3 text-left hover:bg-muted aria-pressed:border-primary aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-primary sm:p-4 [&_strong]:flex [&_strong]:items-center [&_strong]:gap-2 [&_strong]:text-sm [&_strong_svg]:size-4 [&_strong_svg]:text-primary [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-muted-foreground"
                key={option.value}
                aria-pressed={selectedTheme === option.value}
                onClick={() => setTheme(option.value)}
              >
                <span
                  className="theme-swatches flex w-full gap-1 [&_span]:h-8 [&_span]:min-w-0 [&_span]:flex-1 [&_span]:rounded"
                  aria-hidden="true"
                >
                  {option.swatches.map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </span>
                <strong>
                  {option.label}
                  {selectedTheme === option.value ? <Check /> : null}
                </strong>
                <p>{option.description}</p>
              </button>
            ))}
          </div>
        </section>
        <section
          id="sound"
          className="settings-section [&_h2]:mb-2 [&_>_p]:mb-5 [&_>_p]:text-sm [&_>_p]:leading-relaxed [&_>_p]:text-muted-foreground"
        >
          <h2>Sound</h2>
          <p>
            Listen to the story, soften the background, or keep a quiet reading space. Audio starts
            only when you choose Listen.
          </p>
          <SoundControls />
        </section>
        <section
          id="reading"
          className="settings-section [&_h2]:mb-2 [&_>_p]:mb-5 [&_>_p]:text-sm [&_>_p]:leading-relaxed [&_>_p]:text-muted-foreground"
        >
          <h2>Reading & motion</h2>
          <div className="preference-row py-5.5 px-0 gap-7.5 [border-bottom:1px_solid_var(--line-soft)] flex justify-between items-center max-[760px]:gap-[25px] [&_label]:font-semibold [&_p]:text-[15px] [&_p]:text-muted-foreground [&_p]:mt-[7px]">
            <div>
              <label htmlFor="large-text">Larger story text</label>
              <p>Give the full lesson text a little more room.</p>
            </div>
            <Switch
              id="large-text"
              checked={preferences.largerText}
              onCheckedChange={(value) => updateJourney((s) => ({ ...s, largerText: value }))}
            />
          </div>
          <div className="preference-row py-5.5 px-0 gap-7.5 [border-bottom:1px_solid_var(--line-soft)] flex justify-between items-center max-[760px]:gap-[25px] [&_label]:font-semibold [&_p]:text-[15px] [&_p]:text-muted-foreground [&_p]:mt-[7px]">
            <div>
              <label htmlFor="reduce-motion">Reduce motion</label>
              <p>
                Keep transitions and explanatory animations still. Your device’s reduced motion
                preference is also respected.
              </p>
            </div>
            <Switch
              id="reduce-motion"
              checked={preferences.reduceMotion}
              onCheckedChange={(value) => updateJourney((s) => ({ ...s, reduceMotion: value }))}
            />
          </div>
        </section>
        <section
          id="device"
          className="settings-section [&_h2]:mb-2 [&_>_p]:mb-5 [&_>_p]:text-sm [&_>_p]:leading-relaxed [&_>_p]:text-muted-foreground"
        >
          <h2>This device</h2>
          <p>
            Guest progress, saved stories, bookmarks and preferences stay in this browser. They are
            not yet synced to an account.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Clear guest activity</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear your guest activity?</DialogTitle>
                <DialogDescription>
                  This removes your progress, bookmarks, saved stories, demo requests and sound
                  preferences from this browser. Your colour theme stays selected.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Keep my activity</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      clearJourney();
                      toast("Guest activity cleared on this device");
                    }}
                  >
                    Clear activity
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </div>
  );
}
