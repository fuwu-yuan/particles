import {Entities, Result, Vector2D} from '@fuwu-yuan/bgew'
import {Wall} from "./wall";
import {Constants} from "../Constants";

export abstract class Ball extends Entities.Oval {

  protected _image: HTMLImageElement;
  private _mass: number;

  constructor(x: number,
              y: number,
              radius,
              color,
              image: string) {
    super(x, y, radius, radius, color, color);
    this._image = document.createElement("img");
    this._image.src = image;
    this._mass = 1.0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
    ctx.drawImage(this._image, this.x - this.radiusX, this.y - this.radiusY, this.width, this.height);
  }

  get mass(): number {
    return this._mass;
  }

  set mass(value: number) {
    this._mass = value;
  }

  collisionWithWall(wall: Wall, result: Result) {
    this.board.playSound("wall");
    this.x -= result.overlap * result.overlap_x;
    this.y -= result.overlap * result.overlap_y;
    let dot = this.speedX * result.overlap_y + this.speedY * -result.overlap_x

    this.speedX = 2 * dot * result.overlap_y - this.speedX;
    this.speedY = 2 * dot * -result.overlap_x - this.speedY;
  }

  collisionWithBall(ball: Ball, result: Result) {
    this.board.playSound("ball");

    let this_position = new Vector2D(this.x, this.y);
    let this_velocity = new Vector2D(this.speedX, this.speedY);
    let ball_position = new Vector2D(ball.x, ball.y);
    let ball_velocity = new Vector2D(ball.speedX, ball.speedY);

    // get the mtd
    let delta: Vector2D = (this_position.clone().subtract(ball_position));
    let d: number = delta.length();

    // minimum translation distance to push balls apart after intersecting
    let mtd: Vector2D = delta.clone().multiply(((this.radiusX + ball.radiusX)-d)/d);

    // resolve intersection --
    // inverse mass quantities
    let im1: number = 1 / this.mass;
    let im2: number = 1 / ball.mass;

    // push-pull them apart based off their mass
    this_position = this_position.clone().add(mtd.clone().multiply(im1 / (im1 + im2)));
    ball_position = ball_position.clone().subtract(mtd.clone().multiply(im2 / (im1 + im2)));
    this.x = this_position.x;
    this.y = this_position.y;
    ball.x = ball_position.x;
    ball.y = ball_position.y;

    // impact speed
    let v: Vector2D = (this_velocity.clone().subtract(ball_velocity));
    let vn: number = v.clone().dot(mtd.clone().normalize());

    // sphere intersecting but moving away from each other already
    if (vn > 0) return;

    // collision impulse
    let i: number = (-(1.0 + Constants.RESTITUTION) * vn) / (im1 + im2);
    let impulse: Vector2D = mtd.clone().normalize().multiply(i);

    // change in momentum
    this_velocity = this_velocity.clone().add(impulse.clone().multiply(im1));
    ball_velocity = ball_velocity.clone().subtract(impulse.clone().multiply(im2));
    this.speedX = this_velocity.x;
    this.speedY = this_velocity.y;
    ball.speedX = ball_velocity.x;
    ball.speedY = ball_velocity.y;
  }
}
