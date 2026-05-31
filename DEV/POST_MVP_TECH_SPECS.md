# КнС - post-MVP технические спецификации

**Версия**: 0.1  
**Дата**: 2026-05-31  
**Статус**: Черновик роботизированного execution-spec  
**Источник**: `DEV/ROADMAP.md` P1-P3, `DEV/specification.ru` v1.3

---

## 0. Контракт выполнения

EXECUTION_RULE:
- Execute P1-P3 only after `R11` is complete unless the user explicitly changes roadmap priority.

READ_FIRST:
- `DEV/PROJECT_OPERATIONS_INDEX.md`
- `DEV/MILESTONE_TECH_SPECS.md`
- `DEV/ROADMAP.md`
- `DEV/specification.ru`

GLOBAL_FORBID:
- Do not fork gameplay logic.
- Do not duplicate `src/game/` for platform packages.
- Do not invent store metadata, signing identity, publisher identity, or legal text.
- Do not change storage schema without migration plan.
- Do not add assets unless source and Git policy are approved.

CHANGE_LOG_COMMAND:
```powershell
.\scripts\add_to_dev_log.ps1 "<file_path>" "<component>" "<description>"
```

---

## P1. Android Package

ID: `P1`

TYPE: post-mvp-android

GOAL: package stable Web/PWA MVP as Android application without forking game logic.

READ:
- R11 release state
- `DEV/specification.ru` post-MVP scope
- current PWA configuration
- current privacy page

CREATE_OR_UPDATE:
- Capacitor configuration if selected
- Android wrapper project if approved
- Android icon and splash assets
- Play internal testing notes
- privacy linkage

REQUIRE:
- Web MVP stable first.
- Android shell uses same web build.
- No duplicated domain/game logic.
- Offline-capable game shell works.
- Privacy page is final and reachable.

FORBID:
- No Android package before R11.
- No separate gameplay fork.
- No Play metadata guessing; ask for missing store data.

VERIFY:
- Android build installs.
- Game starts offline after first load where supported.
- Icons/splash render correctly.
- Privacy link reachable.

DONE:
- Internal testing package ready or blocker documented.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни P1 Android Package.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/MILESTONE_TECH_SPECS.md, R11 release state, DEV/specification.ru post-MVP scope, current PWA config, privacy page. Verify Web MVP is stable before editing.

TASK: prepare Android packaging plan and implementation using the approved wrapper approach, likely Capacitor.js, without duplicating gameplay logic. Ask for missing Google Play metadata instead of inventing it.

VERIFY: Android build/install/startup/offline behavior if toolchain is available. Log modified files with scripts/add_to_dev_log.ps1.

OUTPUT: package approach, files changed, verification, store-data blockers.
```

---

## P2. Windows Package

ID: `P2`

TYPE: post-mvp-windows

GOAL: prepare Windows distribution without forking game logic.

READ:
- R11 release state
- `DEV/specification.ru` post-MVP scope
- current PWA build
- current branding assets

CREATE_OR_UPDATE:
- packaging decision document
- MSIX/WebView wrapper configuration if approved
- Windows icon assets
- optional WinGet manifest draft

REQUIRE:
- Web MVP stable first.
- Package wraps existing web build.
- Installer reproducible from source.
- App identity and signing requirements documented.

FORBID:
- No Windows package before R11.
- No duplicate TypeScript domain fork.
- No fake signing identity.

VERIFY:
- Package builds if toolchain exists.
- App launches.
- Offline behavior matches PWA constraints where applicable.
- Installer/release process documented.

DONE:
- Windows distribution path is reproducible or blockers are explicit.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни P2 Windows Package.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/MILESTONE_TECH_SPECS.md, R11 release state, DEV/specification.ru post-MVP scope, current PWA build, branding assets. Verify Web MVP is stable before editing.

TASK: decide and implement or document Windows packaging path: MSIX, WebView shell, or another approved wrapper. Preserve single game codebase. Do not invent signing or publisher identity.

VERIFY: build/launch package if tooling exists, document blockers otherwise. Log modified files with scripts/add_to_dev_log.ps1.

OUTPUT: packaging decision, files changed, verification, signing/distribution blockers.
```

---

## P3. Extended Features

ID: `P3`

TYPE: post-mvp-feature-expansion

GOAL: add post-MVP features only through separate specifications and without regressing core gameplay.

READ:
- R11 release state
- `DEV/specification.ru` section 14 and post-MVP notes
- current architecture and storage schema
- proposed feature request

CREATE_OR_UPDATE:
- feature-specific specification
- storage impact note
- implementation plan
- tests for changed behavior

REQUIRE:
- Each feature has its own spec.
- Storage schema impact decided before implementation.
- Feature can be disabled or isolated if risky.
- Core gameplay tests remain green.

FORBID:
- No scope creep inside MVP baseline.
- No storage schema mutation without migration plan.
- No visual/audio assets without approved source and Git policy.

VERIFY:
- Feature spec reviewed.
- Regression tests pass.
- Storage migration tests pass if schema changed.
- Manual smoke confirms core gameplay unchanged.

DONE:
- Feature is shipped behind approved scope, or deferred with explicit reason.

PROMPT:
```text
Ты агент KnC Project Developer. Выполни P3 Extended Features for the requested feature.

READ: DEV/PROJECT_OPERATIONS_INDEX.md, DEV/MILESTONE_TECH_SPECS.md, R11 release state, DEV/specification.ru section 14, current architecture, storage schema, and the user's feature request.

TASK: create a feature-specific specification first. Define scope, storage impact, asset policy, tests, and rollback plan. Implement only after approval if the feature is non-trivial.

VERIFY: run regression tests, storage migration tests if applicable, and manual smoke. Log modified files with scripts/add_to_dev_log.ps1.

OUTPUT: feature spec, implementation summary if executed, verification, regression risks.
```
