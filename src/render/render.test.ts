import { describe, expect, it } from "vitest";

import type { GameState } from "../game";
import { emptyVisualAssets, original1999AssetPaths, windows2003AssetPaths } from "./assets";
import { renderBoardToContext } from "./canvas";
import { calculateBoardGeometry, cellFromPoint } from "./geometry";

describe("render geometry", () => {
  it("calculates stable desktop and compact geometry", () => {
    const desktop = calculateBoardGeometry({ cssWidth: 800, cssHeight: 600, boardWidth: 10, boardHeight: 10, devicePixelRatio: 2 });
    const compact = calculateBoardGeometry({ cssWidth: 180, cssHeight: 120, boardWidth: 20, boardHeight: 10, devicePixelRatio: 1 });

    expect(desktop.cellSize).toBe(120);
    expect(desktop.offsetX).toBe(200);
    expect(desktop.offsetY).toBe(0);
    expect(compact.cellSize).toBe(9);
    expect(compact.boardPixelWidth).toBe(180);
    expect(compact.boardPixelHeight).toBe(90);
  });

  it("maps viewport points to board cells", () => {
    const geometry = calculateBoardGeometry({ cssWidth: 200, cssHeight: 200, boardWidth: 10, boardHeight: 10, devicePixelRatio: 1 });

    expect(cellFromPoint(geometry, 10, 10, { clientX: 25, clientY: 45, rectLeft: 0, rectTop: 0 }, 1)).toEqual({ x: 1, y: 2 });
    expect(cellFromPoint(geometry, 10, 10, { clientX: 210, clientY: 45, rectLeft: 0, rectTop: 0 }, 1)).toBeUndefined();
  });
});

describe("render pipeline", () => {
  it("uses stable asset paths and never references temp", () => {
    for (const path of Object.values(original1999AssetPaths)) {
      expect(path).toContain("assets/original-1999/");
      expect(path).not.toContain("temp/");
      expect(path).not.toContain("OLD/");
    }

    for (const path of Object.values(windows2003AssetPaths)) {
      expect(path).toContain("assets/windows-2003/");
      expect(path).not.toContain("temp/");
      expect(path).not.toContain("OLD/");
    }
  });

  it("disables smoothing and does not mutate domain state", () => {
    const state = makeState();
    const before = JSON.stringify(state);
    const context = new FakeCanvasContext();
    const geometry = calculateBoardGeometry({ cssWidth: 200, cssHeight: 200, boardWidth: 6, boardHeight: 6, devicePixelRatio: 1 });

    renderBoardToContext(context as unknown as CanvasRenderingContext2D, state, geometry, {
      visualMode: "color",
      showGrid: true,
      darkTheme: false,
      assets: emptyVisualAssets,
      legalMoves: [{ x: 2, y: 1 }]
    });

    expect(context.imageSmoothingEnabled).toBe(false);
    expect(context.fillRectCount).toBeGreaterThan(0);
    expect(JSON.stringify(state)).toBe(before);
  });
});

function makeState(): GameState {
  return {
    width: 6,
    height: 6,
    monster: { x: 1, y: 1 },
    kryvavitsa: { x: 5, y: 0 },
    shadows: [{ id: "shadow-1", position: { x: 4, y: 4 } }],
    walls: [{ x: 2, y: 2 }],
    exit: { x: 5, y: 5 },
    status: "playing",
    turn: 0
  };
}

class FakeCanvasContext {
  public imageSmoothingEnabled = true;
  public fillStyle: string | CanvasGradient | CanvasPattern = "#000000";
  public strokeStyle: string | CanvasGradient | CanvasPattern = "#000000";
  public lineWidth = 1;
  public fillRectCount = 0;

  public save(): void {}

  public restore(): void {}

  public clearRect(): void {}

  public fillRect(): void {
    this.fillRectCount += 1;
  }

  public beginPath(): void {}

  public ellipse(): void {}

  public arc(): void {}

  public fill(): void {}

  public stroke(): void {}

  public moveTo(): void {}

  public lineTo(): void {}

  public drawImage(): void {}
}