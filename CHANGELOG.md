# Changelog

All notable changes to KnC are documented here.

## [26.05.31.0400] - 2026-05-31

### Added

- MVP Web/PWA implementation with TypeScript, Vite, strict mode, Vitest, ESLint, and GitHub Actions.
- Pure domain engine for Monster movement, Wall push rules, Kryvavitsa, Shadows, victory, defeat, and deterministic RNG.
- Board generation with bounded retries, path guarantee, first legal move guarantee, wall density, scoring, and progression.
- Canvas rendering with Original 1999 PNG assets and Color fallback mode.
- Keyboard, mouse, and touch input through a one-input one-turn controller.
- HUD, menu, settings, rules, about overlay, victory/defeat notifications, and responsive layout.
- localStorage save/resume, save versioning, EN/RU/UK translations, and settings persistence.
- PWA manifest, service worker, GitHub Pages deploy workflow, history/about/privacy pages, README, robots policy, and sitemap.

### Release Verification

- Public GitHub Pages URL: `https://serzhyale.github.io/knc_26/`.
- GitHub Actions CI passed.
- GitHub Pages deploy workflow passed.
- Public routes `/`, `/history/`, `/about/`, `/privacy/`, manifest, service worker, robots, and sitemap return HTTP 200.
- Release tag: `26.05.31.0400`.