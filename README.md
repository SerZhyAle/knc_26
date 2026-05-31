# KnC: Kryvavitsa and the Monster

Turn-based survival puzzle game for Web and PWA. The player controls the Monster, reaches the Exit, and survives Kryvavitsa plus shuffled Shadows.

Current status: MVP implementation is present in TypeScript/Vite. GitHub Pages deployment is configured through `.github/workflows/deploy.yml`.

Public URL: <https://serzhyale.github.io/knc_26/>

## Run

```powershell
npm ci
npm run dev
```

## Verify

```powershell
npm run lint
npm test
npm run build
```

## Project Structure

| Path | Purpose |
|---|---|
| `src/game/` | Pure domain engine, board generation, scoring, deterministic RNG |
| `src/render/` | Canvas renderer, geometry, Original 1999 assets and color fallback |
| `src/input/` | Keyboard/pointer command translation and turn controller |
| `src/ui/` | HUD, menu, settings, help, about, notifications |
| `src/storage/` | localStorage save schema and version handling |
| `src/i18n/` | EN/RU/UK resources and locale utilities |
| `public/` | PWA manifest, service worker, runtime assets, static Pages routes |
| `docs/` | Human project documentation and approved documentation assets |
| `DEV/` | Canonical specification, roadmap, workflow, and development log |
| `OLD/` | Historical source archive |

## Canonical Docs

- Product specification: [DEV/specification.ru](DEV/specification.ru)
- Roadmap: [DEV/ROADMAP.md](DEV/ROADMAP.md)
- Game rules mirror: [docs/GAME.md](docs/GAME.md), [docs/GAME_ru.md](docs/GAME_ru.md)
- Development workflow: [DEV/AGENT_WORKFLOW.md](DEV/AGENT_WORKFLOW.md)
- Development log: [DEV/CHANGELOG.md](DEV/CHANGELOG.md)

## Public Pages

- Game: <https://serzhyale.github.io/knc_26/>
- History: <https://serzhyale.github.io/knc_26/history/>
- About: <https://serzhyale.github.io/knc_26/about/>
- Privacy: <https://serzhyale.github.io/knc_26/privacy/>

## Data And Privacy

The game uses localStorage only. There is no server-side account, telemetry, analytics, advertising SDK, or personal data collection.

## Version

MVP version: `26.05.31.0400`