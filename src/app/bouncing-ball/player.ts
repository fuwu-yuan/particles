import {Ball} from './Ball';
import {Wall} from './wall';
import {Result, Entity} from '@fuwu-yuan/bgew';
import {Ennemy} from './ennemy';

const IMAGE = './assets/bouncing-ball/images/blue_ball.png';

export class Player extends Ball {

  private _alive = true;

  public movementSpeedX: number = 0;
  public movementSpeedY: number = 0;

  constructor(x: number,
              y: number,
              radius: number) {
    super(x, y, radius, '#20639B', IMAGE);
    this.onIntersectWithAnyEntity((entity: Entity, collisionWith: Entity, result: Result) => {
      if (collisionWith instanceof Wall) {
        if (this.alive) {
          this.x -= result.overlap * result.overlap_x;
          this.y -= result.overlap * result.overlap_y;
        }
      }
      if (collisionWith instanceof Ball) {
        if (collisionWith instanceof Ennemy && !(collisionWith as Ennemy).stopped) {
          this.collisionWithBall(collisionWith as Ball, result);
      }
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
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
