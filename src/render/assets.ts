export type SpriteKey = "empty" | "monster" | "kryvavitsa" | "shadow" | "shadow2" | "shadow3" | "shadow4" | "shadow5" | "wall" | "exit" | "intro" | "title";

export type SpriteMap = Partial<Record<SpriteKey, HTMLImageElement>>;

export interface VisualAssetSet {
  readonly loaded: boolean;
  readonly sprites: SpriteMap;
}

export interface VisualAssetCollection {
  readonly original1999: VisualAssetSet;
  readonly windows2003: VisualAssetSet;
}

export const emptyVisualAssetSet: VisualAssetSet = { loaded: false, sprites: {} };

export const emptyVisualAssets: VisualAssetCollection = {
  original1999: emptyVisualAssetSet,
  windows2003: emptyVisualAssetSet
};

export const original1999AssetPaths: Readonly<Partial<Record<SpriteKey, string>>> = {
  monster: "assets/original-1999/monster.png",
  kryvavitsa: "assets/original-1999/kryvavitsa.png",
  shadow: "assets/original-1999/shadow.png",
  wall: "assets/original-1999/wall.png",
  exit: "assets/original-1999/exit.png",
  intro: "assets/original-1999/intro-sz.png",
  title: "assets/original-1999/title-composite.png"
};

export const windows2003AssetPaths: Readonly<Partial<Record<SpriteKey, string>>> = {
  empty: "assets/windows-2003/place.gif",
  monster: "assets/windows-2003/monster.gif",
  kryvavitsa: "assets/windows-2003/kryvavitsa.gif",
  shadow: "assets/windows-2003/shadow-1.gif",
  shadow2: "assets/windows-2003/shadow-2.gif",
  shadow3: "assets/windows-2003/shadow-3.gif",
  shadow4: "assets/windows-2003/shadow-4.gif",
  shadow5: "assets/windows-2003/shadow-5.gif",
  wall: "assets/windows-2003/wall.gif",
  exit: "assets/windows-2003/exit.gif"
};

export async function loadVisualAssets(): Promise<VisualAssetCollection> {
  const [original1999, windows2003] = await Promise.all([loadAssetSet(original1999AssetPaths), loadAssetSet(windows2003AssetPaths)]);
  return { original1999, windows2003 };
}

async function loadAssetSet(paths: Readonly<Partial<Record<SpriteKey, string>>>): Promise<VisualAssetSet> {
  try {
    const entries = await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await loadImage(path)] as const));
    const sprites: SpriteMap = {};

    for (const [key, image] of entries) {
      sprites[key as SpriteKey] = image;
    }

    return { loaded: true, sprites };
  } catch {
    return { loaded: false, sprites: {} };
  }
}

function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image ${path}.`));
    };
    image.src = path;
  });
}