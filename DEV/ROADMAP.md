# КнС — ROADMAP производства

**Версия**: 0.2  
**Дата**: 2026-05-31  
**Статус**: Черновик производственного плана  
**Базовая спецификация**: `DEV/specification.ru` v1.3

---

## 1. Назначение документа

Этот документ задаёт полный производственный план разработки КнС как Web/PWA-ремейка. ROADMAP описывает вехи верхнего уровня и оформляет каждую веху как отдельную техническую суб-спецификацию.

Документ не является детальным task breakdown. Низкоуровневые задачи, классы, функции, тест-кейсы и UI-макеты должны появляться позже в отдельных implementation-планах для конкретной вехи.

---

## 2. Целевое состояние MVP

MVP считается готовым, когда выполнены условия:

- игра доступна в браузере по URL GitHub Pages;
- приложение работает как PWA и открывается офлайн после первой загрузки;
- игровая логика соответствует `DEV/specification.ru`;
- основной визуальный режим использует встроенную графику `original-1999`;
- резервный режим `Цвет` доступен для отладки и fallback-сценариев;
- поддержаны EN / RU / UK локализации;
- сайт содержит главную страницу, историю игры, страницу privacy и переход к игре;
- сборка, проверка и публикация выполняются через воспроизводимый workflow;
- в Git попадают только документация, исходный код, конфигурации, утверждённые ассеты и утверждённые publish/build results.

---

## 3. Производственные принципы

- Реализация идёт через короткие вехи с проверяемым результатом.
- Каждая веха имеет входы, выходы, критерии приёмки и риски.
- Domain-логика разрабатывается раньше UI-обвязки.
- Canvas-рендеринг не должен содержать правил игры.
- UI-тексты с самого начала идут через i18n-ключи (без хардкода строк).
- Где применимо, гейт вехи закрывается автоматизированной проверкой (lint / test / build / CI), а не только ручным осмотром.
- Временные артефакты остаются в `temp/` и не попадают в Git.
- Публичные ассеты должны быть явно перенесены в `public/assets/` или `docs/assets/`.
- После каждой правки проектных файлов изменение логируется через `scripts/add_to_dev_log.ps1`.

---

## 4. Карта вех

| ID | Веха | Результат | Зависит от | Статус |
|---|---|---|---|---|
| R0 | Specification Baseline | Стабильная база требований | — | Частично готово |
| R1 | Repository Foundation | Проект, тест-раннер, i18n-каркас, CI-skeleton, Git-гигиена | R0 | Готово |
| R2 | Asset Promotion | Утверждённый набор оригинальной графики и бренд-ассетов | R0 | Готово |
| R3 | Domain Engine | Изолированная игровая модель и правила | R1 | Готово |
| R4 | Board Generation | Генерация поля, уровни, очки, прогрессия | R3 | Готово |
| R5 | Rendering Pipeline | Canvas-рендеринг поля и ассетов | R2, R3, R4 | Готово |
| R6 | Input and Turn Loop | Управление и полный цикл хода | R3, R4, R5 | Готово |
| R7 | UI Shell | HUD, меню, настройки, overlays | R5, R6 | Готово |
| R8 | Persistence and Translations | localStorage, версии сейва, переводы EN/RU/UK | R3, R4, R7 | Готово |
| R9 | PWA, CI/CD and Site | Offline/PWA, GitHub Actions деплой, статические страницы | R1, R7, R8 | Готово |
| R10 | Quality Gate | Тесты, регрессия, перф/accessibility, проверка MVP | R3–R9 | Готово |
| R11 | MVP Release | Версия, changelog, публикация | R10 | В процессе: ожидает push/deploy smoke |
| P1 | Android Package | Capacitor/Google Play после MVP | R11 | Отложено |
| P2 | Windows Package | MSIX/WinGet после MVP | R11 | Отложено |
| P3 | Extended Features | Скины, звук, дополнительные режимы | R11 | Отложено |

---

## 5. Dependency Flow

```text
R0 -> R1 -> R2
R1 -> R3 -> R4
R2 + R3 + R4 -> R5
R3 + R4 + R5 -> R6        (клавиатура зависит от R3/R4; pointer/touch — ещё и от геометрии R5)
R5 + R6 -> R7
R7 -> R8 -> R9 -> R10 -> R11
R11 -> P1 / P2 / P3
```

Критический путь MVP: `R0 -> R1 -> R3 -> R4 -> R5 -> R6 -> R7 -> R8 -> R9 -> R10 -> R11`.

Графический путь MVP: `R0 -> R2 -> R5`.

---

## 6. Суб-спецификации вех

### R0. Specification Baseline

**Цель**: зафиксировать требования, терминологию, правила игры, графику, Git-политику и MVP-границы.

**Входы**:
- `DEV/specification.ru`;
- `docs/GAME.md`;
- `docs/GAME_ru.md`;
- `temp/kc_graphics_extract/README.md`.

**Область**:
- правила игры;
- терминология: КнС, Крывавица, Чудовище, Тень;
- MVP и post-MVP границы;
- визуальный режим `Оригинал 1999`;
- политика попадания файлов в Git.

**Выходы**:
- утверждённая версия спецификации;
- синхронизированные human-readable game docs;
- список открытых решений, если они остались.

**Gate**:
- нет противоречий между спецификацией, GAME-документами и ROADMAP;
- отсутствуют устаревшие имена в modern UI context;
- `temp/` не используется как runtime source.

**Риски**:
- рассинхрон `specification.ru` ↔ `GAME.md`/`GAME_ru.md` при ручном поддержании трёх документов;
- неявные открытые решения «протекают» в R1+ как скрытые допущения.

---

### R1. Repository Foundation

**Цель**: создать воспроизводимую техническую основу проекта.

**Входы**:
- `DEV/specification.ru`;
- `docs/TECH_STACK.md`;
- `DEV/TECH_REQUIREMENTS.md`;
- `.gitignore`.

**Область**:
- Git repository initialization;
- TypeScript + Vite project structure;
- package manager lockfile;
- TypeScript strict mode;
- lint / format baseline;
- **Vitest** test runner baseline;
- **i18n-каркас**: модуль локализации + пустые `en/ru/uk` ресурсы (переводы наполняются в R8);
- **GitHub Actions CI-skeleton** (lint + test + build на push/PR; деплой включается в R9);
- build scripts;
- root cleanliness rules.

**Выходы**:
- `package.json`;
- `tsconfig.json` (strict);
- `vite.config.ts`;
- `vitest.config.ts` + один проходящий sample-тест;
- `src/` skeleton;
- `src/i18n/` skeleton (`en.json`, `ru.json`, `uk.json` — ключи-заглушки);
- `public/` skeleton;
- `.github/workflows/ci.yml` (без деплоя);
- reproducible install/build/test/lint commands.

**Gate**:
- clean install works;
- empty app builds;
- lint baseline is clean;
- `npm test` запускает Vitest и проходит sample-тест;
- CI выполняет lint+test+build на push/PR;
- generated folders ignored by Git.

**Риски**:
- выбор менеджера пакетов (npm/pnpm) и lockfile-политика влияют на воспроизводимость CI;
- ранний i18n-каркас без переводов может «застрять» с хардкодом, если R8 откладывается — ключи обязательны с R7.

---

### R2. Asset Promotion

**Цель**: превратить извлечённые DOSBox-материалы в утверждённый runtime-набор ассетов.

**Входы**:
- `temp/kc_graphics_extract/elements_transparent/`;
- `temp/kc_graphics_extract/README.md`;
- требования §9 `DEV/specification.ru`.

**Область**:
- выбор финальных PNG;
- переименование в runtime-имена;
- перенос в `public/assets/original-1999/`;
- проверка alpha-канала;
- проверка палитры и pixel-art constraints;
- выбор скриншотов для `docs/screenshots/1999_original/`;
- **бренд-ассеты**: favicon, набор PWA-иконок (manifest), OpenGraph-превью (производные от оригинальной графики/title-composite).

**Выходы**:
- `public/assets/original-1999/monster.png`;
- `public/assets/original-1999/shadow.png`;
- `public/assets/original-1999/kryvavitsa.png`;
- `public/assets/original-1999/wall.png`;
- `public/assets/original-1999/exit.png`;
- `public/assets/original-1999/intro-sz.png`;
- `public/assets/original-1999/title-composite.png`;
- `public/favicon.ico` + PWA-иконки (192/512, maskable);
- `docs/assets/og-image.png` (OpenGraph-превью);
- approved history screenshots.

**Gate**:
- app code has no references to `temp/`;
- assets render without smoothing;
- published PNG files preserve transparency;
- бренд-иконки покрывают требования manifest и OpenGraph (R9);
- Git contains only approved assets, not raw extractions.

**Риски**:
- pixel-art при апскейле иконок до 512px требует nearest-neighbor, иначе мыло;
- лицензионная чистота исходной графики 1999 (автор — тот же, риск низкий, зафиксировать в privacy/about).

---

### R3. Domain Engine

**Цель**: реализовать изолированную игровую модель без UI, Canvas, DOM и browser-specific dependencies.

**Входы**:
- правила §2–§6 `DEV/specification.ru`;
- historical behavior notes from `DEV/RESEARCH.md`.

**Область**:
- immutable game state model;
- cell types;
- entity positions;
- player move resolution;
- wall push rules;
- enemy collision rules;
- turn cycle state transitions;
- deterministic random abstraction for tests (seedable RNG; решение о сохранении seed доски — в R8).

**Выходы**:
- domain module under `src/game/`;
- typed state and command interfaces;
- unit tests for core rules.

**Gate**:
- domain tests cover movement, wall push, victory, defeat, enemy adjacency and blocked moves;
- domain has no imports from render, UI or storage layers;
- public domain API is stable enough for renderer and UI integration.

**Риски**:
- ранняя фиксация публичного API домена: его изменение после R5/R6 каскадом ломает renderer/controller;
- порядок shuffle теней и проверок поражения легко реализовать неверно — обязательны прицельные тесты.

---

### R4. Board Generation

**Цель**: реализовать генерацию поля, уровни, очки и progression rules.

**Входы**:
- §6–§8.8 `DEV/specification.ru`;
- R3 domain interfaces.

**Область**:
- random board generation;
- wall density 30–40%;
- placement constraints;
- path existence validation;
- custom board sizes;
- level progression;
- scoring;
- restart penalty;
- maximum shadow count handling.

**Выходы**:
- generator module;
- score/progression module;
- tests for generation guarantees and scoring events.

**Gate**:
- generated board always has a path to exit without moving walls;
- first legal move exists;
- enemy distance constraints hold;
- generation has bounded retry strategy and observable failure mode.

**Риски**:
- на больших/плотных полях (до 100×100, стены 30–40%) валидация пути может давать частые ретраи — нужен бюджет попыток и измеримый fallback;
- верхний предел числа теней при дефиците свободных клеток — граничный случай, требует явного теста.

---

### R5. Rendering Pipeline

**Цель**: реализовать Canvas-renderer для `Оригинал 1999` и резервного режима `Цвет`.

**Входы**:
- R2 assets;
- R3/R4 game state;
- §8–§9 `DEV/specification.ru`.

**Область**:
- Canvas sizing;
- cell geometry;
- integer scaling when possible;
- nearest-neighbor image rendering;
- HUD-compatible board viewport;
- highlight of legal moves;
- simple animation hooks;
- asset loading and fallback behavior.

**Выходы**:
- `src/render/` module;
- asset loader;
- renderer for two visual modes;
- render smoke tests or visual fixtures.

**Gate**:
- `imageSmoothingEnabled = false` is enforced;
- original assets stay visually sharp;
- renderer does not mutate game state;
- color mode works when PNG assets fail to load;
- **перф-бюджет**: стабильная отрисовка поля 100×100 без видимых лагов; анимация хода укладывается в 80–120 мс (spec §8), иначе мгновенная перерисовка.

**Риски**:
- DPR/HiDPI и integer-scaling на нестандартных размерах окна могут давать дробный масштаб → размытие или дрожание сетки;
- крупные поля при поклеточной перерисовке каждого кадра — потенциальное узкое место (нужен dirty-region или off-screen буфер).

---

### R6. Input and Turn Loop

**Цель**: соединить пользовательский ввод с domain turn cycle.

**Входы**:
- R3 domain engine;
- R4 progression;
- R5 board geometry.

**Область**:
- keyboard arrows;
- mouse click on adjacent cell;
- touch tap on adjacent cell;
- ignored invalid input;
- one full turn cycle per player action;
- input locking during animations or transition notifications;
- defeat/victory transition handling.

**Выходы**:
- `src/input/` module;
- game controller or state manager;
- integration tests for input-to-turn behavior.

**Gate**:
- enemies never move without player action;
- one input creates one complete cycle;
- invalid clicks do not change state;
- pointer/touch-ввод корректно мапит координаты в клетку через геометрию R5;
- victory/defeat notifications do not corrupt state transitions.

**Риски**:
- mouse/touch-ввод жёстко зависит от геометрии R5 (DPR, отступы HUD); расхождение даёт сдвиг клетки на 1;
- быстрый спам ввода во время анимации/нотификации без input-lock ломает инварианты цикла хода.

---

### R7. UI Shell

**Цель**: реализовать основной интерфейс приложения вокруг Canvas.

**Входы**:
- §8 `DEV/specification.ru`;
- R5 renderer;
- R6 controller.

**Область**:
- splash screen;
- top bar;
- bottom status line;
- compact mode;
- drawer menu;
- settings overlay;
- help overlay;
- about overlay;
- victory/defeat notification strip;
- все тексты UI через i18n-ключи (каркас R1), без хардкода строк.

**Выходы**:
- `src/ui/` module;
- responsive layout;
- accessible command controls;
- UI state integration with game state.

**Gate**:
- main screen is playable on desktop and mobile viewport sizes;
- overlays do not break Canvas layout;
- changing field size starts a new game as specified;
- restart/new game confirmation behavior is implemented;
- **accessibility**: клавиатурная навигация меню/оверлеев, видимый фокус, контраст тёмной темы соответствует WCAG AA для UI вне Canvas;
- все видимые строки берутся из i18n-ресурсов (нет хардкода).

**Риски**:
- compact mode (<200px, spec §8): скрытие топ-бара/статуса не должно перекрывать игровое поле кнопкой `≡`;
- оверлеи поверх Canvas при resize/ориентации могут ломать раскладку поля.

---

### R8. Persistence and Translations

**Цель**: реализовать локальное хранение состояния и наполнить трёхъязычную локализацию (модуль i18n создан в R1).

**Входы**:
- §10–§12 `DEV/specification.ru`;
- R3/R4 state model;
- R1 i18n-каркас;
- R7 UI text inventory.

**Область**:
- localStorage schema;
- save versioning;
- compatible settings retention;
- autosave after full turn cycle;
- **решение по RNG seed**: хранить ли seed доски для точного воспроизведения сейва, либо сохранять полную матрицу поля;
- language auto-detection;
- manual language switch;
- наполнение i18n-ресурсов (game + site) реальными переводами.

**Выходы**:
- `src/storage/` module;
- заполненные `src/i18n/en.json`, `ru.json`, `uk.json`;
- migration/reset rules.

**Gate**:
- saved game restores correctly;
- incompatible save resets current run without losing compatible settings;
- стратегия RNG seed зафиксирована и согласована с R3;
- language switch persists;
- нет недостающих ключей перевода (lint i18n);
- no user data leaves local device.

**Риски**:
- эволюция save-схемы между релизами без аккуратного версионирования ломает сейвы у игроков;
- рекорд должен переживать несовместимый сейв и смену размера поля — лёгкая точка регресса.

---

### R9. PWA, CI/CD and Site

**Цель**: подготовить web distribution, offline behavior, автоматический деплой и static site pages.

**Входы**:
- R1 build foundation + CI-skeleton;
- R2 бренд-иконки и OG-превью;
- R7 UI shell;
- R8 translations;
- §13, §15–§16 `DEV/specification.ru`.

**Область**:
- Vite PWA configuration;
- manifest (+ иконки 192/512 maskable из R2);
- service worker;
- **стратегия обновления SW**: версионирование кэша и поведение при новой версии (auto-update vs prompt «доступна новая версия»);
- **CI/CD**: GitHub Actions — push в `main` → build → deploy на GitHub Pages (spec §13);
- GitHub Pages routing (включая SPA-fallback для hard refresh на под-маршрутах);
- home page;
- history page;
- about page;
- privacy page;
- OpenGraph metadata (использует `docs/assets/og-image.png`);
- shared language selector.

**Выходы**:
- working PWA build;
- `.github/workflows/deploy.yml` (автодеплой);
- `docs/` or configured publish output;
- static pages with EN/RU/UK content;
- deploy-ready GitHub Pages artifact.

**Gate**:
- first load works online;
- second load works offline;
- hard refresh on public routes works (routing/fallback настроен под GitHub Pages);
- новая версия корректно инвалидирует кэш SW по выбранной стратегии;
- push в `main` автоматически публикует сайт без ручных шагов;
- privacy page is reachable;
- history page uses approved screenshots only.

**Риски**:
- GitHub Pages не поддерживает серверный роутинг — нужен 404/SPA-fallback, иначе hard refresh ломается;
- агрессивный SW-кэш может «залипнуть» на старой версии без стратегии обновления;
- base-path (`/knc_26/`) в Vite должен совпадать с реальным путём Pages, иначе битые ассеты.

---

### R10. Quality Gate

**Цель**: проверить MVP как продукт, а не только как набор модулей.

**Входы**:
- R3–R9 outputs;
- `DEV/specification.ru`;
- ROADMAP gates.

**Область**:
- unit tests;
- integration tests;
- manual smoke testing;
- desktop viewport checks;
- mobile viewport checks;
- offline checks;
- перф-проверка (большое поле, плавность хода);
- accessibility-проверка (клавиатура, фокус, контраст тёмной темы);
- i18n-проверка (нет недостающих ключей в EN/RU/UK);
- visual verification of original graphics;
- Git hygiene verification.

**Выходы**:
- QA checklist result;
- known issues list;
- release blocker list;
- final MVP readiness verdict.

**Gate**:
- no release blockers remain;
- no broken routes;
- no missing runtime assets;
- перф-бюджет R5 выполняется на целевых устройствах;
- accessibility-минимум (клавиатура + контраст) подтверждён;
- no unapproved temporary files are staged for Git;
- core gameplay can be completed through at least several levels.

**Риски**:
- ручной smoke без зафиксированного чек-листа пропускает регрессии — чек-лист должен быть артефактом, а не устной договорённостью;
- отсутствие реальных мобильных устройств в тесте: эмулятор может скрыть проблемы touch/перфоманса.

---

### R11. MVP Release

**Цель**: выпустить первую публичную Web/PWA-версию.

**Входы**:
- passed R10 quality gate;
- release version;
- changelog entry;
- GitHub Pages deployment target.

**Область**:
- version bump по calendar-схеме `YY.MM.DD.HHMM` (spec §17, напр. `26.03.02.1430`);
- release notes;
- обновление **корневого** `CHANGELOG.md` (Keep a Changelog — релизы); `DEV/CHANGELOG.md` остаётся отдельным dev-логом правок;
- final production build;
- GitHub Pages deployment (через workflow R9);
- smoke check of public URL;
- repository tag (`release: YY.MM.DD.HHMM`, Conventional Commits).

**Выходы**:
- public game URL;
- release tag;
- release notes;
- updated root `CHANGELOG.md`;
- verified deployed build.

**Gate**:
- public URL opens game;
- PWA can be installed by supported browsers;
- privacy/history pages are reachable;
- версия в приложении, в теге и в `CHANGELOG.md` совпадают;
- корневой `CHANGELOG.md` и `DEV/CHANGELOG.md` не перепутаны.

**Риски**:
- расхождение версии между приложением, тегом и changelog при ручном bump;
- два файла CHANGELOG (релизный vs dev-лог) легко перепутать — назначение должно быть зафиксировано.

---

## 7. Post-MVP суб-спецификации

### P1. Android Package

**Цель**: упаковать PWA в Android-приложение после стабилизации MVP.

**Scope**:
- Capacitor.js wrapper;
- Android project generation;
- icon/splash assets;
- privacy policy linkage;
- Google Play internal testing;
- release track preparation.

**Gate**:
- Web MVP is stable;
- privacy page is final;
- Android build installs and runs offline-capable game shell.

**Риски**:
- требования Google Play (target API, privacy, иконки) меняются — план упаковки может устареть;
- расхождение поведения PWA в Capacitor WebView vs браузер.

---

### P2. Windows Package

**Цель**: подготовить Windows-distribution без форка игровой логики.

**Scope**:
- packaging decision: MSIX, WebView shell or another approved wrapper;
- app identity;
- icon assets;
- install/update story;
- optional WinGet manifest.

**Gate**:
- Web MVP is stable;
- packaging does not duplicate domain/game logic;
- installer can be reproduced from source.

**Риски**:
- выбор обёртки (MSIX/WebView) влияет на размер и сложность поддержки;
- WinGet-манифест и подпись требуют идентичности приложения и стабильного канала обновлений.

---

### P3. Extended Features

**Цель**: расширять продукт только после стабильного MVP.

**Candidate scope**:
- user skins;
- sound;
- additional visual themes;
- richer animations;
- advanced statistics;
- optional challenge modes;
- Windows/mobile-specific UX improvements.

**Gate**:
- feature has separate specification;
- feature does not regress core gameplay;
- storage schema impact is defined before implementation.

**Риски**:
- скины/звук/режимы расширяют save-схему — риск несовместимости сейвов без миграции;
- scope creep после MVP без отдельной спецификации на каждую фичу.

---

## 8. Release Readiness Matrix

| Area | Minimum before MVP release |
|---|---|
| Requirements | `DEV/specification.ru` accepted as current source of truth |
| Repository | Git initialized, `.gitignore` active, no temporary artifacts staged |
| Build | `install`, `build`, `test` (Vitest), `lint` commands documented and reproducible |
| CI/CD | GitHub Actions: lint+test+build на PR, автодеплой на Pages при push в `main` |
| Gameplay | Movement, walls, enemies, victory, defeat, scoring and progression implemented |
| Graphics | `original-1999` assets published and rendered without smoothing |
| Branding | favicon, PWA-иконки (192/512 maskable) и OG-превью готовы |
| UI | Main screen, menu, settings, help, about and notifications implemented |
| Accessibility | Клавиатурная навигация, видимый фокус, контраст тёмной темы (WCAG AA для UI вне Canvas) |
| Performance | Перф-бюджет R5 выполняется (поле 100×100, анимация 80–120 мс) |
| Persistence | localStorage save/restore и правила сброса версии реализованы; RNG-seed политика зафиксирована |
| I18n | EN/RU/UK texts available for game and site; нет недостающих ключей |
| PWA | manifest, service worker и стратегия обновления кэша validated |
| Site | home, history, about and privacy pages available |
| QA | core tests pass and manual smoke checklist (артефакт) complete |
| Release | calendar-версия, root `CHANGELOG.md` и public URL verified |

---

## 9. Контроль артефактов

| Artifact type | Allowed Git location | Forbidden Git location |
|---|---|---|
| Source code | `src/` | `temp/` |
| Runtime assets | `public/assets/` | raw extraction folders |
| Documentation | `DEV/`, `docs/`, root markdown files | ad-hoc notes outside approved folders |
| Site assets | `docs/assets/`, `docs/screenshots/` | `OLD/K&C/` capture files |
| Build output | approved publish directory only | local `dist/`, `build/`, cache folders |
| Backups/logs | none by default | `temp/`, `*.backup`, `*.log` |

---

## 10. Управление изменениями ROADMAP

ROADMAP обновляется при изменении:

- MVP scope;
- architecture boundaries;
- release target;
- asset policy;
- platform packaging plan;
- test / CI strategy;
- versioning scheme;
- quality gates.

Каждое изменение ROADMAP должно быть залогировано в `DEV/CHANGELOG.md` через `scripts/add_to_dev_log.ps1`.
