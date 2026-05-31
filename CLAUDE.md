# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**KnC — Kryvavitsa and the Monster** (RU: *КнС — Крывавица и Чудовище*) is a 2026 Web/PWA **remake** of a turn-based survival puzzle game originally written in Pascal/DOS in 1999, later rebuilt in VB6 (2003–2005). The player controls the Monster on a rectangular grid, pushes walls, evades one greedy hunter (Kryvavitsa) and a growing number of random Shadows, and reaches the Exit.

**Current state: local MVP implementation.** The repository now contains the TypeScript/Vite application under `src/`, npm project files, promoted runtime assets under `public/assets/`, PWA/static Pages files, and the original 1999–2005 archive under `OLD/`. Still verify tooling files before running build/test commands because the repository is actively changing milestone by milestone.

## Source of truth (read these, not the boilerplate)

The **authoritative** documents are:
- **`DEV/specification.ru`** (Russian, v1.3) — the canonical spec for game rules, tech stack, UI, storage, repo layout.
- **`docs/GAME.md`** — English game-design mirror of the rules (movement, wall-push, AI, scoring, generation).
- **`DEV/ROADMAP.md`** — production milestones R0–R11 (+ post-MVP P1–P3), dependency flow, and per-milestone acceptance gates.
- **`DEV/PROJECT_OPERATIONS_INDEX.md`** — task-routing index; open first when navigating docs.
- **`DEV/RESEARCH.md`**, **`DEV/questionnaire.ru`** — historical behavior notes and resolved design decisions.

> **Warning:** `docs/ARCHITECTURE.md`, `docs/DEV_OPS.md`, `docs/TECH_STACK.md`, and `DEV/TECH_REQUIREMENTS.md` are **generic, un-filled templates** (Java/Gradle examples, `TBD` placeholders). They describe abstract layering principles, **not** this project's actual stack. Ignore their concrete tech claims; trust `specification.ru` / `GAME.md`.

Many docs are Russian (`.ru` extension or `_ru` suffix). `specification.ru` is primary; `GAME.md`/`GAME_ru.md` are human-readable mirrors that must stay consistent with it.

## Current tech stack (per spec §13)

TypeScript (strict) · Vite · HTML5 Canvas · static service worker · JSON i18n (EN/RU/UK) · GitHub Pages hosting. Current npm scripts: `npm run dev`, `npm run lint`, `npm test`, `npm run typecheck`, `npm run build`. Post-MVP: Capacitor.js (Android), MSIX/WinGet (Windows).

## Architecture boundaries (enforce strictly)

The intended `src/` layout and its hard rules — these are real constraints, unlike the template docs:

- `src/game/` — **domain engine**: immutable game state, cell types, move/wall-push resolution, turn cycle, enemy AI. **Must not import** from `render/`, `ui/`, `input/`, or `storage/`, nor touch Canvas/DOM/browser APIs. Randomness goes through a deterministic abstraction so rules are unit-testable.
- `src/render/` — **Canvas rendering only**. Contains **no game rules** and never mutates game state. Pixel-art assets render with `imageSmoothingEnabled = false`. The "Color" fallback mode must work when PNG assets fail to load.
- `src/input/` — keyboard / mouse / touch → translated into domain commands.
- `src/ui/` — HUD, drawer menu, settings/help/about overlays, victory/defeat notification strip.
- `src/i18n/` — `en.json`, `ru.json`, `uk.json` (shared by game and site).
- `src/storage/` — `localStorage` persistence with save versioning; incompatible saves reset the run but preserve the record and compatible settings.

Build domain logic **before** UI wrapping. Domain → Board generation → Input/Turn loop → UI is the critical path.

## Key game-rule facts (so you don't misread the code)

- One player action = one full turn cycle: Monster → Kryvavitsa → all Shadows (shuffled each cycle). Enemies never move between player turns.
- Enemies kill by **orthogonal adjacency checked after each enemy's own action** (or by the Monster stepping onto them). Diagonal contact does not kill.
- Shadows kill with **100% certainty** in 2026 (intentional change from the 1999 25% chance).
- User-facing names are **Monster / Kryvavitsa / Shadow**; implementation code may use legacy names like `player`/`wolf`.
- Custom rectangular boards use `fieldBase = min(X, Y)` for distance rules (replaces the historical square value `ww`).

## Mandatory workflow conventions

- **Log every code/config file modification** immediately after making it, before moving on:
  ```powershell
  .\scripts\add_to_dev_log.ps1 "<file_path>" "<component>" "<description>"
  ```
  This appends a timestamped row to `DEV/CHANGELOG.md`. No exceptions.
- **Root cleanliness:** all scratch files, plans, logs, backups, and extraction outputs go in `temp/` (git-ignored). Never leave artifacts in the repo root.
- **Git inclusion is intentional** (spec §17): only source, approved assets, docs, configs, and approved publish output get committed. `temp/`, `*.backup`, DOSBox captures (`*.avi/*.mp4/*.wav`), raw `*_extract/` folders, and `node_modules/` stay out. To use an extracted asset, **promote** it from `temp/` to `public/assets/original-1999/` or `docs/assets/` first.
- **Commits:** Conventional Commits (`feat`/`fix`/`refactor`/`docs`/`style`/`chore`/`release`), scope = module (e.g. `feat(game): implement turn cycle`).
- **App code must never reference `temp/`** — it is not a runtime source.

## Working style (per universal_copilot_instructions.md)

- Audience is a senior engineer: concise, technical, no pleasantries or basic explanations. Code, comments, and logs in **English**.
- **Design gate:** for non-trivial work, present a plan (problem → options → recommendation) and **wait for approval before writing code**. When the user asks for "advice"/"opinion"/"suggestion", give a text answer only — write code only when explicitly told to ("implement"/"fix"/"write").
- Don't hallucinate file contents or APIs — read them with tools first.

## Directory map

```
DEV/      Working docs (spec, roadmap, research, CHANGELOG) — specification.ru is source of truth
docs/     GitHub Pages site + game-design docs; screenshots/, assets/ (build output target)
OLD/      1999 DOS (Pascal) + 2003–2005 VB6 archive — reference only, do not modify
scripts/  add_to_dev_log.ps1 (changelog updater)
temp/     Git-ignored scratch + kc_graphics_extract/ (raw extracted graphics, promote before use)
```
