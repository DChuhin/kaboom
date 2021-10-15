export interface GameState {
  marioState: MarioState;
  score: number;
}

export interface MarioState {
  isBig: boolean,
}

export const state: GameState = {
  marioState: {
    isBig: false,
  },
  score: 0,
};
