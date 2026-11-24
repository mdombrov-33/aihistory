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
    <div className="settings-layout">
      <nav className="settings-sections" aria-label="Settings sections">
        <a href="#appearance">Appearance</a>
        <a href="#sound">Sound</a>
        <a href="#reading">Reading & motion</a>
        <a href="#device">This device</a>
      </nav>
      <div className="settings-content">
        <section id="appearance" className="settings-section">
          <h2>A world that feels like yours.</h2>
          <p>
            Choose a palette for discovery, controls and reading. Scene artwork keeps its original
            colours.
          </p>
          <div className="theme-options" aria-label="Colour theme">
            {themeOptions.map((option) => (
              <button
                className="theme-option"
                key={option.value}
                aria-pressed={selectedTheme === option.value}
                onClick={() => setTheme(option.value)}
              >
                <span className="theme-swatches" aria-hidden="true">
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
        <section id="sound" className="settings-section">
          <h2>Set the atmosphere.</h2>
          <p>
            Listen to the story, soften the background, or keep a quiet reading space. Audio starts
            only when you choose Listen.
          </p>
          <SoundControls />
        </section>
        <section id="reading" className="settings-section">
          <h2>Find your own pace.</h2>
          <div className="preference-row">
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
          <div className="preference-row">
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
        <section id="device" className="settings-section">
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
          <div className="preview-notice">
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
