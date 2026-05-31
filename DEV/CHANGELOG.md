# CHANGELOG

All modifications to the project are logged here with timestamps.  
**Format**: `YYYY-MM-DD HH:mm:ss | File | Component | Description`

---

## Change Log

| Date | File | Component | Description |
|------|------|-----------|-------------|
| 2026-05-31 22:15:15 | version.ts, package.json, sw.js, i18n, docs | Release | Bump app/cache/save version 26.05.31.0400 -> 26.05.31.2214 for Windows 2003 visual mode release |
| 2026-05-31 22:09:09 | src/style.css | render | Fix progressive zoom-in: board-wrap auto grid tracks fed canvas intrinsic size back into layout; pin minmax(0,1fr) tracks to break the resize feedback loop |
| 2026-05-31 21:50:41 | src/render/canvas.ts | Rendering | Add strict fallback for Windows 2003 shadow sprite selection |
| 2026-05-31 21:49:04 | README.md | GitHub Docs | Update render module description for Windows 2003 mode |
| 2026-05-31 21:48:18 | DEV/ROADMAP.md | Roadmap | Add Windows 2003 visual mode to MVP target state |
| 2026-05-31 21:47:50 | CHANGELOG.md | Release Notes | Record Windows 2003 visual mode and bilingual public pages |
| 2026-05-31 21:47:24 | public/sw.js | PWA | Cache Windows 2003 visual mode assets offline |
| 2026-05-31 21:46:35 | DEV/specification.ru | Specification | Add Windows 2003 visual mode and bilingual public pages |
| 2026-05-31 21:46:03 | docs/index.html | GitHub Docs | Add play invitation and bilingual site note |
| 2026-05-31 21:45:36 | docs/GAME_ru.md | Game Docs | Document Windows 2003 skin visual mode |
| 2026-05-31 21:45:36 | docs/GAME.md | Game Docs | Document Windows 2003 skin visual mode |
| 2026-05-31 21:45:00 | docs/HISTORY.md | GitHub Docs | Document Windows 2003 skin assets and bilingual public pages |
| 2026-05-31 21:44:11 | README.md | GitHub Docs | Document Windows 2003 mode and bilingual public pages |
| 2026-05-31 21:43:28 | public/privacy/index.html | GitHub Pages Site | Add bilingual privacy content and play CTA |
| 2026-05-31 21:42:35 | public/about/index.html | GitHub Pages Site | Add bilingual about content rules visual modes and play CTA |
| 2026-05-31 21:41:29 | public/history/index.html | GitHub Pages Site | Add bilingual history content rules visual modes and play CTA |
| 2026-05-31 21:40:20 | public/history/index.html | GitHub Pages Site | Add bilingual navigation to history page |
| 2026-05-31 21:39:53 | public/history/index.html | GitHub Pages Site | Add language switch and CTA styling to history page |
| 2026-05-31 21:36:09 | src/render/canvas.ts | Rendering | Use full-cell scaling for Windows 2003 skin sprites |
| 2026-05-31 21:35:37 | src/i18n/uk.json | i18n | Generalize graphics loading status |
| 2026-05-31 21:35:37 | src/i18n/ru.json | i18n | Generalize graphics loading status |
| 2026-05-31 21:35:37 | src/i18n/en.json | i18n | Generalize graphics loading status |
| 2026-05-31 21:34:56 | src/storage/storage.test.ts | Storage | Cover Windows 2003 visual mode persistence |
| 2026-05-31 21:34:09 | src/render/render.test.ts | Rendering | Cover Windows 2003 asset paths in render tests |
| 2026-05-31 21:33:33 | src/i18n/uk.json | i18n | Add Windows 2003 visual mode label |
| 2026-05-31 21:33:33 | src/i18n/ru.json | i18n | Add Windows 2003 visual mode label |
| 2026-05-31 21:33:33 | src/i18n/en.json | i18n | Add Windows 2003 visual mode label |
| 2026-05-31 21:32:43 | src/storage/index.ts | Storage | Persist Windows 2003 visual mode setting |
| 2026-05-31 21:32:12 | src/ui/app.ts | UI | Expose Windows 2003 visual mode in settings |
| 2026-05-31 21:31:35 | src/render/index.ts | Rendering | Export generalized visual asset loader |
| 2026-05-31 21:30:32 | src/render/canvas.ts | Rendering | Render Windows 2003 intermediate visual mode |
| 2026-05-31 21:29:40 | src/render/assets.ts | Rendering | Add Windows 2003 visual asset set loader |
| 2026-05-31 21:28:37 | public/assets/windows-2003/* | Asset Promotion | Promote Windows 2003 VB6 skin GIF assets for intermediate visual mode |
| 2026-05-31 21:11:33 | public/about/index.html | GitHub Pages Site | Expand public about page with history and implementation summary |
| 2026-05-31 21:11:14 | public/history/index.html | GitHub Pages Site | Expand public history page with timeline versions and implementation notes |
| 2026-05-31 21:10:20 | docs/GAME_ru.md | Game Docs | Update Russian rules mirror with history and current implementation |
| 2026-05-31 21:09:56 | docs/GAME.md | Game Docs | Update English rules mirror with history and current implementation |
| 2026-05-31 21:09:35 | docs/index.html | GitHub Docs | Link history and implementation documentation from docs index |
| 2026-05-31 21:09:23 | README.md | GitHub Docs | Expand repository history and current implementation summary |
| 2026-05-31 21:09:08 | docs/HISTORY.md | GitHub Docs | Add detailed public history and implementation document |
| 2026-05-31 21:06:34 | DEV/ROADMAP.md | R11 MVP Release | Mark R11 as complete after public deploy smoke |
| 2026-05-31 21:06:28 | CHANGELOG.md | R11 MVP Release | Record public deployment verification |
| 2026-05-31 21:06:20 | DEV/QA_MVP_CHECKLIST.md | R11 MVP Release | Record successful public Pages smoke and release status |
| 2026-05-31 21:03:07 | DEV/questionnaire.ru | R11 MVP Release | Switch hosting question to knc_26 GitHub Pages target |
| 2026-05-31 21:02:48 | DEV/specification.ru | R11 MVP Release | Switch documented GitHub Pages path to knc_26 |
| 2026-05-31 21:02:42 | DEV/ROADMAP.md | R11 MVP Release | Switch Pages base path note to knc_26 |
| 2026-05-31 21:02:33 | DEV/QA_MVP_CHECKLIST.md | R11 MVP Release | Switch canonical URL to knc_26 GitHub Pages path |
| 2026-05-31 21:02:26 | public/privacy/index.html | R11 MVP Release | Switch canonical URL to knc_26 GitHub Pages path |
| 2026-05-31 21:02:20 | public/about/index.html | R11 MVP Release | Switch canonical URL to knc_26 GitHub Pages path |
| 2026-05-31 21:02:14 | public/history/index.html | R11 MVP Release | Switch canonical URL to knc_26 GitHub Pages path |
| 2026-05-31 21:02:07 | docs/index.html | R11 MVP Release | Switch canonical URL to knc_26 GitHub Pages path |
| 2026-05-31 21:02:01 | docs/robots.txt | R11 MVP Release | Switch sitemap reference to knc_26 GitHub Pages path |
| 2026-05-31 21:01:56 | docs/sitemap.xml | R11 MVP Release | Switch sitemap URLs to knc_26 GitHub Pages path |
| 2026-05-31 21:01:48 | public/robots.txt | R11 MVP Release | Switch sitemap reference to knc_26 GitHub Pages path |
| 2026-05-31 21:01:43 | public/sitemap.xml | R11 MVP Release | Switch sitemap URLs to knc_26 GitHub Pages path |
| 2026-05-31 21:01:37 | index.html | R11 MVP Release | Switch canonical URL to knc_26 GitHub Pages path |
| 2026-05-31 21:01:31 | CHANGELOG.md | R11 MVP Release | Switch public URL to knc_26 GitHub Pages path |
| 2026-05-31 21:01:20 | README.md | R11 MVP Release | Switch public URL to knc_26 GitHub Pages path |
| 2026-05-31 12:06:51 | DEV/ROADMAP.md | R11 MVP Release | Update R11 status after canonical URL discovery |
| 2026-05-31 12:06:46 | DEV/QA_MVP_CHECKLIST.md | R11 MVP Release | Update blocker status after canonical URL discovery |
| 2026-05-31 12:06:40 | CHANGELOG.md | R11 MVP Release | Replace provisional URL limitation with deployment status |
| 2026-05-31 12:06:34 | README.md | R11 MVP Release | Add canonical public GitHub Pages URL |
| 2026-05-31 12:06:22 | public/privacy/index.html | R11 MVP Release | Add canonical and Open Graph public URL |
| 2026-05-31 12:06:17 | public/about/index.html | R11 MVP Release | Add canonical and Open Graph public URL |
| 2026-05-31 12:06:09 | public/history/index.html | R11 MVP Release | Add canonical and Open Graph public URL |
| 2026-05-31 12:06:04 | docs/index.html | R11 MVP Release | Add canonical and Open Graph public URL |
| 2026-05-31 12:05:58 | index.html | R11 MVP Release | Add canonical and Open Graph public URL |
| 2026-05-31 12:05:51 | docs/robots.txt | R11 MVP Release | Set canonical GitHub Pages sitemap reference |
| 2026-05-31 12:05:47 | docs/sitemap.xml | R11 MVP Release | Set canonical GitHub Pages sitemap URL |
| 2026-05-31 12:05:41 | public/robots.txt | R11 MVP Release | Set canonical GitHub Pages sitemap reference |
| 2026-05-31 12:05:37 | public/sitemap.xml | R11 MVP Release | Set canonical GitHub Pages sitemap URL |
| 2026-05-31 12:00:53 | DEV/QA_MVP_CHECKLIST.md | R10 QA | Update verification count and capacity coverage |
| 2026-05-31 12:00:46 | docs/ARCHITECTURE.md | Documentation Hygiene | Remove three-dot placeholder ellipses |
| 2026-05-31 12:00:38 | CLAUDE.md | Project Guidance | Refresh current MVP tooling state |
| 2026-05-31 11:59:40 | src/game/generation.ts | R4 Board Generation | Avoid compound assignment in path builders |
| 2026-05-31 11:59:22 | src/game/generation.ts | R4 Board Generation | Fix path helper lint issues |
| 2026-05-31 11:59:04 | src/game/generation.ts | R4 Board Generation | Reserve path before placing enemies and walls |
| 2026-05-31 11:58:02 | src/input/input.test.ts | R6 Input and Turn Loop | Update controller capacity regression expectation |
| 2026-05-31 11:57:57 | src/game/generation.test.ts | R4 Board Generation | Update tests for playable shadow capacity |
| 2026-05-31 11:57:52 | src/game/generation.ts | R4 Board Generation | Use conservative playable shadow capacity |
| 2026-05-31 11:56:35 | src/input/input.test.ts | R6 Input and Turn Loop | Add over-capacity controller regression test |
| 2026-05-31 11:56:28 | src/game/generation.test.ts | R4 Board Generation | Add capacity cap regression tests |
| 2026-05-31 11:56:16 | src/game/index.ts | R4 Board Generation | Export maximum shadow level helper |
| 2026-05-31 11:56:10 | src/input/controller.ts | R6 Input and Turn Loop | Cap controller level before high-level board generation |
| 2026-05-31 11:55:58 | src/game/progress.ts | R4 Board Generation | Cap current level by board shadow capacity during progression |
| 2026-05-31 11:55:51 | src/game/generation.ts | R4 Board Generation | Add board-size maximum shadow level validation |
| 2026-05-31 04:04:24 | docs/index.html | GitHub Docs | Add docs index for repository documentation surface |
| 2026-05-31 04:04:13 | DEV/ROADMAP.md | Roadmap | Mark R10 complete and R11 blocked pending GitHub Pages URL |
| 2026-05-31 04:04:03 | DEV/QA_MVP_CHECKLIST.md | R10 Quality Gate | Add MVP QA checklist and release blocker verdict |
| 2026-05-31 04:03:45 | CHANGELOG.md | R11 Release | Add MVP release changelog |
| 2026-05-31 04:03:31 | package-lock.json | R11 Release | Sync package lock after appVersion metadata update |
| 2026-05-31 04:03:23 | package.json | R11 Release | Add appVersion metadata for MVP release |
| 2026-05-31 04:03:16 | src/storage/index.ts | R11 Release | Use app version as save schema version |
| 2026-05-31 04:03:10 | src/version.ts | R11 Release | Add application version source |
| 2026-05-31 04:02:57 | docs/sitemap.xml | GitHub Docs | Add docs sitemap mirror with provisional Pages host |
| 2026-05-31 04:02:48 | docs/robots.txt | GitHub Docs | Add docs robots mirror for crawler policy |
| 2026-05-31 04:02:43 | public/sitemap.xml | GitHub Docs | Add public sitemap with provisional Pages host |
| 2026-05-31 04:02:36 | public/robots.txt | GitHub Docs | Add public robots policy for crawler access |
| 2026-05-31 04:01:59 | README.md | GitHub Docs | Add root README for repository front page |
| 2026-05-31 04:01:35 | DEV/ROADMAP.md | Roadmap | Mark R9 PWA CI/CD and Site as complete |
| 2026-05-31 04:01:04 | public/privacy/index.html | R9 PWA Site | Add public privacy page for GitHub Pages build |
| 2026-05-31 04:00:54 | public/about/index.html | R9 PWA Site | Add public about page for GitHub Pages build |
| 2026-05-31 04:00:43 | public/history/index.html | R9 PWA Site | Add public history page for GitHub Pages build |
| 2026-05-31 04:00:27 | .github/workflows/deploy.yml | R9 PWA Site | Add GitHub Pages deployment workflow |
| 2026-05-31 04:00:18 | vite.config.ts | R9 PWA Site | Use relative Vite base for GitHub Pages |
| 2026-05-31 04:00:09 | public/assets/og-image.png | R9 PWA Site | Promote OpenGraph image into public app assets |
| 2026-05-31 04:00:02 | index.html | R9 PWA Site | Add PWA and OpenGraph metadata to app entry |
| 2026-05-31 03:59:51 | public/sw.js | R9 PWA Site | Add offline service worker with app shell cache |
| 2026-05-31 03:59:38 | public/manifest.webmanifest | R9 PWA Site | Add PWA web manifest with original icons |
| 2026-05-31 03:59:31 | src/main.ts | R9 PWA Site | Register service worker after app mount |
| 2026-05-31 03:59:25 | src/pwa.ts | R9 PWA Site | Add service worker registration helper |
| 2026-05-31 03:58:58 | DEV/ROADMAP.md | Roadmap | Mark R7 UI Shell and R8 Persistence and Translations as complete |
| 2026-05-31 03:58:39 | src/ui/app.ts | R7 UI Shell | Fix controller options and event callback lint issues |
| 2026-05-31 03:58:28 | src/storage/index.ts | R8 Persistence and Translations | Simplify boolean settings normalization for lint |
| 2026-05-31 03:58:06 | src/style.css | R7 UI Shell | Remove viewport-scaled title font size |
| 2026-05-31 03:57:59 | src/style.css | R7 UI Shell | Replace placeholder styles with responsive game UI shell |
| 2026-05-31 03:57:33 | src/main.ts | R7 UI Shell | Mount playable app shell from entry point |
| 2026-05-31 03:57:23 | src/ui/app.ts | R7 UI Shell | Localize UI control labels and option text |
| 2026-05-31 03:57:14 | src/i18n/uk.json | R8 Persistence and Translations | Add Ukrainian custom board label |
| 2026-05-31 03:57:10 | src/i18n/ru.json | R8 Persistence and Translations | Add Russian custom board label |
| 2026-05-31 03:57:04 | src/i18n/en.json | R8 Persistence and Translations | Add English custom board label |
| 2026-05-31 03:56:47 | src/ui/app.ts | R7 UI Shell | Add playable UI shell with Canvas controller input settings and autosave wiring |
| 2026-05-31 03:55:29 | src/i18n/index.test.ts | R8 Persistence and Translations | Add i18n key parity test |
| 2026-05-31 03:55:19 | src/i18n/uk.json | R8 Persistence and Translations | Localize Ukrainian privacy navigation label |
| 2026-05-31 03:55:14 | src/i18n/ru.json | R8 Persistence and Translations | Localize Russian privacy navigation label |
| 2026-05-31 03:55:07 | src/i18n/uk.json | R8 Persistence and Translations | Expand Ukrainian MVP UI translations |
| 2026-05-31 03:54:55 | src/i18n/ru.json | R8 Persistence and Translations | Expand Russian MVP UI translations |
| 2026-05-31 03:54:44 | src/i18n/en.json | R8 Persistence and Translations | Expand English MVP UI translations |
| 2026-05-31 03:54:26 | src/storage/storage.test.ts | R8 Persistence and Translations | Add storage restore migration and settings tests |
| 2026-05-31 03:54:12 | src/storage/index.ts | R8 Persistence and Translations | Fix storage type imports |
| 2026-05-31 03:54:06 | src/storage/index.ts | R8 Persistence and Translations | Add localStorage save schema and versioned load behavior |
| 2026-05-31 03:53:15 | DEV/ROADMAP.md | Roadmap | Mark R6 Input and Turn Loop as complete |
| 2026-05-31 03:53:03 | src/input/input.test.ts | R6 Input and Turn Loop | Add input translator and controller tests |
| 2026-05-31 03:52:44 | src/input/index.ts | R6 Input and Turn Loop | Add input module public exports |
| 2026-05-31 03:52:37 | src/input/controller.ts | R6 Input and Turn Loop | Add game controller for one-input one-turn cycle and transitions |
| 2026-05-31 03:52:21 | src/input/commands.ts | R6 Input and Turn Loop | Add keyboard and adjacent-cell direction translators |
| 2026-05-31 03:51:48 | DEV/ROADMAP.md | Roadmap | Mark R5 Rendering Pipeline as complete |
| 2026-05-31 03:51:37 | src/render/assets.ts | R5 Rendering Pipeline | Expand image loader callbacks for lint compliance |
| 2026-05-31 03:51:25 | src/render/render.test.ts | R5 Rendering Pipeline | Add render geometry asset and Canvas smoke tests |
| 2026-05-31 03:51:06 | src/render/index.ts | R5 Rendering Pipeline | Add render module public exports |
| 2026-05-31 03:51:00 | src/render/canvas.ts | R5 Rendering Pipeline | Add Canvas renderer with Original 1999 and color fallback modes |
| 2026-05-31 03:50:30 | src/render/assets.ts | R5 Rendering Pipeline | Use relative original asset paths for Pages compatibility |
| 2026-05-31 03:50:19 | src/render/assets.ts | R5 Rendering Pipeline | Add original 1999 asset paths and browser loader |
| 2026-05-31 03:50:09 | src/render/geometry.ts | R5 Rendering Pipeline | Add Canvas board geometry and pointer mapping utilities |
| 2026-05-31 03:49:36 | DEV/ROADMAP.md | Roadmap | Mark R4 Board Generation as complete |
| 2026-05-31 03:49:24 | src/game/generation.test.ts | R4 Board Generation | Remove unused TurnResult import from generation tests |
| 2026-05-31 03:49:10 | src/game/generation.test.ts | R4 Board Generation | Add generation and scoring unit tests |
| 2026-05-31 03:48:48 | src/game/index.ts | R4 Board Generation | Export generation progress and random APIs |
| 2026-05-31 03:48:42 | src/game/progress.ts | R4 Board Generation | Add scoring and level progression helpers |
| 2026-05-31 03:48:27 | src/game/generation.ts | R4 Board Generation | Add bounded board generator and validation rules |
| 2026-05-31 03:47:32 | src/game/random.ts | R4 Board Generation | Add deterministic seeded RNG for domain and generation |
| 2026-05-31 03:45:38 | src/game/engine.test.ts | R3 Domain Engine | Correct blocked Monster move test to use out-of-bounds action |
| 2026-05-31 03:45:21 | DEV/ROADMAP.md | Roadmap | Mark R3 Domain Engine as complete |
| 2026-05-31 03:45:06 | src/game/engine.test.ts | R3 Domain Engine | Replace test object spread with Object.assign |
| 2026-05-31 03:44:59 | src/game/engine.ts | R3 Domain Engine | Replace object spread with Object.assign state updates |
| 2026-05-31 03:44:23 | src/game/engine.ts | R3 Domain Engine | Make random index error message lint compliant |
| 2026-05-31 03:44:19 | src/game/engine.test.ts | R3 Domain Engine | Remove unused type import from domain tests |
| 2026-05-31 03:44:01 | src/game/engine.test.ts | R3 Domain Engine | Add domain engine unit tests for movement wall push enemies and defeat rules |
| 2026-05-31 03:43:27 | src/game/index.ts | R3 Domain Engine | Add domain engine public exports |
| 2026-05-31 03:43:22 | src/game/engine.ts | R3 Domain Engine | Add pure domain engine with movement wall push enemies and deterministic RNG |
| 2026-05-31 03:40:17 | DEV/ROADMAP.md | Roadmap | Mark R2 Asset Promotion as complete |
| 2026-05-31 03:39:25 | docs/screenshots/1999_original/README.md | Assets | Update original 1999 screenshot README for promoted R2 files |
| 2026-05-31 03:38:50 | docs/assets/og-image.png | Assets | Generate Open Graph image from original 1999 gameplay screenshot |
| 2026-05-31 03:38:50 | public/favicon.ico | Assets | Generate favicon from original 1999 intro mark |
| 2026-05-31 03:38:50 | public/assets/icons/maskable-512.png | Assets | Generate 512px maskable PWA icon from original 1999 intro mark |
| 2026-05-31 03:38:50 | public/assets/icons/maskable-192.png | Assets | Generate 192px maskable PWA icon from original 1999 intro mark |
| 2026-05-31 03:38:50 | public/assets/icons/icon-512.png | Assets | Generate 512px PWA icon from original 1999 intro mark |
| 2026-05-31 03:38:50 | public/assets/icons/icon-192.png | Assets | Generate 192px PWA icon from original 1999 intro mark |
| 2026-05-31 03:38:50 | docs/screenshots/1999_original/03_gameplay.png | Assets | Promote original 1999 gameplay screenshot |
| 2026-05-31 03:38:50 | docs/screenshots/1999_original/02_title_menu.png | Assets | Promote original 1999 title screenshot |
| 2026-05-31 03:38:50 | docs/screenshots/1999_original/01_intro_logo.png | Assets | Promote original 1999 intro screenshot |
| 2026-05-31 03:38:50 | public/assets/original-1999/title-composite.png | Assets | Promote original 1999 title composite |
| 2026-05-31 03:38:50 | public/assets/original-1999/intro-sz.png | Assets | Promote original 1999 intro mark |
| 2026-05-31 03:38:50 | public/assets/original-1999/exit.png | Assets | Promote original 1999 exit sprite |
| 2026-05-31 03:38:50 | public/assets/original-1999/wall.png | Assets | Promote original 1999 wall sprite |
| 2026-05-31 03:38:50 | public/assets/original-1999/kryvavitsa.png | Assets | Promote original 1999 kryvavitsa sprite |
| 2026-05-31 03:38:50 | public/assets/original-1999/shadow.png | Assets | Promote original 1999 shadow sprite |
| 2026-05-31 03:38:50 | public/assets/original-1999/monster.png | Assets | Promote original 1999 monster sprite |
| 2026-05-31 03:33:36 | DEV/MILESTONE_TECH_SPECS.md | Milestone Specs | Add GitHub public documentation and crawler readiness step |
| 2026-05-31 03:28:15 | DEV/ROADMAP.md | Roadmap | Mark R1 Repository Foundation as complete |
| 2026-05-31 03:27:36 | .github/workflows/ci.yml | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/i18n/uk.json | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/i18n/ru.json | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/i18n/en.json | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/i18n/index.test.ts | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/i18n/index.ts | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/vite-env.d.ts | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/style.css | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | src/main.ts | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | index.html | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | eslint.config.js | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | vitest.config.ts | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | vite.config.ts | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | tsconfig.json | R1 Foundation | Normalize final newline |
| 2026-05-31 03:27:36 | package.json | R1 Foundation | Normalize final newline |
| 2026-05-31 03:26:59 | eslint.config.js | R1 Foundation | Remove spread syntax from ESLint config |
| 2026-05-31 03:26:24 | .git | R1 Foundation | Initialize Git repository metadata |
| 2026-05-31 03:25:38 | package-lock.json | R1 Foundation | Add npm lockfile for reproducible installs |
| 2026-05-31 03:25:15 | public/assets/.gitkeep | R1 Foundation | Add public assets skeleton |
| 2026-05-31 03:24:58 | .github/workflows/ci.yml | R1 Foundation | Add CI skeleton for lint test build |
| 2026-05-31 03:24:58 | src/i18n/uk.json | R1 Foundation | Add Ukrainian placeholder translations |
| 2026-05-31 03:24:58 | src/i18n/ru.json | R1 Foundation | Add Russian placeholder translations |
| 2026-05-31 03:24:58 | src/i18n/en.json | R1 Foundation | Add English placeholder translations |
| 2026-05-31 03:24:58 | src/i18n/index.test.ts | R1 Foundation | Add Vitest sample test |
| 2026-05-31 03:24:58 | src/i18n/index.ts | R1 Foundation | Add i18n skeleton module |
| 2026-05-31 03:24:58 | src/vite-env.d.ts | R1 Foundation | Add Vite type references |
| 2026-05-31 03:24:58 | src/style.css | R1 Foundation | Add minimal app shell styles |
| 2026-05-31 03:24:58 | src/main.ts | R1 Foundation | Add minimal i18n-backed app entry point |
| 2026-05-31 03:24:58 | index.html | R1 Foundation | Add Vite HTML entry point |
| 2026-05-31 03:24:58 | eslint.config.js | R1 Foundation | Add ESLint flat configuration |
| 2026-05-31 03:24:58 | vitest.config.ts | R1 Foundation | Add Vitest configuration |
| 2026-05-31 03:24:58 | vite.config.ts | R1 Foundation | Add Vite build configuration |
| 2026-05-31 03:24:58 | tsconfig.json | R1 Foundation | Add strict TypeScript configuration |
| 2026-05-31 03:24:58 | package.json | R1 Foundation | Add npm scripts and TypeScript/Vite/Vitest dependencies |
| 2026-05-31 03:20:36 | DEV/PROJECT_OPERATIONS_INDEX.md | Navigation | Add post-MVP technical specs to operations index |
| 2026-05-31 03:20:29 | DEV/POST_MVP_TECH_SPECS.md | Milestone Specs | Add post-MVP robotic technical specifications |
| 2026-05-31 03:20:09 | DEV/MILESTONE_TECH_SPECS.md | Milestone Specs | Move post-MVP specs out of main milestone execution file |
| 2026-05-31 03:19:17 | DEV/PROJECT_OPERATIONS_INDEX.md | Navigation | Add milestone technical specs to operations index |
| 2026-05-31 03:19:06 | DEV/MILESTONE_TECH_SPECS.md | Milestone Specs | Add robotic milestone technical specifications with agent prompts |
| 2026-05-31 03:07:04 | .github/agents/knc-project-developer.agent.md | agents | Add KnC project-specific development agent |
| 2026-05-31 03:01:43 | DEV/ROADMAP.md | Roadmap | Improved roadmap v0.2: added per-milestone risks, fixed R5->R6 and i18n ordering, added Vitest/CI/brand assets/versioning/perf/accessibility gates and dependency column |
| 2026-05-31 02:53:02 | CLAUDE.md | Documentation | Added CLAUDE.md guidance file for Claude Code |
| 2026-05-31 02:49:30 | DEV/PROJECT_OPERATIONS_INDEX.md | Roadmap | Registered ROADMAP as production milestone planning artifact |
| 2026-05-31 02:49:21 | DEV/ROADMAP.md | Roadmap | Added production roadmap with milestone sub-specifications for MVP and post-MVP work |
| 2026-05-31 02:43:45 | DEV/specification.ru | Git Hygiene | Documented Git inclusion policy and .gitignore role |
| 2026-05-31 02:43:19 | .gitignore | Git Hygiene | Added repository ignore rules for dependencies, temporary artifacts, backups, build outputs, and DOSBox captures |
| 2026-05-31 02:41:21 | DEV/specification.ru | Specification | Removed remaining English fallback and production wording |
| 2026-05-31 02:41:05 | DEV/specification.ru | Specification | Polished Russian wording in graphics requirements |
| 2026-05-31 02:40:38 | DEV/specification.ru | Specification | Aligned splash, help, and about UI text with Original 1999 graphics mode |
| 2026-05-31 02:39:53 | DEV/specification.ru | Specification | Added original DOS graphics asset sources, rendering rules, MVP visual mode, and production asset paths |
| 2026-05-31 02:07:59 | DEV/specification.ru | Specification | Applied project ellipsis style in changelog example |
| 2026-05-31 02:07:43 | DEV/specification.ru | Specification | Fixed remaining README template title and post-MVP download labels |
| 2026-05-31 02:07:23 | docs/GAME_ru.md | Game Documentation | Added Russian human-readable game description and rules |
| 2026-05-31 02:07:23 | docs/GAME.md | Game Documentation | Added English human-readable game description and rules |
| 2026-05-31 02:07:23 | DEV/specification.ru | Specification | Normalized game canon, MVP scope, turn rules, generation guarantees, persistence behavior |
| 2026-03-02 | DEV/RESEARCH.md | Research | Full platform research + game mechanics reverse-engineering from VB sources |
| 2026-03-02 | dev/ | Project Setup | Created initial folder structure: dev/, docs/, scripts/, temp/ |
| 2026-03-02 | dev/PROJECT_OPERATIONS_INDEX.md | Navigation | Initial creation |
| 2026-03-02 | dev/AGENT_WORKFLOW.md | Workflow | Initial creation |
| 2026-03-02 | dev/TECH_REQUIREMENTS.md | Requirements | Initial creation |
| 2026-03-02 | dev/CHANGELOG.md | Logging | Initial creation |
| 2026-03-02 | docs/ARCHITECTURE.md | Architecture | Initial creation |
| 2026-03-02 | docs/DEV_OPS.md | Build & Deploy | Initial creation |
| 2026-03-02 | docs/TECH_STACK.md | Technology | Initial creation |
| 2026-03-02 | scripts/add_to_dev_log.ps1 | Tooling | Initial creation |
| 2026-03-02 | .editorconfig | Configuration | Initial creation |

---

## How to Update This Log

Use the PowerShell script in `scripts/add_to_dev_log.ps1`:

```powershell
.\scripts\add_to_dev_log.ps1 "<file_path>" "<component>" "<description>"
```

**Example**:
```powershell
.\scripts\add_to_dev_log.ps1 "src/MyClass.cs" "Authentication" "Added OAuth2 support"
```

This will append a timestamped row to this file automatically.

---

## Statistics

- **Total Changes**: [Auto-update]
- **Last Updated**: Check bottom of table above
- **Active Developers**: [Track as needed]

---

## Retention Policy

- Keep all entries (CHANGELOG is historical record)
- Archive old year logs if file exceeds 1000 lines
- Link archived logs from this file

---

## Related Documents

- **Workflow**: [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md)
- **Operations Index**: [PROJECT_OPERATIONS_INDEX.md](PROJECT_OPERATIONS_INDEX.md)
- **Requirements**: [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md)
