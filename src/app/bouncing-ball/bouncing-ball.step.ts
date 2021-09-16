import {Board, Entities, GameStep, Timer} from '@fuwu-yuan/bgew';
import {Player} from "./player";
import {Ennemy} from "./ennemy";
import {Wall} from "./wall";

const WALL_WIDTH = 10;
const BALLS_RADIUS = 20;
const BALL_START_TIMER = 3; //ms
const BALLS_SPEED = { MIN: 100, MAX: 300};
const NEW_BALL_TIMER = 10; // seconds
const MAX_ENNEMIES = 25;

export class BouncingBallStep extends GameStep {
  name: string = "bouncing-ball";
  private wallLeft: Wall;
  private wallTop: Wall;
  private wallRight: Wall;
  private wallBottom: Wall;

  private player?: Player;
  private ennemies: Ennemy[] = [];
  private newEnnemyTimer: Timer;
  private elapsedMs: number = 0;
  private timerLabel: Entities.Label;

  constructor(board: Board) {
    super(board);
    //Left
    this.wallLeft = new Wall(0, 0, WALL_WIDTH, board.height, "#173F5F", "#173F5F");
    //Top
    this.wallTop = new Wall(0, 0, board.width, WALL_WIDTH, "#173F5F", "#173F5F");
    //Right
    this.wallRight = new Wall(board.width - WALL_WIDTH, 0, WALL_WIDTH, board.height, "#173F5F", "#173F5F");
    //Bottom
    this.wallBottom = new Wall(0, board.height - WALL_WIDTH, board.width, WALL_WIDTH, "#173F5F", "#173F5F");

    // Timer
    this.timerLabel = new Entities.Label(20, 20, "00:00:00", board.ctx);
    this.timerLabel.fontSize = 15;

    // Sounds
    this.board.registerSound("music", "./assets/bouncing-ball/sounds/music.mp3", true, 0.1);
    this.board.registerSound("wall", "./assets/bouncing-ball/sounds/wall.mp3", false, 0.7);
    this.board.registerSound("ball", "./assets/bouncing-ball/sounds/ball.mp3", false, 0.7);
  }

  onEnter(data: any): void {
    this.board.addEntities([this.wallLeft, this.wallBottom, this.wallTop, this.wallRight]);
    let btnSize = { width: this.board.width / 3, height: 75};
    let start = new Entities.Button(this.board.width / 2 - btnSize.width / 2, this.board.height / 2 - btnSize.height / 2, btnSize.width, btnSize.height, "CLICK TO START");
    start.hoverFillColor = "black";
    start.hoverStrokeColor = "white";
    start.hoverFontColor = "white";
    start.onMouseEvent("click", () => {
      this.board.removeEntity(start);
      this.start();
    })
    this.board.addEntity(start);
  }

  start() {
    this.board.changeCursor("none");
    this.ennemies = [];
    this.board.playSound("music");

    this.createPlayerBall();
    this.addEnnemy();
    this.addEnnemy();
    this.addEnnemy();
    this.newEnnemyTimer = this.board.addTimer(NEW_BALL_TIMER*1000, () => {
      this.addEnnemy();
      if (this.ennemies.length === MAX_ENNEMIES) {
        this.newEnnemyTimer.stop();
      }
    });
    this.elapsedMs = 0;
    this.board.addEntity(this.timerLabel);
  }

  private createPlayerBall() {
    this.player = new Player(this.board.width / 2, this.board.height / 2, BALLS_RADIUS, BALLS_RADIUS, "#20639B", "#20639B");
    this.board.onMouseEvent("mousemove", (event, x, y) => {
      if (this.player.alive && x > WALL_WIDTH && y > WALL_WIDTH) {
        this.player.x = x;
        this.player.y = y;
      }
    });
    this.board.onMouseEvent("mouseenter", () => {
      if (this.player.alive) {
        this.board.changeCursor("none");
      }
    });
    this.board.onMouseEvent("mouseleave", () => {
      this.board.changeCursor("default");
    });

    let playerOnbounds = (entity, collisionWith, result) => {
      if (this.player.alive) {
        this.player.x -= result.overlap * result.overlap_x;
        this.player.y -= result.overlap * result.overlap_y;
      }
    };

    this.player.onIntersectWithEntity(this.wallTop, playerOnbounds);
    this.player.onIntersectWithEntity(this.wallBottom, playerOnbounds);
    this.player.onIntersectWithEntity(this.wallLeft, playerOnbounds);
    this.player.onIntersectWithEntity(this.wallRight, playerOnbounds);

    this.board.addEntity(this.player);
  }

  addEnnemy() {
    let ennemy = new Ennemy(BouncingBallStep.random(WALL_WIDTH+BALLS_RADIUS+1, this.board.width - BALLS_RADIUS-WALL_WIDTH-1), BouncingBallStep.random(WALL_WIDTH+BALLS_RADIUS+1, this.board.height - BALLS_RADIUS-WALL_WIDTH-1), BALLS_RADIUS, BALLS_RADIUS, "#ED553B", "#ED553B");
    ennemy.stopped = true;
    ennemy.directionDegrees = BouncingBallStep.random(0, 359);
    this.board.addTimer(BALL_START_TIMER*1000, () => {
      ennemy.speed = BouncingBallStep.random(BALLS_SPEED.MIN, BALLS_SPEED.MAX);
      ennemy.stopped = false;
    }, false);
    // Check ball collision
    console.log("New ball added: ", {direction: ennemy.directionDegrees, directionX: ennemy.directionX, directionY: ennemy.directionY, speedX: ennemy.speedX, speedY: ennemy.speedY});
    ennemy.onIntersectWithAnyEntity((entity, collisionWith, result) => {

      // Wall collison
      if (collisionWith instanceof Wall) {
        if (this.player.alive) {
          console.log("WALL");
          this.board.playSound("wall");
          ennemy.x -= result.overlap * result.overlap_x;
          ennemy.y -= result.overlap * result.overlap_y;
          let dot = ennemy.directionX * result.overlap_y + ennemy.directionY * -result.overlap_x

          ennemy.directionX = 2 * dot * result.overlap_y - ennemy.directionX;
          ennemy.directionY = 2 * dot * -result.overlap_x - ennemy.directionY;
        }
      }

      // Other ennemy collision
      if (collisionWith instanceof Ennemy) {
        if (ennemy.stopped || collisionWith.stopped) return ;
        this.board.playSound("ball");
        ennemy.x -= result.overlap * result.overlap_x;
        ennemy.y -= result.overlap * result.overlap_y;
        let dot = collisionWith.directionX * result.overlap_y + collisionWith.directionY * -result.overlap_x;

        collisionWith.directionX = 2 * dot * result.overlap_y - collisionWith.directionX;
        collisionWith.directionY = 2 * dot * -result.overlap_x - collisionWith.directionY;
      }

      // Player collision
      if (collisionWith instanceof Player && this.player.alive) {
        if (ennemy.stopped === false) {
          this.board.playSound("ball");
          ennemy.x -= result.overlap * result.overlap_x;
          ennemy.y -= result.overlap * result.overlap_y;
          let dot = ennemy.directionX * result.overlap_y + ennemy.directionY * -result.overlap_x

          ennemy.directionX = 2 * dot * result.overlap_y - ennemy.directionX;
          ennemy.directionY = 2 * dot * -result.overlap_x - ennemy.directionY;
          console.log(ennemy.directionDegrees);
          console.log(ennemy.direction);
          this.playerLoose();
        }
      }
    });
    this.board.addEntity(ennemy);
    this.ennemies.push(ennemy);
    return ennemy;
  }

  private playerLoose() {
    this.board.stopSound("music", true, 2000);
    this.player.alive = false;
    this.player.directionDegrees = 90;
    for (const ennemy of this.ennemies) {
      ennemy.directionDegrees = 90;
    }
    this.newEnnemyTimer.stop();
    this.board.addTimer(3000, () => {
      this.board.changeCursor("default");
      this.board.removeEntity(this.player);
      for (const ennemy of this.ennemies) {
        this.board.removeEntity(ennemy);
      }
      // Score
      let score = new Entities.Label(0, 0, "Score: " + this.formatMilliseconds(this.elapsedMs, true), this.board.ctx);
      score.fontSize = 25;
      score.x = this.board.width / 2 - score.width / 2;
      score.y = this.board.height / 2 - score.height / 2;
      this.board.addEntity(score);

      // Restart
      let btnSize = { width: 200, height: 50 };
      let restart = new Entities.Button(this.board.width / 2 - btnSize.width / 2, this.board.height / 2 + score.height + 20, btnSize.width, btnSize.height, "Try again");
      restart.hoverFillColor = "black";
      restart.hoverStrokeColor = "white";
      restart.hoverFontColor = "white";
      restart.onMouseEvent("click", () => {
        this.board.removeEntity(score);
        this.board.removeEntity(restart);
        this.start();
      });
      this.board.addEntity(restart);
    }, false);
  }

  private formatMilliseconds(milliseconds, padStart = false) {
    function pad(num) {
      return `${num}`.padStart(2, '0');
    }
    let asSeconds = milliseconds / 1000;

    let hours = undefined;
    let minutes = Math.floor(asSeconds / 60);
    let seconds = Math.floor(asSeconds % 60);
    let ms = Math.floor(milliseconds - (seconds*1000+minutes*60*1000));

    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      minutes %= 60;
      ms = milliseconds - (seconds*1000+minutes*60000+hours*3600000);
    }

    return hours
      ? `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}:${pad(ms)}`
      : `${padStart ? pad(minutes) : minutes}:${pad(seconds)}:${pad(ms)}`;
  }


  onLeave(): void {

  }

  update(delta: number) {
    super.update(delta);
    if (this.player && this.player.alive) {
      this.elapsedMs += delta;
      this.timerLabel.text = this.formatMilliseconds(this.elapsedMs, true) + " | " + this.ennemies.length + " BALLS";
    }
    if (this.player && !this.player.alive && this.board.entities.indexOf(this.player) > -1) {
      this.player.speed += 5;
      for (const ennemy of this.ennemies) {
        ennemy.speed += 5;
      }
    }
  }

  private static random(min, max) {
    return Math.floor(Math.random() * max) + min
  }
}
