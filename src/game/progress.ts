import type { GameEvent, TurnResult } from "./engine";

export interface GameProgress {
  readonly level: number;
  readonly score: number;
  readonly recordLevel: number;
}

export interface ProgressResult {
  readonly progress: GameProgress;
  readonly outcome: "none" | "victory" | "defeat";
}

const turnCost = 10;
const wallPushScore = 10;
const shadowCrushScore = 50;
const victoryScore = 1000;
const restartPenalty = 500;

export function createInitialProgress(recordLevel = 1): GameProgress {
  return {
    level: 1,
    score: 0,
    recordLevel: Math.max(1, Math.trunc(recordLevel))
  };
}

export function applyTurnProgress(progress: GameProgress, turnResult: TurnResult, maximumLevel?: number): ProgressResult {
  let score = progress.score;
  let level = progress.level;
  let outcome: ProgressResult["outcome"] = "none";

  if (turnResult.countedAction) {
    score -= turnCost;
  }

  for (const event of turnResult.events) {
    score += scoreDeltaForEvent(event);

    if (event.type === "victory") {
      outcome = "victory";
      level += 1;
    } else if (event.type === "defeat") {
      outcome = "defeat";
    }
  }

  const normalizedScore = Math.max(0, score);
  const levelLimit = maximumLevel ?? level;
  const normalizedLevel = Math.min(Math.max(1, level), Math.max(1, levelLimit));

  return {
    progress: {
      level: normalizedLevel,
      score: normalizedScore,
      recordLevel: Math.max(progress.recordLevel, normalizedLevel)
    },
    outcome
  };
}

export function applyRestartPenalty(progress: GameProgress): GameProgress {
  return {
    level: progress.level,
    score: Math.max(0, progress.score - restartPenalty),
    recordLevel: progress.recordLevel
  };
}

export function resetProgressForNewGame(progress: GameProgress): GameProgress {
  return createInitialProgress(progress.recordLevel);
}

export function resetProgressForBoardSize(progress: GameProgress): GameProgress {
  return createInitialProgress(progress.recordLevel);
}

function scoreDeltaForEvent(event: GameEvent): number {
  if (event.type === "wallPushed") {
    return wallPushScore;
  }

  if (event.type === "shadowCrushed") {
    return shadowCrushScore;
  }

  if (event.type === "victory") {
    return victoryScore;
  }

  return 0;
}