import { describe, expect, it } from "vitest";

import type { GameState } from "../game";
import { createInitialProgress } from "../game";
import { directionFromAdjacentCell, directionFromKey } from "./commands";
import { GameController } from "./controller";

describe("input translators", () => {
  it("maps arrow keys to domain directions", () => {
    expect(directionFromKey("ArrowUp")).toBe("up");
    expect(directionFromKey("ArrowDown")).toBe("down");
    expect(directionFromKey("ArrowLeft")).toBe("left");
    expect(directionFromKey("ArrowRight")).toBe("right");
    expect(directionFromKey("KeyW")).toBeUndefined();
  });

  it("accepts only orthogonally adjacent target cells", () => {
    const monster = { x: 3, y: 3 };

    expect(directionFromAdjacentCell(monster, { x: 3, y: 2 })).toBe("up");
    expect(directionFromAdjacentCell(monster, { x: 4, y: 3 })).toBe("right");
    expect(directionFromAdjacentCell(monster, { x: 4, y: 4 })).toBeUndefined();
    expect(directionFromAdjacentCell(monster, { x: 6, y: 3 })).toBeUndefined();
  });
});

describe("game controller", () => {
  it("keeps enemies still until accepted input arrives", () => {
    const controller = new GameController({ boardSize: { width: 10, height: 10 }, seed: 10 });
    const before = controller.snapshot();
    const after = controller.snapshot();

    expect(after.game.kryvavitsa).toEqual(before.game.kryvavitsa);
    expect(after.game.shadows).toEqual(before.game.shadows);
    expect(after.game.turn).toBe(before.game.turn);
  });

  it("ignores movement while locked", () => {
    const controller = new GameController({ boardSize: { width: 10, height: 10 }, seed: 20 });
    const before = controller.setLocked(true);
    const update = controller.move("right");

    expect(update.accepted).toBe(false);
    expect(update.snapshot.game).toEqual(before.game);
  });

  it("runs one complete cycle for one accepted input", () => {
    const controller = new GameController({ boardSize: { width: 10, height: 10 }, seed: 30, game: makeState(), progress: createInitialProgress() });
    const update = controller.move("right");

    expect(update.accepted).toBe(true);
    expect(update.snapshot.game.turn).toBe(1);
    expect(update.snapshot.lastEvents.some((event) => event.type === "kryvavitsaMoved" || event.type === "kryvavitsaStayed")).toBe(true);
  });

  it("generates the next board after victory and increases level", () => {
    const controller = new GameController({
      boardSize: { width: 10, height: 10 },
      seed: 40,
      progress: createInitialProgress(),
      game: makeState({ exit: { x: 2, y: 1 } })
    });

    const update = controller.move("right");

    expect(update.accepted).toBe(true);
    expect(update.snapshot.notice).toBe("victory");
    expect(update.snapshot.progress.level).toBe(2);
    expect(update.snapshot.game.status).toBe("playing");
    expect(update.snapshot.game.turn).toBe(0);
  });

  it("freezes the death board and locks on defeat, then resumes on dismissDefeat", () => {
    const controller = new GameController({
      boardSize: { width: 10, height: 10 },
      seed: 60,
      progress: createInitialProgress(),
      game: makeState({ monster: { x: 1, y: 1 }, kryvavitsa: { x: 8, y: 8 }, shadows: [{ id: "shadow-1", position: { x: 2, y: 1 } }] })
    });

    const update = controller.move("right");

    expect(update.accepted).toBe(true);
    expect(update.snapshot.notice).toBe("defeat");
    expect(update.snapshot.locked).toBe(true);
    expect(update.snapshot.game.status).toBe("lost");
    expect(update.snapshot.game.monster).toEqual({ x: 2, y: 1 });
    expect(update.snapshot.lastEvents).toContainEqual({ type: "defeat", reason: "monsterEnteredEnemy", by: "shadow", at: { x: 2, y: 1 } });

    const resumed = controller.dismissDefeat();

    expect(resumed.locked).toBe(false);
    expect(resumed.notice).toBe("none");
    expect(resumed.game.status).toBe("playing");
    expect(resumed.game.turn).toBe(0);
  });

  it("caps restored over-capacity level before generating a board", () => {
    const controller = new GameController({ boardSize: { width: 10, height: 10 }, seed: 50, progress: { level: 120, score: 0, recordLevel: 120 } });
    const snapshot = controller.snapshot();

    expect(snapshot.progress.level).toBe(30);
    expect(snapshot.progress.recordLevel).toBe(120);
    expect(snapshot.game.shadows).toHaveLength(30);
  });
});

function makeState(overrides: Partial<GameState> = {}): GameState {
  return Object.assign(
    {},
    {
      width: 10,
      height: 10,
      monster: { x: 1, y: 1 },
      kryvavitsa: { x: 8, y: 8 },
      shadows: [{ id: "shadow-1", position: { x: 7, y: 7 } }],
      walls: [],
      exit: { x: 9, y: 9 },
      status: "playing",
      turn: 0
    } satisfies GameState,
    overrides
  );
}