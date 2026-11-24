"use client";

// Lazy model-viewer adapter with local decoding, poster, camera tools and retry.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CameraView } from "@/features/lesson/contracts/model-asset";
import type { ModelViewerElement } from "@google/model-viewer";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Rotate3D } from "lucide-react";

// The museum supplies the scan; the app owns its presentation and controls.
// Import only near the viewport, and use local assets (including Draco workers).
export function NativeObject({
  src,
  poster,
  alt,
  onInspect,
  view,
}: {
  src: string;
  poster?: string;
  alt: string;
  onInspect?: () => void;
  view?: CameraView;
}) {
  const root = useRef<HTMLDivElement>(null);
  const viewer = useRef<ModelViewerElement | null>(null);
  const [requested, setRequested] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const element = root.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRequested(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!requested) return;

    let cancelled = false;

    void import("@google/model-viewer")
      .then(({ ModelViewerElement }) => {
        ModelViewerElement.dracoDecoderLocation = "/vendor/draco/";

        if (!cancelled) setEnabled(true);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [requested, attempt]);

  useEffect(() => {
    const element = viewer.current;

    if (!enabled || !element) return;

    const loaded = () => setStatus("ready");
    const failed = () => setStatus("error");

    element.addEventListener("load", loaded);
    element.addEventListener("error", failed);
    element.src = src;

    // A cached model can already be loaded when this element reconnects.
    if (element.loaded) loaded();

    return () => {
      element.removeEventListener("load", loaded);
      element.removeEventListener("error", failed);
    };
  }, [enabled, attempt, src]);

  const authoredOrbit = view
    ? `${view.yaw}deg ${view.pitch}deg ${view.distance}%`
    : "0deg 75deg 105%";

  useEffect(() => {
    if (viewer.current) viewer.current.cameraOrbit = authoredOrbit;
  }, [authoredOrbit, status]);

  const orbit = (turn: number, scale = 1) => {
    onInspect?.();

    const element = viewer.current;

    if (!element) return;

    const camera = element.getCameraOrbit();

    element.cameraOrbit = `${camera.theta + (turn * Math.PI) / 180}rad ${camera.phi}rad ${camera.radius * scale}m`;
  };

  return (
    <div ref={root} className="native-object" data-status={status}>
      <div
        className="native-object-stage"
        onPointerDownCapture={onInspect}
        onKeyDownCapture={onInspect}
      >
        {enabled ? (
          <model-viewer
            key={`${src}:${attempt}`}
            ref={viewer}
            tabIndex={0}
            alt={alt}
            camera-controls
            loading="eager"
            reveal="auto"
            touch-action="pan-y"
            interaction-prompt="none"
            camera-orbit={authoredOrbit}
            shadow-intensity=".7"
            exposure={1}
          />
        ) : null}
        {status !== "ready" ? (
          <div className="native-object-loading">
            {poster ? (
              <Image src={poster} alt="" fill sizes="(max-width:760px) 100vw,65vw" />
            ) : null}
            <output aria-live="polite">
              <Rotate3D aria-hidden="true" />
              <span>
                {status === "error" ? "The 3D object could not open." : "Preparing the 3D object…"}
              </span>
              {status === "error" ? (
                <button
                  onClick={() => {
                    onInspect?.();
                    setStatus("loading");
                    setAttempt((n) => n + 1);
                  }}
                >
                  Try again
                </button>
              ) : null}
            </output>
          </div>
        ) : null}
      </div>
      <small className="native-object-hint">Drag to turn · pinch to zoom</small>
      <details
        className="native-camera-menu"
        onToggle={(event) => {
          if (event.currentTarget.open) onInspect?.();
        }}
      >
        <summary>Camera controls</summary>
        <div className="native-object-controls" aria-label="Object controls">
          <button
            disabled={status !== "ready"}
            onClick={() => orbit(-45)}
            aria-label="Rotate object left"
          >
            <RotateCcw />
          </button>
          <button
            disabled={status !== "ready"}
            onClick={() => orbit(45)}
            aria-label="Rotate object right"
          >
            <RotateCw />
          </button>
          <button
            disabled={status !== "ready"}
            onClick={() => orbit(0, 0.8)}
            aria-label="Zoom in on object"
          >
            <ZoomIn />
          </button>
          <button
            disabled={status !== "ready"}
            onClick={() => orbit(0, 1.25)}
            aria-label="Zoom out of object"
          >
            <ZoomOut />
          </button>
          <button
            disabled={status !== "ready"}
            onClick={() => {
              onInspect?.();

              if (viewer.current) viewer.current.cameraOrbit = authoredOrbit;
            }}
          >
            Reset view
          </button>
        </div>
      </details>
    </div>
  );
}
