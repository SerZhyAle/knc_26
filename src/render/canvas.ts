import type { GameState, Position } from "../game";
import type { OriginalAssetSet, SpriteKey } from "./assets";
import { calculateBoardGeometry, type BoardGeometry } from "./geometry";

export type VisualMode = "original1999" | "color";

export interface RenderOptions {
  readonly visualMode: VisualMode;
  readonly showGrid: boolean;
  readonly darkTheme: boolean;
  readonly assets: OriginalAssetSet;
  readonly legalMoves: readonly Position[];
}

const originalFieldColor = "#00aaaa";
const darkBackgroundColor = "#141414";
const lightBackgroundColor = "#f5f5f5";

export function renderBoard(canvas: HTMLCanvasElement, state: GameState, options: RenderOptions): BoardGeometry {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("Canvas 2D context is not available.");
  }

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(1, rect.width);
  const cssHeight = Math.max(1, rect.height);
  const ratio = window.devicePixelRatio || 1;
  const geometry = calculateBoardGeometry({ cssWidth, cssHeight, boardWidth: state.width, boardHeight: state.height, devicePixelRatio: ratio });

  if (canvas.width !== geometry.canvasWidth) {
    canvas.width = geometry.canvasWidth;
  }

  if (canvas.height !== geometry.canvasHeight) {
    canvas.height = geometry.canvasHeight;
  }

  renderBoardToContext(context, state, geometry, options);
  return geometry;
}

export function renderBoardToContext(context: CanvasRenderingContext2D, state: GameState, geometry: BoardGeometry, options: RenderOptions): void {
  context.save();
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, geometry.canvasWidth, geometry.canvasHeight);
  context.fillStyle = options.visualMode === "original1999" ? originalFieldColor : options.darkTheme ? darkBackgroundColor : lightBackgroundColor;
  context.fillRect(0, 0, geometry.canvasWidth, geometry.canvasHeight);
  context.fillStyle = options.visualMode === "original1999" ? originalFieldColor : options.darkTheme ? "#20242a" : "#ffffff";
  context.fillRect(geometry.offsetX, geometry.offsetY, geometry.boardPixelWidth, geometry.boardPixelHeight);

  drawHighlights(context, geometry, options.legalMoves);
  drawExit(context, geometry, state.exit, options);
  for (const wall of state.walls) {
    drawWall(context, geometry, wall, options);
  }
  for (const shadow of state.shadows) {
    drawActor(context, geometry, shadow.position, "shadow", "#111111", options);
  }
  drawActor(context, geometry, state.kryvavitsa, "kryvavitsa", "#8b1d2c", options);
  drawActor(context, geometry, state.monster, "monster", "#166534", options);

  if (options.showGrid) {
    drawGrid(context, state, geometry, options.visualMode === "original1999");
  }

  context.restore();
}

function drawHighlights(context: CanvasRenderingContext2D, geometry: BoardGeometry, legalMoves: readonly Position[]): void {
  context.fillStyle = "rgba(255, 255, 255, 0.22)";
  for (const position of legalMoves) {
    context.fillRect(geometry.offsetX + position.x * geometry.cellSize, geometry.offsetY + position.y * geometry.cellSize, geometry.cellSize, geometry.cellSize);
  }
}

function drawWall(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position, options: RenderOptions): void {
  if (drawSprite(context, geometry, position, "wall", options)) {
    return;
  }

  const rect = insetRect(geometry, position, 0.18);
  context.fillStyle = "#7f1d1d";
  context.fillRect(rect.x + rect.size * 0.35, rect.y, rect.size * 0.3, rect.size);
  context.fillRect(rect.x, rect.y + rect.size * 0.35, rect.size, rect.size * 0.3);
}

function drawExit(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position, options: RenderOptions): void {
  if (drawSprite(context, geometry, position, "exit", options)) {
    return;
  }

  const center = cellCenter(geometry, position);
  const radiusX = geometry.cellSize * 0.32;
  const radiusY = geometry.cellSize * 0.22;
  context.beginPath();
  context.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.fillStyle = "#22c55e";
  context.fill();
}

function drawActor(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position, spriteKey: SpriteKey, color: string, options: RenderOptions): void {
  if (drawSprite(context, geometry, position, spriteKey, options)) {
    return;
  }

  const center = cellCenter(geometry, position);
  context.beginPath();
  context.arc(center.x, center.y, geometry.cellSize * 0.32, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

function drawSprite(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position, spriteKey: SpriteKey, options: RenderOptions): boolean {
  if (options.visualMode !== "original1999" || !options.assets.loaded) {
    return false;
  }

  const image = options.assets.sprites[spriteKey];
  if (image === undefined) {
    return false;
  }

  const maxSize = Math.max(1, Math.floor(geometry.cellSize * 0.88));
  const scale = Math.min(maxSize / image.width, maxSize / image.height);
  const width = Math.max(1, Math.floor(image.width * scale));
  const height = Math.max(1, Math.floor(image.height * scale));
  const left = Math.floor(geometry.offsetX + position.x * geometry.cellSize + (geometry.cellSize - width) / 2);
  const top = Math.floor(geometry.offsetY + position.y * geometry.cellSize + (geometry.cellSize - height) / 2);
  context.drawImage(image, left, top, width, height);
  return true;
}

function drawGrid(context: CanvasRenderingContext2D, state: GameState, geometry: BoardGeometry, originalMode: boolean): void {
  context.strokeStyle = originalMode ? "rgba(0, 0, 0, 0.2)" : "rgba(120, 120, 120, 0.35)";
  context.lineWidth = Math.max(1, Math.floor(geometry.cellSize * 0.03));
  for (let columnIndex = 0; columnIndex <= state.width; columnIndex += 1) {
    const positionX = geometry.offsetX + columnIndex * geometry.cellSize;
    context.beginPath();
    context.moveTo(positionX, geometry.offsetY);
    context.lineTo(positionX, geometry.offsetY + geometry.boardPixelHeight);
    context.stroke();
  }

  for (let rowIndex = 0; rowIndex <= state.height; rowIndex += 1) {
    const positionY = geometry.offsetY + rowIndex * geometry.cellSize;
    context.beginPath();
    context.moveTo(geometry.offsetX, positionY);
    context.lineTo(geometry.offsetX + geometry.boardPixelWidth, positionY);
    context.stroke();
  }
}

function cellCenter(geometry: BoardGeometry, position: Position): Position {
  return {
    x: geometry.offsetX + position.x * geometry.cellSize + geometry.cellSize / 2,
    y: geometry.offsetY + position.y * geometry.cellSize + geometry.cellSize / 2
  };
}

function insetRect(geometry: BoardGeometry, position: Position, ratio: number): { readonly x: number; readonly y: number; readonly size: number } {
  const inset = Math.floor(geometry.cellSize * ratio);
  return {
    x: geometry.offsetX + position.x * geometry.cellSize + inset,
    y: geometry.offsetY + position.y * geometry.cellSize + inset,
    size: Math.max(1, geometry.cellSize - inset * 2)
  };
}