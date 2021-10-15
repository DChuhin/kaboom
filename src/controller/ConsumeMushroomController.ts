import { state } from 'game/GameState';
import { BIG_MARIO_DURATION_SECONDS } from 'config/constants';

export const consumeMushroom = () => {
  biggify();
  setTimeout(() => {
    smallify();
  }, BIG_MARIO_DURATION_SECONDS)
};

const biggify = () => {
  state.marioState.isBig = true;
}

const smallify = () => {
  state.marioState.isBig = false;
}