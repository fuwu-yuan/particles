import {Ball} from './Ball';
import {Wall} from './wall';
import {Result, Entity} from '@fuwu-yuan/bgew';
import {Ennemy} from './ennemy';

const IMAGES = [
  './assets/bouncing-ball/images/balls/blue_ball.png',
  './assets/bouncing-ball/images/balls/green_ball.png',
  './assets/bouncing-ball/images/balls/yellow_ball.png',
  './assets/bouncing-ball/images/balls/purple_ball.png'
];

export class Player extends Ball {

  private _playerId;

  private _alive = true;

  public movementSpeedX = 0;
  public movementSpeedY = 0;

  constructor(playerId: number,
              x: number,
              y: number,
              radius: number) {
    super(x, y, radius, '#20639B', IMAGES[playerId]);
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

  get alive(): boolean {
    return this._alive;
  }

  set alive(value: boolean) {
    this._alive = value;
  }

  get playerId(): number {
    return this._playerId;
  }

  set playerId(value) {
    this._playerId = value;
  }
}
