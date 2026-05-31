# KnC History And Current Implementation

This document records the public history of **KnC: Kryvavitsa and the Monster**, from the original DOS game to the current Web/PWA remake. It is the Git documentation counterpart of the public `/history/` site page.

## Timeline

| Period | Source | Platform | Status | Notes |
|---|---|---|---|---|
| 13 February 1999 | `OLD/K&C/` | DOS / Pascal-style packed runtime data | First version | Original title: `Krovavitsa and the Monster`. Author marker: `SZA`. The game used a bright cyan board, red cross-shaped walls, a green oval exit, pixel characters, a top HUD, and a right-side command strip. |
| 1999-2001 | `OLD/prg/` | Visual Basic scratch material | Reference only | Contains experiments and helper snippets, including field-size config and unrelated UI/media tests. It is not treated as primary game code. |
| 2003 | `OLD/KNC3/` | Visual Basic 6 | Later rewrite | The project metadata describes `Krovavica & Chudovishe v3`. It introduced a GUI shell, multilingual resource files `ENG.LNG` and `RUS.LNG`, menus, registry-backed settings, and an author string dated 2003. |
| 2003-2004 | `OLD/KnC/` | VB.NET | Abandoned attempt | Contains an early Windows Forms attempt and is not a complete playable port. |
| 2003-2005 | `OLD/KnC_NEW/` | Visual Basic 6 | Most complete Windows-era implementation | Expanded the VB6 version with a larger form implementation, a `skin` switch, color mode, photo-head GIF sprites, brick walls, a Ukrainian-emblem exit, and more mature Windows UI behavior. |
| 2026 | `src/`, `public/`, `docs/`, `DEV/` | TypeScript / Vite / Canvas / PWA | Current MVP | Web remake deployed through GitHub Pages with local saves, Original 1999 assets, Windows 2003 skin assets, Color fallback, EN/RU/UK UI strings, PWA manifest, service worker, and bilingual EN/RU static history/about/privacy pages. |

## Original 1999 Game

The first known version is dated **13 February 1999**. It was created by Serge Zhigunenko under the author marker **SZA**. The historical title used **Krovavitsa**; the modern remake deliberately uses **Kryvavitsa** in current player-facing UI while preserving the older spelling in historical context.

The original character set was personal and explicit in the menu:

| Role | Original game name | Personal name | Modern UI name |
|---|---|---|---|
| Player | Chudovishche | Sergey | Monster |
| Main hunter | Krovavitsa | Olga | Kryvavitsa |
| Random hunter | podKrovavnitsa | Lena | Shadow |

The 1999 game was already turn-based at its core: the player moved the Monster, then the hunter logic advanced. It also contained a CPU-speed-dependent auto-move behavior that could be cancelled with `H`; the 2026 remake treats this as a historical bug and does not reproduce it.

### 1999 Controls And HUD

The original controls were:

| Key | Action |
|---|---|
| Arrow keys | Move the Monster |
| `Q` / `Esc` | Quit |
| `M` | Toggle music or sound |
| `N` | Restart the level |
| `H` | Cancel the CPU-speed-dependent auto-move mode |

The HUD displayed level, score, real clock time, wall count, and the number of shadow-like enemies. Original screenshots are kept under `docs/screenshots/1999_original/`.

## Windows-Era Versions, 2003-2005

The later Visual Basic versions were not just archival duplicates. They explored several directions that influenced the remake boundaries:

| Area | Windows-era behavior |
|---|---|
| Localization | `ENG.LNG` and `RUS.LNG` resource files in `OLD/KNC3/` |
| Settings | Registry-backed settings in the VB6 GUI generation |
| Visual mode | Color rendering plus skin/GIF sprite experiments |
| UI | Menus, forms, and desktop application structure |
| Incomplete branch | The VB.NET `OLD/KnC/` branch stayed minimal and is treated as abandoned |

The 2026 implementation uses those versions as behavioral and product references, but the DOS 1999 game remains the primary historical identity and visual target.

### Windows 2003 Skin Assets

The intermediate visual mode comes from the VB6 skin assets in `OLD/KnC_NEW/`. The approved runtime copies live under `public/assets/windows-2003/`.

| Runtime asset | Archive source | Role |
|---|---|---|
| `public/assets/windows-2003/place.gif` | `OLD/KnC_NEW/PLACE.GIF` | Empty tiled field |
| `public/assets/windows-2003/wall.gif` | `OLD/KnC_NEW/WALL.GIF` | Brick Wall |
| `public/assets/windows-2003/exit.gif` | `OLD/KnC_NEW/EXIT.GIF` | Exit with Ukrainian emblem |
| `public/assets/windows-2003/monster.gif` | `OLD/KnC_NEW/PLAY3.GIF` | Monster / player photo-head sprite |
| `public/assets/windows-2003/kryvavitsa.gif` | `OLD/KnC_NEW/warGIF.GIF` | Kryvavitsa / hunter photo-head sprite |
| `public/assets/windows-2003/shadow-1.gif` to `shadow-5.gif` | `OLD/KnC_NEW/LENA*.GIF` | Rotating Shadow photo-head sprites |

## Intentional Design Changes In 2026

The Web/PWA version is a remake, not a byte-for-byte port. The major documented changes are:

| Mechanic | 1999 behavior | 2026 behavior |
|---|---|---|
| Main title spelling | Krovavitsa in historical material | Kryvavitsa in modern UI |
| Shadow lethality | The shadow-like enemy killed with a 25% chance on adjacency | Shadows kill with 100% certainty after their own action |
| Restart cost | Restart could remove all current points | Restart applies a `-500` score penalty, clamped at zero |
| Enemy timing | A CPU-speed bug could make enemies move without player input | Enemies move only after a player action |
| Sound | Historical sound/music toggle existed | Sound is outside MVP scope |
| Board shape | Historical rules assumed a square board value `ww` | Custom boards are rectangular and use `fieldBase = min(width, height)` |

## Current Web/PWA Implementation

The current MVP release is **`26.05.31.2223`**.

Implementation summary:

| Layer | Location | Responsibility |
|---|---|---|
| Domain engine | `src/game/` | Immutable game state, movement, wall pushes, scoring, enemy AI, generation, deterministic random behavior |
| Rendering | `src/render/` | Canvas board rendering, geometry, Original 1999 asset mode, Windows 2003 skin mode, Color fallback, smoothing disabled |
| Input | `src/input/` | Keyboard, mouse, and touch commands mapped into domain moves through the turn controller |
| UI | `src/ui/` | HUD, menu, settings, rules, about overlay, notifications, responsive layout |
| Storage | `src/storage/` | `localStorage` save/resume, version compatibility, settings and record preservation |
| Localization | `src/i18n/` | English, Russian, and Ukrainian game UI resources |
| PWA and site | `public/` | Manifest, service worker, approved assets, static history/about/privacy pages |
| Project docs | `DEV/`, `docs/` | Canonical specification, roadmap, game rules, screenshots, release and workflow documentation |

The game runs entirely in the browser. There is no server-side account, telemetry, analytics, advertising SDK, or remote leaderboard in the MVP.

## Visual Continuity

The primary MVP visual mode is **Original 1999**. Runtime assets live in `public/assets/original-1999/` and are derived from the approved DOSBox extraction workflow. Canvas rendering keeps `imageSmoothingEnabled = false` so pixel art stays sharp.

The intermediate visual mode is **Windows 2003 skin**. It uses promoted GIF assets from the VB6 archive: photo-head characters, brick walls, a white tiled field, and a Ukrainian-emblem exit. The **Modern Color** mode remains available as a fallback and debugging mode when image assets fail to load.

The approved historical screenshots are:

| File | Screen |
|---|---|
| `docs/screenshots/1999_original/01_intro_logo.png` | S.Z. intro logo |
| `docs/screenshots/1999_original/02_title_menu.png` | Original title/menu screen |
| `docs/screenshots/1999_original/03_gameplay.png` | Original DOS gameplay screen |

## Public Distribution

The MVP is published through GitHub Pages:

| Public route | Purpose |
|---|---|
| `https://serzhyale.github.io/knc_26/` | Playable Web/PWA game |
| `https://serzhyale.github.io/knc_26/history/` | Public history page |
| `https://serzhyale.github.io/knc_26/about/` | About page with current implementation summary |
| `https://serzhyale.github.io/knc_26/privacy/` | Privacy page for web and future store packaging |

Post-MVP packaging targets remain Android through Capacitor/Google Play and optional Windows MSIX/WinGet. iOS remains browser-first through Safari.