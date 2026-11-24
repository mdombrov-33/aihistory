"use client";

// Thin-lens ray view with distance controls and real, virtual and focal states.

import { z } from "zod";
import { useLearningState } from "../../shared/session";
import { useId } from "react";
import { LabRange } from "../../shared/controls";
import { thinLens } from "./model";
import type { Experiment } from "../../contracts/experiment";

export function OpticsLab({
  experiment,
  onInteract,
}: {
  experiment: Extract<Experiment, { model: "thin-lens" }>;
  onInteract: () => void;
}) {
  const [{ focal, distance }, change] = useLearningState(
    z.object({ focal: z.number().min(5).max(15), distance: z.number().min(4).max(50) }),
    { focal: experiment.focalLength, distance: experiment.objectDistance },
  );

  const setFocal = (focal: number) => change({ focal });
  const setDistance = (distance: number) => change({ distance });
  const clip = useId();
  const result = thinLens(focal, distance);

  const scale = 5,
    center = 340,
    axis = 205,
    height = 65;

  const objectX = center - distance * scale;
  const imageX = result.imageDistance === null ? null : center + result.imageDistance * scale;
  const imageY = result.magnification === null ? null : axis - height * result.magnification;
  const outgoingY = axis - height + (height / focal) * ((700 - center) / scale);

  return (
    <section className="learning-lab" aria-label="Thin lens experiment">
      <div className="lab-canvas optics-viewport">
        <svg
          viewBox="0 0 700 390"
          role="img"
          aria-label={`Thin lens ray diagram: ${result.kind === "parallel" ? "parallel outgoing rays" : result.kind + " image"}`}
        >
          <defs>
            <clipPath id={clip}>
              <rect x="15" y="15" width="670" height="345" />
            </clipPath>
          </defs>
          <path d={`M20 ${axis}H680`} className="lab-axis" />
          <ellipse cx={center} cy={axis} rx="13" ry="120" className="optics-lens" />
          {[center - focal * scale, center + focal * scale].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={axis} r="4" className="lab-accent-fill" />
              <text x={x} y={axis + 27} textAnchor="middle">
                F
              </text>
            </g>
          ))}
          <g clipPath={`url(#${clip})`}>
            <path
              d={`M${objectX} ${axis}V${axis - height}m-7 10l7 -10 7 10`}
              className="optics-object"
            />
            <path
              d={`M${objectX} ${axis - height}H${center}L700 ${outgoingY}`}
              className="optics-ray"
            />
            <path
              d={`M${objectX} ${axis - height}L700 ${axis + ((700 - center) * height) / (distance * scale)}`}
              className="optics-ray second"
            />
            {result.kind === "virtual" && imageX !== null && imageY !== null ? (
              <>
                <path
                  d={`M${center} ${axis - height}L${imageX} ${imageY}L${center} ${axis}`}
                  className="optics-extension"
                />
              </>
            ) : null}
            {imageX !== null && imageY !== null ? (
              <path
                d={`M${imageX} ${axis}V${imageY}m-7 ${imageY > axis ? -10 : 10}l7 ${imageY > axis ? 10 : -10} 7 ${imageY > axis ? -10 : 10}`}
                className="optics-image"
              />
            ) : null}
          </g>
          <text x={objectX} y="335" textAnchor="middle">
            Object
          </text>
          <text x={center} y="350" textAnchor="middle">
            Lens
          </text>
          <text x="658" y="38" textAnchor="end">
            Schematic · not to scale vertically
          </text>
        </svg>
      </div>
      <div className="lab-controls">
        <LabRange
          label="Object distance"
          value={distance}
          min={4}
          max={50}
          unit=" cm"
          onChange={(n) => {
            onInteract();
            setDistance(n);
          }}
        />
        <LabRange
          label="Focal length"
          value={focal}
          min={5}
          max={15}
          unit=" cm"
          onChange={(n) => {
            onInteract();
            setFocal(n);
          }}
        />
        <div className="lab-choices" aria-label="Lens configurations">
          <button
            onClick={() => {
              onInteract();
              setDistance(focal * 2);
            }}
          >
            Object at 2F
          </button>
          <button
            onClick={() => {
              onInteract();
              setDistance(focal);
            }}
          >
            Object at F
          </button>
          <button
            onClick={() => {
              onInteract();
              setDistance(Math.max(4, focal * 0.6));
            }}
          >
            Inside the focus
          </button>
          <button
            onClick={() => {
              onInteract();
              setFocal(experiment.focalLength);
              setDistance(experiment.objectDistance);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="lab-feedback" aria-live="polite">
        <h2>
          {result.kind === "parallel"
            ? "No finite image plane"
            : result.kind === "real"
              ? "The rays meet beyond the lens"
              : "An upright virtual image"}
        </h2>
        <p>
          {result.kind === "parallel"
            ? "At the focal distance, the outgoing rays are parallel in this ideal model. A finite screen cannot catch a focused image."
            : `${result.kind === "real" ? "Real image" : "Virtual image"} · ${Math.abs(result.imageDistance!).toFixed(1)} cm ${result.kind === "real" ? "beyond" : "in front of"} the lens · ${Math.abs(result.magnification!).toFixed(2)}× size.`}
        </p>
        {imageX !== null && (imageX < 15 || imageX > 685 || imageY! < 15 || imageY! > 360) ? (
          <p>
            The image is beyond this drawing’s window; its calculated distance and size are shown
            above.
          </p>
        ) : null}
      </div>
      <details className="lab-assumptions">
        <summary>Model and assumptions</summary>
        <p>
          Ideal converging thin lens in air, paraxial rays, centimetres. 1/f = 1/u + 1/v;
          magnification = −v/u. Aberrations and diffraction are omitted. Dashed rays show backward
          extensions for virtual images.
        </p>
      </details>
    </section>
  );
}
