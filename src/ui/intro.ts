import type { TranslationKey } from "../i18n";
import { original1999AssetPaths, type SpriteKey } from "../render";

interface IntroCharacter {
  readonly assetKey: Extract<SpriteKey, "kryvavitsa" | "shadow" | "monster">;
  readonly variant: string;
  readonly nameKey: TranslationKey;
  readonly descKey: TranslationKey;
}

const introCharacters: readonly IntroCharacter[] = [
  { assetKey: "kryvavitsa", variant: "kryvavitsa", nameKey: "intro.kryvavitsa.name", descKey: "intro.kryvavitsa.desc" },
  { assetKey: "shadow", variant: "shadow", nameKey: "intro.shadow.name", descKey: "intro.shadow.desc" },
  { assetKey: "monster", variant: "monster", nameKey: "intro.monster.name", descKey: "intro.monster.desc" }
];

export interface IntroOverlayOptions {
  readonly translate: (key: TranslationKey) => string;
  readonly onDismiss: () => void;
}

export interface IntroOverlay {
  readonly element: HTMLElement;
  open(): void;
  close(): void;
  isOpen(): boolean;
}

export function createIntroOverlay(options: IntroOverlayOptions): IntroOverlay {
  const overlay = document.createElement("aside");
  overlay.className = "intro-overlay";
  overlay.hidden = true;

  const screen = document.createElement("div");
  screen.className = "intro-screen";
  screen.setAttribute("role", "dialog");
  screen.setAttribute("aria-modal", "true");

  const present = document.createElement("div");
  present.className = "intro-present";

  const logo = document.createElement("img");
  logo.className = "intro-logo";
  logo.src = original1999AssetPaths.title ?? "";
  logo.alt = "Kryvavitsa and the Monster";
  logo.decoding = "async";

  const castTitle = document.createElement("h2");
  castTitle.className = "intro-cast-title";

  const cast = document.createElement("div");
  cast.className = "intro-cast";

  const textTargets: { readonly key: TranslationKey; readonly element: HTMLElement }[] = [];

  for (const character of introCharacters) {
    const figure = document.createElement("figure");
    figure.className = `intro-char intro-char--${character.variant}`;

    const portrait = document.createElement("div");
    portrait.className = "intro-portrait";
    const portraitImage = document.createElement("img");
    portraitImage.src = original1999AssetPaths[character.assetKey] ?? "";
    portraitImage.alt = "";
    portraitImage.decoding = "async";
    portrait.append(portraitImage);

    const caption = document.createElement("figcaption");
    const name = document.createElement("span");
    name.className = "intro-char-name";
    const description = document.createElement("span");
    description.className = "intro-char-desc";
    caption.append(name, description);
    textTargets.push({ key: character.nameKey, element: name }, { key: character.descKey, element: description });

    figure.append(portrait, caption);
    cast.append(figure);
  }

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "intro-start";

  const signature = document.createElement("img");
  signature.className = "intro-signature";
  signature.src = original1999AssetPaths.intro ?? "";
  signature.alt = "Serge Zhigunenko";
  signature.decoding = "async";

  screen.append(present, createRoof(), logo, castTitle, cast, startButton, signature);
  overlay.append(screen);

  overlay.addEventListener("click", () => {
    close();
  });
  startButton.addEventListener("click", (event) => {
    event.stopPropagation();
    close();
  });

  function renderText(): void {
    present.textContent = options.translate("intro.present");
    castTitle.textContent = options.translate("intro.cast");
    startButton.textContent = options.translate("intro.start");
    for (const target of textTargets) {
      target.element.textContent = options.translate(target.key);
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    close();
  }

  function open(): void {
    if (!overlay.hidden) {
      return;
    }

    renderText();
    overlay.hidden = false;
    window.addEventListener("keydown", handleKeyDown, true);
    startButton.focus();
  }

  function close(): void {
    if (overlay.hidden) {
      return;
    }

    overlay.hidden = true;
    window.removeEventListener("keydown", handleKeyDown, true);
    options.onDismiss();
  }

  return {
    element: overlay,
    open,
    close,
    isOpen: () => !overlay.hidden
  };
}

function createRoof(): SVGSVGElement {
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("class", "intro-roof");
  svg.setAttribute("viewBox", "0 0 640 56");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  const roofLine = document.createElementNS(svgNamespace, "polyline");
  roofLine.setAttribute("points", "6,54 320,8 634,54");
  roofLine.setAttribute("fill", "none");
  roofLine.setAttribute("stroke", "#6b6b6b");
  roofLine.setAttribute("stroke-width", "2");

  const apex = document.createElementNS(svgNamespace, "circle");
  apex.setAttribute("cx", "320");
  apex.setAttribute("cy", "8");
  apex.setAttribute("r", "5");
  apex.setAttribute("fill", "none");
  apex.setAttribute("stroke", "#6b6b6b");
  apex.setAttribute("stroke-width", "2");

  svg.append(roofLine, apex);
  return svg;
}
