import type { BoardSize, Direction, GameEvent, GameProgress, GameState } from "../game";
import { applyRestartPenalty, applyTurnProgress, createInitialProgress, generateBoard, getMaximumShadowLevelForBoard, playTurn, resetProgressForBoardSize, resetProgressForNewGame, SeededRandom } from "../game";

export interface GameControllerOptions {
  readonly boardSize: BoardSize;
  readonly seed: number;
  readonly progress?: GameProgress;
  readonly game?: GameState;
}

export interface GameControllerSnapshot {
  readonly boardSize: BoardSize;
  readonly seed: number;
  readonly progress: GameProgress;
  readonly game: GameState;
  readonly lastEvents: readonly GameEvent[];
  readonly locked: boolean;
  readonly notice: "none" | "victory" | "defeat" | "restart" | "newGame";
}

export interface ControllerUpdate {
  readonly accepted: boolean;
  readonly snapshot: GameControllerSnapshot;
}

export class GameController {
  private readonly random: SeededRandom;
  private boardSize: BoardSize;
  private progress: GameProgress;
  private game: GameState;
  private lastEvents: readonly GameEvent[] = [];
  private locked = false;
  private notice: GameControllerSnapshot["notice"] = "none";

  public constructor(options: GameControllerOptions) {
    this.random = new SeededRandom(options.seed);
    this.boardSize = copyBoardSize(options.boardSize);
    this.progress = capProgressLevel(options.progress ?? createInitialProgress(), this.boardSize);
    this.game = options.game !== undefined && options.game.status === "playing" ? options.game : this.generateCurrentBoard();
  }

  public snapshot(): GameControllerSnapshot {
    return {
      boardSize: copyBoardSize(this.boardSize),
      seed: this.random.snapshot(),
      progress: copyProgress(this.progress),
      game: copyGameState(this.game),
      lastEvents: this.lastEvents.slice(),
      locked: this.locked,
      notice: this.notice
    };
  }

  public setLocked(locked: boolean): GameControllerSnapshot {
    this.locked = locked;
    return this.snapshot();
  }

  public move(direction: Direction): ControllerUpdate {
    if (this.locked) {
      return { accepted: false, snapshot: this.snapshot() };
    }

    const turnResult = playTurn(this.game, direction, this.random);
    if (!turnResult.countedAction) {
      return { accepted: false, snapshot: this.snapshot() };
    }

    const progressResult = applyTurnProgress(this.progress, turnResult, getMaximumShadowLevelForBoard(this.boardSize));
    this.progress = progressResult.progress;
    this.lastEvents = turnResult.events.slice();
    this.notice = progressResult.outcome === "none" ? "none" : progressResult.outcome;

    if (progressResult.outcome === "victory") {
      this.game = this.generateCurrentBoard();
    } else if (progressResult.outcome === "defeat") {
      // Keep the board frozen at the moment of death so the UI can show where
      // and who killed the Monster. The next board is generated on dismissDefeat().
      this.game = turnResult.state;
      this.locked = true;
    } else {
      this.game = turnResult.state;
    }

    return { accepted: true, snapshot: this.snapshot() };
  }

  public dismissDefeat(): GameControllerSnapshot {
    this.game = this.generateCurrentBoard();
    this.locked = false;
    this.lastEvents = [];
    this.notice = "none";
    return this.snapshot();
  }

  public restart(): GameControllerSnapshot {
    this.progress = applyRestartPenalty(this.progress);
    this.game = this.generateCurrentBoard();
    this.lastEvents = [];
    this.notice = "restart";
    return this.snapshot();
  }

  public newGame(): GameControllerSnapshot {
    this.progress = resetProgressForNewGame(this.progress);
    this.game = this.generateCurrentBoard();
    this.lastEvents = [];
    this.notice = "newGame";
    return this.snapshot();
  }

  public changeBoardSize(boardSize: BoardSize): GameControllerSnapshot {
    this.boardSize = copyBoardSize(boardSize);
    this.progress = resetProgressForBoardSize(this.progress);
    this.game = this.generateCurrentBoard();
    this.lastEvents = [];
    this.notice = "newGame";
    return this.snapshot();
  }

  private generateCurrentBoard(): GameState {
    this.progress = capProgressLevel(this.progress, this.boardSize);
    return generateBoard({ width: this.boardSize.width, height: this.boardSize.height, level: this.progress.level, random: this.random, maxAttempts: 1500 });
  }
}

function copyBoardSize(boardSize: BoardSize): BoardSize {
  return { width: boardSize.width, height: boardSize.height };
}

function copyProgress(progress: GameProgress): GameProgress {
  return { level: progress.level, score: progress.score, recordLevel: progress.recordLevel };
}

function capProgressLevel(progress: GameProgress, boardSize: BoardSize): GameProgress {
  return {
    level: Math.min(progress.level, getMaximumShadowLevelForBoard(boardSize)),
    score: progress.score,
    recordLevel: progress.recordLevel
  };
}

function copyGameState(game: GameState): GameState {
  return {
    width: game.width,
    height: game.height,
    monster: { x: game.monster.x, y: game.monster.y },
    kryvavitsa: { x: game.kryvavitsa.x, y: game.kryvavitsa.y },
    shadows: game.shadows.map((shadow) => ({ id: shadow.id, position: { x: shadow.position.x, y: shadow.position.y } })),
    walls: game.walls.map((wall) => ({ x: wall.x, y: wall.y })),
    exit: { x: game.exit.x, y: game.exit.y },
    status: game.status,
    turn: game.turn
  };
}