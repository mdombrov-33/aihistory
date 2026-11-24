# Frontend development

This folder contains the Next.js app, its dependencies, public media, tests and app-specific configuration. Shared documentation stays at the repository root:

- [Local setup, commands and verification](../docs/technical/development.md)
- [Current capabilities and limitations](../docs/status.md)
- [Scene contracts and presets](../docs/technical/scenes.md)
- [Authoring a lesson](../docs/technical/lesson-authoring.md)
- [Implementation plan](../docs/implementation-plan.md)

From the repo root, use `make install`, then `make dev`. Run `make` for all shortcuts, `make format` to format code, `make check` for static/documentation checks, `make test` for browser-independent contracts and `make verify` for those checks plus the production build/HTML validation. `make test-browser` builds and runs browser journeys separately. From this folder, use `make -C .. <target>` or the package scripts directly. The repo `.node-version` pins Node; this package's manifest and lockfile pin its tools/dependencies.

The root [Makefile](../Makefile) delegates to the existing tools. Run documentation validation alone with `make docs-check`.

`make format` runs Oxfmt, then the [syntax-aware blank-line pass](scripts/format-spacing.cjs). It separates module headers/imports, functions, type declarations, multiline declarations and control-flow/return blocks, while keeping related short declarations together. It preserves import order and attached comments and skips UI-library wrappers and declaration files. `make format-check` and `make check` enforce both steps. The helper uses the already installed TypeScript parser; no additional formatter package is required. Oxc editor format-on-save runs Oxfmt alone; `make format` applies the complete project spacing policy.

## Start here

The reusable lesson engine lives in **[src/features/lesson](src/features/lesson/)**. The route loads prepared data; the player owns navigation and playback; scene renderers choose the visual; individual mechanics own their controls and calculations.

| Change you want to make | Start with |
| --- | --- |
| Understand the complete player flow | [Lesson route](src/app/stories/[slug]/play/[scene]/page.tsx) → [program selection](src/features/lesson/player/scene-programs.ts) → [Player](src/features/lesson/player/player.tsx) → [SceneStage](src/features/lesson/scenes/scene-stage.tsx) |
| Change what lesson data can describe | [Bundle schema](src/features/lesson/contracts/bundle.ts), [scene schema](src/features/lesson/contracts/scene.ts), [composition registry](src/features/lesson/contracts/compositions.ts) |
| Change the visual/reading layout | [SceneFrame](src/features/lesson/scenes/scene-frame.tsx) and [layout rules](src/features/lesson/scenes/layout.css) |
| Change Read/Listen or narration | [Reading controls](src/features/lesson/player/reading-controls.tsx), [narration hook](src/features/lesson/player/use-narration.ts) |
| Change chapters or Back/Next | [Chapter menu](src/features/lesson/player/chapter-menu.tsx), [screen navigation](src/features/lesson/player/screen-navigation.tsx) |
| Add or change an interactive mechanic | [Interaction dispatcher](src/features/lesson/interactions/interaction-stage.tsx), then its named folder under [interactions](src/features/lesson/interactions/) |
| Change shared mechanic controls | [Range control](src/features/lesson/shared/controls.tsx), [fixed-stage workbench](src/features/lesson/shared/workbench.tsx), [scoped state](src/features/lesson/shared/session.tsx) |
| Change image/model inspection | [Media viewers](src/features/lesson/media/) |
| Edit a prepared lesson | [Lesson JSON and registry](src/content/lessons/); follow the [authoring guide](../docs/technical/lesson-authoring.md) |
| Change discovery metadata | [Catalog queries](src/content/catalog/catalog.ts), [generated summaries](src/content/catalog/showcase-catalog.generated.json), [sync script](scripts/sync-prepared-catalog.mjs) |
| Change saved progress/preferences | [Guest schema/defaults](src/state/guest/schema.ts), [store](src/state/guest/store.ts), [actions](src/state/guest/actions.ts) |

## Folder ownership

```text
src/
  app/                       Next.js routes, metadata, root shell and local fonts
  features/
    lesson/
      contracts/             Validated bundle/scene inputs and derived shared types
      player/                Reading, narration, chapters and screen navigation
      scenes/                Dispatcher, frame and individual scene-family views
      interactions/          Assembly, image reveal, optics, pendulum, sound, logic, traveler
      media/                 Image/native-model inspection shared with discovery
      shared/                Mechanic controls, scoped state, workbench and viewer recovery
    discovery/               Homepage, catalog browsing and story-level actions
    account/                 Auth previews and device-local My space
    creation/                Saved-question creation/status previews
    settings/                Preferences, sound controls and available themes
  content/
    lessons/                 Complete canonical JSON bundles and server registry
    catalog/                 Lightweight metadata/query layer and generated summary index
    discovery/               Prepared homepage exhibit/source data
    geography/               Local base-map geometry and provenance
  state/guest/               One guest store with separate schema, persistence and actions
  components/app/            Shared navigation, providers, cards and page shell
  components/ui/             Reusable UI primitives
  styles/                    Global theme/foundations and shared application base rules
  lib/                       Small generic helpers: class names and pagination
  types/                     External declarations, currently model-viewer JSX
tests/
  contracts/                 Browser-independent content, model, framing and guest-state checks
  browser/                   Cross-route desktop/mobile Playwright journeys
```

Within a mechanic, `*-lab.tsx` owns the visible controls/feedback; `*-canvas.tsx` is its lazy heavy viewer; `model.ts` or `*-model.ts` contains pure calculations; `schema.ts` owns its validated inputs. Assembly motion is in the assembly folder. Fixed Boolean networks and editable construction share the logic folder. The thin-lens/pendulum union lives in [contracts/experiment.ts](src/features/lesson/contracts/experiment.ts).

## Dependency and maintenance rules

- Routes compose prepared data and feature entry points. Keep complete lesson bundles server-side; browser discovery uses generated summaries. The registry and summary index are deliberate separate inputs, not duplicate files to merge.
- Contracts and calculations contain no React/viewer implementation. Component props stay near their component; shared lesson/catalog types derive from the bundle schema. Keep `types/` for external declarations rather than every application type.
- Use direct imports into the owning module. Do not add a root barrel that mixes data/schema modules with client components or heavy viewers.
- Guest state still uses one store and the existing `history-worlds:journey:v1` envelope. Separating files does not introduce independent stores, a migration or account synchronization. Transient playback remains local to its mechanic.
- Handwritten modules have short purpose comments. Keep them accurate when responsibilities change; generated JSON, vendor code and UI-library wrappers do not need boilerplate headers.
- Global CSS is imported in explicit order by [app/layout.tsx](src/app/layout.tsx). The existing cascade is preserved: global foundations, application base, player base, shared interaction base, scene layout, discovery exhibit, gallery, visual exploration, vendor graph styles, then mechanic styles. Feature styles have named owners but remain global CSS; moving a file does not scope it. A later CSS Modules conversion or deletion of old selectors requires rendered regression verification.
- Add a lesson to the [registry](src/content/lessons/registry.ts), then run `node scripts/sync-prepared-catalog.mjs`. Never hand-edit the generated summary index. Media paths, provenance, font licenses and local Draco decoding remain part of the content contract.
- Keep focused browser-independent checks in `tests/contracts/` and actual browser journeys in `tests/browser/`. Both use the existing Playwright runner; `test:scenes` launches no browser. Shared documentation remains outside this package; root README stays empty.
