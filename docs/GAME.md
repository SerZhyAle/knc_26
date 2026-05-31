# KnC: Kryvavitsa and the Monster

## Human Game Description

KnC is a turn-based survival puzzle game on a rectangular grid. The player controls the Monster, tries to reach the Exit, and survives against one main hunter, Kryvavitsa, plus a growing number of Shadows.

The modern game title is **Kryvavitsa and the Monster**. Historical material about the 1999 DOS version may use the older name **Krovavitsa**; the playable 2026 game uses **Kryvavitsa**.

## Core Idea

Each player action advances the whole world by one turn. The Monster moves first. Then Kryvavitsa moves. Then every Shadow moves once, in a shuffled random order. Enemies never move on their own between player turns.

The game is not about speed. It is about reading the board, pushing walls, opening routes, killing Shadows with walls when possible, and staying away from enemies that kill by adjacency after their own turns.

## Characters

| Role | In-game name | Behavior |
|---|---|---|
| Player | Monster | Controlled by the user. Reaches the Exit to win the level. |
| Main enemy | Kryvavitsa | One greedy hunter that tries to get closer to the Monster. |
| Random enemy | Shadow | Random-moving enemy. The number of Shadows equals the current level. |

Technical names such as player and wolf may appear in implementation code, but user-facing text should use Monster, Kryvavitsa, and Shadow.

## Board

The board is a rectangular grid with width `X` and height `Y`.

Preset sizes:
- 10x10
- 15x15
- 20x20

Custom size:
- minimum width and height: 10
- maximum width and height: 100

For distance rules on custom rectangular boards, the game uses `fieldBase = min(X, Y)`. This replaces the historical square-board value `ww`.

Changing the board size starts a new game: level becomes 1, current score becomes 0, and the board is regenerated. The record is preserved.

## Cell Types

| Cell | Meaning |
|---|---|
| Empty | Walkable cell. |
| Wall | Blocks movement. The Monster can push it in specific cases. |
| Monster | The player-controlled character. |
| Kryvavitsa | Main enemy. |
| Shadow | Random enemy. |
| Exit | The goal cell. |

## Controls

Desktop keyboard:
- Arrow keys move the Monster up, down, left, or right.

Desktop mouse:
- Click an orthogonally adjacent cell to move in that direction.
- Clicks on non-adjacent cells are ignored.

Touch screen:
- Tap an orthogonally adjacent cell to move in that direction.

Only four-directional movement is used. Diagonal movement does not exist.

## Monster Turn

The Monster always acts first in a turn cycle.

Movement rules:

1. If the target cell is empty, the Monster moves into it.
2. If the target cell is the Exit, the level is won.
3. If the target cell contains Kryvavitsa or a Shadow, the Monster dies immediately.
4. If the target cell is a Wall, the game checks the cell behind that Wall in the same direction.

Wall push rules:

1. Wall followed by an empty cell: the Wall moves forward, and the Monster occupies the Wall's old cell.
2. Wall followed by a Shadow: the Wall crushes the Shadow, the Shadow dies, the Wall moves into the Shadow's cell, and the Monster occupies the Wall's old cell.
3. Wall followed by the Exit: the Wall is destroyed, the Exit remains, and the Monster occupies the Wall's old cell.
4. Wall followed by Kryvavitsa: the move is blocked.
5. Wall followed by another Wall or board edge: the move is blocked.

Wall chains are not pushed. Only the first Wall and the single cell behind it are considered.

## Enemy Turn Order

Every successful or blocked Monster move that counts as a turn starts this cycle:

1. Monster acts.
2. Kryvavitsa acts once.
3. All living Shadows act once each.
4. The order of Shadows is shuffled before every cycle.
5. Defeat checks run after each individual enemy finishes its action.

Enemies do not perform a separate kill check before moving. If an enemy cannot move and stays in place, that still counts as its action, and the adjacency check runs after it.

## Defeat Rule

The Monster loses when either of these happens:

- The Monster moves directly onto an enemy cell.
- After an enemy action, that enemy is orthogonally adjacent to the Monster.

Adjacency uses four directions only: up, down, left, and right. Diagonal contact does not kill.

After defeat, a new board is generated immediately with the same level and board size. The current score is not reset. There is no blocking defeat screen; the UI shows a short overlay notification.

## Victory Rule

The Monster wins a level by moving onto the Exit.

After victory:
- the number of Shadows increases by 1;
- a new board is generated immediately with the same board size;
- the current score continues;
- the record is updated if the reached level is higher than the previous record;
- the UI shows a short overlay notification instead of a blocking victory screen.

## Kryvavitsa AI

There is always exactly one Kryvavitsa.

Kryvavitsa acts once after every Monster turn. It cannot push walls and cannot move through walls, Shadows, or board edges.

Priority order:

1. Try to reduce the distance to the Monster using a greedy rule: X axis first, then Y axis.
2. If blocked, try to move toward the Exit using the same greedy rule.
3. If still blocked, try a random available direction.
4. If all four directions are blocked, stay in place.

Kryvavitsa does not enter the Monster's cell. Killing is resolved by the adjacency check after Kryvavitsa finishes moving or standing.

Kryvavitsa behavior does not scale with level. Higher difficulty comes from the increasing number of Shadows.

## Shadow AI

Each Shadow acts after Kryvavitsa. The living Shadows are shuffled before every turn cycle.

For each Shadow:

1. Shuffle the four directions randomly.
2. Move into the first available empty cell.
3. If no direction is available, stay in place.
4. Run the defeat adjacency check after the Shadow's action.

Shadows cannot move into walls, other Shadows, Kryvavitsa, or board edges. Shadows do not enter the Monster's cell. Killing is resolved by adjacency after their own action.

A Shadow dies only when the Monster pushes a Wall into it. A dead Shadow disappears for the rest of the current board and returns only when the next board is generated.

In the 1999 version, the shadow-like enemy killed with a 25% chance. In the 2026 game, Shadows kill with 100% certainty after their action if they are adjacent to the Monster. This is an intentional design change.

## Levels

The game is endless. The level number is the number of Shadows on the board.

Progression:

| Event | Result |
|---|---|
| Start | Level 1, one Shadow. |
| Victory | Level increases by 1. |
| Defeat | Level stays the same. |
| Restart | Level stays the same, board regenerates, score penalty applies. |
| New Game | Level resets to 1, score resets to 0. |
| Board size change | Level resets to 1, score resets to 0, record remains. |

The maximum number of Shadows is limited by available board cells. The game must not create more Shadows than can be placed on legal cells.

## Scoring

| Event | Score |
|---|---:|
| Monster reaches the Exit | +1000 |
| Wall pushed | +10 |
| Shadow crushed by a Wall | +50 |
| Each Monster turn | -10 |
| Restart level | -500 |

Score cannot go below 0.

The record is the maximum reached level across all games. It is stored separately from the current score and survives board size changes and incompatible saved-game resets.

## Board Generation

The board is generated randomly for every new board.

Generation order:

1. Clear the board.
2. Place Walls on 30-40% of all cells.
3. Place the Monster on a random cell, overwriting a Wall if needed.
4. Place Kryvavitsa on a random cell with Manhattan distance from the Monster greater than `fieldBase / 3`, overwriting a Wall if needed.
5. Place Shadows with Manhattan distance from the Monster greater than `fieldBase / 4`, avoiding Kryvavitsa and other Shadows, overwriting Walls if needed.
6. Place the Exit on a random empty cell with Manhattan distance from the Monster greater than `fieldBase / 4`.
7. Validate the generated board.

Validation guarantees:

- there is at least one path from the Monster to the Exit through empty cells without pushing walls;
- the Monster has at least one legal first move;
- all enemies satisfy the required spawn distance;
- the requested number of Shadows fits on the board.

If validation fails, the whole generation attempt is discarded and repeated.

## Interface

The game uses one permanent game screen. Menus and help screens are overlays over the board.

Main screen:
- top bar with menu button, game title, level, and score;
- Canvas board using as much available space as possible;
- bottom status row with turn count and killed Shadows.

Victory and defeat:
- no blocking modal dialog;
- a short 1.5 second overlay strip appears over the board;
- tapping or clicking the strip may dismiss it faster.

Settings:
- board size presets and custom size;
- visual mode: Original 1999, Windows 2003 skin, or Color fallback;
- dark theme;
- grid lines on/off;
- language selection;
- progress reset.

Original 1999 is the primary MVP visual mode. Windows 2003 skin is the intermediate archive mode based on the VB6 GIF assets. Color remains available as a fallback and debugging mode. User-uploaded skins are planned after MVP.

## Visual Style

Original 1999 mode is the default MVP target. It renders approved PNG assets from `public/assets/original-1999/` on Canvas with `imageSmoothingEnabled = false`.

Original 1999 mode:

| Cell | Appearance |
|---|---|
| Empty | Bright cyan DOS-style board field |
| Wall | Dark red cross-shaped Wall sprite |
| Monster | Pixel character based on the original Sergey/Monster art |
| Kryvavitsa | Pixel character based on the original Olga/Krovavitsa art, renamed in modern UI |
| Shadow | Pixel character based on the original Lena/podKrovavnitsa art |
| Exit | Bright green oval exit |

Color fallback mode:

| Cell | Suggested color |
|---|---|
| Empty | White |
| Wall | Gray |
| Monster | Dark green |
| Kryvavitsa | Dark red / burgundy |
| Shadow | Black |
| Exit | Pink / light red |

Dark theme affects UI chrome and Color mode. It does not invert Original 1999 sprites or the original board palette. Grid lines are optional and controlled by settings.

Windows 2003 skin mode:

| Cell | Appearance |
|---|---|
| Empty | White tiled field from `PLACE.GIF` |
| Wall | Brick wall from `WALL.GIF` |
| Monster | Photo-head sprite from `PLAY3.GIF` |
| Kryvavitsa | Photo-head hunter sprite from `warGIF.GIF` |
| Shadow | Rotating photo-head sprites from `LENA*.GIF` |
| Exit | Ukrainian-emblem exit from `EXIT.GIF` |

## Storage

The game uses localStorage only. There is no server.

Stored data:
- current level;
- current score;
- record level;
- board matrix and entity positions;
- settings: board size, language, color mode, dark theme, grid lines;
- save format version.

The current game is saved after every full turn cycle. On app launch, the game resumes from the saved state if the save version is compatible.

If the saved game version is incompatible, the current game is reset automatically. Record and compatible settings are preserved.

## Localization

Supported languages:
- English
- Russian
- Ukrainian

Default language is English. The app may auto-detect Russian or Ukrainian from `navigator.language`; everything else falls back to English. The user can change the language manually in settings.

## MVP Scope

MVP includes:
- Web game;
- PWA behavior;
- GitHub Pages hosting;
- game site pages: home, history, privacy;
- Original 1999 PNG assets as the primary visual mode;
- Windows 2003 GIF skin assets as the intermediate visual mode;
- Color fallback rendering;
- localStorage persistence;
- English, Russian, and Ukrainian UI strings.

Not in MVP:
- custom skins;
- sound;
- online leaderboards;
- multiplayer;
- Android Google Play packaging;
- Windows MSIX / WinGet packaging;
- iOS App Store release.

## Current Implementation

The current MVP version is `26.06.01.0047`. It is implemented with TypeScript, Vite, HTML5 Canvas, Vitest, ESLint, a static service worker, and GitHub Pages deployment.

Implementation boundaries:

| Layer | Location | Role |
|---|---|---|
| Game domain | `src/game/` | Pure rules, board generation, scoring, enemy AI, deterministic random behavior |
| Rendering | `src/render/` | Canvas drawing, geometry, Original 1999 assets, Windows 2003 skin assets, Color fallback |
| Input | `src/input/` | Keyboard, pointer, and touch command translation |
| UI | `src/ui/` | HUD, menu, settings, help, about, notifications |
| Storage | `src/storage/` | localStorage save versioning, compatible resume, settings and record preservation |
| Localization | `src/i18n/` | EN/RU/UK JSON resources |
| Static public site | `public/` | PWA manifest, service worker, assets, history/about/privacy routes |

## Historical Notes

The first version was a DOS game dated 13 February 1999 and stored in the archive under `OLD/K&C/`. It used the historical spelling Krovavitsa, the SZA author marker, DOS-style pixel graphics, a bright cyan board, red cross-shaped walls, a green oval exit, and a top HUD with level, score, clock, wall count, and shadow count.

The Windows-era archives from 2003-2005 are stored mainly under `OLD/KNC3/` and `OLD/KnC_NEW/`. They introduced Visual Basic GUI forms, multilingual resource files, registry-backed settings, and skin/GIF sprite experiments. The small `OLD/KnC/` VB.NET branch is treated as an abandoned attempt.

The 2026 version is a remake rather than a byte-for-byte clone. It keeps the turn-based survival puzzle identity while intentionally changing some behavior: Shadows now kill with 100% certainty, restart uses a `-500` score penalty instead of losing all points, custom boards can be rectangular, and historical CPU-speed auto-move behavior is not reproduced.

Detailed version archaeology is maintained in [HISTORY.md](HISTORY.md).