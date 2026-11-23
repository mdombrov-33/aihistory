"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Square, RotateCcw } from "lucide-react";
import type { Oscillator, Gain } from "tone";
import { z } from "zod";
import { LabRange } from "./controls";
import { harmonicSample } from "./models";
import type { SoundLab as SoundData } from "./schema";
import { useLearningState } from "./session";
import { useJourney } from "@/lib/journey-store";
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
      <div className="lab-canvas sound-viewport">
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
      <div className="lab-controls">
        <div className="lab-actions">
          <button
            className="lab-play"
            disabled={loading}
            aria-busy={loading}
            onClick={() => void start()}
            aria-pressed={playing}
          >
            {playing ? <Square size={16} /> : <Play size={16} />}
            {loading ? "Preparing sound…" : playing ? "Stop sound" : "Play sound"}
          </button>
          <button
            onClick={() => {
              onInteract();
              change({ fundamental: sound.fundamental, harmonics: sound.harmonics });
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
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
        <div className="harmonic-controls">
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
        <div className="lab-choices" aria-label="Sound presets">
          {sound.presets.map((p) => (
            <button
              key={p.label}
              aria-pressed={preset?.label === p.label}
              onClick={() => {
                onInteract();
                change({ harmonics: p.harmonics });
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lab-feedback" aria-live="polite">
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
      <details className="lab-assumptions">
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
