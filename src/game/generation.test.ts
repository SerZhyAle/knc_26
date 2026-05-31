import { describe, expect, it } from "vitest";

import type { GameState } from "./engine";
import { fieldBase, generateBoard, getMaximumShadowCapacity, getMaximumShadowLevelForBoard, getWallDensity, hasLegalFirstMove, hasPathToExit, validateGeneratedBoard } from "./generation";
import { applyRestartPenalty, applyTurnProgress, createInitialProgress } from "./progress";
import { SeededRandom } from "./random";

describe("board generation", () => {
  it("generates every preset size with valid guarantees", () => {
    const presetSides = [10, 15, 20];

    for (const presetSide of presetSides) {
      const state = generateBoard({ width: presetSide, height: presetSide, level: 1, random: new SeededRandom(presetSide), maxAttempts: 1000 });

      expect(state.width).toBe(presetSide);
      expect(state.height).toBe(presetSide);
      expect(state.shadows).toHaveLength(1);
      expect(getWallDensity(state)).toBeGreaterThanOrEqual(0.3);
      expect(getWallDensity(state)).toBeLessThanOrEqual(0.4);
      expect(validateGeneratedBoard(state)).toBe(true);
    }
  });

  it("uses fieldBase as the smaller side on rectangular boards", () => {
    const state = generateBoard({ width: 12, height: 20, level: 3, random: new SeededRandom(1220), maxAttempts: 1000 });

    expect(fieldBase(state)).toBe(12);
    expect(state.shadows).toHaveLength(3);
    expect(validateGeneratedBoard(state)).toBe(true);
  });

  it("guarantees a path to the Exit and at least one legal first move", () => {
    const state = generateBoard({ width: 10, height: 10, level: 2, random: new SeededRandom(777), maxAttempts: 1000 });

    expect(hasPathToExit(state)).toBe(true);
    expect(hasLegalFirstMove(state)).toBe(true);
  });

  it("rejects a level above playable shadow capacity", () => {
    expect(getMaximumShadowLevelForBoard({ width: 10, height: 10 })).toBe(30);
    expect(() => generateBoard({ width: 10, height: 10, level: 31, random: new SeededRandom(1), maxAttempts: 1 })).toThrow("capacity");
  });

  it("reports generated shadow capacity after walls and fixed entities", () => {
    const state = makeState({
      walls: [
        { x: 0, y: 0 },
        { x: 1, y: 0 }
      ]
    });

    expect(getMaximumShadowCapacity(state)).toBe(31);
  });
});

describe("progression and scoring", () => {
  it("applies turn cost, wall push, Shadow crush, victory, level increase, and record", () => {
    const progress = createInitialProgress(1);
    const result = applyTurnProgress(progress, {
      countedAction: true,
      state: makeState({ status: "won" }),
      events: [
        { type: "wallPushed", from: { x: 1, y: 1 }, to: { x: 2, y: 1 } },
        { type: "shadowCrushed", shadowId: "shadow-1", at: { x: 2, y: 1 } },
        { type: "victory", at: { x: 5, y: 5 } }
      ]
    });

    expect(result.outcome).toBe("victory");
    expect(result.progress.score).toBe(1050);
    expect(result.progress.level).toBe(2);
    expect(result.progress.recordLevel).toBe(2);
  });

  it("floors turn and restart penalties at zero", () => {
    const progress = createInitialProgress(5);
    const turnResult = applyTurnProgress(progress, {
      countedAction: true,
      state: makeState({ status: "playing" }),
      events: [{ type: "playerBlocked", reason: "outOfBounds", at: { x: -1, y: 1 } }]
    });

    expect(turnResult.progress.score).toBe(0);
    expect(applyRestartPenalty(turnResult.progress).score).toBe(0);
    expect(applyRestartPenalty(turnResult.progress).recordLevel).toBe(5);
  });

  it("caps current level at board capacity while preserving previous record", () => {
    const result = applyTurnProgress(
      { level: 67, score: 0, recordLevel: 90 },
      {
        countedAction: true,
        state: makeState({ status: "won" }),
        events: [{ type: "victory", at: { x: 5, y: 5 } }]
      },
      67
    );

    expect(result.progress.level).toBe(67);
    expect(result.progress.recordLevel).toBe(90);
  });
});

function makeState(overrides: Partial<GameState>): GameState {
  return Object.assign(
    {},
    {
      width: 6,
      height: 6,
      monster: { x: 1, y: 1 },
      kryvavitsa: { x: 5, y: 0 },
      shadows: [],
      walls: [],
      exit: { x: 5, y: 5 },
      status: "playing",
      turn: 0
    } satisfies GameState,
    overrides
  );
}