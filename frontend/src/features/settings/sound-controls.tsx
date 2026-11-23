"use client";
import { Volume2, Mic2, Music2, Waves } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useJourney, updateJourney, type Sound } from "@/lib/journey-store";
const controls = [
  { key: "master", label: "Master volume", icon: Volume2 },
  { key: "narration", label: "Narration", icon: Mic2 },
  { key: "music", label: "Music", icon: Music2 },
  { key: "environment", label: "Environment", icon: Waves },
] as const;
export function SoundControls() {
  const { sound } = useJourney();
  return (
    <div>
      {controls.map(({ key, label, icon: Icon }) => (
        <div className="volume-control" key={key}>
          <div>
            <Icon size={17} aria-hidden="true" />
            <label id={`volume-${key}`}>{label}</label>
            <output>{sound[key]}%</output>
          </div>
          <Slider
            aria-labelledby={`volume-${key}`}
            value={[sound[key]]}
            max={100}
            step={5}
            onValueChange={([value]) =>
              updateJourney((s) => ({ ...s, sound: { ...s.sound, [key as keyof Sound]: value } }))
            }
          />
        </div>
      ))}
      <p className="form-note">
        This preview uses your browser’s voice and quiet synthesized background sounds. Final voices
        and the soundtrack will be designed separately. Changes apply when you next press Listen.
      </p>
    </div>
  );
}
