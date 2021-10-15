import { KaboomCtx } from 'kaboom';

interface BigComp {
  isBig: () => boolean,
  biggify: (timerSeconds: number) => void,
  smallify: () => void,
}

export const big = (kaboomCtx: KaboomCtx): BigComp => {
  const { vec2 } = kaboomCtx;
  let isBig = false;
  return {
    isBig: () => isBig,
    biggify: function (timerSeconds: number) {
      isBig = true;
      setTimeout(() => {
        this.smallify();
      }, timerSeconds * 1000);
      this.scale = vec2(2)
    },
    smallify: function () {
      isBig = false;
      this.scale = vec2(1)
    }
  }
}



