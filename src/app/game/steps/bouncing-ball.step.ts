import {Board, Entities, GameStep, Timer} from '@fuwu-yuan/bgew';
import {Player} from "../entities/player";
import {Ennemy} from "../entities/ennemy";
import {Wall} from "../entities/wall";
import {RestInCloudAPI} from 'restincloud-node';
import {Score} from "../entities/score";
import {environment} from '../../../environments/environment';
import {Ball} from "../entities/Ball";
import {Plateform} from "../helpers/plateform";

const DEFAULT_CANVAS_SIZE = {
  WIDTH: 900,
  HEIGHT: 900
};

const DEFAULT_WALL_WIDTH = 10;
const DEFAULT_BALLS_RADIUS = 20;
const DEFAULT_BALL_START_TIMER = 3; //ms
const DEFAULT_BALLS_SPEED = { MIN: 100, MAX: 300};
const DEFAULT_NEW_BALL_TIMER = 10; // seconds
const DEFAULT_MAX_ENNEMIES = 25;

let WALL_WIDTH = DEFAULT_WALL_WIDTH;
let BALLS_RADIUS = DEFAULT_BALLS_RADIUS;
let BALL_START_TIMER = DEFAULT_BALL_START_TIMER;
let BALLS_SPEED = DEFAULT_BALLS_SPEED;
let NEW_BALL_TIMER = DEFAULT_NEW_BALL_TIMER;
let MAX_ENNEMIES = DEFAULT_MAX_ENNEMIES;

export class BouncingBallStep extends GameStep {
  name: string = "bouncing-ball";
  private walls: Wall[];
  private player?: Player;
  private ennemies: Ennemy[] = [];
  private newEnnemyTimer: Timer;
  private elapsedMs: number = 0;
  private timerLabel: Entities.Label;
  private restInCloudApi: RestInCloudAPI;
  private scores?: Score[] = [];
  private bestScore: Entities.Label;
  private mouseMovement : {x: number, y: number} = {x: 0, y: 0};
  private previousTouch: Touch;

  constructor(board: Board) {
    super(board);
    // Mobile/tablet fullscreen resize
    if (Plateform.deviceType() === "tablet" || Plateform.deviceType() === "mobile") {
      this.updateRatio();
      environment.restincloud_api_scores_key = environment.restincloud_api_scores_key + "-mobile";
    }

    this.walls = [
      //Left
      new Wall(-WALL_WIDTH, -WALL_WIDTH, WALL_WIDTH*2, board.height + 2*WALL_WIDTH, "#173F5F", "#173F5F"),
      //Top
      new Wall(-WALL_WIDTH, -WALL_WIDTH, board.width + 2*WALL_WIDTH, WALL_WIDTH*2, "#173F5F", "#173F5F"),
      //Right
      new Wall(board.width - WALL_WIDTH, -WALL_WIDTH, WALL_WIDTH*2, board.height+WALL_WIDTH*2, "#173F5F", "#173F5F"),
      //Bottom
      new Wall(-WALL_WIDTH, board.height - WALL_WIDTH, board.width+WALL_WIDTH*2, WALL_WIDTH*2, "#173F5F", "#173F5F")
    ]
    // Timer
    this.timerLabel = new Entities.Label(20, 20, "00:00:00", board.ctx);
    this.timerLabel.fontSize = 15;

    // Sounds
    this.board.registerSound("music", "./assets/bouncing-ball/sounds/music.mp3", true, 0.1);
    this.board.registerSound("wall", "./assets/bouncing-ball/sounds/wall.mp3", false, 0.7);
    this.board.registerSound("ball", "./assets/bouncing-ball/sounds/ball.mp3", false, 0.7);

    this.restInCloudApi = new RestInCloudAPI(environment.restincloud_api_token);
    this.bestScore = new Entities.Label(0, 20, "", board.ctx);
    this.bestScore.fontSize = 15;
    this.board.addEntity(this.bestScore);
    this.updateScores().then(() => { this.updateBest(); });
  }

  updateRatio() {
    this.board.width = screen.width;

    let ratio = this.board.width / DEFAULT_CANVAS_SIZE.WIDTH;

    this.board.height = DEFAULT_CANVAS_SIZE.HEIGHT*ratio;
    WALL_WIDTH = DEFAULT_WALL_WIDTH*ratio;
    BALLS_RADIUS = DEFAULT_BALLS_RADIUS*ratio;
    BALLS_SPEED.MAX = DEFAULT_BALLS_SPEED.MAX*(1-((1-ratio)/2));
    BALLS_SPEED.MIN = DEFAULT_BALLS_SPEED.MIN*(1-((1-ratio)/2));
  }

  onEnter(data: any): void {

    let btnSize = { width: this.board.width / 3, height: 75};
    if (Plateform.deviceType() === "mobile") {
      btnSize.width = this.board.width/2;
    }
    let start = new Entities.Button(
      this.board.width / 2 - btnSize.width / 2,
      this.board.height / 2 - btnSize.height / 2,
      btnSize.width,
      btnSize.height,
      "CLICK TO START");
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
    if (Plateform.deviceType() === "tablet" || Plateform.deviceType() === "mobile") {
      this.updateRatio();
    }
    this.board.addEntities(this.walls);

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
    }, true);
    this.elapsedMs = 0;
    this.board.addEntity(this.timerLabel);

    if (Plateform.deviceType() !== "desktop") {
      this.bestScore.text = "";
    }
  }

  private createPlayerBall() {
    this.player = new Player(1, this.board.width / 2, this.board.height / 2, BALLS_RADIUS);
    this.player.alive = true;

    let playerInputMove = (x: number, y: number) => {
      x = x < WALL_WIDTH ? WALL_WIDTH : x;
      x = x > this.board.width - WALL_WIDTH ? this.board.width - WALL_WIDTH : x;
      y = y < WALL_WIDTH ? WALL_WIDTH : y;
      y = y > this.board.height - WALL_WIDTH ? this.board.height - WALL_WIDTH : y;
      if (this.player.alive) {
        this.player.x = x;
        this.player.y = y;
      }
    }

    document.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = this.board.canvas.getBoundingClientRect();
      let x = (event.clientX - rect.left) * (1/this.board.scale);
      let y = (event.clientY - rect.top) * (1/this.board.scale);
      playerInputMove(x, y);
    });

    document.addEventListener("touchmove", (event: TouchEvent) => {
      const rect = this.board.canvas.getBoundingClientRect();
      if (this.previousTouch) {
        let movementX = (event.touches.item(0).pageX - this.previousTouch.pageX)*2; //x2 to speed up touch movement
        let movementY = (event.touches.item(0).pageY - this.previousTouch.pageY)*2;
        //let x = (event.touches.item(0).clientX - rect.left) * (1/this.board.scale);
        //let y = (event.touches.item(0).clientY - rect.top) * (1/this.board.scale);
        let x = this.player.x + movementX;
        let y = this.player.y + movementY;
        playerInputMove(x, y);
      }
      this.previousTouch = event.touches.item(0);
    });

    document.addEventListener("touchend", () => {
      this.previousTouch = null;
    });

    /*this.board.onMouseEvent("mousemove", (event, x, y) => {
      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;
      if (this.player.alive && x > WALL_WIDTH && y > WALL_WIDTH) {
        this.player.x = x;
        this.player.y = y;
      }
    });*/
    this.board.onMouseEvent("mouseenter", () => {
      if (this.player.alive) {
        this.board.changeCursor("none");
      }
    });
    this.board.onMouseEvent("mouseleave", () => {
      this.board.changeCursor("default");
    });

    this.board.addEntity(this.player);
  }

  addEnnemy(x?: number, y?: number, speed?: number, angle?: number) {
    let ennemy = new Ennemy(
      x || BouncingBallStep.random(WALL_WIDTH+BALLS_RADIUS+10, this.board.width - BALLS_RADIUS-WALL_WIDTH-50),
      y || BouncingBallStep.random(WALL_WIDTH+BALLS_RADIUS+10, this.board.height - BALLS_RADIUS-WALL_WIDTH-50),
      BALLS_RADIUS);
    ennemy.stopped = true;
    this.board.addTimer(BALL_START_TIMER*1000, () => {
      ennemy.setSpeedWithAngle(speed || BouncingBallStep.random(BALLS_SPEED.MIN, BALLS_SPEED.MAX), angle || BouncingBallStep.random(0, 359), true);
      ennemy.stopped = false;
      console.log("New ball added: ", {angle: ennemy.angle, degrees: ennemy.angleInDegrees, speed: ennemy.speed, speedX: ennemy.speedX, speedY: ennemy.speedY});
    }, false);
    // Check ball collision
    ennemy.onIntersectWithAnyEntity((entity, collisionWith, result) => {
      // Wall collison
      if (collisionWith instanceof Wall) {
        if (this.player.alive) {
          ennemy.collisionWithWall(<Wall>collisionWith, result);
        }
      }
      // Other ennemy collision
      if (collisionWith instanceof Ennemy) {
        if (!ennemy.stopped && !collisionWith.stopped) {
          ennemy.collisionWithBall(<Ball>collisionWith, result);
        }
      }
      // Player collision
      if (collisionWith instanceof Player && this.player.alive) {
        if (ennemy.stopped === false) {
          ennemy.collisionWithBall(<Ball>collisionWith, result);
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
    this.board.removeEntities(this.walls);
    /*this.player.angleInDegrees = 90;
    for (const ennemy of this.ennemies) {
      ennemy.angleInDegrees = 90;
    }*/
    this.newEnnemyTimer.stop();
    this.board.addTimer(3000, () => {
      this.board.changeCursor("default");
      this.timerLabel.text = "";
      // TOP 10
      let top10Container = new Entities.Container(0, 0, this.board.width, this.board.height / 3 * 2);
      let bottomPart = new Entities.Container(0, top10Container.y + top10Container.height, this.board.width, this.board.height / 3);
      top10Container.addEntity(new Entities.Rectangle(0, 0, top10Container.width, top10Container.height, "black", "transparent"));
      let top10Title = new Entities.Label(0, 50, "TOP 10" + (Plateform.deviceType() === "desktop" ? " (DESKTOP)" : " (MOBILE)"), this.board.ctx);
      top10Title.fontSize = 30;
      top10Title.x = top10Container.width / 2 - top10Title.width / 2;
      top10Container.addEntity(top10Title);

      this.addScore(this.elapsedMs, this.ennemies.length).then(() => {
        let top10values = this.scores.map((s: Score) => {
          return `[${s.name}] ${this.formatMilliseconds(s.duration, true)} (${Plateform.deviceName(s.user_agent)}) | ${s.balls} BALLS`;
        });
        let firstLabel = null;
        let medals = ["🥇 ", "🥈 ", "🥉 ", "4. ", "5. ", "6. ", "7. ", "8. ", "9. ", "10. "];
        for (let i = 0; i < top10values.length; i++) {
          let top10Label = new Entities.Label(10, top10Title.y + top10Title.height + 50 + 30*i, medals[i] + top10values[i], this.board.ctx);
          if (Plateform.deviceType() === "mobile") {
            top10Label.fontSize = 15;
          }
          top10Label.x = this.board.width / 2 - top10Label.width / 2;
          if (firstLabel) top10Label.x = firstLabel.x;
          top10Container.addEntity(top10Label);
          if (firstLabel === null) firstLabel = top10Label;
        }
        this.updateBest();
        this.board.addEntity(top10Container);
      });

      // RESTART
      let btnSize = { width: 200, height: 50 };
      let restart = new Entities.Button(bottomPart.width / 2 - btnSize.width / 2, bottomPart.height / 3 * 2 - btnSize.height / 2, btnSize.width, btnSize.height, "Try again");
      restart.hoverFillColor = "black";
      restart.hoverStrokeColor = "white";
      restart.hoverFontColor = "white";
      restart.onMouseEvent("click", () => {
        this.board.removeEntities([bottomPart, top10Container]);
        this.board.removeEntity(this.player);
        for (const ennemy of this.ennemies) {
          this.board.removeEntity(ennemy);
        }
        this.start();
      });
      bottomPart.addEntity(restart)

      // SCORE
      let score = new Entities.Label(0, 0, "Score: " + this.formatMilliseconds(this.elapsedMs, true) + " | " + this.ennemies.length + " BALLS", this.board.ctx);
      score.fontSize = 25;
      score.x = bottomPart.width / 2 - score.width / 2;
      score.y = bottomPart.height / 3 - btnSize.height / 2;
      bottomPart.addEntity(score);

      this.board.addEntity(bottomPart);
    }, false);
  }

  private updateScores() {
    return this.restInCloudApi.getVar(environment.restincloud_api_scores_key)
      .then((value) => {
        if (value.code === "success") {
          this.scores = JSON.parse(value.result.value);
          this.scores = this.scores.sort((a, b) => {
            return b.duration - a.duration;
          });
          console.log("Scores updated: ", this.scores);
        }else if (value.code === "not_found") {
          this.scores = [];
          console.log("Scores not found in server.");
        }else {
          this.scores = null;
          console.log(value.code);
        }
      }).catch(err => {
      });
  }

  private updateBest() {
    if (this.scores.length > 0) {
      let s = this.scores[0];
      this.bestScore.text = "🥇 " + `[${s.name}] ${this.formatMilliseconds(s.duration, true)} | ${s.balls} BALLS`;
      this.bestScore.x = this.board.width - this.bestScore.width - 20;
    }
  }

  private addScore(time: number, balls: number) {
    console.log("Adding score: ", {time: time, balls: balls});
    return this.updateScores().then(() => {
      let rank = this.getRank(time);
      console.log("Player rank: " + rank);
      if (this.scores !== null && rank <= 10) {
        let name = window.prompt("Congratulation, you are in TOP 10 ! Please enter your name (10 char max) :", "");
        if (name === ""|| name === null) return;
        name = name.slice(0, 10);
        return this.getClientIp().then((ip: any) => {
          //console.log("ip: ", ip);
          this.scores.splice(rank-1, 0 , {
            balls: balls,
            timestamp: (new Date()).getMilliseconds(),
            duration: time,
            //ip: ip.ip,
            name: name,
            user_agent: navigator.userAgent
          });
          this.scores = this.scores.slice(0, 10); // Keep only 10 scores (top 10)
          return this.restInCloudApi.putVar(environment.restincloud_api_scores_key, JSON.stringify(this.scores)).then((value) => {
            console.log("Score sent to server: " + value.code);
            return {code: "success", result: this.scores};
          });
        });
      }else {
        return {code: "success", result: this.scores};
      }
    })
  }

  private getRank(duration) {
    let rank = 1;
    for (const score of this.scores) {
      if (duration > score.duration) {
        break;
      }
      rank++;
    }
    return rank;
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

  private getClientIp() {
    return new Promise<any>((resolve, reject) => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            let data = JSON.parse(xhttp.responseText);
            resolve(data);
          }else {
            reject();
          }
        }
      };
      xhttp.open("GET", "//api.ipstack.com/check?access_key=5f3d4ae4b4dceb19f4300c139e4a73d7", true);
      xhttp.send();
    });
  }


  onLeave(): void {

  }

  update(delta: number) {
    super.update(delta);
    if (this.player && this.player.alive) {
      this.player.movementSpeedX = this.mouseMovement.x > 0 ? BALLS_SPEED.MIN : -BALLS_SPEED.MIN;
      this.player.movementSpeedY = this.mouseMovement.y > 0 ? BALLS_SPEED.MIN : -BALLS_SPEED.MIN;
      this.elapsedMs += delta;
      this.timerLabel.text = this.formatMilliseconds(this.elapsedMs, true) + " | " + this.ennemies.length + " BALLS";
    }
    if (this.player && !this.player.alive && this.board.entities.indexOf(this.player) > -1) {
      this.player.speedY += 5;
      for (const ennemy of this.ennemies) {
        ennemy.speedY += 5;
      }

      if (this.player && !this.player.alive && Plateform.deviceType() === "mobile" && this.board.height < screen.height) {
        this.board.height += (screen.height - this.board.height)/50;
      }
    }
  }

  private static random(min, max) {
    return Math.floor(Math.random() * max) + min
  }
}