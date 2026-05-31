# KnC MVP QA Checklist

Date: 2026-05-31
Version: 26.05.31.0400

## Automated Verification

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm test` | Passed: 6 files, 40 tests |
| `npm run build` | Passed |
| PWA manifest copied to `dist/manifest.webmanifest` | Passed |
| Service worker copied to `dist/sw.js` | Passed |
| Static routes copied to `dist/history/`, `dist/about/`, `dist/privacy/` | Passed |
| Runtime `src/` and `public/` references to `temp/` | None found except negative test assertion |
| `src/game/` DOM/Canvas/localStorage/`Math.random` boundary | No runtime violations found |

## Gameplay Coverage

- Monster movement and blocked movement.
- Wall push to empty cell, Shadow, Exit, Kryvavitsa, Wall chain, and board edge.
- Victory and defeat events.
- Kryvavitsa greedy movement.
- Shuffled Shadow order with deterministic RNG.
- Defeat after blocked enemy action.
- Diagonal adjacency is not lethal.
- Board generation guarantees: presets, rectangular `fieldBase`, wall density, path to Exit, legal first move, playable capacity failure, high-level capacity cap.
- Scoring: turn cost, Wall push, Shadow crush, victory, restart penalty, score floor.

## Manual Smoke Checklist

- App starts from Vite build output.
- Canvas renderer disables image smoothing.
- Original 1999 asset paths are stable under `public/assets/original-1999/`.
- Color fallback works when assets are unavailable.
- Keyboard arrows, pointer, and touch target translation are covered by tests.
- Settings reset board size and preserve record through progress helpers.
- localStorage save version preserves compatible saves and resets incompatible game state while preserving settings and record.

## Release Blockers

| Blocker | Status |
|---|---|
| GitHub repository push and Pages workflow run are pending. | Required for public smoke check |
| `sitemap.xml` uses canonical `https://serzhyale.github.io/knc_26/` URLs. | Ready for deployment |
| Git release tag was not created. | Requires explicit approval |

## Readiness Verdict

Implementation is locally MVP-ready. Public release is blocked on GitHub repository remote/Pages URL configuration and explicit tag approval.