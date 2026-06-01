export type { SpriteKey, SpriteMap, VisualAssetCollection, VisualAssetSet } from "./assets";
export { emptyVisualAssets, loadVisualAssets, original1999AssetPaths, windows2003AssetPaths } from "./assets";
export type { CompletionHighlight, MovementAnimation, RenderOptions, VisualMode } from "./canvas";
export { renderBoard, renderBoardToContext } from "./canvas";
export type { BoardGeometry, BoardGeometryInput, ViewportPoint } from "./geometry";
export { calculateBoardGeometry, cellFromPoint, cellRect } from "./geometry";