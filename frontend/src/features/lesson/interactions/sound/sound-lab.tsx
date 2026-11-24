"use client";

// Harmonic waveform controls and opt-in synthesis with lifecycle-aware audio cleanup.

import { useEffect, useRef, useState } from "react";
import { Play, Square, RotateCcw } from "lucide-react";
import type { Oscillator, Gain } from "tone";
import { z } from "zod";
import { LabRange, LabButton } from "../../shared/controls";
import { harmonicSample } from "./model";
import type { SoundLab as SoundData } from "./schema";
import { useLearningState } from "../../shared/session";
import { useJourney } from "@/state/guest/store";

const stateSchema = z.object({
  fundamental: z.number().min(110).max(440),
  harmonics: z.array(z.number().min(0).max(1)).length(4),
});

export function SoundLab({ sound, onInteract }: { sound: SoundData; onInteract: () => void }) {
  const [{ fundamental, harmonics }, change] = useLearningState(stateSchema, {
    fundamental: sound.fundamental,
    harmonics: sound.harmonics,
  });

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const busy = useRef(false),
    generation = useRef(0);

  const audio = useRef<{ oscillator: Oscillator; gain: Gain } | null>(null);
  const { sound: volume } = useJourney();
  const latest = useRef({ fundamental, harmonics, master: volume.master });

  useEffect(() => {
    latest.current = { fundamental, harmonics, master: volume.master };
  }, [fundamental, harmonics, volume.master]);

  const stop = () => {
    generation.current++;
    busy.current = false;

    if (audio.current) {
      audio.current.oscillator.dispose();
      audio.current.gain.dispose();
      audio.current = null;
    }

    setPlaying(false);
    setLoading(false);
  };

  useEffect(() => {
    const dispose = (notify = true) => {
      generation.current++;
      busy.current = false;
      audio.current?.oscillator.dispose();
      audio.current?.gain.dispose();
      audio.current = null;

      if (notify) {
        setPlaying(false);
        setLoading(false);
      }
    };

    const visibility = () => {
      if (document.hidden) dispose();
    };

    const silence = () => dispose();

    window.addEventListener("learning:stop-audio", silence);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", silence);

    return () => {
      window.removeEventListener("learning:stop-audio", silence);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", silence);
      dispose(false);
    };
  }, []);
  useEffect(() => {
    if (!audio.current) return;

    audio.current.oscillator.frequency.rampTo(fundamental, 0.04);

    if (harmonics.some((v) => v > 0)) audio.current.oscillator.partials = harmonics;

    audio.current.gain.gain.rampTo(
      harmonics.some((v) => v > 0) ? (volume.master / 100) * 0.12 : 0,
      0.03,
    );
  }, [fundamental, harmonics, volume.master]);

  const start = async () => {
    if (busy.current) return;

    if (playing) {
      stop();

      return;
    }

    onInteract();
    setError("");
    busy.current = true;
    setLoading(true);

    const token = ++generation.current;

    try {
      const tone = await import("tone");

      await tone.start();

      if (token !== generation.current) return;

      const current = latest.current;
      const audible = current.harmonics.some((v) => v > 0);
      const gain = new tone.Gain(audible ? (current.master / 100) * 0.12 : 0).toDestination();

      const oscillator = new tone.Oscillator({
        frequency: current.fundamental,
        type: "custom",
        partials: audible ? current.harmonics : [1, 0, 0, 0],
      }).connect(gain);

      audio.current = { oscillator, gain };
      oscillator.start();
      setPlaying(true);
    } catch {
      if (token !== generation.current) return;

      stop();
      setError("Audio could not start. Try again; the waveform and all controls still work.");
    } finally {
      if (token === generation.current) {
        busy.current = false;
        setLoading(false);
      }
    }
  };

  const silent = harmonics.every((value) => value === 0);

  const preset = sound.presets.find((p) =>
    p.harmonics.every((v, i) => Math.abs(v - harmonics[i]) < 0.001),
  );

  const path = Array.from(
    { length: 401 },
    (_, i) =>
      `${i ? "L" : "M"}${25 + i * 1.625},${190 - harmonicSample((i / 400) * Math.PI * 6, harmonics) * 100}`,
  ).join(" ");

  return (
    <section className="learning-lab" aria-label="Sound studio">
      <div className="lab-canvas sound-viewport [&_>_svg]:block [&_>_svg]:w-full [&_>_svg]:h-full [&_>_svg]:min-h-[260px] [&_>_svg]:max-h-[55dvh]">
        <svg
          viewBox="0 0 700 380"
          role="img"
          aria-label={`Combined waveform at ${fundamental} hertz with four adjustable harmonics`}
        >
          <path d="M25 190H675" className="lab-axis" />
          <path d={path} className="sound-wave" />
          <text x="30" y="45">
            {fundamental} Hz fundamental
          </text>
          <text x="30" y="340">
            Three cycles · relative waveform shape
          </text>
        </svg>
      </div>
      <div className="lab-controls py-5 px-6.5 gap-4 grid bg-muted [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5">
        <div className="lab-actions gap-2 flex flex-wrap items-center">
          <LabButton
            className="lab-play"
            variant="primary"
            disabled={loading}
            aria-busy={loading}
            onClick={() => void start()}
            aria-pressed={playing}
          >
            {playing ? <Square size={16} /> : <Play size={16} />}
            {loading ? "Preparing sound…" : playing ? "Stop sound" : "Play sound"}
          </LabButton>
          <LabButton
            onClick={() => {
              onInteract();
              change({ fundamental: sound.fundamental, harmonics: sound.harmonics });
            }}
          >
            <RotateCcw size={16} /> Reset
          </LabButton>
        </div>
        <LabRange
          label="Fundamental"
          value={fundamental}
          min={110}
          max={440}
          unit=" Hz"
          onChange={(n) => {
            onInteract();
            change({ fundamental: n });
          }}
        />
        <div className="harmonic-controls grid grid-cols-[repeat(2,_minmax(0,_1fr))] gap-y-3 gap-x-6">
          {harmonics.map((amplitude, i) => (
            <LabRange
              key={i}
              label={`${i + 1} × frequency`}
              value={amplitude}
              min={0}
              max={1}
              step={0.01}
              onChange={(n) => {
                onInteract();
                change({ harmonics: harmonics.map((v, index) => (index === i ? n : v)) });
              }}
            />
          ))}
        </div>
        <div className="lab-choices gap-2 flex flex-wrap items-center" aria-label="Sound presets">
          {sound.presets.map((p) => (
            <LabButton
              key={p.label}
              aria-pressed={preset?.label === p.label}
              onClick={() => {
                onInteract();
                change({ harmonics: p.harmonics });
              }}
            >
              {p.label}
            </LabButton>
          ))}
        </div>
      </div>
      <div
        className="lab-feedback py-5 px-6.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:px-5 [&_h2]:mx-0 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:mt-0 [&_h2]:mb-2 [&_p]:mx-0 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:mt-1.5 [&_p]:mb-0 [&_p]:max-w-[65ch]"
        aria-live="polite"
      >
        <h2>{silent ? "Silence" : (preset?.label ?? "Your own mixture")}</h2>
        <p>
          {silent
            ? "Every component is zero. The waveform is flat and the output is silent."
            : (preset?.explanation ??
              "The fundamental sets a reference frequency. Changing the relative harmonics changes the repeating shape and the tone’s character.")}
        </p>
        {volume.master === 0 ? (
          <p>Master sound is muted in Settings. You can still explore the wave visually.</p>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
      </div>
      <details className="lab-assumptions px-6.5 pt-0 pb-5 text-[14px] text-muted-foreground max-[760px]:px-5 max-[760px]:pb-4 [&_summary]:py-3 [&_summary]:px-0 [&_summary]:cursor-pointer [&_summary]:text-foreground [&_p]:mx-0 [&_p]:leading-[1.55] [&_p]:mt-0 [&_p]:mb-2 [&_ul]:mx-0 [&_ul]:leading-[1.55] [&_ul]:mt-0 [&_ul]:mb-2">
        <summary>About this sound</summary>
        <p>
          Four ideal sine components at integer multiples of the fundamental. The plot is
          amplitude-normalized; it is not a calibrated sound-pressure measurement. Audio starts only
          with Play and stops when leaving this scene or hiding the tab.
        </p>
      </details>
    </section>
  );
}
