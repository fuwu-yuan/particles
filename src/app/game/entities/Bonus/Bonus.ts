import {Entities} from '@fuwu-yuan/bgew';
import {Player} from '../player';

export abstract class Bonus extends Entities.Oval {

  protected _image: HTMLImageElement;

  constructor(x: number,
              y: number,
              radius,
              image: string) {
    super(x, y, radius, radius, 'transparent', 'transparent');
    this._image = document.createElement('img');
    this._image.src = image;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.drawImage(this._image, this.x - this.radiusX, this.y - this.radiusY, this.width, this.height);
  }

  public abstract apply(owner: Player, otherPlayers: Player[]): void;
  protected abstract get Image(): string;

}
