import {Entities, Result, Vector2D} from '@fuwu-yuan/bgew';
import {Wall} from './wall';
import {Constants} from '../Constants';

export abstract class Ball extends Entities.Oval {

  protected _image: HTMLImageElement;
  private _mass: number;

  constructor(x: number,
              y: number,
              radius,
              color,
              image: string) {
    super(x, y, radius, radius, color, color);
    this._image = document.createElement('img');
    this._image.src = image;
    this._mass = 1.0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.drawImage(this._image, this.x - this.radiusX, this.y - this.radiusY, this.width, this.height);
  }

  get mass(): number {
    return this._mass;
  }

  set mass(value: number) {
    this._mass = value;
  }

  collisionWithWall(wall: Wall, result: Result): void {
    this.board.playSound('wall');
    this.x -= result.overlap * result.overlap_x;
    this.y -= result.overlap * result.overlap_y;
    const dot = this.speedX * result.overlap_y + this.speedY * -result.overlap_x;

    this.speedX = 2 * dot * result.overlap_y - this.speedX;
    this.speedY = 2 * dot * -result.overlap_x - this.speedY;
  }

  collisionWithBall(ball: Ball, result: Result): void {
    this.board.playSound('ball');

    let thisPosition = new Vector2D(this.x, this.y);
    let thisVelocity = new Vector2D(this.speedX, this.speedY);
    let ballPosition = new Vector2D(ball.x, ball.y);
    let ballVelocity = new Vector2D(ball.speedX, ball.speedY);

    // get the mtd
    const delta: Vector2D = (thisPosition.clone().subtract(ballPosition));
    const d: number = delta.length();

    // minimum translation distance to push balls apart after intersecting
    const mtd: Vector2D = delta.clone().multiply(((this.radiusX + ball.radiusX) - d) / d);

    // resolve intersection --
    // inverse mass quantities
    const im1: number = 1 / this.mass;
    const im2: number = 1 / ball.mass;

    // push-pull them apart based off their mass
    thisPosition = thisPosition.clone().add(mtd.clone().multiply(im1 / (im1 + im2)));
    ballPosition = ballPosition.clone().subtract(mtd.clone().multiply(im2 / (im1 + im2)));
    this.x = thisPosition.x;
    this.y = thisPosition.y;
    ball.x = ballPosition.x;
    ball.y = ballPosition.y;

    // impact speed
    const v: Vector2D = (thisVelocity.clone().subtract(ballVelocity));
    const vn: number = v.clone().dot(mtd.clone().normalize());

    // sphere intersecting but moving away from each other already
    if (vn > 0) { return; }

    // collision impulse
    const i: number = (-(1.0 + Constants.RESTITUTION) * vn) / (im1 + im2);
    const impulse: Vector2D = mtd.clone().normalize().multiply(i);

    // change in momentum
    thisVelocity = thisVelocity.clone().add(impulse.clone().multiply(im1));
    ballVelocity = ballVelocity.clone().subtract(impulse.clone().multiply(im2));
    this.speedX = thisVelocity.x;
    this.speedY = thisVelocity.y;
    ball.speedX = ballVelocity.x;
    ball.speedY = ballVelocity.y;
  }
}
