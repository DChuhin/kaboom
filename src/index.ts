import kaboom, { GameObj, LevelConf } from 'kaboom';
import { SpriteManager } from 'sprite/SpriteManager';
import { Sprite } from 'sprite/SpriteTypes';
import { ControlManager } from 'control/ControlManager';
import { big } from 'comp/biggify';
import { BIG_MARIO_DURATION_SECONDS, Scenes, Tags } from 'config/constants';
import { state } from 'game/GameState';

import './index.scss'

const init = async () => {
  const kaboomCtx = kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1]
  });

  const {
    scene, layers, addLevel, pos, body, origin, start, solid, add, scale, text, layer, destroy, action, go, width, height, camPos,
  } = kaboomCtx;

  const spriteManager = new SpriteManager(kaboomCtx);
  await spriteManager.init();

  const { sprite } = spriteManager;

  scene(Scenes.GAME, () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const map = [
      '                                      ',
      '                      $$$$$           ',
      '                                      ',
      '                                      ',
      '                                      ',
      '     %   =*=%=                        ',
      '                                      ',
      '                            -+        ',
      '                    ^   ^   ()        ',
      '==============================   =====',
    ];

    const levelConfig: LevelConf = {
      width: 20,
      height: 20,
      '=': [sprite(Sprite.BLOCK), solid()],
      '$': [sprite(Sprite.COIN), Tags.COIN],
      '#': [sprite(Sprite.MUSHROOM), solid(), body(), Tags.MUSHROOM],
      '(': [sprite(Sprite.PIPE_BOTTOM_LEFT), solid(), scale(0.5)],
      ')': [sprite(Sprite.PIPE_BOTTOM_RIGHT), solid(), scale(0.5)],
      '-': [sprite(Sprite.PIPE_TOP_LEFT), solid(), scale(0.5)],
      '+': [sprite(Sprite.PIPE_TOP_RIGHT), solid(), scale(0.5)],
      '%': [sprite(Sprite.SURPRISE), solid(), 'coin-surprise'],
      '*': [sprite(Sprite.SURPRISE), solid(), 'mushroom-surprise'],
      '}': [sprite(Sprite.UNBOXED), solid()],
      '^': [sprite(Sprite.EVIL_SHROOM), Tags.DEATH],
      any: s => undefined
    }

    const level = addLevel(map, levelConfig);

    const scoreLabel = add([
      text('0'),
      pos(30, 6),
      layer('ui'),
    ]);

    const mario = add([
      sprite(Sprite.MARIO),
      pos(50, 0),
      body(),
      origin('bot'),
      big(kaboomCtx),
    ]);

    const controlManager = new ControlManager(kaboomCtx, mario);
    controlManager.assignKeys();

    action('mushroom', (m) => {
      m.move(20, 0);
    });

    mario.collides(Tags.MUSHROOM, (m: GameObj) => {
      destroy(m);
      mario.biggify(BIG_MARIO_DURATION_SECONDS);
    });

    mario.collides(Tags.COIN, (m: GameObj) => {
      destroy(m);
      scoreLabel.text = ++state.score;
    });

    mario.collides(Tags.DEATH, (m: GameObj) => {
      if (mario.grounded()) {
        go('lose');
      } else {
        destroy(m);
      }
    });

    const ENEMY_SPEED = 20;
    const FALL_DEATH = 400;
    action(Tags.DEATH, (d) => {
      d.move(-ENEMY_SPEED, 0);
    });

    mario.action(() => {
      camPos(mario.pos);
      if (mario.pos.y >= FALL_DEATH) {
        go('lose');
      }
    });

    // @ts-ignore bug in kaboom: illegal contract of function on: obj is allowed
    mario.on('headbump', (obj: GameObj) => {
      if (obj.is('coin-surprise')) {
        level.spawn('$', obj.gridPos.sub(0, 1))
        destroy(obj)
        level.spawn('}', obj.gridPos)
      }
      if (obj.is('mushroom-surprise')) {
        level.spawn('#', obj.gridPos.sub(0, 1))
        destroy(obj)
        level.spawn('}', obj.gridPos)
      }
    })
  });

  scene(Scenes.LOSE, () => {
    const fontSize = 24;
    const lineGap = fontSize * 2;
    add([
      text('GAME OVER', fontSize),
      origin('center'),
      pos(width() / 2, height() / 2 - lineGap / 2)
    ]);
    add([
      text(`Your score: ${state.score.toLocaleString()}`, fontSize),
      origin('center'),
      pos(width() / 2, height() / 2 + lineGap / 2)
    ]);
  });

  start('game');
}

init();
