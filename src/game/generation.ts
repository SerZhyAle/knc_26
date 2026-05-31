import { cellAt, manhattanDistance, type Direction, type GameState, type Position, type RandomSource, type Shadow } from "./engine";

export interface BoardSize {
  readonly width: number;
  readonly height: number;
}

export interface GenerateBoardOptions extends BoardSize {
  readonly level: number;
  readonly random: RandomSource;
  readonly maxAttempts?: number;
}

export class BoardGenerationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "BoardGenerationError";
  }
}

const minimumBoardSide = 10;
const maximumBoardSide = 100;
const defaultMaxAttempts = 500;
const maximumPlacementAttempts = 5000;
const directions: readonly Direction[] = ["up", "down", "left", "right"];
const directionVectors: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export function generateBoard(options: GenerateBoardOptions): GameState {
  validateBoardSize(options);
  validateLevel(options.level, options.width, options.height);

  const maxAttempts = options.maxAttempts ?? defaultMaxAttempts;
  if (!Number.isInteger(maxAttempts) || maxAttempts <= 0) {
    throw new BoardGenerationError(`Generation maxAttempts must be positive, got ${String(maxAttempts)}.`);
  }

  for (let attemptIndex = 0; attemptIndex < maxAttempts; attemptIndex += 1) {
    const candidate = tryGenerateBoard(options.width, options.height, options.level, options.random);
    if (candidate !== undefined && validateGeneratedBoard(candidate)) {
      return candidate;
    }
  }

  throw new BoardGenerationError(`Unable to generate valid ${String(options.width)}x${String(options.height)} board for level ${String(options.level)} after ${String(maxAttempts)} attempts.`);
}

export function validateBoardSize(size: BoardSize): void {
  if (!isValidBoardSide(size.width) || !isValidBoardSide(size.height)) {
    throw new BoardGenerationError(`Board size must be between 10 and 100, got ${String(size.width)}x${String(size.height)}.`);
  }
}

export function fieldBase(size: BoardSize): number {
  return Math.min(size.width, size.height);
}

export function getMaximumShadowCapacity(state: GameState): number {
  return Math.max(0, state.width * state.height - state.walls.length - 3);
}

export function getMaximumShadowLevelForBoard(size: BoardSize): number {
  validateBoardSize(size);
  const cellCount = size.width * size.height;
  return Math.max(1, Math.floor(cellCount * 0.3));
}

export function getWallDensity(state: GameState): number {
  return state.walls.length / (state.width * state.height);
}

export function validateGeneratedBoard(state: GameState): boolean {
  return hasValidWallDensity(state) && hasPathToExit(state) && hasLegalFirstMove(state) && enemiesHaveValidDistances(state) && state.shadows.length <= getMaximumShadowCapacity(state);
}

export function hasPathToExit(state: GameState): boolean {
  const visited = new Set<string>();
  const queue: Position[] = [copyPosition(state.monster)];
  visited.add(positionKey(state.monster));

  while (queue.length > 0) {
    const currentPosition = queue.shift();
    if (currentPosition === undefined) {
      continue;
    }

    if (samePosition(currentPosition, state.exit)) {
      return true;
    }

    for (const direction of directions) {
      const nextPosition = step(currentPosition, direction);
      const nextKey = positionKey(nextPosition);
      if (!visited.has(nextKey) && isPathPassable(state, nextPosition)) {
        visited.add(nextKey);
        queue.push(nextPosition);
      }
    }
  }

  return false;
}

export function hasLegalFirstMove(state: GameState): boolean {
  return directions.some((direction) => isLegalMonsterMove(state, direction));
}

function tryGenerateBoard(width: number, height: number, level: number, random: RandomSource): GameState | undefined {
  const monster = chooseRandomPosition(width, height, random);
  const currentFieldBase = fieldBase({ width, height });

  const exit = findPosition(width, height, random, (position) => manhattanDistance(position, monster) > currentFieldBase / 4 && !samePosition(position, monster));
  if (exit === undefined) {
    return undefined;
  }

  const reservedPath = buildPath(monster, exit, random);
  const kryvavitsa = findPosition(width, height, random, (position) => !samePosition(position, monster) && !samePosition(position, exit) && !hasPosition(reservedPath, position) && manhattanDistance(position, monster) > currentFieldBase / 3);
  if (kryvavitsa === undefined) {
    return undefined;
  }

  const shadows: Shadow[] = [];
  for (let shadowIndex = 0; shadowIndex < level; shadowIndex += 1) {
    const shadowPosition = findPosition(
      width,
      height,
      random,
      (position) => !samePosition(position, monster) && !samePosition(position, exit) && !samePosition(position, kryvavitsa) && !hasPosition(reservedPath, position) && !hasPosition(shadows.map((shadow) => shadow.position), position) && manhattanDistance(position, monster) > currentFieldBase / 4
    );

    if (shadowPosition === undefined) {
      return undefined;
    }

    shadows.push({ id: `shadow-${String(shadowIndex + 1)}`, position: copyPosition(shadowPosition) });
  }

  const occupiedPositions = [monster, exit, kryvavitsa].concat(shadows.map((shadow) => shadow.position));
  const wallCandidates = allPositions(width, height).filter((position) => !hasPosition(occupiedPositions, position) && !hasPosition(reservedPath, position));
  const wallTarget = chooseWallTarget(width, height, random);
  if (wallCandidates.length < wallTarget) {
    return undefined;
  }
  const walls = chooseUniquePositionsFrom(wallCandidates, wallTarget, random);

  return {
    width,
    height,
    monster: copyPosition(monster),
    kryvavitsa: copyPosition(kryvavitsa),
    shadows: shadows.map(copyShadow),
    walls: walls.map(copyPosition),
    exit: copyPosition(exit),
    status: "playing",
    turn: 0
  };
}

function validateLevel(level: number, width: number, height: number): void {
  if (!Number.isInteger(level) || level < 1) {
    throw new BoardGenerationError(`Level must be a positive integer, got ${String(level)}.`);
  }

  const maximumLevel = getMaximumShadowLevelForBoard({ width, height });
  if (level > maximumLevel) {
    throw new BoardGenerationError(`Level ${String(level)} exceeds board shadow capacity ${String(maximumLevel)}.`);
  }
}

function hasValidWallDensity(state: GameState): boolean {
  const wallDensity = getWallDensity(state);
  return wallDensity >= 0.3 && wallDensity <= 0.4;
}

function enemiesHaveValidDistances(state: GameState): boolean {
  const currentFieldBase = fieldBase(state);
  return manhattanDistance(state.kryvavitsa, state.monster) > currentFieldBase / 3 && state.shadows.every((shadow) => manhattanDistance(shadow.position, state.monster) > currentFieldBase / 4);
}

function isLegalMonsterMove(state: GameState, direction: Direction): boolean {
  const target = step(state.monster, direction);
  const targetCell = cellAt(state, target);

  if (targetCell === "empty" || targetCell === "exit") {
    return true;
  }

  if (targetCell !== "wall") {
    return false;
  }

  const behindWall = step(target, direction);
  const behindCell = cellAt(state, behindWall);
  return behindCell === "empty" || behindCell === "shadow" || behindCell === "exit";
}

function isPathPassable(state: GameState, position: Position): boolean {
  const cellKind = cellAt(state, position);
  return cellKind === "empty" || cellKind === "exit" || samePosition(position, state.monster);
}

function chooseWallTarget(width: number, height: number, random: RandomSource): number {
  const cellCount = width * height;
  const minimumWalls = Math.ceil(cellCount * 0.3);
  const extraWallLimit = Math.floor(cellCount * 0.1) + 1;
  return minimumWalls + random.nextInt(extraWallLimit);
}

function chooseUniquePositionsFrom(availablePositions: readonly Position[], count: number, random: RandomSource): Position[] {
  const positions = availablePositions.map(copyPosition);
  shufflePositions(positions, random);
  return positions.slice(0, count).map(copyPosition);
}

function buildPath(from: Position, to: Position, random: RandomSource): Position[] {
  const path: Position[] = [copyPosition(from)];
  let currentPosition = copyPosition(from);
  const horizontalFirst = random.nextInt(2) === 0;

  if (horizontalFirst) {
    currentPosition = appendHorizontalPath(path, currentPosition, to.x);
    appendVerticalPath(path, currentPosition, to.y);
  } else {
    currentPosition = appendVerticalPath(path, currentPosition, to.y);
    appendHorizontalPath(path, currentPosition, to.x);
  }

  return path;
}

function appendHorizontalPath(path: Position[], from: Position, targetX: number): Position {
  let currentX = from.x;
  while (currentX !== targetX) {
    currentX += targetX > currentX ? 1 : -1;
    path.push({ x: currentX, y: from.y });
  }

  return { x: currentX, y: from.y };
}

function appendVerticalPath(path: Position[], from: Position, targetY: number): Position {
  let currentY = from.y;
  while (currentY !== targetY) {
    currentY += targetY > currentY ? 1 : -1;
    path.push({ x: from.x, y: currentY });
  }

  return { x: from.x, y: currentY };
}

function chooseRandomPosition(width: number, height: number, random: RandomSource): Position {
  return { x: random.nextInt(width), y: random.nextInt(height) };
}

function findPosition(width: number, height: number, random: RandomSource, predicate: (position: Position) => boolean): Position | undefined {
  for (let attemptIndex = 0; attemptIndex < maximumPlacementAttempts; attemptIndex += 1) {
    const position = chooseRandomPosition(width, height, random);
    if (predicate(position)) {
      return copyPosition(position);
    }
  }

  const candidates = allPositions(width, height).filter(predicate);
  if (candidates.length === 0) {
    return undefined;
  }

  return copyPosition(candidates[random.nextInt(candidates.length)] as Position);
}

function allPositions(width: number, height: number): Position[] {
  const positions: Position[] = [];
  for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < width; columnIndex += 1) {
      positions.push({ x: columnIndex, y: rowIndex });
    }
  }

  return positions;
}

function shufflePositions(positions: Position[], random: RandomSource): void {
  for (let index = positions.length - 1; index > 0; index -= 1) {
    const swapIndex = random.nextInt(index + 1);
    const currentPosition = positions[index];
    const swapPosition = positions[swapIndex];
    if (currentPosition === undefined || swapPosition === undefined) {
      throw new BoardGenerationError("Position shuffle produced an invalid index.");
    }

    positions[index] = swapPosition;
    positions[swapIndex] = currentPosition;
  }
}

function hasPosition(positions: readonly Position[], searchedPosition: Position): boolean {
  return positions.some((position) => samePosition(position, searchedPosition));
}

function positionKey(position: Position): string {
  return `${String(position.x)},${String(position.y)}`;
}

function step(position: Position, direction: Direction): Position {
  const vector = directionVectors[direction];
  return { x: position.x + vector.x, y: position.y + vector.y };
}

function samePosition(first: Position, second: Position): boolean {
  return first.x === second.x && first.y === second.y;
}

function isValidBoardSide(value: number): boolean {
  return Number.isInteger(value) && value >= minimumBoardSide && value <= maximumBoardSide;
}

function copyPosition(position: Position): Position {
  return { x: position.x, y: position.y };
}

function copyShadow(shadow: Shadow): Shadow {
  return { id: shadow.id, position: copyPosition(shadow.position) };
}