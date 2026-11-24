"use client";

// Theme, reading, motion and sound preferences backed by device-local guest state.

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Check, Info } from "lucide-react";
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
    <div className="settings-layout gap-[65px] grid grid-cols-[210px_minmax(0,_850px)] pb-12.5 max-[1050px]:gap-[35px] max-[1050px]:grid-cols-[160px_1fr] max-[760px]:block max-[760px]:pb-[25px]">
      <nav
        className="settings-sections [&_a:hover]:bg-secondary gap-[5px] grid [align-content:start] sticky top-[25px] [align-self:start] max-[760px]:gap-[3px] max-[760px]:overflow-auto max-[760px]:flex max-[760px]:static max-[760px]:mb-7 max-[760px]:[border-bottom:1px_solid_var(--border)] [&_a]:py-3 [&_a]:px-[15px] [&_a]:min-h-11 [&_a]:rounded-[6px] [&_a]:text-[16px] max-[760px]:[&_a]:p-2.5 max-[760px]:[&_a]:text-[14px] max-[760px]:[&_a]:whitespace-nowrap"
        aria-label="Settings sections"
      >
        <a href="#appearance">Appearance</a>
        <a href="#sound">Sound</a>
        <a href="#reading">Reading & motion</a>
        <a href="#device">This device</a>
      </nav>
      <div className="settings-content gap-12 grid max-[760px]:gap-9.5">
        <section
          id="appearance"
          className="settings-section [scroll-margin-top:30px] [&_h2]:mb-[13px] [&_>_p]:text-muted-foreground [&_>_p]:mb-6"
        >
          <h2>A world that feels like yours.</h2>
          <p>
            Choose a palette for discovery, controls and reading. Scene artwork keeps its original
            colours.
          </p>
          <div
            className="theme-options gap-3.5 grid grid-cols-[repeat(2,_minmax(0,_1fr))] max-[760px]:gap-[9px] max-[760px]:grid-cols-[1fr]"
            aria-label="Colour theme"
          >
            {themeOptions.map((option) => (
              <button
                className="theme-option [&_strong_svg]:w-[17px] [&_strong_svg]:text-primary p-4.5 gap-3 text-left flex flex-col min-h-[175px] border border-border rounded-[10px] bg-card max-[760px]:p-3 max-[760px]:gap-2.5 max-[760px]:min-h-[150px] max-[400px]:min-h-0 aria-pressed:[outline:2px_solid_var(--primary)] aria-pressed:[outline-offset:2px] [&_strong]:gap-2 [&_strong]:flex [&_strong]:items-center max-[760px]:[&_strong]:text-[14px] max-[400px]:[&_strong]:text-[17px] [&_p]:text-[13px] [&_p]:leading-[1.5] [&_p]:text-muted-foreground max-[760px]:[&_p]:text-[12px] max-[400px]:[&_p]:text-[14px] hover:bg-muted"
                key={option.value}
                aria-pressed={selectedTheme === option.value}
                onClick={() => setTheme(option.value)}
              >
                <span
                  className="theme-swatches gap-[5px] flex max-[400px]:max-w-[180px] max-[400px]:w-full [&_span]:h-7.5 [&_span]:flex-1 [&_span]:rounded-[3px] max-[760px]:[&_span]:h-6"
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
          className="settings-section [scroll-margin-top:30px] [&_h2]:mb-[13px] [&_>_p]:text-muted-foreground [&_>_p]:mb-6"
        >
          <h2>Set the atmosphere.</h2>
          <p>
            Listen to the story, soften the background, or keep a quiet reading space. Audio starts
            only when you choose Listen.
          </p>
          <SoundControls />
        </section>
        <section
          id="reading"
          className="settings-section [scroll-margin-top:30px] [&_h2]:mb-[13px] [&_>_p]:text-muted-foreground [&_>_p]:mb-6"
        >
          <h2>Find your own pace.</h2>
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
          className="settings-section [scroll-margin-top:30px] [&_h2]:mb-[13px] [&_>_p]:text-muted-foreground [&_>_p]:mb-6"
        >
          <h2>Your place, on this device.</h2>
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
          <div className="preview-notice my-6 mx-0 py-3.5 px-4.5 gap-3 bg-secondary rounded-[8px] text-[14px] text-muted-foreground flex items-start [&_svg]:w-4.5 [&_svg]:mt-0.5">
            <Info />
            <p>
              History is a working name. Account sync, provider settings and payments will be
              connected in later implementation stages.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
