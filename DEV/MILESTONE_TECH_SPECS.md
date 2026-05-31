# КнС - технические спецификации вех для агентной разработки

**Версия**: 0.1  
**Дата**: 2026-05-31  
**Статус**: Черновик роботизированного execution-spec  
**Источник**: `DEV/ROADMAP.md` v0.2, `DEV/specification.ru` v1.3

---

## 0. Контракт выполнения

AGENT_MODE: `KnC Project Developer`

RESPONSE_LANGUAGE: Russian

CODE_LANGUAGE: English

SOURCE_OF_TRUTH:
- `DEV/specification.ru`
- `DEV/ROADMAP.md`
- `docs/GAME.md`
- `docs/GAME_ru.md`
- `DEV/RESEARCH.md` for historical behavior only

ALWAYS_READ_FIRST:
- `DEV/PROJECT_OPERATIONS_INDEX.md`
- current milestone section in `DEV/ROADMAP.md`
- this file

GLOBAL_FORBID:
- Do not use `temp/` as runtime source.
- Do not import from outer layers into `src/game/`.
- Do not place game rules in `src/render/`, `src/input/`, or `src/ui/`.
- Do not hardcode user-visible UI strings after i18n skeleton exists.
- Do not run build/test/dev-server commands before verifying that project tooling exists.
- Do not modify `OLD/` archives.
- Do not add raw extraction output to Git.
- Do not skip `DEV/CHANGELOG.md` logging after file modifications.

GLOBAL_DO:
- Work milestone-first.
- Prefer small verifiable increments.
- Keep artifacts under approved paths.
- Run the narrowest useful verification after each milestone task.
- Stop on source-of-truth conflict and report exact files.

CHANGE_LOG_COMMAND:
```powershell
.\scripts\add_to_dev_log.ps1 "<file_path>" "<component>" "<description>"
```

STATUS_VALUES:
- `BLOCKED`: required input or decision missing.
- `READY`: prerequisites exist.
- `IN_PROGRESS`: files are being changed.
- `VERIFYING`: implementation complete, checks running.
- `DONE`: gates passed and changelog updated.

PROMPT_RULES:
- Paste only one milestone prompt at a time.
- Agent must read latest files, not cached assumptions.
- Agent must produce: scope, changed files, verification, remaining risks.
- For medium or complex implementation, agent must present a plan and wait for approval unless the user explicitly asks to execute immediately.

---

## R0. Specification Baseline

ID: `R0`

TYPE: requirements-baseline

GOAL: freeze product rules, terminology, visual baseline, MVP scope, Git policy.

READ:
- `DEV/specification.ru`
- `DEV/ROADMAP.md`
- `docs/GAME.md`
- `docs/GAME_ru.md`
- `DEV/RESEARCH.md`
- `DEV/questionnaire.ru`
- `temp/kc_graphics_extract/README.md`

CREATE_OR_UPDATE:
- `DEV/specification.ru`
- `docs/GAME.md`
- `docs/GAME_ru.md`
- `DEV/ROADMAP.md` only if milestone dependencies or gates change

REQUIRE:
- Modern UI terms: `Чудовище`, `Крывавица`, `Тень`, `Выход`, `Стена`.
- Historical term `Кровавица` allowed only in historical context.
- Rule conflicts resolved in `DEV/specification.ru` first.
- GAME docs mirror the spec and contain no independent rules.

VERIFY:
- Check `specification.ru` vs `GAME.md` vs `GAME_ru.md` for rule conflicts.
- Check no modern UI text uses obsolete names.
- Check no runtime instruction points to `temp/`.
- Check `DEV/CHANGELOG.md` contains entries for every modified project document.

DONE:
- Spec accepted as current source of truth.
- Open decisions listed or explicitly closed.
- Downstream milestones can proceed without hidden assumptions.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R0 Specification Baseline.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru, DEV/ROADMAP.md, docs/GAME.md, docs/GAME_ru.md, DEV/RESEARCH.md, DEV/questionnaire.ru, temp/kc_graphics_extract/README.md.

TASK: audit and align requirements, terminology, game rules, visual baseline, MVP scope, and Git policy. Treat DEV/specification.ru as source of truth. If GAME docs conflict, propose exact changes. Do not implement app code.

OUTPUT: conflicts found, files changed, verification performed, remaining decisions. Log each modified file with scripts/add_to_dev_log.ps1.
```

---

## R1. Repository Foundation

ID: `R1`

TYPE: project-foundation

GOAL: create reproducible TypeScript/Vite foundation with strict mode, Vitest, i18n skeleton, CI skeleton, and root hygiene.

READ:
- `DEV/specification.ru`
- `DEV/ROADMAP.md`
- `DEV/AGENT_WORKFLOW.md`
- `.gitignore`
- `docs/TECH_STACK.md` with caution: verify placeholder status before trusting
- `DEV/TECH_REQUIREMENTS.md` with caution: verify placeholder status before trusting

CREATE_OR_UPDATE:
- `package.json`
- lockfile selected by package manager decision
- `tsconfig.json`
- `vite.config.ts`
- `vitest.config.ts`
- `eslint.config.*` or equivalent lint config
- `index.html`
- `src/`
- `src/main.ts`
- `src/i18n/`
- `src/i18n/en.json`
- `src/i18n/ru.json`
- `src/i18n/uk.json`
- `public/`
- `.github/workflows/ci.yml`
- `.gitignore` if generated outputs are missing

REQUIRE:
- TypeScript strict mode enabled.
- Build command reproducible.
- Test command runs Vitest.
- Lint command exists and is clean.
- i18n skeleton exists before UI work.
- CI runs lint, test, build on push and PR.
- Generated folders ignored.

FORBID:
- No game logic beyond a sample placeholder.
- No runtime dependency on `temp/`.
- No deploy workflow in R1.
- No framework added unless justified against spec.

VERIFY:
- Clean install works.
- `npm run lint` passes.
- `npm test` passes sample test.
- `npm run build` passes.
- CI YAML has lint, test, build jobs.

DONE:
- Empty app builds.
- Toolchain is strict and reproducible.
- Root remains clean.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R1 Repository Foundation.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru, DEV/ROADMAP.md R1, DEV/AGENT_WORKFLOW.md, .gitignore. Verify whether package.json, src, tsconfig.json, vite.config.ts, and test config already exist.

TASK: create TypeScript + Vite + strict mode + Vitest + lint + i18n skeleton + CI skeleton. Keep implementation minimal. Do not implement gameplay. Do not deploy.

VERIFY: clean install, lint, test, build. If any command cannot run, report exact blocker. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: created files, selected package manager, commands, verification results, risks.
```

---

## R2. Asset Promotion

ID: `R2`

TYPE: asset-pipeline

GOAL: promote approved original 1999 graphics into stable runtime and site asset paths.

READ:
- `DEV/specification.ru` sections 9, 15, 16, 17
- `DEV/ROADMAP.md` R2
- `temp/kc_graphics_extract/README.md`
- source asset directories under `temp/kc_graphics_extract/`

CREATE_OR_UPDATE:
- `public/assets/original-1999/monster.png`
- `public/assets/original-1999/shadow.png`
- `public/assets/original-1999/kryvavitsa.png`
- `public/assets/original-1999/wall.png`
- `public/assets/original-1999/exit.png`
- `public/assets/original-1999/intro-sz.png`
- `public/assets/original-1999/title-composite.png`
- `public/favicon.ico`
- PWA icons 192/512 and maskable variants
- `docs/assets/og-image.png`
- approved screenshots under `docs/screenshots/1999_original/`

REQUIRE:
- Copy only approved assets from `temp/` to stable paths.
- Preserve alpha channel.
- Preserve pixel-art look.
- Use nearest-neighbor for derived icon scaling.
- Modern UI must use `Крывавица`, not historical title text, except history page.

FORBID:
- No app code may reference `temp/`.
- No raw extraction folders in Git.
- No smoothing or vector redraw of original sprites.

VERIFY:
- Open promoted PNGs and confirm transparency.
- Check target filenames match spec.
- Check app/site references use stable paths only.
- Check `.gitignore` still excludes raw extraction outputs.

DONE:
- Runtime asset set exists.
- Branding assets exist for R9.
- History assets are approved and stable.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R2 Asset Promotion.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 9, 15, 16, 17, DEV/ROADMAP.md R2, temp/kc_graphics_extract/README.md. Inspect candidate images before copying.

TASK: promote approved original 1999 assets from temp into public/assets/original-1999 and docs assets. Preserve transparency and pixel-art sharpness. Generate favicon/PWA/OG derivatives only from approved sources.

VERIFY: target files exist, alpha channel preserved, no runtime reference to temp, raw extraction remains ignored. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: promoted assets, derivation method, verification, unresolved asset choices.
```

---

## R3. Domain Engine

ID: `R3`

TYPE: pure-domain

GOAL: implement isolated game model and core rules without browser, Canvas, UI, input, or storage dependencies.

READ:
- `DEV/specification.ru` sections 2-6
- `docs/GAME.md`
- `docs/GAME_ru.md`
- `DEV/RESEARCH.md` game mechanics
- R1 source layout

CREATE_OR_UPDATE:
- `src/game/`
- domain state types
- board cell and entity types
- command interfaces
- movement resolver
- wall push resolver
- enemy turn resolver
- deterministic RNG interface
- `src/game/**/*.test.ts`

REQUIRE:
- Immutable state transitions.
- One player action triggers one full cycle when action is counted.
- Kryvavitsa acts before Shadows.
- Shadows are shuffled each cycle.
- Defeat adjacency checked after each individual enemy action.
- Diagonal adjacency does not kill.
- Shadow kill chance is 100%.
- Wall push cases match spec exactly.

FORBID:
- No DOM.
- No Canvas.
- No localStorage.
- No imports from `render`, `input`, `ui`, `storage`.
- No direct `Math.random()` in rule logic; use RNG abstraction.

VERIFY:
- Unit tests: empty move, blocked move, wall push to empty, wall crushes Shadow, wall into Exit, wall into Kryvavitsa blocked, wall chain blocked.
- Unit tests: Monster into Exit wins.
- Unit tests: Monster into enemy loses.
- Unit tests: Kryvavitsa greedy priority.
- Unit tests: Shadow shuffled movement with deterministic RNG.
- Unit tests: adjacency after blocked enemy action.
- Import-boundary check by inspection or lint rule.

DONE:
- Domain API stable enough for R4-R6.
- Tests cover core rules.
- No outer-layer dependency exists.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R3 Domain Engine.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 2-6, docs/GAME.md, docs/GAME_ru.md, DEV/RESEARCH.md mechanics, existing src layout. Verify R1 is complete before editing.

TASK: implement pure TypeScript domain engine under src/game. Model immutable state, commands, movement, wall push, enemies, turn cycle, defeat/victory, deterministic RNG. No UI, Canvas, DOM, storage.

VERIFY: add focused Vitest tests for all core rules and run test/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: public domain API, test coverage list, verification results, remaining integration risks.
```

---

## R4. Board Generation

ID: `R4`

TYPE: generation-and-progression

GOAL: implement board generation, level progression, scoring, restart penalty, and shadow capacity rules.

READ:
- `DEV/specification.ru` sections 6, 7, 8.8
- `DEV/ROADMAP.md` R4
- R3 domain API

CREATE_OR_UPDATE:
- `src/game/generation/` or equivalent domain-owned generation module
- scoring/progression module
- tests for generator and scoring

REQUIRE:
- Board sizes: 10x10, 15x15, 20x20, custom 10-100 each axis.
- `fieldBase = min(width, height)`.
- Walls: 30-40% of cells.
- Placement order exactly follows spec.
- Monster may overwrite wall.
- Kryvavitsa may overwrite wall and must be distance `> fieldBase / 3`.
- Shadows may overwrite walls and must be distance `> fieldBase / 4`.
- Exit only on empty cell and distance `> fieldBase / 4`.
- Path from Monster to Exit exists without moving walls.
- Monster has at least one legal first move.
- Retry strategy is bounded and failure is explicit.
- Score never below 0.

FORBID:
- No unbounded infinite generation loop.
- No browser APIs in generation.
- No hidden global random source.

VERIFY:
- Tests for each preset size.
- Tests for rectangular custom board and `fieldBase`.
- Tests for wall density bounds.
- Tests for path guarantee.
- Tests for first legal move guarantee.
- Tests for maximum shadow capacity handling.
- Tests for scoring events and floor at zero.

DONE:
- Generator produces valid boards or explicit failure.
- Progression rules are deterministic and testable.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R4 Board Generation.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 6, 7, 8.8, DEV/ROADMAP.md R4, R3 domain API. Verify R3 tests pass before editing.

TASK: implement board generation, validation, bounded retries, level progression, scoring, restart penalty, and shadow capacity handling. Keep logic in domain layer. Use deterministic RNG abstraction.

VERIFY: add Vitest coverage for generation guarantees and scoring. Run tests/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: generator API, failure mode, test cases, verification results, performance risks.
```

---

## R5. Rendering Pipeline

ID: `R5`

TYPE: canvas-rendering

GOAL: render game state on Canvas in Original 1999 mode and Color fallback mode.

READ:
- `DEV/specification.ru` sections 8, 9
- `DEV/ROADMAP.md` R5
- R2 asset paths
- R3/R4 state model

CREATE_OR_UPDATE:
- `src/render/`
- Canvas renderer
- board geometry calculator
- asset loader
- visual mode selector
- render smoke tests or fixtures

REQUIRE:
- `imageSmoothingEnabled = false`.
- Original assets render from `public/assets/original-1999/`.
- Color mode works when PNG loading fails.
- Renderer reads state and never mutates it.
- Cell geometry supports DPR and responsive viewport.
- Prefer integer scaling when available.
- Highlight legal moves without encoding game rules in renderer.
- 100x100 board has stable rendering budget.

FORBID:
- No game rule decisions in renderer.
- No mutation of domain state.
- No `temp/` paths.
- No smoothing.

VERIFY:
- Inspect Canvas context smoothing flags.
- Verify asset load success and failure fallback.
- Verify geometry for desktop, mobile, compact viewport.
- Verify 100x100 render performance target.
- Verify renderer output does not modify input state.

DONE:
- Renderer module is usable by R6/R7.
- Original and Color modes both function.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R5 Rendering Pipeline.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 8-9, DEV/ROADMAP.md R5, R2 promoted asset paths, R3/R4 state types. Verify assets exist before referencing them.

TASK: implement src/render Canvas pipeline: sizing, geometry, Original 1999 asset rendering, Color fallback, asset loader, smoothing disabled, legal-move highlight using data supplied by domain/controller.

VERIFY: run render smoke checks available in project, test fallback behavior, inspect no state mutation and no temp references. Run tests/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: renderer API, asset paths, fallback behavior, verification, performance risks.
```

---

## R6. Input and Turn Loop

ID: `R6`

TYPE: input-controller

GOAL: connect keyboard, mouse, and touch input to one complete domain turn cycle per valid player action.

READ:
- `DEV/specification.ru` sections 3, 4, 8.9
- `DEV/ROADMAP.md` R6
- R3/R4 domain API
- R5 geometry API

CREATE_OR_UPDATE:
- `src/input/`
- keyboard translator
- pointer/touch translator
- controller or state manager
- input lock handling
- integration tests

REQUIRE:
- Arrow keys map to four directions.
- Click/tap only adjacent orthogonal cell creates command.
- Non-adjacent click/tap ignored.
- One accepted input creates one full cycle.
- Enemies never move without player action.
- Input locked during animations and transition notification windows if needed.
- Victory/defeat transition generates next board without corrupting state.

FORBID:
- No duplicated game rules in input layer.
- No direct state mutation outside controller boundary.
- No multi-input race during animation.

VERIFY:
- Tests for keyboard direction mapping.
- Tests for pointer-to-cell mapping through R5 geometry.
- Tests for ignored invalid input.
- Tests for one input equals one cycle.
- Tests for input lock.
- Tests for victory/defeat transition.

DONE:
- Main loop can drive the game from user input.
- Turn invariants hold under fast input.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R6 Input and Turn Loop.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 3, 4, 8.9, DEV/ROADMAP.md R6, R3/R4 domain API, R5 geometry API. Verify dependencies are present.

TASK: implement input translation and controller/state manager. Keyboard, mouse, touch must produce domain commands only for valid actions. Enforce one full turn cycle per accepted input and input locking during animation/transition.

VERIFY: add integration tests for input-to-turn behavior and invalid input. Run tests/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: controller API, input behavior, tests, verification, race-condition risks.
```

---

## R7. UI Shell

ID: `R7`

TYPE: application-ui

GOAL: implement game screen, HUD, drawer menu, settings/help/about overlays, and notifications around Canvas.

READ:
- `DEV/specification.ru` section 8
- `DEV/ROADMAP.md` R7
- R1 i18n skeleton
- R5 renderer API
- R6 controller API

CREATE_OR_UPDATE:
- `src/ui/`
- app shell wiring
- top bar
- bottom status line
- drawer menu
- settings overlay
- help overlay
- about overlay
- victory/defeat strip
- responsive layout styles
- i18n keys for all visible strings

REQUIRE:
- One permanent game screen.
- All other screens are overlays.
- UI visible strings use i18n keys.
- Board size change starts new game: level 1, score 0, record preserved.
- Restart and new game confirmation behavior implemented.
- Keyboard navigation for menu and overlays.
- Visible focus.
- Dark theme contrast WCAG AA for UI outside Canvas.
- Compact mode below 200px does not cover board incorrectly.

FORBID:
- No game rules in UI.
- No hardcoded user-visible strings after i18n keys exist.
- No nested decorative card layouts unless required by spec.

VERIFY:
- Desktop viewport smoke.
- Mobile viewport smoke.
- Compact viewport smoke.
- Keyboard navigation smoke.
- i18n key coverage check.
- Settings behavior check.

DONE:
- App is playable through UI on desktop and mobile viewport sizes.
- UI does not corrupt game state.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R7 UI Shell.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru section 8, DEV/ROADMAP.md R7, R1 i18n skeleton, R5 renderer API, R6 controller API. Verify dependencies are complete.

TASK: implement the game shell around Canvas: splash, top bar, bottom status, drawer, settings, help, about, victory/defeat strip, responsive and compact modes. All visible strings through i18n keys.

VERIFY: desktop/mobile/compact smoke, keyboard navigation, visible focus, settings behavior, i18n coverage. Run tests/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: UI modules, i18n keys added, verification, accessibility risks.
```

---

## R8. Persistence and Translations

ID: `R8`

TYPE: storage-i18n

GOAL: implement localStorage persistence, save versioning, compatible reset behavior, and complete EN/RU/UK translations.

READ:
- `DEV/specification.ru` sections 10, 11, 12
- `DEV/ROADMAP.md` R8
- R3/R4 state model
- R7 UI text inventory

CREATE_OR_UPDATE:
- `src/storage/`
- save schema types
- save/load/migration/reset logic
- settings persistence
- `src/i18n/en.json`
- `src/i18n/ru.json`
- `src/i18n/uk.json`
- i18n validation tooling if absent

REQUIRE:
- localStorage only.
- No server.
- Autosave after full turn cycle.
- Compatible save restores current game.
- Incompatible save resets current run.
- Record survives incompatible save reset when compatible.
- Settings survive incompatible game reset when compatible.
- Language auto-detection: RU/UK else EN.
- Manual language switch persists.
- RNG seed strategy explicitly decided: full matrix save or seed save.
- No missing i18n keys.

FORBID:
- No remote telemetry.
- No personal data collection.
- No silent data loss of compatible record/settings.

VERIFY:
- Tests for save and restore.
- Tests for incompatible version reset.
- Tests for record preservation.
- Tests for settings preservation.
- Tests for language detection and persistence.
- i18n key parity check.

DONE:
- Game can resume after reload.
- Translations complete for game and site inventory available at this stage.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R8 Persistence and Translations.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 10-12, DEV/ROADMAP.md R8, R3/R4 state model, R7 UI text inventory. Verify current i18n skeleton.

TASK: implement localStorage persistence, save versioning, compatible reset behavior, settings retention, language detection/switching, and complete EN/RU/UK translation files. Decide and document RNG save strategy.

VERIFY: add tests for save/restore/migration/settings/language/i18n parity. Run tests/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: save schema, version policy, RNG strategy, translation coverage, verification, data-loss risks.
```

---

## R9. PWA, CI/CD and Site

ID: `R9`

TYPE: distribution-site

GOAL: prepare installable offline PWA, GitHub Pages deployment, and static site pages.

READ:
- `DEV/specification.ru` sections 13, 15, 16
- `DEV/ROADMAP.md` R9
- R1 CI skeleton
- R2 branding assets
- R7 UI shell
- R8 translations

CREATE_OR_UPDATE:
- Vite PWA config
- manifest
- service worker config
- `.github/workflows/deploy.yml`
- GitHub Pages publish configuration
- `docs/index.html` or configured generated site output
- history page
- about page
- privacy page
- OpenGraph metadata
- SPA fallback or routing fallback for Pages

REQUIRE:
- First load online works.
- Second load offline works.
- Manifest includes 192/512 and maskable icons.
- Service worker update strategy selected and documented.
- Push to `main` deploys to GitHub Pages.
- Hard refresh on public routes works.
- Site pages share i18n resources or equivalent key parity.
- Privacy page states local-only storage and no server collection.

FORBID:
- No deployment secrets in repository.
- No broken base path for GitHub Pages.
- No raw `temp/` screenshots in published site.

VERIFY:
- Production build works.
- PWA manifest valid.
- Offline reload works in local preview or browser test.
- Pages routing fallback works.
- Deploy workflow syntax valid.
- Privacy/history/about reachable.

DONE:
- Build is deploy-ready.
- Offline behavior validated.
- Site has required pages.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R9 PWA, CI/CD and Site.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 13, 15, 16, DEV/ROADMAP.md R9, R1 CI skeleton, R2 branding assets, R7 UI, R8 translations. Verify actual GitHub Pages base path before final config.

TASK: configure PWA manifest/service worker/update strategy, GitHub Actions deploy to Pages, static pages home/history/about/privacy, OpenGraph metadata, and routing fallback. Use approved assets only.

VERIFY: production build, manifest, offline reload, hard refresh routes, workflow syntax. Run tests/lint/build as applicable. Log each modified file with scripts/add_to_dev_log.ps1.

OUTPUT: deploy architecture, SW update strategy, pages created, verification, deployment blockers.
```

---

## R10. Quality Gate

ID: `R10`

TYPE: product-validation

GOAL: validate MVP as a product against requirements, quality gates, performance, accessibility, i18n, PWA, and Git hygiene.

READ:
- `DEV/specification.ru`
- `DEV/ROADMAP.md`
- all R3-R9 outputs
- `DEV/CHANGELOG.md`

CREATE_OR_UPDATE:
- QA checklist artifact under `DEV/` or `docs/` if approved
- known issues list
- release blocker list
- test evidence artifacts under `temp/` unless approved for docs

REQUIRE:
- Unit and integration tests pass.
- Manual smoke checklist exists as artifact.
- Core gameplay can complete several levels.
- Desktop and mobile viewport checks pass.
- Offline check passes.
- 100x100 performance budget checked.
- Accessibility minimum checked: keyboard, focus, contrast.
- i18n missing key check passes.
- Original graphics visually verified.
- Git status has no unapproved temp/raw files staged.

FORBID:
- No release if blockers remain.
- No silent acceptance of missing assets.
- No QA based only on verbal smoke.

VERIFY:
- Run lint/test/build.
- Run targeted browser/PWA checks if tooling exists.
- Inspect staged and unstaged file list.
- Record blockers and non-blockers separately.

DONE:
- MVP readiness verdict exists.
- Release blockers are zero or explicitly deferred by decision.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R10 Quality Gate.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru, DEV/ROADMAP.md R10, outputs from R3-R9, DEV/CHANGELOG.md. Verify actual available test/build/browser tooling.

TASK: run product-level validation: unit, integration, build, manual smoke checklist, desktop/mobile, offline, performance, accessibility, i18n, visual assets, Git hygiene. Create a QA artifact and blocker list.

VERIFY: execute available checks and record exact commands/results. Do not fix unrelated issues unless asked. Log modified QA artifacts with scripts/add_to_dev_log.ps1.

OUTPUT: readiness verdict, blockers, known issues, verification evidence, residual risks.
```

---

## R11. MVP Release

ID: `R11`

TYPE: release

GOAL: publish first public Web/PWA MVP with consistent version, changelog, tag, and public URL smoke check.

READ:
- R10 readiness verdict
- `DEV/specification.ru` sections 12, 17
- `DEV/ROADMAP.md` R11
- root `CHANGELOG.md` if exists
- `DEV/CHANGELOG.md`

CREATE_OR_UPDATE:
- application version source
- root `CHANGELOG.md` release entry
- release notes
- Git tag only if explicitly approved
- deployment artifact through R9 workflow

REQUIRE:
- Version format `YY.MM.DD.hhmm`.
- App version, release notes, tag, and root changelog match.
- `DEV/CHANGELOG.md` remains dev modification log.
- root `CHANGELOG.md` is release changelog.
- Public URL opens game.
- PWA install prompt supported where browser allows.
- Privacy/history/about reachable.

FORBID:
- No release if R10 blockers remain.
- No manual publish outside documented workflow unless approved.
- No confusion between root changelog and `DEV/CHANGELOG.md`.

VERIFY:
- Final lint/test/build.
- Deployment workflow completed.
- Public URL smoke.
- Version consistency check.
- PWA installability check where possible.

DONE:
- Public MVP URL verified.
- Release metadata consistent.
- Repository tag created only with approval.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни R11 MVP Release.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, R10 readiness artifact, DEV/specification.ru sections 12 and 17, DEV/ROADMAP.md R11, root CHANGELOG.md if present, DEV/CHANGELOG.md.

TASK: prepare MVP release version, release changelog, release notes, final build, deployment through configured workflow, and public smoke check. Do not create git tag unless explicitly approved.

VERIFY: lint/test/build, deployment status, public URL, PWA installability, privacy/history/about reachability, version consistency. Log modified files with scripts/add_to_dev_log.ps1.

OUTPUT: release version, public URL, verification, tag status, remaining post-release risks.
```

---

## 12. Post-MVP Specs

POST_MVP_SPEC: `DEV/POST_MVP_TECH_SPECS.md`

CONTAINS:
- `P1` Android Package.
- `P2` Windows Package.
- `P3` Extended Features.

RULE:
- Do not execute post-MVP work before `R11` is complete unless the user explicitly changes the roadmap.

---

## 13. GitHub Public Documentation And Crawlers

ID: `GITHUB_DOCS`

TYPE: public documentation and crawler readiness

GOAL: prepare the repository and GitHub Pages surface for humans, search engines, link preview scanners, archive crawlers, and security scanners.

READ:
- `DEV/PROJECT_OPERATIONS_INDEX.md`
- `DEV/specification.ru` sections 12, 17
- `DEV/ROADMAP.md` R9-R11
- `docs/` current GitHub Pages content
- root `README.md` if exists
- root `CHANGELOG.md` if exists
- `DEV/CHANGELOG.md`

CREATE_OR_UPDATE:
- root `README.md`
- `docs/index.html` or the configured GitHub Pages entry
- `docs/robots.txt`
- `docs/sitemap.xml`
- `docs/manifest.webmanifest` if not already generated by the app build
- `docs/security.txt` or `docs/.well-known/security.txt` when project contact policy exists
- link preview metadata in the GitHub Pages entry
- root repository metadata files only when explicitly useful, such as `CONTRIBUTING.md`, `SECURITY.md`, or `SUPPORT.md`

REQUIRE:
- README states project purpose, current status, supported build commands, repository structure, canonical docs, and public URL when available.
- README does not duplicate the full product specification.
- GitHub Pages entry contains title, description, canonical URL, Open Graph metadata, and crawler-safe language links.
- `robots.txt` allows public app and documentation pages, blocks temporary/generated/private paths, and references `sitemap.xml`.
- `sitemap.xml` lists stable public URLs only.
- Crawlers never reference `temp/`, raw extraction outputs, `OLD/`, private dev logs, or local-only artifacts.
- Generated or published assets match the repository inclusion policy from `DEV/specification.ru` section 17.
- Public metadata uses user-facing names: Monster, Kryvavitsa, Shadow, Exit, Wall.
- All modified files are logged with `scripts/add_to_dev_log.ps1`.

FORBID:
- No marketing-only landing page replacing the playable app.
- No crawler exposure for `temp/`, raw extraction outputs, local backups, build logs, `node_modules/`, or DOSBox captures.
- No claim that the MVP is released until R11 is complete and verified.
- No duplicate source of truth for game rules outside `DEV/specification.ru` and `docs/GAME.md` mirrors.
- No GitHub Pages deploy changes unless R9/R11 workflow context is verified.

VERIFY:
- README links resolve inside the repository.
- GitHub Pages entry renders locally or from build output.
- `robots.txt` syntax is valid and references an existing `sitemap.xml`.
- `sitemap.xml` is valid XML and contains only canonical public URLs.
- Link preview metadata is present and points to promoted public assets only.
- `npm run build` passes when the project tooling exists.
- No public file contains `temp/` runtime references.
- No diagnostics in modified docs/config files.

DONE:
- GitHub repository front page is useful for a first-time visitor.
- GitHub Pages public surface is crawler-ready.
- Scanner-facing files expose only approved public content.
- Verification evidence and remaining publication risks are recorded.

PROMPT:
```text
You are the KnC Project Developer agent. Execute GITHUB_DOCS public documentation and crawler readiness.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/specification.ru sections 12 and 17, DEV/ROADMAP.md R9-R11, docs/ current Pages content, root README.md if present, root CHANGELOG.md if present, DEV/CHANGELOG.md.

TASK: create or update the GitHub repository README, GitHub Pages public metadata, robots.txt, sitemap.xml, and scanner-facing documentation files. Keep the playable app as the primary Pages experience. Do not expose temp, OLD, raw extraction outputs, local backups, private logs, node_modules, or generated build internals.

VERIFY: validate README links, Pages metadata, robots.txt, sitemap.xml XML, public asset references, build if tooling exists, and absence of temp runtime references. Log every modified file with scripts/add_to_dev_log.ps1.

OUTPUT: files changed, public URLs covered, crawler policy, verification evidence, and remaining publication risks.
```
