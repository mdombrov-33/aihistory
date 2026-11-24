"use client";

// Combines a registered model, source attribution and optional guided camera view.

import type { ModelAsset, CameraView } from "@/features/lesson/contracts/model-asset";
import { NativeObject } from "./native-object";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { museumObjects, type MuseumObjectId } from "@/content/discovery/heritage-media";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MuseumObject({
  objectId,
  model,
  view,
  onInspect,
}: {
  objectId?: MuseumObjectId;
  model?: ModelAsset;
  view?: CameraView;
  onInspect?: () => void;
}) {
  const object = model ?? (objectId ? museumObjects[objectId] : undefined);

  if (!object) return null;

  return (
    <section
      className="museum-object museum-exhibit grid grid-rows-[minmax(200px,_1fr)_auto_auto] bg-surface-deep h-full min-h-0"
      aria-label={object.title}
    >
      <div className="museum-viewport relative min-h-0">
        <NativeObject
          key={object.model}
          src={object.model}
          poster={object.poster}
          alt={object.description}
          view={view}
          onInspect={onInspect}
        />
      </div>
      <div className="museum-toolbar py-2 px-3.5 gap-3 flex items-center flex-wrap bg-card text-[11px] [border-top:1px_solid_var(--line-soft)] max-[760px]:px-3 [&_button]:gap-[5px] [&_button]:inline-flex [&_button]:items-center [&_button]:min-h-11 [&_button]:text-primary [&_a]:gap-[5px] [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:text-primary [&_>_span]:mr-auto [&_>_span]:text-muted-foreground [&_svg]:w-4 [&_svg]:h-4">
        <span>{object.institution}</span>
        <Dialog
          onOpenChange={(open) => {
            if (open) onInspect?.();
          }}
        >
          <DialogTrigger asChild>
            <button aria-label="Enlarge 3D object">
              <Maximize2 />
            </button>
          </DialogTrigger>
          <DialogContent className="museum-dialog">
            <DialogHeader>
              <DialogTitle>{object.title}</DialogTitle>
              <DialogDescription>
                {object.institution}. Drag to rotate, or use the labelled controls to inspect the
                scan.
              </DialogDescription>
            </DialogHeader>
            <NativeObject
              src={object.model}
              poster={object.poster}
              alt={object.description}
              view={view}
              onInspect={onInspect}
            />
          </DialogContent>
        </Dialog>
        <a href={object.record} target="_blank" rel="noreferrer">
          Source record <ArrowUpRight />
          <span className="sr-only">opens in a new tab</span>
        </a>
      </div>
    </section>
  );
}
