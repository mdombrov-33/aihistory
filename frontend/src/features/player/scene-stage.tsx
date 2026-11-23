"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useId,
  type ReactNode,
} from "react";
import { ArrowUpRight, X, ArrowRight } from "lucide-react";
import { geoPath, type GeoPermissibleObjects } from "d3-geo";
import { mapFraming } from "./map-framing";
import land from "@/content/natural-earth-land.json";
import type { Source, LessonScene } from "@/content/lessons";
import type { ModelAsset } from "@/story/model-asset";
import { compositions } from "@/story/compositions";
import { SceneFrame } from "./scene-frame";
import { ImageExplorer } from "@/components/media/image-explorer";
import { MuseumObject } from "@/components/media/museum-object";
import { LearningStage } from "@/features/learning/learning-stage";
import type { SceneBeat } from "./scene-schema";

export type SceneAssetSize = { src: string; width: number; height: number; credit?: string };
const SceneAssets = createContext<readonly SceneAssetSize[]>([]);
type StageProps = {
  assets?: readonly SceneAssetSize[];
  models?: readonly ModelAsset[];
  beat: SceneBeat;
  reading: ReactNode;
  audio: ReactNode;
  sources: Source[];
  onInspect: () => void;
  slug: string;
  scene: LessonScene;
};
type ImageData = {
  image?: string;
  imageAlt?: string;
  caption?: string;
  imageFit?: "contain" | "cover";
  focalPoint?: [number, number];
};
function Art({
  beat,
  children,
  onInspect,
  framing,
  inspectionPoints,
}: {
  beat: ImageData;
  children?: ReactNode;
  onInspect?: () => void;
  framing?: "contain" | "cover";
  inspectionPoints?: readonly { x: number; y: number }[];
}) {
  const assets = useContext(SceneAssets);
  const size = assets.find((a) => a.src === beat.image);
  if (!beat.image || !size) return null;
  return (
    <ImageExplorer
      src={beat.image}
      alt={beat.imageAlt ?? "Historical source"}
      caption={beat.caption ?? size.credit}
      width={size.width}
      height={size.height}
      framing={framing ?? beat.imageFit ?? "cover"}
      focalPoint={beat.focalPoint}
      inspectionPoints={inspectionPoints}
      onInspect={onInspect}
    >
      {children}
    </ImageExplorer>
  );
}
function Frame({
  props,
  visual,
  details,
  image,
}: {
  props: StageProps;
  visual: ReactNode;
  details?: ReactNode;
  image?: string;
}) {
  const assets = useContext(SceneAssets);
  const asset = assets.find((a) => a.src === (image ?? props.beat.image));
  return (
    <SceneFrame
      beat={props.beat}
      reading={props.reading}
      audio={props.audio}
      visual={visual}
      details={details}
      sourceAspect={asset ? asset.width / asset.height : undefined}
    />
  );
}
function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="scene-context-note">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function PictureStage(
  props: StageProps & { beat: Extract<SceneBeat, { type: "place" | "illustrated" }> },
) {
  const { beat } = props;
  const points = beat.type === "place" ? beat.places : beat.annotations;
  const [selected, setSelected] = useState<string | null>(null);
  const detailTrigger = useRef<HTMLButtonElement | null>(null);
  const detail = points.find((p) => p.id === selected);
  const assets = useContext(SceneAssets);
  const size = assets.find((a) => a.src === beat.image)!;
  const crop = detail?.crop;
  const select = (id: string, trigger: HTMLButtonElement) => {
    props.onInspect();
    detailTrigger.current = trigger;
    setSelected((current) => (current === id ? null : id));
  };
  const close = () => {
    setSelected(null);
    detailTrigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (!selected) return;
    const dismiss = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        document.querySelector('[role="dialog"]')
      )
        return;
      event.preventDefault();
      setSelected(null);
      detailTrigger.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [selected]);
  return (
    <Frame
      props={props}
      visual={
        <div className="looking-exhibit">
          <div className="looking-art">
            <Art beat={beat} framing="cover" inspectionPoints={points} onInspect={props.onInspect}>
              {points.map((p, i) => (
                <button
                  key={p.id}
                  className="scene-marker image-hotspot"
                  aria-label={"Inspect " + p.label}
                  aria-expanded={selected === p.id}
                  aria-controls={beat.id + "-detail"}
                  style={{ left: p.x + "%", top: p.y + "%" }}
                  onClick={(event) => select(p.id, event.currentTarget)}
                >
                  <span className="marker-number">{i + 1}</span>
                </button>
              ))}
            </Art>
            {detail ? (
              <section
                id={beat.id + "-detail"}
                className="image-detail"
                aria-label={detail.title}
                aria-live="polite"
              >
                {crop ? (
                  <svg
                    viewBox={`${(crop.x / 100) * size.width} ${(crop.y / 100) * size.height} ${(crop.width / 100) * size.width} ${(crop.height / 100) * size.height}`}
                    role="img"
                    aria-label={"Magnified detail: " + detail.label}
                  >
                    <image href={beat.image} width={size.width} height={size.height} />
                  </svg>
                ) : null}
                <div>
                  <h2>{detail.title}</h2>
                  <p>{detail.body}</p>
                </div>
                <button className="detail-close" aria-label="Close detail" onClick={close}>
                  <X />
                </button>
              </section>
            ) : (
              <span id={beat.id + "-detail"} className="sr-only" />
            )}
          </div>
          {points.length ? (
            <div className="scene-selections detail-selections" aria-label="Image details">
              {points.map((p, i) => (
                <button
                  key={p.id}
                  aria-pressed={selected === p.id}
                  aria-controls={beat.id + "-detail"}
                  onClick={(event) => select(p.id, event.currentTarget)}
                >
                  <span>{i + 1}</span>
                  {p.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      }
    />
  );
}

function AtlasStage(props: StageProps & { beat: Extract<SceneBeat, { type: "atlas" }> }) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const [state, setState] = useState(0);
  const active = beat.map.states?.[state];
  const locations = active
    ? beat.map.locations.filter((p) => active.activeLocations.includes(p.id))
    : beat.map.locations;
  const line = { type: "LineString" as const, coordinates: locations.map((p) => p.coordinates) };
  const canvas = useRef<HTMLDivElement>(null);
  const gridId = useId();
  const [bounds, setBounds] = useState({ width: 800, height: 600 });
  useEffect(() => {
    if (!canvas.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0)
        setBounds({ width: Math.max(280, width), height: Math.max(220, height) });
    });
    observer.observe(canvas.current);
    return () => observer.disconnect();
  }, []);
  const { projection, local } = mapFraming(
    locations.map((p) => p.coordinates),
    bounds.width,
    bounds.height,
  );
  const path = geoPath(projection);
  const focus = locations[Math.min(selected, locations.length - 1)];
  return (
    <Frame
      props={props}
      visual={
        <div className="atlas-exhibit">
          <div className="atlas-map">
            <div
              className="atlas-canvas"
              ref={canvas}
              data-geography={local ? "schematic" : "physical"}
            >
              <svg
                viewBox={`0 0 ${bounds.width} ${bounds.height}`}
                role="img"
                aria-label={
                  local
                    ? "Approximate local positions; schematic connection, no coastline"
                    : "Physical geography and schematic connections"
                }
              >
                <rect width={bounds.width} height={bounds.height} className="map-water" />
                {local ? (
                  <>
                    <defs>
                      <pattern id={gridId} width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M 48 0 L 0 0 0 48" className="map-grid" />
                      </pattern>
                    </defs>
                    <rect width={bounds.width} height={bounds.height} fill={`url(#${gridId})`} />
                    <text x="24" y="32" className="map-mode-label">
                      Local positions · schematic
                    </text>
                    <text x={bounds.width - 28} y="32" textAnchor="end" className="map-mode-label">
                      N ↑
                    </text>
                  </>
                ) : (
                  <path d={path(land as GeoPermissibleObjects) ?? ""} className="map-ground" />
                )}
                <path d={path(line) ?? ""} className="map-connection-outline" />
                <path d={path(line) ?? ""} className="map-connection" />
                {locations.map((p, i) => {
                  const xy = projection(p.coordinates);
                  return xy ? (
                    <g
                      key={p.id}
                      className={focus.id === p.id ? "map-location is-selected" : "map-location"}
                    >
                      <circle cx={xy[0]} cy={xy[1]} r={focus.id === p.id ? 8 : 5} />
                      <text x={xy[0]} y={xy[1] + (i % 2 === 0 ? 30 : -20)} textAnchor="middle">
                        {p.name}
                      </text>
                    </g>
                  ) : null;
                })}
              </svg>
            </div>
            <div className="map-focus" aria-live="polite">
              <h2>{focus.name}</h2>
              <p>{active?.description ?? focus.description}</p>
            </div>
          </div>
          <div className="scene-selections" aria-label={active ? "Network states" : "Places"}>
            {beat.map.states
              ? beat.map.states.map((s, i) => (
                  <button
                    key={s.label}
                    aria-pressed={state === i}
                    onClick={() => {
                      props.onInspect();
                      setState(i);
                      setSelected(0);
                    }}
                  >
                    {s.label}
                  </button>
                ))
              : locations.map((p, i) => (
                  <button
                    key={p.id}
                    aria-pressed={selected === i}
                    onClick={() => {
                      props.onInspect();
                      setSelected(i);
                    }}
                  >
                    {p.name}
                  </button>
                ))}
          </div>
          <details className="atlas-note">
            <summary>About this map</summary>
            <p>{beat.map.note}</p>
          </details>
        </div>
      }
    />
  );
}
function EvidenceStage(props: StageProps & { beat: Extract<SceneBeat, { type: "evidence" }> }) {
  const { beat } = props;
  const record = beat.record;
  const source = props.sources[record.sourceIndex];
  return (
    <Frame
      props={props}
      visual={
        beat.composition === "quotation-focus" ? (
          <figure className="source-quotation">
            <small>{record.date}</small>
            <blockquote>“{record.quote}”</blockquote>
            <figcaption>
              {record.title}
              <span>{source.name} · Transcribed source</span>
            </figcaption>
            <a href={source.url} target="_blank" rel="noreferrer">
              Examine the source <ArrowUpRight />
              <span className="sr-only">opens in a new tab</span>
            </a>
          </figure>
        ) : (
          <Art
            beat={beat}
            framing={beat.imageFit ?? compositions[beat.composition].framing}
            onInspect={props.onInspect}
          />
        )
      }
      details={
        <Note title={record.title}>
          <p>
            {record.date} · {record.material}
          </p>
          <details>
            <summary>Context and limits</summary>
            <p>{record.interpretation}</p>
            <p>{record.limitation}</p>
          </details>
          <a href={source.url} target="_blank" rel="noreferrer">
            Collection / source record
            <ArrowUpRight />
            <span className="sr-only">opens in a new tab</span>
          </a>
        </Note>
      }
    />
  );
}
function ComparisonStage(props: StageProps & { beat: Extract<SceneBeat, { type: "comparison" }> }) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const sides = [beat.left, beat.right];
  const side = sides[selected];
  return (
    <Frame
      props={props}
      image={side.image}
      visual={
        <div className="comparison-exhibit">
          <Art
            beat={{ image: side.image, imageAlt: side.alt }}
            framing="cover"
            onInspect={props.onInspect}
          />
          <div className="scene-selections" aria-label="Compared sources">
            {sides.map((item, i) => (
              <button
                key={item.image}
                aria-pressed={i === selected}
                onClick={() => {
                  props.onInspect();
                  setSelected(i);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="selection-explanation" aria-live="polite">
            <p>{side.explanation}</p>
          </div>
        </div>
      }
      details={<p className="scene-media-note">{beat.note}</p>}
    />
  );
}

function TimelineStage(props: StageProps & { beat: Extract<SceneBeat, { type: "timeline" }> }) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const event = beat.events[selected];
  return (
    <Frame
      props={props}
      image={event.image}
      visual={
        <div className="sequence-exhibit" data-gallery={beat.composition === "timeline-gallery"}>
          {beat.composition === "timeline-gallery" ? (
            <Art
              beat={{ image: event.image, imageAlt: event.imageAlt, caption: event.caption }}
              onInspect={props.onInspect}
            />
          ) : (
            <div className="event-explanation" aria-live="polite">
              <small>{event.date}</small>
              <h2>{event.title}</h2>
              <p>{event.body}</p>
            </div>
          )}
          <ol className="chronology-track">
            {beat.events.map((e, i) => (
              <li key={e.title}>
                <button
                  aria-pressed={selected === i}
                  onClick={() => {
                    props.onInspect();
                    setSelected(i);
                  }}
                >
                  <small>{e.date}</small>
                  <strong>{e.title}</strong>
                </button>
              </li>
            ))}
          </ol>
          {beat.composition === "timeline-gallery" ? (
            <p className="selection-explanation" aria-live="polite">
              {event.body}
            </p>
          ) : null}
        </div>
      }
      details={<p className="scene-media-note">{beat.note}</p>}
    />
  );
}
function ProcessStage(props: StageProps & { beat: Extract<SceneBeat, { type: "journey" }> }) {
  const { beat } = props;
  const [selected, setSelected] = useState(0);
  const summary = beat.composition === "synthesis-board";
  return (
    <Frame
      props={props}
      visual={
        summary ? (
          <ol className="synthesis-board">
            {beat.stages.map((s, i) => (
              <li key={s.title}>
                <span>0{i + 1}</span>
                <div>
                  <small>{s.date}</small>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="process-workbench">
            <ol>
              {beat.stages.map((s, i) => (
                <li key={s.title}>
                  <button
                    aria-pressed={i === selected}
                    aria-controls={beat.id + "-operation"}
                    onClick={() => {
                      props.onInspect();
                      setSelected(i);
                    }}
                  >
                    <span>0{i + 1}</span>
                    <strong>{s.title}</strong>
                    {i < beat.stages.length - 1 ? <ArrowRight aria-hidden="true" /> : null}
                  </button>
                </li>
              ))}
            </ol>
            <div id={beat.id + "-operation"} className="operation" aria-live="polite">
              <small>{beat.stages[selected].date || "Follow the operation"}</small>
              <h2>{beat.stages[selected].title}</h2>
              <p>{beat.stages[selected].body}</p>
            </div>
          </div>
        )
      }
    />
  );
}
function ObjectStage(props: StageProps & { beat: Extract<SceneBeat, { type: "object" }> }) {
  const model = props.models?.find((m) => m.id === props.beat.objectId);
  const [view, setView] = useState(0);
  if (!model) return null;
  return (
    <Frame
      props={props}
      visual={
        <div className="object-exhibit">
          <MuseumObject
            model={model}
            view={props.beat.composition === "object-guided" ? model.views[view] : undefined}
            onInspect={props.onInspect}
          />
          {props.beat.composition === "object-guided" ? (
            <div className="guided-views">
              <div className="scene-selections" aria-label="Object viewpoints">
                {model.views.map((v, i) => (
                  <button
                    key={v.label}
                    aria-pressed={view === i}
                    onClick={() => {
                      props.onInspect();
                      setView(i);
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <details key={view}>
                <summary>About this view</summary>
                <p>{model.views[view].explanation}</p>
              </details>
            </div>
          ) : null}
        </div>
      }
      details={
        <details className="photograph-notes">
          <summary>About the object</summary>
          <p>{model.context}</p>
        </details>
      }
    />
  );
}
export function SceneStage(props: StageProps) {
  return (
    <SceneAssets value={props.assets ?? []}>
      <SceneContent {...props} />
    </SceneAssets>
  );
}
function SceneContent(props: StageProps) {
  switch (props.beat.type) {
    case "assembly":
    case "experiment":
    case "sound":
    case "system":
      return (
        <Frame
          props={props}
          visual={
            <LearningStage beat={props.beat} scope={props.slug} onInteract={props.onInspect} />
          }
        />
      );
    case "place":
    case "illustrated":
      return <PictureStage {...props} beat={props.beat} />;
    case "atlas":
      return <AtlasStage {...props} beat={props.beat} />;
    case "evidence":
      return <EvidenceStage {...props} beat={props.beat} />;
    case "comparison":
      return <ComparisonStage {...props} beat={props.beat} />;
    case "timeline":
      return <TimelineStage {...props} beat={props.beat} />;
    case "journey":
      return <ProcessStage {...props} beat={props.beat} />;
    case "object":
      return <ObjectStage {...props} beat={props.beat} />;
    case "photograph":
      return (
        <Frame
          props={props}
          visual={
            <Art
              beat={props.beat}
              framing={props.beat.imageFit ?? compositions[props.beat.composition].framing}
              onInspect={props.onInspect}
            />
          }
          details={
            <details className="photograph-notes">
              <summary>About the image</summary>
              <p>{props.beat.observation}</p>
              <a href={props.beat.sourceUrl} target="_blank" rel="noreferrer">
                Collection record <ArrowUpRight />
                <span className="sr-only">opens in a new tab</span>
              </a>
            </details>
          }
        />
      );
  }
}
