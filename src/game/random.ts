import type { RandomSource } from "./engine";

export interface StatefulRandomSource extends RandomSource {
  snapshot(): number;
}

export class SeededRandom implements StatefulRandomSource {
  private state: number;

  public constructor(seed: number) {
    this.state = normalizeSeed(seed);
  }

  public nextInt(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error(`Random max must be a positive integer, got ${String(maxExclusive)}.`);
    }

    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state % maxExclusive;
  }

  public snapshot(): number {
    return this.state;
  }
}

export function createSeedFromTime(timestamp: number): number {
  return normalizeSeed(Math.trunc(timestamp));
}

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) {
    return 1;
  }

  const normalized = Math.trunc(seed) >>> 0;
  return normalized === 0 ? 1 : normalized;
}