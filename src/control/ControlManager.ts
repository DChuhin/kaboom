import { GameObj, KaboomCtx } from 'kaboom';
import { BIG_JUMP_FORCE, MOVE_SPEED, SMALL_JUMP_FORCE } from 'config/constants';

export class ControlManager {

  // TODO maybe wrap mario as class extending or wrapping pure game obj
  constructor(private kaboomCtx: KaboomCtx, private mario: GameObj) {
  }

  assignKeys() {
    const { keyDown, keyPress } = this.kaboomCtx;
    keyDown('left', () => {
      this.mario.move(-MOVE_SPEED, 0);
    });
    keyDown('right', () => {
      this.mario.move(MOVE_SPEED, 0);
    });
    keyPress('space', () => {
      if (this.mario.grounded()) {
        const jumpForce = this.mario.isBig() ? BIG_JUMP_FORCE : SMALL_JUMP_FORCE;
        this.mario.jump(jumpForce)
      }
    })
  }
}