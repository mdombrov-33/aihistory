"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Sound } from "@/lib/journey-store";
export function useNarration(
  text: string[],
  passage: number,
  sound: Sound,
  onPassage: (n: number) => void,
  onMessage: (s: string) => void,
) {
  const [playing, setPlaying] = useState(false);
  const session = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const current = useRef({ sound, onPassage, onMessage });
  useEffect(() => {
    current.current = { sound, onPassage, onMessage };
  }, [sound, onPassage, onMessage]);
  const stop = useCallback(() => {
    session.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    void audio.current?.close();
    audio.current = null;
    setPlaying(false);
  }, []);
  useEffect(
    () => () => {
      session.current++;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      void audio.current?.close();
      audio.current = null;
    },
    [],
  );
  const play = () => {
    if (playing) {
      stop();
      return;
    }
    if (!("speechSynthesis" in window)) {
      onMessage("This browser has no narrator. You can read every passage below.");
      return;
    }
    if (sound.master === 0 || sound.narration === 0) {
      onMessage("Narration is muted. Raise master and narration volume in sound settings.");
      return;
    }
    window.dispatchEvent(new Event("learning:stop-audio"));
    const id = ++session.current;
    window.speechSynthesis.cancel();
    if (sound.music > 0 || sound.environment > 0) {
      try {
        const context = new AudioContext();
        audio.current = context;
        const master = context.createGain();
        master.gain.value = sound.master / 100;
        master.connect(context.destination);
        if (sound.music > 0) {
          const level = context.createGain();
          level.gain.value = (sound.music / 100) * 0.004;
          level.connect(master);
          [65.4, 98, 130.8].forEach((f) => {
            const o = context.createOscillator();
            o.frequency.value = f;
            o.connect(level);
            o.start();
          });
        }
        if (sound.environment > 0) {
          const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
          const samples = buffer.getChannelData(0);
          let previous = 0;
          for (let i = 0; i < samples.length; i++) {
            previous = (previous + 0.02 * (Math.random() * 2 - 1)) / 1.02;
            samples[i] = previous * 3;
          }
          const source = context.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          const filter = context.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 350;
          const level = context.createGain();
          level.gain.value = (sound.environment / 100) * 0.05;
          source.connect(filter);
          filter.connect(level);
          level.connect(master);
          source.start();
        }
      } catch {
        onMessage("Background audio is unavailable. Narration can still play.");
      }
    }
    const speak = (index: number) => {
      if (id !== session.current) return;
      if (index >= text.length) {
        stop();
        onMessage("Scene complete. Continue when you are ready.");
        return;
      }
      current.current.onPassage(index);
      const utterance = new SpeechSynthesisUtterance(text[index]);
      utterance.lang = "en-GB";
      utterance.rate = 0.92;
      utterance.pitch = 0.9;
      utterance.volume =
        ((current.current.sound.master / 100) * current.current.sound.narration) / 100;
      utterance.voice = window.speechSynthesis.getVoices().find((v) => v.lang === "en-GB") ?? null;
      utterance.onend = () => speak(index + 1);
      utterance.onerror = (e) => {
        if (id !== session.current || e.error === "interrupted" || e.error === "canceled") return;
        stop();
        current.current.onMessage("The voice could not play. Try again, or keep reading.");
      };
      window.speechSynthesis.speak(utterance);
    };
    setPlaying(true);
    speak(passage);
  };
  return { playing, play, stop };
}
