import { createSeedFromTime } from "../game";
import { adjacentCells, directionFromAdjacentCell, directionFromKey, GameController, type GameControllerSnapshot } from "../input";
import { detectLocale, supportedLocales, translate, type Locale, type TranslationKey } from "../i18n";
import { cellFromPoint, emptyVisualAssets, loadVisualAssets, renderBoard, type BoardGeometry, type VisualAssetCollection, type VisualMode } from "../render";
import { hasSeenIntro, loadGame, markIntroSeen, saveGame, type AppSettings } from "../storage";
import { createIntroOverlay } from "./intro";

export async function mountApp(rootElement: HTMLElement): Promise<void> {
  const detectedLocale = detectLocale(navigator.language);
  const loadResult = loadGame(window.localStorage, detectedLocale);
  let settings = loadResult.settings;
  const seed = loadResult.seed ?? createSeedFromTime(Date.now());
  const controllerOptions = loadResult.game === undefined ? { boardSize: { width: settings.width, height: settings.height }, seed, progress: loadResult.progress } : { boardSize: { width: settings.width, height: settings.height }, seed, progress: loadResult.progress, game: loadResult.game };
  const controller = new GameController(controllerOptions);
  let snapshot = controller.snapshot();
  let geometry: BoardGeometry | undefined;
  let noticeTimer: number | undefined;
  let assets: VisualAssetCollection = emptyVisualAssets;

  const appElement = document.createElement("main");
  appElement.className = "game-app";

  const topBarElement = document.createElement("header");
  topBarElement.className = "top-bar";

  const menuButtonElement = document.createElement("button");
  menuButtonElement.className = "icon-button";
  menuButtonElement.type = "button";
  menuButtonElement.textContent = "☰";

  const titleElement = document.createElement("h1");
  titleElement.className = "game-title";

  const statsElement = document.createElement("dl");
  statsElement.className = "hud-stats";

  const canvasWrapElement = document.createElement("section");
  canvasWrapElement.className = "board-wrap";

  const canvasElement = document.createElement("canvas");
  canvasElement.className = "game-canvas";
  canvasElement.tabIndex = 0;

  const noticeElement = document.createElement("div");
  noticeElement.className = "notice-strip";
  noticeElement.hidden = true;

  const bottomBarElement = document.createElement("footer");
  bottomBarElement.className = "bottom-bar";

  const statusElement = document.createElement("span");
  const turnElement = document.createElement("span");

  const overlayElement = document.createElement("aside");
  overlayElement.className = "drawer-overlay";
  overlayElement.hidden = true;

  const drawerElement = document.createElement("div");
  drawerElement.className = "drawer";
  drawerElement.setAttribute("role", "dialog");
  drawerElement.setAttribute("aria-modal", "true");

  const drawerHeaderElement = document.createElement("div");
  drawerHeaderElement.className = "drawer-header";
  const drawerTitleElement = document.createElement("h2");
  const closeButtonElement = document.createElement("button");
  closeButtonElement.className = "icon-button";
  closeButtonElement.type = "button";
  closeButtonElement.textContent = "×";
  drawerHeaderElement.append(drawerTitleElement, closeButtonElement);

  const actionRowElement = document.createElement("div");
  actionRowElement.className = "action-row";
  const restartButtonElement = document.createElement("button");
  restartButtonElement.type = "button";
  const newGameButtonElement = document.createElement("button");
  newGameButtonElement.type = "button";
  const introButtonElement = document.createElement("button");
  introButtonElement.type = "button";
  actionRowElement.append(restartButtonElement, newGameButtonElement, introButtonElement);

  const settingsSectionElement = document.createElement("section");
  settingsSectionElement.className = "drawer-section";
  const settingsTitleElement = document.createElement("h3");
  const languageSelectElement = document.createElement("select");
  const boardSelectElement = document.createElement("select");
  const widthInputElement = document.createElement("input");
  const heightInputElement = document.createElement("input");
  const visualSelectElement = document.createElement("select");
  const darkThemeInputElement = document.createElement("input");
  const showGridInputElement = document.createElement("input");
  const applyButtonElement = document.createElement("button");
  applyButtonElement.type = "button";

  const helpSectionElement = document.createElement("section");
  helpSectionElement.className = "drawer-section";
  const helpTitleElement = document.createElement("h3");
  const helpBodyElement = document.createElement("p");

  const aboutSectionElement = document.createElement("section");
  aboutSectionElement.className = "drawer-section";
  const aboutTitleElement = document.createElement("h3");
  const aboutBodyElement = document.createElement("p");
  const versionElement = document.createElement("p");

  configureControls();
  settingsSectionElement.append(settingsTitleElement, labeledControl("settings.language", languageSelectElement), labeledControl("settings.boardSize", boardSelectElement), labeledControl("settings.customWidth", widthInputElement), labeledControl("settings.customHeight", heightInputElement), labeledControl("settings.visualMode", visualSelectElement), checkboxControl("settings.darkTheme", darkThemeInputElement), checkboxControl("settings.showGrid", showGridInputElement), applyButtonElement);
  helpSectionElement.append(helpTitleElement, helpBodyElement);
  aboutSectionElement.append(aboutTitleElement, aboutBodyElement, versionElement);
  drawerElement.append(drawerHeaderElement, actionRowElement, settingsSectionElement, helpSectionElement, aboutSectionElement);
  overlayElement.append(drawerElement);
  topBarElement.append(menuButtonElement, titleElement, statsElement);
  bottomBarElement.append(statusElement, turnElement);
  canvasWrapElement.append(canvasElement, noticeElement);

  const introOverlay = createIntroOverlay({
    translate: (key) => message(key),
    onDismiss: () => {
      markIntroSeen(window.localStorage);
      canvasElement.focus();
    }
  });

  appElement.append(topBarElement, canvasWrapElement, bottomBarElement, overlayElement, introOverlay.element);
  rootElement.replaceChildren(appElement);

  menuButtonElement.addEventListener("click", () => {
    openDrawer();
  });
  closeButtonElement.addEventListener("click", () => {
    closeDrawer();
  });
  overlayElement.addEventListener("click", (event) => {
    if (event.target === overlayElement) {
      closeDrawer();
    }
  });
  restartButtonElement.addEventListener("click", () => {
    snapshot = controller.restart();
    persist();
    render();
    showNotice("notice.restart");
  });
  newGameButtonElement.addEventListener("click", () => {
    snapshot = controller.newGame();
    persist();
    render();
    showNotice("notice.newGame");
  });
  introButtonElement.addEventListener("click", () => {
    closeDrawer();
    introOverlay.open();
  });
  applyButtonElement.addEventListener("click", applySettings);
  languageSelectElement.addEventListener("change", () => {
    settings = assignSettings(settings, { locale: languageSelectElement.value as Locale });
    persist();
    render();
  });
  visualSelectElement.addEventListener("change", () => {
    settings = assignSettings(settings, { visualMode: visualSelectElement.value as VisualMode });
    persist();
    render();
  });
  darkThemeInputElement.addEventListener("change", () => {
    settings = assignSettings(settings, { darkTheme: darkThemeInputElement.checked });
    persist();
    render();
  });
  showGridInputElement.addEventListener("change", () => {
    settings = assignSettings(settings, { showGrid: showGridInputElement.checked });
    persist();
    render();
  });
  canvasElement.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", () => {
    render();
  });

  render();
  if (loadResult.incompatible) {
    showNotice("notice.incompatibleReset");
  }

  if (!hasSeenIntro(window.localStorage)) {
    introOverlay.open();
  }

  assets = await loadVisualAssets();
  render();
  if (!activeVisualAssetsLoaded()) {
    showNotice("app.status.assetsFallback");
  }

  function configureControls(): void {
    for (const locale of supportedLocales) {
      languageSelectElement.append(option(locale, locale.toUpperCase()));
    }

    boardSelectElement.append(option("10", "10×10"), option("15", "15×15"), option("20", "20×20"), option("custom", "Custom"));
    visualSelectElement.append(option("original1999", "Original 1999"), option("windows2003", "Windows 2003"), option("color", "Color"));
    widthInputElement.type = "number";
    widthInputElement.min = "10";
    widthInputElement.max = "100";
    heightInputElement.type = "number";
    heightInputElement.min = "10";
    heightInputElement.max = "100";
    darkThemeInputElement.type = "checkbox";
    showGridInputElement.type = "checkbox";
  }

  function render(): void {
    snapshot = controller.snapshot();
    document.documentElement.lang = settings.locale;
    appElement.classList.toggle("dark", settings.darkTheme);
    titleElement.textContent = message("app.title");
    drawerTitleElement.textContent = message("menu.title");
    menuButtonElement.setAttribute("aria-label", message("menu.open"));
    closeButtonElement.setAttribute("aria-label", message("menu.close"));
    restartButtonElement.textContent = message("action.restart");
    newGameButtonElement.textContent = message("action.newGame");
    introButtonElement.textContent = message("menu.intro");
    settingsTitleElement.textContent = message("settings.title");
    applyButtonElement.textContent = message("action.apply");
    helpTitleElement.textContent = message("help.title");
    helpBodyElement.textContent = message("help.body");
    aboutTitleElement.textContent = message("about.title");
    aboutBodyElement.textContent = message("about.body");
    versionElement.textContent = message("about.version");
    updateLocalizedLabels();
    updateControls();
    updateStats(snapshot);
    statusElement.textContent = activeVisualAssetsLoaded() ? message("app.status.ready") : message("app.status.loadingAssets");
    turnElement.textContent = `${message("hud.turn")}: ${String(snapshot.game.turn)}`;
    geometry = renderBoard(canvasElement, snapshot.game, {
      visualMode: settings.visualMode,
      showGrid: settings.showGrid,
      darkTheme: settings.darkTheme,
      assets,
      legalMoves: adjacentCells(snapshot.game.monster, snapshot.game.width, snapshot.game.height)
    });
  }

  function updateStats(currentSnapshot: GameControllerSnapshot): void {
    statsElement.replaceChildren(
      statItem(message("hud.level"), String(currentSnapshot.progress.level)),
      statItem(message("hud.score"), String(currentSnapshot.progress.score)),
      statItem(message("hud.record"), String(currentSnapshot.progress.recordLevel)),
      statItem(message("hud.shadows"), String(currentSnapshot.game.shadows.length))
    );
  }

  function updateControls(): void {
    languageSelectElement.value = settings.locale;
    visualSelectElement.value = settings.visualMode;
    darkThemeInputElement.checked = settings.darkTheme;
    showGridInputElement.checked = settings.showGrid;
    widthInputElement.value = String(settings.width);
    heightInputElement.value = String(settings.height);
    boardSelectElement.value = settings.width === settings.height && (settings.width === 10 || settings.width === 15 || settings.width === 20) ? String(settings.width) : "custom";
  }

  function updateLocalizedLabels(): void {
    for (const labelElement of appElement.querySelectorAll<HTMLElement>("[data-i18n-label]")) {
      const key = labelElement.dataset.i18nLabel as TranslationKey;
      labelElement.textContent = message(key);
    }

    setOptionLabel(boardSelectElement, "custom", message("settings.custom"));
    setOptionLabel(visualSelectElement, "original1999", message("settings.visualOriginal"));
    setOptionLabel(visualSelectElement, "windows2003", message("settings.visualWindows2003"));
    setOptionLabel(visualSelectElement, "color", message("settings.visualColor"));
  }

  function activeVisualAssetsLoaded(): boolean {
    if (settings.visualMode === "original1999") {
      return assets.original1999.loaded;
    }

    if (settings.visualMode === "windows2003") {
      return assets.windows2003.loaded;
    }

    return true;
  }

  function applySettings(): void {
    const selectedBoard = boardSelectElement.value;
    const nextWidth = selectedBoard === "custom" ? clampBoardSide(Number(widthInputElement.value)) : Number(selectedBoard);
    const nextHeight = selectedBoard === "custom" ? clampBoardSide(Number(heightInputElement.value)) : Number(selectedBoard);
    settings = assignSettings(settings, { width: nextWidth, height: nextHeight });
    snapshot = controller.changeBoardSize({ width: settings.width, height: settings.height });
    persist();
    render();
    showNotice("notice.newGame");
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (introOverlay.isOpen() || !overlayElement.hidden) {
      return;
    }

    const direction = directionFromKey(event.key);
    if (direction === undefined) {
      return;
    }

    event.preventDefault();
    move(direction);
  }

  function handlePointerDown(event: PointerEvent): void {
    if (geometry === undefined) {
      return;
    }

    const rect = canvasElement.getBoundingClientRect();
    const targetCell = cellFromPoint(geometry, snapshot.game.width, snapshot.game.height, { clientX: event.clientX, clientY: event.clientY, rectLeft: rect.left, rectTop: rect.top }, window.devicePixelRatio || 1);
    if (targetCell === undefined) {
      return;
    }

    const direction = directionFromAdjacentCell(snapshot.game.monster, targetCell);
    if (direction !== undefined) {
      move(direction);
    }
  }

  function move(direction: Parameters<GameController["move"]>[0]): void {
    const update = controller.move(direction);
    if (!update.accepted) {
      return;
    }

    snapshot = update.snapshot;
    persist();
    render();
    if (snapshot.notice === "victory") {
      showNotice("notice.victory");
    } else if (snapshot.notice === "defeat") {
      showNotice("notice.defeat");
    }
  }

  function openDrawer(): void {
    overlayElement.hidden = false;
    closeButtonElement.focus();
  }

  function closeDrawer(): void {
    overlayElement.hidden = true;
    canvasElement.focus();
  }

  function showNotice(key: TranslationKey): void {
    if (noticeTimer !== undefined) {
      window.clearTimeout(noticeTimer);
    }

    noticeElement.textContent = message(key);
    noticeElement.hidden = false;
    noticeTimer = window.setTimeout(() => {
      noticeElement.hidden = true;
    }, 1500);
  }

  function persist(): void {
    saveGame(window.localStorage, settings, snapshot.progress, snapshot.game, snapshot.seed, new Date().toISOString());
  }

  function message(key: TranslationKey): string {
    return translate(settings.locale, key);
  }
}

function labeledControl(labelKey: TranslationKey, control: HTMLElement): HTMLLabelElement {
  const labelElement = document.createElement("label");
  const textElement = document.createElement("span");
  textElement.dataset.i18nLabel = labelKey;
  textElement.textContent = labelKey;
  labelElement.append(textElement, control);
  return labelElement;
}

function checkboxControl(labelKey: TranslationKey, control: HTMLInputElement): HTMLLabelElement {
  const labelElement = document.createElement("label");
  labelElement.className = "checkbox-row";
  const textElement = document.createElement("span");
  textElement.dataset.i18nLabel = labelKey;
  textElement.textContent = labelKey;
  labelElement.append(control, textElement);
  return labelElement;
}

function option(value: string, label: string): HTMLOptionElement {
  const optionElement = document.createElement("option");
  optionElement.value = value;
  optionElement.textContent = label;
  return optionElement;
}

function statItem(label: string, value: string): HTMLElement {
  const wrapperElement = document.createElement("div");
  const termElement = document.createElement("dt");
  const descriptionElement = document.createElement("dd");
  termElement.textContent = label;
  descriptionElement.textContent = value;
  wrapperElement.append(termElement, descriptionElement);
  return wrapperElement;
}

function clampBoardSide(value: number): number {
  if (!Number.isFinite(value)) {
    return 10;
  }

  return Math.min(100, Math.max(10, Math.trunc(value)));
}

function assignSettings(settings: AppSettings, overrides: Partial<AppSettings>): AppSettings {
  return Object.assign({}, settings, overrides);
}

function setOptionLabel(selectElement: HTMLSelectElement, value: string, label: string): void {
  for (const optionElement of Array.from(selectElement.options)) {
    if (optionElement.value === value) {
      optionElement.textContent = label;
      return;
    }
  }
}