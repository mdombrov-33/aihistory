"use client";

// Shared image inspection, framing, pan/zoom, retry and enlarged view.

import { useEffect, useId, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { Hand, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useJourney } from "@/state/guest/store";
import { imageFraming, type ImagePoint } from "./image-framing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ImageExplorerProps = {
  src?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  children?: ReactNode;
  onInspect?: () => void;
  expandable?: boolean;
  showCaption?: boolean;
  framing?: "contain" | "cover";
  focalPoint?: [number, number];
  inspectionPoints?: readonly ImagePoint[];
  showChildrenInDialog?: boolean;
};

export function ImageExplorer(props: ImageExplorerProps) {
  return <ImageExplorerSurface key={props.src ?? "vector"} {...props} />;
}

function ImageExplorerSurface({
  src,
  alt,
  caption,
  width = 1536,
  height = 1024,
  children,
  onInspect,
  expandable = true,
  showCaption = true,
  framing = "contain",
  focalPoint,
  inspectionPoints,
  showChildrenInDialog = false,
}: ImageExplorerProps) {
  const [active, setActive] = useState(false);
  const [scale, setScale] = useState(1);
  const [minimumScale, setMinimumScale] = useState(0.001);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const api = useRef<ReactZoomPanPinchRef>(null);
  const container = useRef<HTMLDivElement>(null);
  const instructions = useId();
  const { reduceMotion } = useJourney();
  const systemReduceMotion = useReducedMotion();
  const still = reduceMotion || systemReduceMotion;
  const duration = still ? 0 : 140;
  const inspect = () => onInspect?.();

  const fit = () => {
    inspect();
    setActive(true);
    void api.current?.fitToView({ mode: "contain", animationTime: duration });
  };

  // Keep the authored framing when the scene resizes. Once inspection starts,
  // retain the reader's own zoom and position instead.
  useEffect(() => {
    const element = container.current;

    if (!element) return;

    let frame = 0;

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewport = element.querySelector(".image-explorer-window");
        const bounds = viewport?.getBoundingClientRect();

        if (bounds && bounds.width > 0 && bounds.height > 0) {
          setMinimumScale(Math.min(bounds.width / width, bounds.height / height) / 2);
        }

        if (!active && bounds && api.current) {
          const next = imageFraming(
            width,
            height,
            bounds.width,
            bounds.height,
            framing,
            focalPoint,
            inspectionPoints,
          );

          void api.current.setTransform(next.x, next.y, next.scale, 0);
        }
      });
    });

    const viewport = element.querySelector(".image-explorer-window");

    observer.observe(viewport ?? element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [active, framing, width, height, focalPoint, inspectionPoints]);

  return (
    <div ref={container} className="image-explorer" data-exploring={active} data-framing={framing}>
      <span id={instructions} className="sr-only">
        Choose the hand to inspect. Drag or use arrow keys to pan; pinch, wheel or plus and minus to
        zoom. Stop inspection to restore the scene framing.
      </span>
      <TransformWrapper
        ref={api}
        fitOnInit={framing}
        minScale={minimumScale}
        maxScale={4}
        centerOnInit
        wheel={{ disabled: !active, step: 0.15 }}
        panning={{
          disabled: !active,
          excluded: ["image-hotspot"],
          releaseAtBounds: true,
          velocityDisabled: Boolean(still),
        }}
        pinch={{ disabled: !active }}
        keyboard={{ disabled: !active, panStep: 35, animationTime: duration }}
        doubleClick={{ disabled: !active, mode: "toggle", animationTime: duration }}
        onTransform={(_, state) => setScale(state.scale)}
        onPanningStart={inspect}
        onZoomStart={inspect}
      >
        <TransformComponent
          wrapperClass="image-explorer-window"
          contentClass="image-explorer-content"
          wrapperProps={{ role: "region", "aria-label": alt, "aria-describedby": instructions }}
        >
          <div
            className="image-coordinate-plane"
            style={{ width, height, "--image-counter-scale": 1 / scale } as CSSProperties}
          >
            {src ? (
              <Image
                key={attempt}
                src={src}
                unoptimized={src.startsWith("https://")}
                alt={alt}
                width={width}
                height={height}
                draggable={false}
                onError={() => setFailed(true)}
                sizes="(max-width:760px) 100vw,75vw"
              />
            ) : null}
            {children}
          </div>
        </TransformComponent>
      </TransformWrapper>
      {failed ? (
        <div className="image-load-failure" aria-live="polite">
          <p>The image couldn’t load. You can continue reading and open its source record.</p>
          <button
            onClick={() => {
              setFailed(false);
              setAttempt((n) => n + 1);
            }}
          >
            Try image again
          </button>
        </div>
      ) : null}
      <div className="image-tools" aria-label="Image inspection">
        <button
          aria-label={active ? "Stop image inspection" : "Explore image by dragging"}
          aria-pressed={active}
          onClick={() => {
            inspect();
            setActive(!active);

            if (active) void api.current?.fitToView({ mode: framing, animationTime: duration });
            else
              requestAnimationFrame(() =>
                container.current
                  ?.querySelector<HTMLElement>(".image-explorer-window")
                  ?.focus({ preventScroll: true }),
              );
          }}
        >
          {active ? <X /> : <Hand />}
        </button>
        <button
          aria-label="Zoom in on image"
          onClick={() => {
            inspect();
            setActive(true);
            void api.current?.zoomIn(0.3, duration);
          }}
        >
          <Plus />
        </button>
        <button
          aria-label="Zoom out of image"
          disabled={scale <= minimumScale}
          onClick={() => {
            inspect();
            setActive(true);
            void api.current?.zoomOut(0.3, duration);
          }}
        >
          <Minus />
        </button>
        <button aria-label="Fit whole image" onClick={fit}>
          <RotateCcw />
        </button>
        {expandable ? (
          <Dialog
            onOpenChange={(open) => {
              if (open) inspect();
            }}
          >
            <DialogTrigger asChild>
              <button aria-label="Enlarge image">
                <Maximize2 />
              </button>
            </DialogTrigger>
            <DialogContent className="image-inspection-dialog">
              <DialogHeader>
                <DialogTitle>Look closer</DialogTitle>
                <DialogDescription>
                  Choose the hand to drag. Use pinch, wheel or +/− to zoom; arrow keys pan while
                  inspection is active.
                </DialogDescription>
              </DialogHeader>
              <ImageExplorer
                src={src}
                alt={alt}
                caption={caption}
                width={width}
                height={height}
                expandable={false}
              >
                {!src || showChildrenInDialog ? children : null}
              </ImageExplorer>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      {showCaption ? (
        <div className="image-explorer-caption" title={caption}>
          <span>{caption}</span>
          {active ? (
            <span>Drag to explore · +/− zoom · arrows pan</span>
          ) : (
            <span>Choose the hand to explore</span>
          )}
        </div>
      ) : null}
    </div>
  );
}
