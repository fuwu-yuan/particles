import {Entities} from '@fuwu-yuan/bgew'

export class Player extends Entities.Oval {

  private _alive = true;
  private _image: HTMLImageElement;

  constructor(x: number,
              y: number,
              radiusX: number,
              radiusY: number,
              strokeColor: string|null = null,
              fillColor: string|null = null,
              hoverStrokeColor: string|null = null,
              hoverFillColor: string|null = null,
              clickStrokeColor: string|null = null,
              clickFillColor: string|null = null) {
    super(x, y, radiusX, radiusY, strokeColor, fillColor, hoverStrokeColor, hoverFillColor, clickStrokeColor, clickFillColor);
    this._image = document.createElement("img");
    this._image.src = "./assets/bouncing-ball/images/blue_ball.png";
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
    ctx.drawImage(this._image, this.x - this.radiusX, this.y - this.radiusY, this.width, this.height);
  }

  get alive(): boolean {
    return this._alive;
  }

  set alive(value: boolean) {
    this._alive = value;
  }
}
