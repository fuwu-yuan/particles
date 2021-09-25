import {Board, Entities, GameStep, Timer} from '@fuwu-yuan/bgew';
import {Player} from "./player";
import {Ennemy} from "./ennemy";
import {Wall} from "./wall";
import {RestInCloudAPI} from 'restincloud-node';
import {Score} from "./score";
import {environment} from '../../environments/environment';

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
  private restInCloudApi: RestInCloudAPI;
  private scores?: Score[] = [];
  private bestScore;

  constructor(board: Board) {
    super(board);
    //Left
    this.wallLeft = new Wall(-WALL_WIDTH, -WALL_WIDTH, WALL_WIDTH*2, board.height + 2*WALL_WIDTH, "#173F5F", "#173F5F");
    //Top
    this.wallTop = new Wall(-WALL_WIDTH, -WALL_WIDTH, board.width + 2*WALL_WIDTH, WALL_WIDTH*2, "#173F5F", "#173F5F");
    //Right
    this.wallRight = new Wall(board.width - WALL_WIDTH, -WALL_WIDTH, WALL_WIDTH*2, board.height+WALL_WIDTH*2, "#173F5F", "#173F5F");
    //Bottom
    this.wallBottom = new Wall(-WALL_WIDTH, board.height - WALL_WIDTH, board.width+WALL_WIDTH*2, WALL_WIDTH*2, "#173F5F", "#173F5F");

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
    this.player.alive = true;
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
    let ennemy = new Ennemy(BouncingBallStep.random(WALL_WIDTH+BALLS_RADIUS+10, this.board.width - BALLS_RADIUS-WALL_WIDTH-50), BouncingBallStep.random(WALL_WIDTH+BALLS_RADIUS+10, this.board.height - BALLS_RADIUS-WALL_WIDTH-50), BALLS_RADIUS, BALLS_RADIUS, "#ED553B", "#ED553B");
    ennemy.stopped = true;
    this.board.addTimer(BALL_START_TIMER*1000, () => {
      ennemy.setSpeedWithAngle(BouncingBallStep.random(BALLS_SPEED.MIN, BALLS_SPEED.MAX), BouncingBallStep.random(0, 359), true);
      ennemy.stopped = false;
    }, false);
    console.log("New ball added: ", {angle: ennemy.angle, degrees: ennemy.angleInDegrees, speed: ennemy.speed, speedX: ennemy.speedX, speedY: ennemy.speedY});
    // Check ball collision
    ennemy.onIntersectWithAnyEntity((entity, collisionWith, result) => {

      // Wall collison
      if (collisionWith instanceof Wall) {
        if (this.player.alive) {
          console.log("WALL");
          this.board.playSound("wall");
          ennemy.x -= result.overlap * result.overlap_x;
          ennemy.y -= result.overlap * result.overlap_y;
          let dot = ennemy.speedX * result.overlap_y + ennemy.speedY * -result.overlap_x

          ennemy.speedX = 2 * dot * result.overlap_y - ennemy.speedX;
          ennemy.speedY = 2 * dot * -result.overlap_x - ennemy.speedY;
        }
      }

      // Other ennemy collision
      if (collisionWith instanceof Ennemy) {
        if (ennemy.stopped || collisionWith.stopped) return ;
        this.board.playSound("ball");
        ennemy.x -= result.overlap * result.overlap_x;
        ennemy.y -= result.overlap * result.overlap_y;
        let dot = collisionWith.speedX * result.overlap_y + collisionWith.speedY * -result.overlap_x;

        collisionWith.speedX = 2 * dot * result.overlap_y - collisionWith.speedX;
        collisionWith.speedY = 2 * dot * -result.overlap_x - collisionWith.speedY;
      }

      // Player collision
      if (collisionWith instanceof Player && this.player.alive) {
        if (ennemy.stopped === false) {
          this.board.playSound("ball");
          ennemy.x -= result.overlap * result.overlap_x;
          ennemy.y -= result.overlap * result.overlap_y;
          let dot = ennemy.speedX * result.overlap_y + ennemy.speedY * -result.overlap_x

          ennemy.speedX = 2 * dot * result.overlap_y - ennemy.speedX;
          ennemy.speedY = 2 * dot * -result.overlap_x - ennemy.speedY;
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
    /*this.player.angleInDegrees = 90;
    for (const ennemy of this.ennemies) {
      ennemy.angleInDegrees = 90;
    }*/
    this.newEnnemyTimer.stop();
    this.board.addTimer(3000, () => {
      this.board.changeCursor("default");
      this.board.removeEntity(this.player);
      for (const ennemy of this.ennemies) {
        this.board.removeEntity(ennemy);
      }
      this.timerLabel.text = "";
      // TOP 10
      let top10Container = new Entities.Container(0, 0, this.board.width, this.board.height / 3 * 2);
      top10Container.addEntity(new Entities.Rectangle(0, 0, top10Container.width, top10Container.height, "black", "transparent"));
      let top10Title = new Entities.Label(0, 50, "TOP 10", this.board.ctx);
      top10Title.x = top10Container.width / 2 - top10Title.width / 2;
      top10Title.fontSize = 30;
      top10Container.addEntity(top10Title);

      this.addScore(this.elapsedMs, this.ennemies.length).then(() => {
        let top10values = this.scores.map((s: Score) => {
          return `[${s.name}] ${this.formatMilliseconds(s.duration, true)} | ${s.balls} BALLS`;
        });
        let firstLabel = null;
        let medals = ["🥇 ", "🥈 ", "🥉 ", "4. ", "5. ", "6. ", "7. ", "8. ", "9. ", "10. "];
        for (let i = 0; i < top10values.length; i++) {
          let top10Label = new Entities.Label(10, top10Title.y + top10Title.height + 50 + 30*i, medals[i] + top10values[i], this.board.ctx);
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
      let restart = new Entities.Button(this.board.width / 2 - btnSize.width / 2, this.board.height - btnSize.height - 50, btnSize.width, btnSize.height, "Try again");
      restart.hoverFillColor = "black";
      restart.hoverStrokeColor = "white";
      restart.hoverFontColor = "white";
      restart.onMouseEvent("click", () => {
        this.board.removeEntities([score, restart, top10Container]);
        this.start();
      });
      this.board.addEntity(restart);

      // SCORE
      let score = new Entities.Label(0, 0, "Score: " + this.formatMilliseconds(this.elapsedMs, true) + " | " + this.ennemies.length + " BALLS", this.board.ctx);
      score.fontSize = 25;
      score.x = this.board.width / 2 - score.width / 2;
      score.y = restart.y - restart.height - score.height - 50;
      this.board.addEntity(score);
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
          console.log("Scores uodated: ", this.scores);
        }else if (value.code === "not_found") {
          this.scores = [];
        }else {
          this.scores = null;
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
          console.log("ip: ", ip);
          this.scores.splice(rank-1, 0 , {
            balls: balls,
            timestamp: (new Date()).getMilliseconds(),
            duration: time,
            ip: ip.ip,
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
      this.elapsedMs += delta;
      this.timerLabel.text = this.formatMilliseconds(this.elapsedMs, true) + " | " + this.ennemies.length + " BALLS";
    }
    if (this.player && !this.player.alive && this.board.entities.indexOf(this.player) > -1) {
      this.player.speedY += 5;
      for (const ennemy of this.ennemies) {
        ennemy.speedY += 5;
      }
    }
  }

  private static random(min, max) {
    return Math.floor(Math.random() * max) + min
  }
}
