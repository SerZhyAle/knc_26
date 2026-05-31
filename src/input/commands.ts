import type { Direction, Position } from "../game";
import { areOrthogonallyAdjacent } from "../game";

export function directionFromKey(key: string): Direction | undefined {
  if (key === "ArrowUp") {
    return "up";
  }

  if (key === "ArrowDown") {
    return "down";
  }

  if (key === "ArrowLeft") {
    return "left";
  }

  if (key === "ArrowRight") {
    return "right";
  }

  return undefined;
}

export function directionFromAdjacentCell(monster: Position, target: Position): Direction | undefined {
  if (!areOrthogonallyAdjacent(monster, target)) {
    return undefined;
  }

  if (target.x > monster.x) {
    return "right";
  }

  if (target.x < monster.x) {
    return "left";
  }

  if (target.y > monster.y) {
    return "down";
  }

  return "up";
}

export function adjacentCells(monster: Position, width: number, height: number): readonly Position[] {
  const candidates: readonly Position[] = [
    { x: monster.x, y: monster.y - 1 },
    { x: monster.x, y: monster.y + 1 },
    { x: monster.x - 1, y: monster.y },
    { x: monster.x + 1, y: monster.y }
  ];

  return candidates.filter((position) => position.x >= 0 && position.y >= 0 && position.x < width && position.y < height);
}