import type { GameState, Position } from "../game";
import type { SpriteKey, VisualAssetCollection, VisualAssetSet } from "./assets";
import { calculateBoardGeometry, type BoardGeometry } from "./geometry";

export type VisualMode = "original1999" | "windows2003" | "color";

export interface MovementAnimation {
  readonly animationProgress: number;
  readonly monsterFrom: Position;
  readonly kryvavitsaFrom: Position;
  readonly shadowsFrom: readonly Position[];
}

export interface CompletionHighlight {
  readonly animationProgress: number;
}

export interface RenderOptions {
  readonly visualMode: VisualMode;
  readonly showGrid: boolean;
  readonly darkTheme: boolean;
  readonly assets: VisualAssetCollection;
  readonly legalMoves: readonly Position[];
  readonly deathCell?: Position | undefined;
  readonly movement?: MovementAnimation | undefined;
  readonly completionHighlight?: CompletionHighlight | undefined;
}

const originalFieldColor = "#00aaaa";
const windows2003FieldColor = "#ffffff";
const darkBackgroundColor = "#141414";
const lightBackgroundColor = "#f5f5f5";
const windows2003ShadowSprites: readonly SpriteKey[] = ["shadow", "shadow2", "shadow3", "shadow4", "shadow5"];

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
  context.fillStyle = fieldColor(options);
  context.fillRect(0, 0, geometry.canvasWidth, geometry.canvasHeight);
  context.fillStyle = boardColor(options);
  context.fillRect(geometry.offsetX, geometry.offsetY, geometry.boardPixelWidth, geometry.boardPixelHeight);
  drawEmptyTiles(context, state, geometry, options);

  drawHighlights(context, geometry, options.legalMoves);
  drawExit(context, geometry, state.exit, options);
  for (const wall of state.walls) {
    drawWall(context, geometry, wall, options);
  }
  const getInterpolatedPosition = (startPos: Position, endPos: Position, progress: number): Position => {
    if (progress >= 1) return endPos;
    return {
      x: startPos.x + (endPos.x - startPos.x) * progress,
      y: startPos.y + (endPos.y - startPos.y) * progress
    };
  };

  const monsterPos = options.movement ? getInterpolatedPosition(options.movement.monsterFrom, state.monster, options.movement.animationProgress) : state.monster;
  const kryvavitsaPos = options.movement ? getInterpolatedPosition(options.movement.kryvavitsaFrom, state.kryvavitsa, options.movement.animationProgress) : state.kryvavitsa;

  for (const [shadowIndex, shadow] of state.shadows.entries()) {
    const shadowFrom = options.movement?.shadowsFrom[shadowIndex];
    const shadowPos = shadowFrom ? getInterpolatedPosition(shadowFrom, shadow.position, options.movement.animationProgress) : shadow.position;
    drawActor(context, geometry, shadowPos, shadowSpriteForMode(options.visualMode, shadowIndex), "#111111", options, "shadow", options.movement?.animationProgress);
  }
  drawActor(context, geometry, kryvavitsaPos, "kryvavitsa", "#8b1d2c", options, "kryvavitsa", options.movement?.animationProgress);
  drawActor(context, geometry, monsterPos, "monster", "#166534", options, "monster", options.movement?.animationProgress);

  if (options.deathCell !== undefined) {
    drawDeathMarker(context, geometry, options.deathCell);
  }

  if (options.showGrid) {
    drawGrid(context, state, geometry, options.visualMode === "original1999");
  }

  context.restore();
}

function fieldColor(options: RenderOptions): string {
  if (options.visualMode === "original1999") {
    return originalFieldColor;
  }

  if (options.visualMode === "windows2003") {
    return windows2003FieldColor;
  }

  return options.darkTheme ? darkBackgroundColor : lightBackgroundColor;
}

function boardColor(options: RenderOptions): string {
  if (options.visualMode === "original1999") {
    return originalFieldColor;
  }

  if (options.visualMode === "windows2003") {
    return windows2003FieldColor;
  }

  return options.darkTheme ? "#20242a" : "#ffffff";
}

function drawEmptyTiles(context: CanvasRenderingContext2D, state: GameState, geometry: BoardGeometry, options: RenderOptions): void {
  if (options.visualMode !== "windows2003") {
    return;
  }

  for (let rowIndex = 0; rowIndex < state.height; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < state.width; columnIndex += 1) {
      drawSprite(context, geometry, { x: columnIndex, y: rowIndex }, "empty", options);
    }
  }
}

function shadowSpriteForMode(visualMode: VisualMode, shadowIndex: number): SpriteKey {
  return visualMode === "windows2003" ? windows2003ShadowSprites[shadowIndex % windows2003ShadowSprites.length] ?? "shadow" : "shadow";
}

function drawHighlights(context: CanvasRenderingContext2D, geometry: BoardGeometry, legalMoves: readonly Position[]): void {
  context.fillStyle = "rgba(255, 255, 255, 0.22)";
  for (const position of legalMoves) {
    context.fillRect(geometry.offsetX + position.x * geometry.cellSize, geometry.offsetY + position.y * geometry.cellSize, geometry.cellSize, geometry.cellSize);
  }
}

function drawDeathMarker(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position): void {
  const left = geometry.offsetX + position.x * geometry.cellSize;
  const top = geometry.offsetY + position.y * geometry.cellSize;
  context.fillStyle = "rgba(220, 20, 20, 0.38)";
  context.fillRect(left, top, geometry.cellSize, geometry.cellSize);
  context.strokeStyle = "#dc1414";
  context.lineWidth = Math.max(2, Math.floor(geometry.cellSize * 0.09));
  const inset = context.lineWidth / 2;
  context.strokeRect(left + inset, top + inset, geometry.cellSize - context.lineWidth, geometry.cellSize - context.lineWidth);
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
  if (options.completionHighlight !== undefined) {
    const brightness = Math.sin(options.completionHighlight.animationProgress * Math.PI) * 0.5 + 0.5;
    const glowSize = Math.sin(options.completionHighlight.animationProgress * Math.PI) * geometry.cellSize * 0.3;
    const center = cellCenter(geometry, position);
    context.beginPath();
    context.ellipse(center.x, center.y, geometry.cellSize * 0.32 + glowSize, geometry.cellSize * 0.22 + glowSize, 0, 0, Math.PI * 2);
    context.fillStyle = `rgba(34, 197, 94, ${String(brightness * 0.6)})`;
    context.fill();
  }

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

function drawActor(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position, spriteKey: SpriteKey, color: string, options: RenderOptions, actorType?: "monster" | "kryvavitsa" | "shadow", movementProgress?: number): void {
  const offset = getActorVerticalOffset(geometry, movementProgress ?? 0);

  if (options.completionHighlight !== undefined && actorType === "monster") {
    const brightness = Math.sin(options.completionHighlight.animationProgress * Math.PI) * 0.5 + 0.5;
    const glowSize = Math.sin(options.completionHighlight.animationProgress * Math.PI) * geometry.cellSize * 0.2;
    const center = cellCenter(geometry, position);
    context.beginPath();
    context.arc(center.x, center.y + offset, geometry.cellSize * 0.32 + glowSize, 0, Math.PI * 2);
    context.fillStyle = `rgba(22, 101, 52, ${String(brightness * 0.6)})`;
    context.fill();
  }

  if (drawSprite(context, geometry, position, spriteKey, options, offset)) {
    return;
  }

  const center = cellCenter(geometry, position);
  context.beginPath();
  context.arc(center.x, center.y + offset, geometry.cellSize * 0.32, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

function drawSprite(context: CanvasRenderingContext2D, geometry: BoardGeometry, position: Position, spriteKey: SpriteKey, options: RenderOptions, verticalOffset: number = 0): boolean {
  const assetSet = activeAssetSet(options);
  if (assetSet === undefined || !assetSet.loaded) {
    return false;
  }

  const image = assetSet.sprites[spriteKey];
  if (image === undefined) {
    return false;
  }

  const maxSpriteRatio = options.visualMode === "windows2003" ? 1 : 0.88;
  const maxSize = Math.max(1, Math.floor(geometry.cellSize * maxSpriteRatio));
  const scale = Math.min(maxSize / image.width, maxSize / image.height);
  const width = Math.max(1, Math.floor(image.width * scale));
  const height = Math.max(1, Math.floor(image.height * scale));
  const left = Math.floor(geometry.offsetX + position.x * geometry.cellSize + (geometry.cellSize - width) / 2);
  const top = Math.floor(geometry.offsetY + position.y * geometry.cellSize + (geometry.cellSize - height) / 2 + verticalOffset);
  context.drawImage(image, left, top, width, height);
  return true;
}

function activeAssetSet(options: RenderOptions): VisualAssetSet | undefined {
  if (options.visualMode === "original1999") {
    return options.assets.original1999;
  }

  if (options.visualMode === "windows2003") {
    return options.assets.windows2003;
  }

  return undefined;
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

function getActorVerticalOffset(geometry: BoardGeometry, progress: number): number {
  const bounceHeight = geometry.cellSize * 0.08;
  const normalizedProgress = progress % 1;
  if (normalizedProgress < 0.5) {
    return Math.sin(normalizedProgress * Math.PI) * bounceHeight;
  } else {
    return Math.sin((normalizedProgress - 0.5) * Math.PI) * bounceHeight;
  }
}