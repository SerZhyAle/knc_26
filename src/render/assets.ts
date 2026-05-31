export type SpriteKey = "monster" | "kryvavitsa" | "shadow" | "wall" | "exit" | "intro" | "title";

export type SpriteMap = Partial<Record<SpriteKey, HTMLImageElement>>;

export interface OriginalAssetSet {
  readonly loaded: boolean;
  readonly sprites: SpriteMap;
}

export const original1999AssetPaths: Readonly<Record<SpriteKey, string>> = {
  monster: "assets/original-1999/monster.png",
  kryvavitsa: "assets/original-1999/kryvavitsa.png",
  shadow: "assets/original-1999/shadow.png",
  wall: "assets/original-1999/wall.png",
  exit: "assets/original-1999/exit.png",
  intro: "assets/original-1999/intro-sz.png",
  title: "assets/original-1999/title-composite.png"
};

export async function loadOriginal1999Assets(): Promise<OriginalAssetSet> {
  try {
    const entries = await Promise.all(Object.entries(original1999AssetPaths).map(async ([key, path]) => [key, await loadImage(path)] as const));
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