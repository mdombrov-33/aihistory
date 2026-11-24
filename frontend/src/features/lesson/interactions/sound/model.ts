// Normalized harmonic waveform calculation independent of audio playback.
export function harmonicSample(phase: number, harmonics: readonly number[]) {
  const scale = Math.max(
    1,
    harmonics.reduce((total, value) => total + Math.abs(value), 0),
  );

  return (
    harmonics.reduce((total, amplitude, i) => total + amplitude * Math.sin((i + 1) * phase), 0) /
    scale
  );
}
