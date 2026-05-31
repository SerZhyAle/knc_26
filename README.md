# KnC: Kryvavitsa and the Monster

Turn-based survival puzzle game for Web and PWA. The player controls the Monster, reaches the Exit, and survives Kryvavitsa plus shuffled Shadows.

Current status: MVP implementation is present in TypeScript/Vite. GitHub Pages deployment is configured through `.github/workflows/deploy.yml`.

Public URL: <https://serzhyale.github.io/knc_26/>

## History

KnC started as a DOS game dated 13 February 1999. The archived first version lives under `OLD/K&C/` and used the historical title spelling `Krovavitsa and the Monster`, the SZA author marker, a bright cyan board, red cross-shaped walls, a green oval exit, and pixel characters extracted later from DOSBox reference captures.

The 2003-2005 Windows-era archives under `OLD/KNC3/` and `OLD/KnC_NEW/` document the Visual Basic rewrites: GUI forms, multilingual resource files, registry-backed settings, and skin/GIF sprite experiments. The 2026 release is a Web/PWA remake rather than a byte-for-byte clone: it keeps the turn-based survival puzzle identity, Original 1999 visual mode, and Windows 2003 skin mode while modernizing persistence, input, deployment, and browser support.

Detailed history, version archaeology, and current implementation notes are documented in [docs/HISTORY.md](docs/HISTORY.md). The public site version is available at <https://serzhyale.github.io/knc_26/history/>.

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
| `src/render/` | Canvas renderer, geometry, Original 1999 assets, Windows 2003 skin assets, color fallback |
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
- Project history and current implementation: [docs/HISTORY.md](docs/HISTORY.md)
- Roadmap: [DEV/ROADMAP.md](DEV/ROADMAP.md)
- Game rules mirror: [docs/GAME.md](docs/GAME.md), [docs/GAME_ru.md](docs/GAME_ru.md)
- Development workflow: [DEV/AGENT_WORKFLOW.md](DEV/AGENT_WORKFLOW.md)
- Development log: [DEV/CHANGELOG.md](DEV/CHANGELOG.md)

## Current Implementation

The MVP release `26.05.31.2251` contains the complete browser implementation: pure TypeScript domain engine, deterministic board generation, Canvas rendering with Original 1999 assets, Windows 2003 skin GIF assets, and Color fallback, keyboard/mouse/touch input, HUD and overlays, localStorage save/resume, EN/RU/UK UI strings, bilingual EN/RU public documentation pages, PWA manifest, service worker, GitHub Actions CI, and GitHub Pages deployment.

## Public Pages

- Game: <https://serzhyale.github.io/knc_26/>
- History: <https://serzhyale.github.io/knc_26/history/>
- About: <https://serzhyale.github.io/knc_26/about/>
- Privacy: <https://serzhyale.github.io/knc_26/privacy/>

## Data And Privacy

The game uses localStorage only. There is no server-side account, telemetry, analytics, advertising SDK, or personal data collection.

## Version

MVP version: `26.05.31.2251`