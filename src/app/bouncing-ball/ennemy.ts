import {Ball} from './Ball';

const IMAGE = './assets/bouncing-ball/images/red_ball.png';

export class Ennemy extends Ball {

  private _stopped = false;

  constructor(x: number,
              y: number,
              radius) {
    super(x, y, radius, '#ED553B', IMAGE);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.drawImage(this._image, this.x - this.radiusX, this.y - this.radiusY, this.width, this.height);
  }

  get stopped(): boolean {
    return this._stopped;
  }

  set stopped(value: boolean) {
    this._stopped = value;
  }
}
