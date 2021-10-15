import { KaboomCtx } from 'kaboom';
import { Sprite } from './SpriteTypes';

export class SpriteManager {

  constructor(private kaboomCtx: KaboomCtx) {
  }

  async init() {
    await this.loadSprites();
  }

  sprite = (sprite: Sprite) => {
    return this.kaboomCtx.sprite(sprite);
  }

  private async loadSprites() {
    const { loadRoot, loadSprite } = this.kaboomCtx;
    loadRoot('sprites')
    Promise.all(
      Object.values(Sprite).map(spriteName => loadSprite(spriteName, `/${spriteName}.png`))
    )
  }
}