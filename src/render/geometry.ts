import type { Position } from "../game";

export interface BoardGeometryInput {
  readonly cssWidth: number;
  readonly cssHeight: number;
  readonly boardWidth: number;
  readonly boardHeight: number;
  readonly devicePixelRatio: number;
}

export interface BoardGeometry {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly cellSize: number;
  readonly boardPixelWidth: number;
  readonly boardPixelHeight: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export interface ViewportPoint {
  readonly clientX: number;
  readonly clientY: number;
  readonly rectLeft: number;
  readonly rectTop: number;
}

export function calculateBoardGeometry(input: BoardGeometryInput): BoardGeometry {
  const ratio = Math.max(1, input.devicePixelRatio);
  const canvasWidth = Math.max(1, Math.floor(input.cssWidth * ratio));
  const canvasHeight = Math.max(1, Math.floor(input.cssHeight * ratio));
  const rawCellSize = Math.max(1, Math.floor(Math.min(canvasWidth / input.boardWidth, canvasHeight / input.boardHeight)));
  const cellSize = Math.max(1, rawCellSize);
  const boardPixelWidth = cellSize * input.boardWidth;
  const boardPixelHeight = cellSize * input.boardHeight;

  return {
    canvasWidth,
    canvasHeight,
    cellSize,
    boardPixelWidth,
    boardPixelHeight,
    offsetX: Math.floor((canvasWidth - boardPixelWidth) / 2),
    offsetY: Math.floor((canvasHeight - boardPixelHeight) / 2)
  };
}

export function cellRect(geometry: BoardGeometry, position: Position): DOMRectReadOnly {
  return new DOMRectReadOnly(
    geometry.offsetX + position.x * geometry.cellSize,
    geometry.offsetY + position.y * geometry.cellSize,
    geometry.cellSize,
    geometry.cellSize
  );
}

export function cellFromPoint(geometry: BoardGeometry, boardWidth: number, boardHeight: number, point: ViewportPoint, devicePixelRatio: number): Position | undefined {
  const ratio = Math.max(1, devicePixelRatio);
  const canvasX = Math.floor((point.clientX - point.rectLeft) * ratio);
  const canvasY = Math.floor((point.clientY - point.rectTop) * ratio);
  const relativeX = canvasX - geometry.offsetX;
  const relativeY = canvasY - geometry.offsetY;

  if (relativeX < 0 || relativeY < 0 || relativeX >= geometry.boardPixelWidth || relativeY >= geometry.boardPixelHeight) {
    return undefined;
  }

  const columnIndex = Math.floor(relativeX / geometry.cellSize);
  const rowIndex = Math.floor(relativeY / geometry.cellSize);

  if (columnIndex < 0 || rowIndex < 0 || columnIndex >= boardWidth || rowIndex >= boardHeight) {
    return undefined;
  }

  return { x: columnIndex, y: rowIndex };
}