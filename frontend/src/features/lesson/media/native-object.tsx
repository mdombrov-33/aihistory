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
    <div
      ref={root}
      className="native-object block grid-rows-[minmax(0,_1fr)_auto] h-full min-h-0 text-foreground bg-background relative"
      data-status={status}
    >
      <div
        className="native-object-stage relative min-h-0 isolate h-full [&_model-viewer]:block [&_model-viewer]:w-full [&_model-viewer]:h-full [&_model-viewer]:[--poster-color:transparent]"
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
          <div className="native-object-loading absolute top-0 right-0 bottom-0 left-0 pointer-events-none [&_>_img]:object-contain [&_>_output]:py-2.5 [&_>_output]:px-3.5 [&_>_output]:gap-2.5 [&_>_output]:absolute [&_>_output]:left-4 [&_>_output]:right-4 [&_>_output]:bottom-4 [&_>_output]:w-fit [&_>_output]:max-w-[calc(100%_-_32px)] [&_>_output]:flex [&_>_output]:flex-wrap [&_>_output]:items-center [&_>_output]:bg-card [&_>_output]:text-foreground [&_>_output]:text-[13px] [&_>_output]:border [&_>_output]:border-input [&_>_output]:rounded-[8px] [&_svg]:w-5 [&_svg]:h-5 [&_button]:py-2 [&_button]:px-3.5 [&_button]:pointer-events-auto [&_button]:min-h-11 [&_button]:bg-primary [&_button]:text-primary-foreground [&_button]:rounded-[6px]">
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
      <small className="native-object-hint absolute left-4 bottom-4 max-w-[45%] text-[12px] leading-[1.4] text-muted-foreground pointer-events-none">
        Drag to turn · pinch to zoom
      </small>
      <details
        className="native-camera-menu absolute right-3 bottom-2 [&_>_summary]:py-2 [&_>_summary]:px-3 [&_>_summary]:cursor-pointer [&_>_summary]:min-h-11 [&_>_summary]:flex [&_>_summary]:items-center [&_>_summary]:text-[13px] [&_>_summary]:text-foreground [&_>_summary]:bg-background"
        onToggle={(event) => {
          if (event.currentTarget.open) onInspect?.();
        }}
      >
        <summary>Camera controls</summary>
        <div
          className="native-object-controls py-1.5 px-3 gap-1 flex items-center flex-wrap bg-card [border-top:1px_solid_var(--line-soft)] [&_>_span]:mr-auto [&_>_span]:text-muted-foreground [&_>_span]:text-[12px] max-[760px]:[&_>_span]:w-full [&_button]:p-2 [&_button]:inline-flex [&_button]:items-center [&_button]:justify-center [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:rounded-[6px] [&_button]:text-[12px] [&_svg]:w-4.5 [&_svg]:h-4.5"
          aria-label="Object controls"
        >
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
