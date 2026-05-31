# RESEARCH: KnC — Platform & Technology Selection

**Date**: 2026-03-02  
**Source analysis**: `OLD/KNC3/`, `OLD/KnC_NEW/`, `OLD/KnC/`, `OLD/K&C/`, `OLD/prg/`  
**Status**: Updated — original 1999 version analysed

---

## 0. Version History (from source archaeology)

| Directory | Year | Notes |
|---|---|---|
| `OLD/K&C/` | **13.02.1999** | First version. DOS-style, controls Q/ESC/M/N. K&C.DOC dated 13.02.99. Author: SZA |
| `OLD/prg/` | ~1999–2001 | Developer scratch pad: test .frm snippets, AVI playback snippet, `k&c.cfg` (field size=15). NOT game code |
| `OLD/KNC3/` | ~2003 | VB6 GUI, multi-language (ENG.LNG/RUS.LNG), menus, registry settings |
| `OLD/KnC/` | ~2003–2004 | VB.NET attempt (Form1.vb empty except Exit button) — abandoned |
| `OLD/KnC_NEW/` | ~2003–2005 | Most complete VB6 implementation (900-line Form1.frm), skin mode, GIF sprites |

**The game was created in 1999, not 2003.** The 2003 versions are later rewrites.

---

### Original 1999 version (K&C) — decoded from CP866

**Full title**: «Кровавица и Чудовище» (Krovavitsa = blood+creature, from «кровь» = blood)  
**Author**: SZA. Version 1, dated **13.02.1999**.

**Original character names (from K&C.DOC):**

| New spec name | Original 1999 name | Notes |
|---|---|---|
| Чудовище (player) | Чудовище | Same |
| Крывавица (wolf) | **Кровавица** | Кры-/Кро- — two different words; user chose Крывавица intentionally |
| Тень (shadow) | **Подкровавница** | Literally «ундер-Кровавица». Renamed to «Тень» in new version |

**Controls:**
- Arrow keys — movement
- Q / ESC — quit
- M — toggle music/sound on/off (**sound existed from v1**)
- N — restart level (costs all current points)
- H — cancel auto-move mode (see bug below)

**Rules (verbatim from K&C.DOC, decoded):**

> Стены можно двигать только в том случае, если за ними пустое пространство или выход.

> Кровавица всегда одна на уровне, передвигается в вашу сторону, убивает как только вы оказываетесь на соседней с ней клетке уже после вашего хода.

> **В отличие от нее, Подкровавница бьёт лишь в 1 случае из 4 и двигается случайным образом.**

> Иногда (зависит от процессора) Кровавница и Подкровавницы двигаются без вашего хода. Этот режим можно отменить, нажав ‘H’ (только отменить).

> При перезапуске уровня теряются очки, но так можно уйти от неминуемой гибели или непролазных дебрей.

**Key differences vs new version:**

| Mechanic | 1999 original | New version (spec) |
|---|---|---|
| Shadow kill chance | **25%** per adjacency | **100%** (always kills) — user decision |
| Restart cost | All points lost | −500 points — user decision |
| Sound | music toggle (M) | None in MVP |
| Auto-move | CPU-speed bug, H cancels | Not reproduced |

**Visual style (observed in DOSBox, 2026-03-02 — screenshots in `docs/screenshots/1999_original/`):**

**Character names (personal touch from 17-year-old developer):**

| Role | Game name | Personal name | Description in menu |
|---|---|---|---|
| Player | Чудовище | **Сергей** | «Нет вооружения. Вы им управляете. Проходит по уровням.» |
| Wolf | Кровавица | **Ольга** | «Самое вооружённое и опасное. Двигается в вашу сторону. Следует немедленно уходить.» |
| Shadow | подКровавница | **Лена** | «Вооружённое, опасное. Вольно передвигается. Следует обходить.» |

**HUD format (top bar):**
```
КРОВавица и ЧУДОвище.  1 -ой уровень,  0 -Очей  04:16:30  37 -СТЕН  2 -ЛЕН.
```
Fields: level number · score (Очей) · real time clock · wall count (СТЕН) · shadow count (ЛЕН = Лен = Лены)

**Right sidebar buttons:**  `Quit` · `↑` `↓` `→` `←` · `New` · `Mus`

| Element | 1999 appearance |
|---|---|
| Background | Bright cyan (#00AAAA) |
| Walls | Dark red, **cross/plus shaped** — not rectangles |
| Player (Сергей/Чудовище) | Small pixel humanoid, lilac/purple |
| Wolf (Ольга/Кровавица) | Round pink-white sprite with face, wearing something |
| Shadows (Лена/подКровавницы) | Similar humanoid sprite, purple-brown, 2 shown on level 2 |
| Exit | **Green oval** («зелёный кружок» per docs) |
| HUD | Top bar + right sidebar (not on field itself) |
| Menu title | «КРОВАВИЦА И ЧУДОВИЩЕ» — large decorative red dripping letters |
| Menu subtitle | «ДЕЙСТВУЮЩИЕ ЛИЦА:» + 3 portrait cards with names and descriptions |

**`K&C.K&C` file format (3 packed sections):**

```
Section 1 (lines 1-5):   comma-separated float pairs  → animation path coordinates
                          (character trace on main menu screen)
Section 2 (lines 6-100): 74-char rows of '0' and 'C'  → multiple packed board states
                          C = wall, 0 = empty
Section 3 (lines 101+):  palette-indexed pixel art     → character sprites
                          char codes: 0=black, 3=bg, 4–9=colors, B/C/D/F=shading
```

Key insight: **sprites were pixel art baked into the data file**, not separate image files. The new version should eventually do the same (sprites as embedded assets).

**`OLD/prg/k&c.cfg`**: single value `15` → field size for that compiled build (15×15).

**`OLD/prg/*.frm`**: NOT game code. Three scratch VB files:
- Loop sum test
- Tooltip hover demo  
- AVI playback via `mciSendString` (WinAPI) — snippet the developer collected

---

## 1. Game Mechanics (Reverse-Engineered from VB Source)

### Grid System

- NxN grid, configurable: **10×10, 15×15, 20×20**
- Internal state: 2D integer matrix `M(x, y)`

### Cell Types

| Value | Name | Description |
|-------|------|-------------|
| `0` | Empty | Walkable, passable |
| `1` | Wall | Pushable if empty cell behind (Sokoban mechanic) |
| `2` | Player | Controlled via arrow keys |
| `3` | Wolf | Main enemy, AI: tracks player (greedy pathfinding) |
| `4` | Black (shadow) | 1-5 enemies, random walk AI |
| `5` | Exit | Win condition |

### Player Movement (arrow keys)

- Move to **empty cell (0)**: simple move
- Move into **wall (1)**: push it if the cell behind is empty (`0`) or exit (`4` in BL array = deactivated shadow)
- Move into **exit (5)**: WIN → new game
- Move into **enemy (3, 4)**: LOSE immediately
- Move **off-grid**: blocked

### AI — Wolf (cell 3)

Greedy pathfinding, executes every player turn:
1. Try to close X distance (move horizontally toward player)
2. If blocked, try to close Y distance
3. If still blocked: random direction
4. Can only move into empty cells (`0`)
5. Check after move: if Wolf is adjacent to Player → LOSE

### AI — Black Enemies (cell 4, array BL)

Multiple enemies (configured by `BL_end`, default 1):
1. Check if Player is any adjacent cell → LOSE
2. Else: random direction (4 tries), move into empty cell only

### Win / Lose

- **WIN**: Player steps onto Exit cell (`5`)
- **LOSE (wolf)**: Wolf is adjacent to Player after wolf's move
- **LOSE (shadow)**: Shadow is adjacent to Player after shadow's move
- **LOSE (collision)**: Player steps onto enemy cell

### Board Generation (random on New Game)

Order matters. Fields placed first can be overwritten by entities placed later.

1. All cells → `0`
2. Walls (`1`): `Int(ww² × 0.3 + rand(0..ww²×0.1))` cells — random positions, 30–40% density
3. Player (`2`): random position, **overwrites walls** (guaranteed clear cell)
4. Wolf (`3`): random, Manhattan dist to Player > `ww/3`, overwrites walls
5. Each Shadow (`4`): random, Manhattan dist to Player > `ww/4`, not on Wolf cell, overwrites walls
6. Exit (`5`): random **empty cell only** (`M=0`), Manhattan dist to Player > `ww/4`

**Note**: VB source does NOT protect against player being surrounded at start.  
**New impl requirement**: ensure player has ≥1 free adjacent cell at generation time.

### Level progression (shadow count)

- Starts at `BL_end = 1` (one shadow)
- On **WIN**: `BL_end += 1` → next game has one more shadow
- On **LOSE**: `BL_end` unchanged
- On **grid size change**: game resets, `BL_end = 1`

### Visual Modes

- **Color mode**: solid colored rectangles per cell type
- **Skin mode**: GIF images per cell type (character sprites)

---

## 2. Platform Requirements

| Requirement | Notes |
|-------------|-------|
| Grid rendering | 10–20×10–20 cells, colored or image-based |
| Input | Arrow keys (keyboard), swipe (mobile touch optional) |
| AI | Wolf pathfinding + random enemies, per-turn logic only |
| State | In-memory only (no persistence needed for MVP) |
| Network | None |
| Build artifacts | None (pure runtime) |
| Installer | None preferred |
| Target devices | Android, iOS, Windows, macOS, Web browser |

---

## 3. Technology Options

### Option A: Progressive Web App (PWA) — TypeScript + Vite

**Architecture**: Single HTML/CSS/JS bundle deployed as static site.  
**Rendering**: HTML5 Canvas (or CSS Grid for simpler approach).  
**AI & Game logic**: Pure TypeScript, no framework needed.  
**Input**: `keydown` events (keyboard) + touch swipe events (mobile).  
**Install**: Browser prompts "Add to Home Screen" on Android/iOS/Windows.  
**Hosting**: GitHub Pages / Cloudflare Pages (free, static, permanent URL).

| Platform | Support | Quality |
|----------|---------|---------|
| Android Chrome | ✅ Installs as app via browser prompt | Excellent |
| iOS Safari 16.4+ | ✅ PWA fully supported | Good |
| Windows (Edge/Chrome) | ✅ Installs in taskbar via browser | Excellent |
| All browsers (Web) | ✅ Native | Excellent |
| App Stores | ❌ Not available without wrapper | — |

**Effort**: ~1–2 weeks for full game  
**Stack size**: <200 KB (no framework)  
**Dependencies**: Zero runtime deps (Vite for build only)  
**Offline**: Yes, via Service Worker caching  

---

### Option B: Flutter (Dart)

**Architecture**: One Dart codebase → compile to Android APK, iOS IPA, Windows EXE, Web WASM.  
**Rendering**: Flutter Canvas / CustomPainter.  
**AI & Logic**: Dart, straightforward port.  
**Input**: Keyboard + gesture support built-in.

| Platform | Support | Quality |
|----------|---------|---------|
| Android | ✅ Native APK | Excellent |
| iOS | ✅ Native IPA | Excellent |
| Windows | ✅ Native EXE | Excellent |
| Web (WASM) | ✅ Stable in 2026 | Good |
| App Stores | ✅ Play Store + App Store | — |

**Effort**: ~2–4 weeks (Dart learning curve + toolchain setup)  
**iOS build**: Requires macOS + Xcode (or paid CI: Codemagic ~$10/mo)  
**Stack size**: ~15–20 MB mobile app  
**Complexity**: Medium (Dart easy if Java/VB background)  

---

### Option C: Kotlin Multiplatform + Compose Multiplatform

**Architecture**: Kotlin + Compose UI → Android, iOS, Desktop (JVM), Web (WASM).  
Relevant if Kotlin/Java experience exists.

| Platform | Support | Quality |
|----------|---------|---------|
| Android | ✅ | Excellent |
| iOS | ✅ (stable since 2024) | Good |
| Windows Desktop | ✅ Compose Desktop (JVM) | Good |
| Web | ⚠️ Compose WASM — works but less mature | Acceptable |
| App Stores | ✅ | — |

**Effort**: ~3–5 weeks  
**iOS build**: Requires macOS  
**Complexity**: Medium–High (Gradle multiplatform setup is verbose)  

---

### Option D: Capacitor.js (PWA → Native wrapper)

**Architecture**: Build PWA first → wrap with Capacitor → publish to Play Store / App Store.  
**Benefit**: Write once (TypeScript), get native app stores if needed later.  
**Effort**: +1 week on top of PWA to wrap and publish.  

---

## 4. Decision Matrix

| Criterion | PWA | Flutter | KMP | Capacitor |
|-----------|-----|---------|-----|-----------|
| One codebase | ✅ | ✅ | ✅ | ✅ |
| Android | ✅ | ✅ | ✅ | ✅ |
| iOS | ✅* | ✅ | ✅ | ✅ |
| Windows | ✅ | ✅ | ✅ | ✅ |
| Web (browser) | ✅ | ✅ | ⚠️ | ✅ |
| App Store | ❌ | ✅ | ✅ | ✅ |
| No Mac needed | ✅ | ❌ | ❌ | ✅** |
| Setup complexity | Minimal | Medium | High | Low |
| Runtime size | <200 KB | ~15 MB | ~20 MB | ~5 MB |
| Time to working game | 1–2 wk | 2–4 wk | 3–5 wk | 1–2 wk + 1 wk |
| Long-term cost | Free | Free | Free | Free |

*iOS PWA full support: iOS 16.4+, 2024+, fully viable in 2026  
**Capacitor publishes to App Store — still needs macOS for iOS final build/signing

---

## 5. Recommendation

### Primary: **PWA — TypeScript + Vite + HTML5 Canvas**

**Rationale:**
1. **Zero overhead** for a grid logic game — no framework needed, no build complexity
2. **Works on all targets today**: open URL → play. Android/iOS/Windows can install from browser.
3. **GitHub Pages**: permanent, free, zero maintenance hosting
4. **Arrow keys + touch swipe**: easy to implement, covers all devices
5. **Pure TypeScript**: clean port of VB logic (grid matrix, move function, AI loop)
6. **App Store route open**: add Capacitor.js later, same code

### Secondary (if App Store is required): **PWA → Capacitor.js wrapper**

Wrap the finished PWA → publish to Google Play + App Store.  
iOS: needs Mac only for signing step (can use GitHub Actions + Fastlane).

### Reject for this project:
- **Flutter**: Overkill. No UI framework benefits for a simple grid game. Mac dependency annoying.
- **KMP**: Too complex setup, Web support still second-class.
- **React Native**: Doesn't add value for game, poor Windows support.

---

## 6. Proposed Stack

```
Language:    TypeScript (strict mode)
Build tool:  Vite
Rendering:   HTML5 Canvas (one <canvas> element)
Input:       KeyboardEvent (arrow keys) + TouchEvent (swipe, mobile)
State:       Plain TypeScript objects (no framework, no Redux)
Storage:     localStorage (grid size preference, skin preference)
Service Worker: Workbox (auto-generated by Vite PWA plugin)
Hosting:     GitHub Pages
Optional:    Capacitor.js wrapper → Play Store + App Store
```

---

## 7. Architecture Sketch (TypeScript)

```
src/
├── game/
│   ├── Board.ts          // Grid state: M[x][y], entity positions
│   ├── GameLoop.ts       // Turn engine: player move → wolf AI → shadow AI → check win/lose
│   ├── Generator.ts      // NewGame: random board generation
│   ├── WolfAI.ts         // Greedy pathfinding toward player
│   └── ShadowAI.ts       // Random walk, adjacency check
├── render/
│   ├── CanvasRenderer.ts // Draws board onto <canvas>
│   └── Skins.ts          // Color mode vs image mode
├── input/
│   ├── KeyboardInput.ts  // Arrow key handling
│   └── TouchInput.ts     // Swipe gestures → direction
├── ui/
│   └── HUD.ts            // Grid size selector, new game button
├── main.ts               // Entry point
└── sw.ts                 // Service Worker (offline support)
```

---

## 8. Key Implementation Notes

### Cell values (enum)
```typescript
enum Cell {
  Empty  = 0,
  Wall   = 1,
  Player = 2,
  Wolf   = 3,
  Shadow = 4,
  Exit   = 5,
}
```

### Turn order (per key press)
1. Validate player move direction → execute `tot(dx, dy)`
2. If move succeeded (`GGOO=1`): run `wolfMove()` → run `shadowsMove()`
3. After each AI move: check adjacency → win/lose
4. Re-render canvas

### Wall push rule (from VB `Case 1` in `tot()`)
```
player at (px,py), direction (dx,dy)
next = (px+dx, py+dy) → wall
next2 = (px+dx*2, py+dy*2):
  - Empty (0)        → wall moves to next2, player moves to next
  - Shadow (4, BL[]) → wall moves to next2, shadow is removed, player moves to next
  - Wolf (3)         → move blocked, wall stays
  - Wall (1) / OOB   → move blocked, wall stays
```

### Wolf AI (greedy, from `ket()` and `GOW()`)
```
try: close X gap (move toward player.x)
if blocked: try close Y gap
if blocked: random direction
if all blocked: stay
```

---

## 9. Out of Scope (MVP)

- Save / Load game state
- Multiplayer
- Sound
- Animations (smooth movement)
- Leaderboard

---

## References

- `OLD/KnC_NEW/Form1.frm` — Full VB6 game implementation (900 lines)
- `OLD/KNC3/F1.FRM`, `F2.FRM` — KnC v3 with menu and language system
- `OLD/KNC3/ENG.LNG`, `RUS.LNG` — Localization strings
- `DEV/specification.ru` — Original project specification
