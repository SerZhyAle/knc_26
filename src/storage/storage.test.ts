import { describe, expect, it } from "vitest";

import type { GameState } from "../game";
import { createInitialProgress } from "../game";
import type { AppSettings, StoragePort } from "./index";
import { defaultSettings, loadGame, saveGame, saveVersion } from "./index";

describe("storage", () => {
  it("saves and restores compatible game state", () => {
    const storage = new MemoryStorage();
    const settings = defaultSettings("en");
    const progress = { level: 3, score: 1200, recordLevel: 4 };
    const game = makeState();

    saveGame(storage, settings, progress, game, 123, "2026-05-31T04:00:00.000Z");
    const result = loadGame(storage, "ru");

    expect(result.incompatible).toBe(false);
    expect(result.settings.locale).toBe("en");
    expect(result.progress).toEqual(progress);
    expect(result.game).toEqual(game);
    expect(result.seed).toBe(123);
  });

  it("resets incompatible game while preserving compatible settings and record", () => {
    const storage = new MemoryStorage();
    const settings: AppSettings = {
      width: 15,
      height: 20,
      locale: "uk",
      visualMode: "color",
      darkTheme: true,
      showGrid: false
    };

    storage.setItem(
      "knc.save.v1",
      JSON.stringify({
        version: "old",
        seed: 77,
        settings,
        progress: { level: 5, score: 900, recordLevel: 8 },
        game: makeState(),
        savedAt: "2026-05-31T04:00:00.000Z"
      })
    );

    const result = loadGame(storage, "en");

    expect(result.incompatible).toBe(true);
    expect(result.game).toBeUndefined();
    expect(result.seed).toBeUndefined();
    expect(result.settings).toEqual(settings);
    expect(result.progress).toEqual(createInitialProgress(8));
  });

  it("falls back to default settings on missing save", () => {
    const result = loadGame(new MemoryStorage(), "ru");

    expect(result.settings.locale).toBe("ru");
    expect(result.progress).toEqual(createInitialProgress());
    expect(result.incompatible).toBe(false);
  });

  it("preserves the Windows 2003 visual mode setting", () => {
    const storage = new MemoryStorage();
    const settings: AppSettings = {
      ...defaultSettings("en"),
      visualMode: "windows2003"
    };

    saveGame(storage, settings, createInitialProgress(), makeState(), 123, "2026-05-31T04:00:00.000Z");
    const result = loadGame(storage, "en");

    expect(result.settings.visualMode).toBe("windows2003");
  });

  it("exposes the current save version", () => {
    expect(saveVersion).toBe("26.05.31.2251");
  });
});

class MemoryStorage implements StoragePort {
  private readonly values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  public removeItem(key: string): void {
    this.values.delete(key);
  }
}

function makeState(): GameState {
  return {
    width: 10,
    height: 10,
    monster: { x: 1, y: 1 },
    kryvavitsa: { x: 8, y: 8 },
    shadows: [{ id: "shadow-1", position: { x: 7, y: 7 } }],
    walls: [],
    exit: { x: 9, y: 9 },
    status: "playing",
    turn: 4
  };
}