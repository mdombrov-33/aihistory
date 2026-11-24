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
    <section className="museum-object museum-exhibit" aria-label={object.title}>
      <div className="museum-viewport">
        <NativeObject
          key={object.model}
          src={object.model}
          poster={object.poster}
          alt={object.description}
          view={view}
          onInspect={onInspect}
        />
      </div>
      <div className="museum-toolbar">
        <span>{object.institution}</span>
        <Dialog
          onOpenChange={(open) => {
            if (open) onInspect?.();
          }}
        >
          <DialogTrigger asChild>
            <button aria-label="Enlarge museum object">
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
          Museum record <ArrowUpRight />
          <span className="sr-only">opens in a new tab</span>
        </a>
      </div>
    </section>
  );
}
