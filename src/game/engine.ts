export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "playing" | "won" | "lost";

export type CellKind =
  | "empty"
  | "wall"
  | "monster"
  | "kryvavitsa"
  | "shadow"
  | "exit"
  | "outOfBounds";

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface Shadow {
  readonly id: string;
  readonly position: Position;
}

export interface GameState {
  readonly width: number;
  readonly height: number;
  readonly monster: Position;
  readonly kryvavitsa: Position;
  readonly shadows: readonly Shadow[];
  readonly walls: readonly Position[];
  readonly exit: Position;
  readonly status: GameStatus;
  readonly turn: number;
}

export interface RandomSource {
  nextInt(maxExclusive: number): number;
}

export type PlayerBlockedReason =
  | "outOfBounds"
  | "wallAtBoardEdge"
  | "wallBlockedByWall"
  | "wallBlockedByKryvavitsa";

export type DefeatReason = "monsterEnteredEnemy" | "enemyAdjacent";

export type GameEvent =
  | { readonly type: "playerMoved"; readonly from: Position; readonly to: Position }
  | { readonly type: "playerBlocked"; readonly reason: PlayerBlockedReason; readonly at: Position }
  | { readonly type: "wallPushed"; readonly from: Position; readonly to: Position }
  | { readonly type: "wallDestroyed"; readonly at: Position }
  | { readonly type: "shadowCrushed"; readonly shadowId: string; readonly at: Position }
  | { readonly type: "kryvavitsaMoved"; readonly from: Position; readonly to: Position }
  | { readonly type: "kryvavitsaStayed"; readonly at: Position }
  | { readonly type: "shadowMoved"; readonly shadowId: string; readonly from: Position; readonly to: Position }
  | { readonly type: "shadowStayed"; readonly shadowId: string; readonly at: Position }
  | { readonly type: "victory"; readonly at: Position }
  | { readonly type: "defeat"; readonly reason: DefeatReason; readonly by: "kryvavitsa" | "shadow" | "monster"; readonly at: Position };

export interface TurnResult {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
  readonly countedAction: boolean;
}

const directions: readonly Direction[] = ["up", "down", "left", "right"];

const directionVectors: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export function playTurn(state: GameState, direction: Direction, random: RandomSource): TurnResult {
  if (state.status !== "playing") {
    return { state, events: [], countedAction: false };
  }

  const playerPhase = resolveMonsterAction(state, direction);
  const stateAfterCountedAction = incrementTurn(playerPhase.state);

  if (stateAfterCountedAction.status !== "playing") {
    return { state: stateAfterCountedAction, events: playerPhase.events, countedAction: true };
  }

  const enemyPhase = resolveEnemyCycle(stateAfterCountedAction, random);

  return {
    state: enemyPhase.state,
    events: playerPhase.events.concat(enemyPhase.events),
    countedAction: true
  };
}

export function cellAt(state: GameState, position: Position): CellKind {
  if (!isInsideBoard(state, position)) {
    return "outOfBounds";
  }

  if (samePosition(state.monster, position)) {
    return "monster";
  }

  if (samePosition(state.kryvavitsa, position)) {
    return "kryvavitsa";
  }

  if (state.shadows.some((shadow) => samePosition(shadow.position, position))) {
    return "shadow";
  }

  if (state.walls.some((wall) => samePosition(wall, position))) {
    return "wall";
  }

  if (samePosition(state.exit, position)) {
    return "exit";
  }

  return "empty";
}

export function areOrthogonallyAdjacent(first: Position, second: Position): boolean {
  return manhattanDistance(first, second) === 1;
}

export function manhattanDistance(first: Position, second: Position): number {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

function resolveMonsterAction(state: GameState, direction: Direction): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  const target = step(state.monster, direction);
  const targetCell = cellAt(state, target);

  if (targetCell === "outOfBounds") {
    return blockedMonsterMove(state, "outOfBounds", target);
  }

  if (targetCell === "empty") {
    return moveMonster(state, target, []);
  }

  if (targetCell === "exit") {
    const nextState = updateState(state, { monster: copyPosition(target), status: "won" as const });
    return {
      state: nextState,
      events: [
        { type: "playerMoved", from: copyPosition(state.monster), to: copyPosition(target) },
        { type: "victory", at: copyPosition(target) }
      ]
    };
  }

  if (targetCell === "kryvavitsa" || targetCell === "shadow") {
    const nextState = updateState(state, { monster: copyPosition(target), status: "lost" as const });
    return {
      state: nextState,
      events: [
        { type: "playerMoved", from: copyPosition(state.monster), to: copyPosition(target) },
        { type: "defeat", reason: "monsterEnteredEnemy", by: targetCell, at: copyPosition(target) }
      ]
    };
  }

  return resolveWallPush(state, direction, target);
}

function resolveWallPush(state: GameState, direction: Direction, wallPosition: Position): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  const behindWall = step(wallPosition, direction);
  const behindCell = cellAt(state, behindWall);

  if (behindCell === "outOfBounds") {
    return blockedMonsterMove(state, "wallAtBoardEdge", wallPosition);
  }

  if (behindCell === "wall") {
    return blockedMonsterMove(state, "wallBlockedByWall", wallPosition);
  }

  if (behindCell === "kryvavitsa") {
    return blockedMonsterMove(state, "wallBlockedByKryvavitsa", wallPosition);
  }

  if (behindCell === "empty") {
    const nextState = updateState(state, {
      monster: copyPosition(wallPosition),
      walls: state.walls.map((wall) => (samePosition(wall, wallPosition) ? copyPosition(behindWall) : copyPosition(wall)))
    });
    return {
      state: nextState,
      events: [
        { type: "wallPushed", from: copyPosition(wallPosition), to: copyPosition(behindWall) },
        { type: "playerMoved", from: copyPosition(state.monster), to: copyPosition(wallPosition) }
      ]
    };
  }

  if (behindCell === "shadow") {
    const crushedShadow = findShadowAt(state, behindWall);
    if (crushedShadow === undefined) {
      throw new Error("Expected a shadow behind the pushed wall.");
    }

    const nextState = updateState(state, {
      monster: copyPosition(wallPosition),
      shadows: state.shadows.filter((shadow) => shadow.id !== crushedShadow.id).map(copyShadow),
      walls: state.walls.map((wall) => (samePosition(wall, wallPosition) ? copyPosition(behindWall) : copyPosition(wall)))
    });
    return {
      state: nextState,
      events: [
        { type: "shadowCrushed", shadowId: crushedShadow.id, at: copyPosition(behindWall) },
        { type: "wallPushed", from: copyPosition(wallPosition), to: copyPosition(behindWall) },
        { type: "playerMoved", from: copyPosition(state.monster), to: copyPosition(wallPosition) }
      ]
    };
  }

  if (behindCell === "exit") {
    const nextState = updateState(state, {
      monster: copyPosition(wallPosition),
      walls: state.walls.filter((wall) => !samePosition(wall, wallPosition)).map(copyPosition)
    });
    return {
      state: nextState,
      events: [
        { type: "wallDestroyed", at: copyPosition(wallPosition) },
        { type: "playerMoved", from: copyPosition(state.monster), to: copyPosition(wallPosition) }
      ]
    };
  }

  return blockedMonsterMove(state, "wallBlockedByWall", wallPosition);
}

function resolveEnemyCycle(state: GameState, random: RandomSource): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  const kryvavitsaPhase = resolveKryvavitsaAction(state, random);
  let currentState = kryvavitsaPhase.state;
  let events = kryvavitsaPhase.events.slice();

  if (areOrthogonallyAdjacent(currentState.kryvavitsa, currentState.monster)) {
    return defeatAfterEnemyAction(currentState, events, "kryvavitsa", currentState.kryvavitsa);
  }

  const shuffledShadows = shuffleItems(currentState.shadows, random);
  for (const orderedShadow of shuffledShadows) {
    const currentShadow = currentState.shadows.find((shadow) => shadow.id === orderedShadow.id);
    if (currentShadow === undefined) {
      continue;
    }

    const shadowPhase = resolveShadowAction(currentState, currentShadow, random);
    currentState = shadowPhase.state;
    events = events.concat(shadowPhase.events);

    const movedShadow = currentState.shadows.find((shadow) => shadow.id === orderedShadow.id);
    if (movedShadow !== undefined && areOrthogonallyAdjacent(movedShadow.position, currentState.monster)) {
      return defeatAfterEnemyAction(currentState, events, "shadow", movedShadow.position);
    }
  }

  return { state: currentState, events };
}

function resolveKryvavitsaAction(state: GameState, random: RandomSource): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  const from = state.kryvavitsa;
  const chosenDirection = chooseKryvavitsaDirection(state, random);

  if (chosenDirection === undefined) {
    return { state, events: [{ type: "kryvavitsaStayed", at: copyPosition(from) }] };
  }

  const to = step(from, chosenDirection);
  return {
    state: updateState(state, { kryvavitsa: copyPosition(to) }),
    events: [{ type: "kryvavitsaMoved", from: copyPosition(from), to: copyPosition(to) }]
  };
}

function chooseKryvavitsaDirection(state: GameState, random: RandomSource): Direction | undefined {
  // Already orthogonally adjacent to the Monster: stay put so the post-action
  // adjacency check turns the contact into a kill. Kryvavitsa must never vacate
  // an adjacency (otherwise the exit-seeking fallback below makes her flee on the
  // very step she should catch the Monster).
  if (areOrthogonallyAdjacent(state.kryvavitsa, state.monster)) {
    return undefined;
  }

  for (const direction of greedyDirections(state.kryvavitsa, state.monster)) {
    if (canEnemyMoveTo(state, step(state.kryvavitsa, direction))) {
      return direction;
    }
  }

  for (const direction of greedyDirections(state.kryvavitsa, state.exit)) {
    if (canEnemyMoveTo(state, step(state.kryvavitsa, direction))) {
      return direction;
    }
  }

  return shuffleItems(directions, random).find((direction) => canEnemyMoveTo(state, step(state.kryvavitsa, direction)));
}

function resolveShadowAction(state: GameState, shadow: Shadow, random: RandomSource): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  const chosenDirection = shuffleItems(directions, random).find((direction) => canEnemyMoveTo(state, step(shadow.position, direction)));

  if (chosenDirection === undefined) {
    return { state, events: [{ type: "shadowStayed", shadowId: shadow.id, at: copyPosition(shadow.position) }] };
  }

  const to = step(shadow.position, chosenDirection);
  return {
    state: updateState(state, {
      shadows: state.shadows.map((currentShadow) => (currentShadow.id === shadow.id ? { id: shadow.id, position: copyPosition(to) } : copyShadow(currentShadow)))
    }),
    events: [{ type: "shadowMoved", shadowId: shadow.id, from: copyPosition(shadow.position), to: copyPosition(to) }]
  };
}

function greedyDirections(from: Position, target: Position): readonly Direction[] {
  const result: Direction[] = [];

  if (target.x < from.x) {
    result.push("left");
  } else if (target.x > from.x) {
    result.push("right");
  }

  if (target.y < from.y) {
    result.push("up");
  } else if (target.y > from.y) {
    result.push("down");
  }

  return result;
}

function canEnemyMoveTo(state: GameState, position: Position): boolean {
  return cellAt(state, position) === "empty";
}

function defeatAfterEnemyAction(
  state: GameState,
  previousEvents: readonly GameEvent[],
  by: "kryvavitsa" | "shadow",
  at: Position
): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  return {
    state: updateState(state, { status: "lost" }),
    events: previousEvents.concat([{ type: "defeat", reason: "enemyAdjacent", by, at: copyPosition(at) }])
  };
}

function moveMonster(state: GameState, to: Position, extraEvents: readonly GameEvent[]): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  return {
    state: updateState(state, { monster: copyPosition(to) }),
    events: extraEvents.concat([{ type: "playerMoved", from: copyPosition(state.monster), to: copyPosition(to) }])
  };
}

function blockedMonsterMove(
  state: GameState,
  reason: PlayerBlockedReason,
  at: Position
): { readonly state: GameState; readonly events: readonly GameEvent[] } {
  return { state, events: [{ type: "playerBlocked", reason, at: copyPosition(at) }] };
}

function step(position: Position, direction: Direction): Position {
  const vector = directionVectors[direction];
  return { x: position.x + vector.x, y: position.y + vector.y };
}

function isInsideBoard(state: GameState, position: Position): boolean {
  return position.x >= 0 && position.y >= 0 && position.x < state.width && position.y < state.height;
}

function samePosition(first: Position, second: Position): boolean {
  return first.x === second.x && first.y === second.y;
}

function findShadowAt(state: GameState, position: Position): Shadow | undefined {
  return state.shadows.find((shadow) => samePosition(shadow.position, position));
}

function incrementTurn(state: GameState): GameState {
  return updateState(state, { turn: state.turn + 1 });
}

function updateState(state: GameState, overrides: Partial<GameState>): GameState {
  return Object.assign({}, state, overrides);
}

function copyPosition(position: Position): Position {
  return { x: position.x, y: position.y };
}

function copyShadow(shadow: Shadow): Shadow {
  return { id: shadow.id, position: copyPosition(shadow.position) };
}

function shuffleItems<Item>(items: readonly Item[], random: RandomSource): Item[] {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = nextRandomIndex(random, index + 1);
    const currentItem = result[index];
    const swapItem = result[swapIndex];

    if (currentItem === undefined || swapItem === undefined) {
      throw new Error("Random shuffle index was outside the array bounds.");
    }

    result[index] = swapItem;
    result[swapIndex] = currentItem;
  }

  return result;
}

function nextRandomIndex(random: RandomSource, maxExclusive: number): number {
  const value = random.nextInt(maxExclusive);

  if (!Number.isInteger(value) || value < 0 || value >= maxExclusive) {
    throw new Error(`Random source returned invalid index ${String(value)} for max ${String(maxExclusive)}.`);
  }

  return value;
}