"use client";

// Measures a diagram host for responsive layouts without shrinking its labels.

import { useEffect, useRef, useState } from "react";

export function useDiagramWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 700, height: 300 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: Math.max(280, entry.contentRect.width),
        height: Math.max(180, entry.contentRect.height),
      }),
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
