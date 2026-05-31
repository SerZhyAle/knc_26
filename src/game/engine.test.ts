import { describe, expect, it } from "vitest";

import { areOrthogonallyAdjacent, cellAt, playTurn, type GameEvent, type GameState, type RandomSource } from "./engine";

class FixedRandom implements RandomSource {
  private cursor = 0;

  public constructor(private readonly values: readonly number[] = []) {}

  public nextInt(maxExclusive: number): number {
    const configuredValue = this.values[this.cursor] ?? 0;
    this.cursor += 1;
    return configuredValue % maxExclusive;
  }
}

const baseState: GameState = {
  width: 6,
  height: 6,
  monster: { x: 1, y: 1 },
  kryvavitsa: { x: 5, y: 0 },
  shadows: [],
  walls: [
    { x: 4, y: 0 },
    { x: 5, y: 1 }
  ],
  exit: { x: 5, y: 5 },
  status: "playing",
  turn: 0
};

describe("domain engine", () => {
  it("moves the Monster into an empty cell and counts the turn", () => {
    const result = playTurn(baseState, "right", new FixedRandom());

    expect(result.countedAction).toBe(true);
    expect(result.state.monster).toEqual({ x: 2, y: 1 });
    expect(result.state.turn).toBe(1);
    expect(result.state.status).toBe("playing");
    expect(result.events).toContainEqual({ type: "playerMoved", from: { x: 1, y: 1 }, to: { x: 2, y: 1 } });
  });

  it("counts a blocked Monster move and still resolves the enemy phase", () => {
    const state = withState({ monster: { x: 0, y: 1 } });

    const result = playTurn(state, "left", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 0, y: 1 });
    expect(result.state.turn).toBe(1);
    expect(result.events).toContainEqual({ type: "playerBlocked", reason: "outOfBounds", at: { x: -1, y: 1 } });
    expect(result.events.some((event) => event.type === "kryvavitsaStayed")).toBe(true);
  });

  it("pushes one Wall into an empty cell", () => {
    const state = withState({ walls: baseState.walls.concat([{ x: 2, y: 1 }]) });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 2, y: 1 });
    expect(cellAt(result.state, { x: 3, y: 1 })).toBe("wall");
    expect(result.events).toContainEqual({ type: "wallPushed", from: { x: 2, y: 1 }, to: { x: 3, y: 1 } });
  });

  it("crushes a Shadow with a pushed Wall", () => {
    const state = withState({
      walls: baseState.walls.concat([{ x: 2, y: 1 }]),
      shadows: [{ id: "shadow-1", position: { x: 3, y: 1 } }]
    });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 2, y: 1 });
    expect(result.state.shadows).toEqual([]);
    expect(cellAt(result.state, { x: 3, y: 1 })).toBe("wall");
    expect(result.events).toContainEqual({ type: "shadowCrushed", shadowId: "shadow-1", at: { x: 3, y: 1 } });
  });

  it("destroys a Wall pushed into the Exit and keeps the Exit", () => {
    const state = withState({
      walls: baseState.walls.concat([{ x: 2, y: 1 }]),
      exit: { x: 3, y: 1 }
    });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 2, y: 1 });
    expect(result.state.walls).not.toContainEqual({ x: 2, y: 1 });
    expect(result.state.exit).toEqual({ x: 3, y: 1 });
    expect(cellAt(result.state, { x: 3, y: 1 })).toBe("exit");
    expect(result.events).toContainEqual({ type: "wallDestroyed", at: { x: 2, y: 1 } });
  });

  it("blocks a Wall pushed into Kryvavitsa", () => {
    const state = withState({
      kryvavitsa: { x: 3, y: 1 },
      walls: [{ x: 2, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }],
      exit: { x: 5, y: 5 }
    });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 1, y: 1 });
    expect(cellAt(result.state, { x: 2, y: 1 })).toBe("wall");
    expect(result.events).toContainEqual({ type: "playerBlocked", reason: "wallBlockedByKryvavitsa", at: { x: 2, y: 1 } });
  });

  it("blocks Wall chains", () => {
    const state = withState({ walls: baseState.walls.concat([{ x: 2, y: 1 }, { x: 3, y: 1 }]) });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 1, y: 1 });
    expect(cellAt(result.state, { x: 2, y: 1 })).toBe("wall");
    expect(cellAt(result.state, { x: 3, y: 1 })).toBe("wall");
    expect(result.events).toContainEqual({ type: "playerBlocked", reason: "wallBlockedByWall", at: { x: 2, y: 1 } });
  });

  it("wins immediately when the Monster enters the Exit", () => {
    const state = withState({ exit: { x: 2, y: 1 } });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.status).toBe("won");
    expect(result.state.turn).toBe(1);
    expect(result.events).toContainEqual({ type: "victory", at: { x: 2, y: 1 } });
    expect(result.events.some((event) => event.type === "kryvavitsaMoved" || event.type === "kryvavitsaStayed")).toBe(false);
  });

  it("loses immediately when the Monster enters an enemy cell", () => {
    const state = withState({ shadows: [{ id: "shadow-1", position: { x: 2, y: 1 } }] });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.status).toBe("lost");
    expect(result.events).toContainEqual({ type: "defeat", reason: "monsterEnteredEnemy", by: "monster", at: { x: 2, y: 1 } });
  });

  it("moves Kryvavitsa with X-axis greedy priority before Y-axis", () => {
    const state = withState({
      monster: { x: 1, y: 1 },
      kryvavitsa: { x: 4, y: 2 },
      walls: [],
      exit: { x: 5, y: 5 }
    });

    const result = playTurn(state, "up", new FixedRandom());

    expect(result.events).toContainEqual({ type: "kryvavitsaMoved", from: { x: 4, y: 2 }, to: { x: 3, y: 2 } });
  });

  it("moves Shadows in shuffled order with deterministic random directions", () => {
    const state = withState({
      monster: { x: 0, y: 0 },
      kryvavitsa: { x: 5, y: 0 },
      shadows: [
        { id: "shadow-1", position: { x: 2, y: 2 } },
        { id: "shadow-2", position: { x: 3, y: 2 } }
      ],
      walls: [
        { x: 4, y: 0 },
        { x: 5, y: 1 }
      ],
      exit: { x: 5, y: 5 }
    });

    const result = playTurn(state, "right", new FixedRandom());
    const shadowMoveEvents = result.events.filter(isShadowMoveEvent);

    expect(shadowMoveEvents.map((event) => event.shadowId)).toEqual(["shadow-2", "shadow-1"]);
    expect(shadowMoveEvents.map((event) => event.to)).toEqual([
      { x: 3, y: 3 },
      { x: 2, y: 3 }
    ]);
  });

  it("checks defeat after a blocked enemy action", () => {
    const state = withState({
      monster: { x: 1, y: 1 },
      kryvavitsa: { x: 2, y: 2 },
      walls: [
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 3 }
      ],
      exit: { x: 5, y: 5 }
    });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.status).toBe("lost");
    expect(result.events).toContainEqual({ type: "kryvavitsaStayed", at: { x: 2, y: 2 } });
    expect(result.events).toContainEqual({ type: "defeat", reason: "enemyAdjacent", by: "kryvavitsa", at: { x: 2, y: 2 } });
  });

  it("keeps Kryvavitsa adjacent for the kill instead of fleeing toward the Exit", () => {
    const state = withState({
      monster: { x: 2, y: 2 },
      kryvavitsa: { x: 4, y: 2 },
      walls: [],
      exit: { x: 5, y: 5 }
    });

    const result = playTurn(state, "right", new FixedRandom());

    expect(result.state.monster).toEqual({ x: 3, y: 2 });
    expect(result.state.kryvavitsa).toEqual({ x: 4, y: 2 });
    expect(result.state.status).toBe("lost");
    expect(result.events).toContainEqual({ type: "kryvavitsaStayed", at: { x: 4, y: 2 } });
    expect(result.events).toContainEqual({ type: "defeat", reason: "enemyAdjacent", by: "kryvavitsa", at: { x: 4, y: 2 } });
    expect(result.events.some((event) => event.type === "kryvavitsaMoved")).toBe(false);
  });

  it("does not treat diagonal contact as lethal adjacency", () => {
    expect(areOrthogonallyAdjacent({ x: 1, y: 1 }, { x: 2, y: 2 })).toBe(false);
    expect(areOrthogonallyAdjacent({ x: 1, y: 1 }, { x: 2, y: 1 })).toBe(true);
  });
});

function withState(overrides: Partial<GameState>): GameState {
  return Object.assign({}, baseState, overrides);
}

function isShadowMoveEvent(event: GameEvent): event is Extract<GameEvent, { readonly type: "shadowMoved" }> {
  return event.type === "shadowMoved";
}