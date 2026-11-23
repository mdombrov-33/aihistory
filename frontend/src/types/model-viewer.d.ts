import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { ModelViewerElement } from "@google/model-viewer";
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & {
        alt?: string;
        loading?: "auto" | "eager" | "lazy";
        reveal?: "auto" | "manual";
        exposure?: number;
        "camera-controls"?: boolean;
        "touch-action"?: string;
        "interaction-prompt"?: string;
        "camera-orbit"?: string;
        "shadow-intensity"?: string;
      };
    }
  }
}
