import type { BoardSize, GameProgress, GameState } from "../game";
import { createInitialProgress } from "../game";
import type { Locale } from "../i18n";
import type { VisualMode } from "../render";
import { appVersion } from "../version";

export const saveVersion = appVersion;

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface AppSettings extends BoardSize {
  readonly locale: Locale;
  readonly visualMode: VisualMode;
  readonly darkTheme: boolean;
  readonly showGrid: boolean;
}

export interface PersistedGame {
  readonly version: string;
  readonly seed: number;
  readonly settings: AppSettings;
  readonly progress: GameProgress;
  readonly game: GameState;
  readonly savedAt: string;
}

export interface LoadResult {
  readonly settings: AppSettings;
  readonly progress: GameProgress;
  readonly game: GameState | undefined;
  readonly seed: number | undefined;
  readonly incompatible: boolean;
}

const storageKey = "knc.save.v1";

export function defaultSettings(locale: Locale): AppSettings {
  return {
    width: 10,
    height: 10,
    locale,
    visualMode: "original1999",
    darkTheme: false,
    showGrid: true
  };
}

export function loadGame(storage: StoragePort, locale: Locale): LoadResult {
  const fallbackSettings = defaultSettings(locale);
  const raw = storage.getItem(storageKey);
  if (raw === null) {
    return { settings: fallbackSettings, progress: createInitialProgress(), game: undefined, seed: undefined, incompatible: false };
  }

  const parsed = parsePersistedGame(raw);
  if (parsed === undefined) {
    return { settings: fallbackSettings, progress: createInitialProgress(), game: undefined, seed: undefined, incompatible: true };
  }

  const settings = normalizeSettings(parsed.settings, locale);
  const progress = normalizeProgress(parsed.progress);
  if (parsed.version !== saveVersion) {
    return { settings, progress: createInitialProgress(progress.recordLevel), game: undefined, seed: undefined, incompatible: true };
  }

  return { settings, progress, game: parsed.game, seed: parsed.seed, incompatible: false };
}

export function saveGame(storage: StoragePort, settings: AppSettings, progress: GameProgress, game: GameState, seed: number, timestamp: string): void {
  const persisted: PersistedGame = {
    version: saveVersion,
    seed,
    settings: normalizeSettings(settings, settings.locale),
    progress: normalizeProgress(progress),
    game,
    savedAt: timestamp
  };

  storage.setItem(storageKey, JSON.stringify(persisted));
}

export function clearGame(storage: StoragePort): void {
  storage.removeItem(storageKey);
}

function parsePersistedGame(raw: string): PersistedGame | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedGameLike(parsed)) {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
}

function normalizeSettings(settings: AppSettings, fallbackLocale: Locale): AppSettings {
  const width = normalizeSide(settings.width);
  const height = normalizeSide(settings.height);
  return {
    width,
    height,
    locale: isLocale(settings.locale) ? settings.locale : fallbackLocale,
    visualMode: normalizeVisualMode(settings.visualMode),
    darkTheme: settings.darkTheme,
    showGrid: settings.showGrid
  };
}

function normalizeVisualMode(value: VisualMode): VisualMode {
  if (value === "color" || value === "windows2003") {
    return value;
  }

  return "original1999";
}

function normalizeProgress(progress: GameProgress): GameProgress {
  const level = Math.max(1, Math.trunc(progress.level));
  const score = Math.max(0, Math.trunc(progress.score));
  const recordLevel = Math.max(1, Math.trunc(progress.recordLevel));
  return { level, score, recordLevel: Math.max(recordLevel, level) };
}

function normalizeSide(value: number): number {
  if (!Number.isFinite(value)) {
    return 10;
  }

  return Math.min(100, Math.max(10, Math.trunc(value)));
}

function isPersistedGameLike(value: unknown): value is PersistedGame {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<PersistedGame>;
  return typeof candidate.version === "string" && typeof candidate.seed === "number" && candidate.settings !== undefined && candidate.progress !== undefined && candidate.game !== undefined;
}

function isLocale(value: string): value is Locale {
  return value === "en" || value === "ru" || value === "uk";
}