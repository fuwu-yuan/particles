import {Board, Entities, GameStep, Timer} from '@fuwu-yuan/bgew';
import {Player} from './player';
import {Ennemy} from './ennemy';
import {Wall} from './wall';
import {GameDataService} from 'restincloud-node';
import {Score} from './score';
import {environment} from '../../environments/environment';
import {Ball} from './Ball';
import {Plateform} from '../helpers/plateform';
import {AppComponent} from '../app.component';

const DEFAULT_CANVAS_SIZE = {
  WIDTH: 900,
  HEIGHT: 900
};

const INSTAGRAM = 'https://www.instagram.com/dev.stevecohen';

const DEFAULT_WALL_WIDTH = 10;
const DEFAULT_BALLS_RADIUS = 20;
const DEFAULT_BALL_START_TIMER = 3; // ms
const DEFAULT_BALLS_SPEED = { MIN: 100, MAX: 300};
const DEFAULT_NEW_BALL_TIMER = 10; // seconds
const DEFAULT_MAX_ENNEMIES = 25;

let WALL_WIDTH = DEFAULT_WALL_WIDTH;
let BALLS_RADIUS = DEFAULT_BALLS_RADIUS;
const BALL_START_TIMER = DEFAULT_BALL_START_TIMER;
const BALLS_SPEED = Object.assign({}, DEFAULT_BALLS_SPEED);
const NEW_BALL_TIMER = DEFAULT_NEW_BALL_TIMER;
const MAX_ENNEMIES = DEFAULT_MAX_ENNEMIES;

export class BouncingBallStep extends GameStep {

  name = 'particles';
  private walls: Wall[];
  private player?: Player;
  private ennemies: Ennemy[] = [];
  private newEnnemyTimer: Timer;
  private elapsedMs = 0;
  private timerLabel: Entities.Label;
  private gameDataService: GameDataService;
  private scores?: Score[] = [];
  private bestScore: Entities.Label;
  private mouseMovement: {x: number, y: number} = {x: 0, y: 0};
  private previousTouch: Touch;
  private tuto: Entities.Image;
  private hideTuto: boolean = false;
  private leaderboardName: string;
  private apiScoreKey = environment.restincloud_api_scores_key;

  constructor(board: Board) {
    super(board);

    this.leaderboardName = 'desktop';

    // Mobile/tablet fullscreen resize
    if (Plateform.isTouchScreen()) {
      this.leaderboardName = 'mobile';
      this.updateRatio();
    }

    const params = new URLSearchParams(window.location.search);
    const leaderboardParam = params.get('leaderboard') || params.get('lb');
    if (leaderboardParam) {
      const isValid = /^[a-zA-Z0-9_-]+$/.test(leaderboardParam);
      if (isValid) {
        this.leaderboardName = leaderboardParam;
      } else {
        alert('Invalid leaderboard name: ' + leaderboardParam + '. Please use only letters, numbers, dashes and underscores. Using default leaderboard.');
      }
    }

    this.apiScoreKey = this.apiScoreKey + '-' + this.leaderboardName;

    this.walls = [
      // Left
      new Wall(-WALL_WIDTH, -WALL_WIDTH, WALL_WIDTH * 2, board.height + 2 * WALL_WIDTH, '#173F5F', '#173F5F'),
      // Top
      new Wall(-WALL_WIDTH, -WALL_WIDTH, board.width + 2 * WALL_WIDTH, WALL_WIDTH * 2, '#173F5F', '#173F5F'),
      // Right
      new Wall(board.width - WALL_WIDTH, -WALL_WIDTH, WALL_WIDTH * 2, board.height + WALL_WIDTH * 2, '#173F5F', '#173F5F'),
      // Bottom
      new Wall(-WALL_WIDTH, board.height - WALL_WIDTH, board.width + WALL_WIDTH * 2, WALL_WIDTH * 2, '#173F5F', '#173F5F')
    ];
    // Timer
    this.timerLabel = new Entities.Label(20, 20, '00:00:00', board.ctx);
    this.timerLabel.fontSize = 15;

    // Sounds
    this.board.registerSound('music', './assets/bouncing-ball/sounds/music.mp3', true, 0.1);
    this.board.registerSound('wall', './assets/bouncing-ball/sounds/wall.mp3', false, 0.7);
    this.board.registerSound('ball', './assets/bouncing-ball/sounds/ball.mp3', false, 0.7);

    this.gameDataService = new GameDataService(environment.restincloud_api_token);
    this.bestScore = new Entities.Label(0, 20, '', board.ctx);
    this.bestScore.fontSize = 15;
    this.board.addEntity(this.bestScore);
    this.updateScores().then(() => { this.updateBest(); });
  }

  private static random(min, max): number {
    return Math.floor(Math.random() * max) + min;
  }

  updateRatio(): void {
    this.board.width = screen.width;

    const ratio = this.board.width / DEFAULT_CANVAS_SIZE.WIDTH;

    this.board.height = DEFAULT_CANVAS_SIZE.HEIGHT * ratio;
    WALL_WIDTH = DEFAULT_WALL_WIDTH * ratio;
    BALLS_RADIUS = DEFAULT_BALLS_RADIUS * ratio;
    BALLS_SPEED.MAX = DEFAULT_BALLS_SPEED.MAX * ratio;
    BALLS_SPEED.MIN = DEFAULT_BALLS_SPEED.MIN * ratio;
  }

  onEnter(data: any): void {

    const btnSize = { width: this.board.width / 3, height: 75};
    if (Plateform.isTouchScreen()) {
      btnSize.width = this.board.width / 2;
    }
    const start = new Entities.Button(
      this.board.width / 2 - btnSize.width / 2,
      this.board.height / 2 - btnSize.height / 2,
      btnSize.width,
      btnSize.height,
      'CLICK TO START');
    start.hoverFillColor = 'black';
    start.hoverStrokeColor = 'white';
    start.hoverFontColor = 'white';
    start.onMouseEvent('click', () => {
      this.board.removeEntity(start);
      this.start();
      AppComponent.angulartics2.eventTrack.next({
        action: 'start',
        properties: { category: 'InGame' }
      });
    });
    this.board.addEntity(start);
    this.onVisibilityChange((visible) => {
      if (visible === false) {
        this.board.pause();
      }else {
        this.board.resume();
      }
    });
  }

  onVisibilityChange(callback: (visible: boolean) => void): void {
    let visible = true;
    if (!callback) {
      throw new Error('no callback given');
    }
    function focused(): void {
      if (!visible) {
        callback(visible = true);
      }
    }
    function unfocused(): void {
      if (visible) {
        callback(visible = false);
      }
    }
    // Standards:
    if ('hidden' in document) {
      visible = !document.hidden;
      document.addEventListener('visibilitychange',
        () => {(document.hidden ? unfocused : focused)(); });
    }
    if ('mozHidden' in document) {
      // @ts-ignore
      visible = !document.mozHidden;
      // @ts-ignore
      document.addEventListener('mozvisibilitychange',
        // @ts-ignore
        () => {(document.mozHidden ? unfocused : focused)(); });
    }
    if ('webkitHidden' in document) {
      // @ts-ignore
      visible = !document.webkitHidden;
      // @ts-ignore
      document.addEventListener('webkitvisibilitychange',
        // @ts-ignore
        () => {(document.webkitHidden ? unfocused : focused)(); });
    }
    if ('msHidden' in document) {
      // @ts-ignore
      visible = !document.msHidden;
      // @ts-ignore
      document.addEventListener('msvisibilitychange',
        // @ts-ignore
        () => {(document.msHidden ? unfocused : focused)(); });
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
      // @ts-ignore
      document.onfocusin = focused;
      // @ts-ignore
      document.onfocusout = unfocused;
    }
    // All others:
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
  }

  start(): void {
    if (Plateform.isTouchScreen()) {
      this.updateRatio();
    }
    this.board.addEntities(this.walls);

    this.board.changeCursor('none');
    this.ennemies = [];
    this.board.playSound('music');

    this.createPlayerBall();
    this.addEnnemy();
    this.addEnnemy();
    this.addEnnemy();
    this.newEnnemyTimer = this.board.addTimer(NEW_BALL_TIMER * 1000, () => {
      this.addEnnemy();
      if (this.ennemies.length === MAX_ENNEMIES) {
        this.newEnnemyTimer.stop();
      }
    }, true);
    this.elapsedMs = 0;
    this.board.addEntity(this.timerLabel);

    if (Plateform.isTouchScreen()) {
      this.bestScore.text = '';
    }
  }

  private createPlayerBall(): void {
    this.player = new Player(this.board.width / 2, this.board.height / 2, BALLS_RADIUS);
    this.player.alive = true;
    this.tuto = new Entities.Image('assets/bouncing-ball/images/tuto-' + (Plateform.isTouchScreen() ? 'touch' : 'mouse') + '.png',
      3 * this.board.width / 8,
      this.board.height / 2 - this.board.width / 8,
      this.board.width / 4,
      this.board.width / 4
    );
    if (Plateform.isTouchScreen()) {
      this.tuto.y += this.tuto.height * 31 / 100;
    }
    this.hideTuto = false;
    this.board.addTimer(3000, () => {
      this.hideTuto = true;
    });

    const playerInputMove = (x: number, y: number) => {
      x = x < WALL_WIDTH ? WALL_WIDTH : x;
      x = x > this.board.width - WALL_WIDTH ? this.board.width - WALL_WIDTH : x;
      y = y < WALL_WIDTH ? WALL_WIDTH : y;
      y = y > this.board.height - WALL_WIDTH ? this.board.height - WALL_WIDTH : y;
      if (this.player.alive) {
        this.player.x = x;
        this.player.y = y;
      }
    };

    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!Plateform.isTouchScreen()) {
        const rect = this.board.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (1 / this.board.scale);
        const y = (event.clientY - rect.top) * (1 / this.board.scale);
        playerInputMove(x, y);
      }
    });

    document.addEventListener('touchmove', (event: TouchEvent) => {
      if (this.previousTouch) {
        const movementX = (event.touches.item(0).pageX - this.previousTouch.pageX) * 1.5; // x1.5 to speed up touch movement
        const movementY = (event.touches.item(0).pageY - this.previousTouch.pageY) * 1.5;
        const x = this.player.x + movementX;
        const y = this.player.y + movementY;
        playerInputMove(x, y);
      }
      this.previousTouch = event.touches.item(0);
    });

    document.addEventListener('touchend', () => {
      this.previousTouch = null;
    });

    /*this.board.onMouseEvent('mousemove', (event, x, y) => {
      if (!Plateform.isTouchScreen()) {
        console.log("mousemove");
        this.mouseMovement.x = event.movementX;
        this.mouseMovement.y = event.movementY;
        if (this.player.alive && x > WALL_WIDTH && y > WALL_WIDTH) {
          this.player.x = x;
          this.player.y = y;
        }
      }
    });*/
    this.board.onMouseEvent('mouseenter', () => {
      if (this.player.alive) {
        this.board.changeCursor('none');
      }
    });
    this.board.onMouseEvent('mouseleave', () => {
      this.board.changeCursor('default');
    });

    this.board.addEntity(this.player);
    this.board.addEntity(this.tuto);
  }

  addEnnemy(x?: number, y?: number, speed?: number, angle?: number): Ennemy {
    const ennemy = new Ennemy(
      x || BouncingBallStep.random(WALL_WIDTH + BALLS_RADIUS + 10, this.board.width - BALLS_RADIUS - WALL_WIDTH - 50),
      y || BouncingBallStep.random(WALL_WIDTH + BALLS_RADIUS + 10, this.board.height - BALLS_RADIUS - WALL_WIDTH - 50),
      BALLS_RADIUS);
    ennemy.stopped = true;
    this.board.addTimer(BALL_START_TIMER * 1000, () => {
      ennemy.setSpeedWithAngle(
        speed || BouncingBallStep.random(BALLS_SPEED.MIN, BALLS_SPEED.MAX),
        angle || BouncingBallStep.random(0, 359), true
      );
      ennemy.stopped = false;
      console.log('New ball added: ', {
        angle: ennemy.angle, degrees: ennemy.angleInDegrees, speed: ennemy.speed, speedX: ennemy.speedX, speedY: ennemy.speedY
      });
    }, false);
    // Check ball collision
    ennemy.onIntersectWithAnyEntity((entity, collisionWith, result) => {
      // Wall collison
      if (collisionWith instanceof Wall) {
        if (this.player.alive) {
          ennemy.collisionWithWall(collisionWith as Wall, result);
        }
      }
      // Other ennemy collision
      if (collisionWith instanceof Ennemy) {
        if (!ennemy.stopped && !collisionWith.stopped) {
          ennemy.collisionWithBall(collisionWith as Ball, result);
        }
      }
      // Player collision
      if (collisionWith instanceof Player && this.player.alive) {
        if (ennemy.stopped === false) {
          ennemy.collisionWithBall(collisionWith as Ball, result);
          this.playerLoose();
        }
      }
    });
    this.board.addEntity(ennemy);
    this.ennemies.push(ennemy);
    return ennemy;
  }

  private playerLoose(): void {
    this.board.stopSound('music', true, 2000);
    this.player.alive = false;
    this.board.removeEntities(this.walls);
    /*this.player.angleInDegrees = 90;
    for (const ennemy of this.ennemies) {
      ennemy.angleInDegrees = 90;
    }*/
    this.newEnnemyTimer.stop();
    this.board.addTimer(3000, () => {
      this.board.changeCursor('default');
      this.timerLabel.text = '';
      // TOP 10
      const top10Container = new Entities.Container(0, 0, this.board.width, this.board.height / 3 * 2);
      const bottomPart = new Entities.Container(0, top10Container.y + top10Container.height, this.board.width, this.board.height / 3);
      top10Container.addEntity(new Entities.Rectangle(0, 0, top10Container.width, top10Container.height, 'black', 'transparent'));
      const top10Title = new Entities.Label(0, 50, 'LEADERBOARD' + ' (' + this.leaderboardName.toUpperCase() + ')', this.board.ctx);
      top10Title.fontSize = 30;
      top10Title.x = top10Container.width / 2 - top10Title.width / 2;
      top10Container.addEntity(top10Title);

      AppComponent.angulartics2.eventTrack.next({
        action: 'loose',
        properties: {
          category: 'InGame',
          time: this.elapsedMs,
          ennemies: this.ennemies.length,
        },
      });
      this.addScore(this.elapsedMs, this.ennemies.length).then(() => {
        const maxNameLength = Math.max(
          ...this.scores.map(s => s.name.slice(0, 10).length)
        );

        const maxDeviceLength = Math.max(
          ...this.scores.map(s => Plateform.deviceName(s.user_agent).length)
        );
        const top10values = this.scores.map((s: Score) => {
          return this.generateLeaderboardLine(s, maxNameLength, maxDeviceLength);
        });
        let firstLabel = null;
        const medals = ['🥇 ', '🥈 ', '🥉 ', '4. ', '5. ', '6. ', '7. ', '8. ', '9. ', '10. '];
        for (let i = 0; i < top10values.length; i++) {
          const top10Label = new Entities.Label(
            10,
            top10Title.y + top10Title.height + 50 + 30 * i,
            medals[i] + top10values[i],
            this.board.ctx)
          ;
          if (Plateform.isTouchScreen()) {
            top10Label.fontSize = 15;
          }
          top10Label.fontFamily = '\'Courier New\', Courier, monospace';
          top10Label.x = this.board.width / 2 - top10Label.width / 2;
          if (firstLabel) { top10Label.x = firstLabel.x; }
          top10Container.addEntity(top10Label);
          if (firstLabel === null) { firstLabel = top10Label; }
        }
        this.updateBest();
        this.board.addEntity(top10Container);
      });

      // RESTART
      const btnSize = { width: 200, height: 50 };
      const restart = new Entities.Button(
        bottomPart.width / 2 - btnSize.width / 2,
        bottomPart.height / 3 * 2 - btnSize.height / 2 - 20,
        btnSize.width,
        btnSize.height,
        'Try again'
      );
      restart.hoverFillColor = 'black';
      restart.hoverStrokeColor = 'white';
      restart.hoverFontColor = 'white';
      restart.onMouseEvent('click', () => {
        this.board.removeEntities([bottomPart, top10Container]);
        this.board.removeEntity(this.player);
        for (const ennemy of this.ennemies) {
          this.board.removeEntity(ennemy);
        }
        this.start();
        AppComponent.angulartics2.eventTrack.next({
          action: 'restart',
          properties: { category: 'InGame' }
        });
      });
      bottomPart.addEntity(restart);

      // Instagram
      const insta = new Entities.Image('assets/bouncing-ball/images/instagram.png',
        restart.x, restart.y + restart.height + 20, restart.width, 247 * (restart.width / 750));
      insta.onMouseEvent('click', () => {
        AppComponent.angulartics2.eventTrack.next({
          action: 'instagram',
          properties: { category: 'InGame' }
        });
        this.openInNewTab(INSTAGRAM);
      });
      bottomPart.addEntity(insta);
      // SCORE
      const score = new Entities.Label(0, 0, 'Score: ' +
        this.formatMilliseconds(this.elapsedMs) + ' | ' + this.ennemies.length + ' ENNEMIES', this.board.ctx);
      score.fontSize = 25;
      score.x = bottomPart.width / 2 - score.width / 2;
      score.y = bottomPart.height / 3 - btnSize.height / 2;
      bottomPart.addEntity(score);

      this.board.addEntity(bottomPart);
    }, false);
  }

  public openInNewTab(href): void {
    Object.assign(document.createElement('a'), {
      target: '_blank',
      href,
    }).click();
  }

  private updateScores(): Promise<void> {
    return this.gameDataService.get(this.apiScoreKey)
      .then((result) => {
        console.log(result);
        if (result.status === 'success' && result.response.value) {
          this.scores = JSON.parse(result.response.value);
          this.scores = this.scores.sort((a, b) => {
            return b.duration - a.duration;
          });
          console.log('Scores updated: ', this.scores);
        }else {
          this.scores = [];
          console.log('Fail to get scores: ', result.response);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  private updateBest(): void {
    if (this.scores.length > 0) {
      const s = this.scores[0];
      this.bestScore.text = '🥇 ' + `[${s.name}] ${this.formatMilliseconds(s.duration)} | ${s.balls} ENNEMIES`;
      this.bestScore.x = this.board.width - this.bestScore.width - 20;
    }
  }

  // tslint:disable-next-line:typedef
  private async addScore(time: number, balls: number) {
    console.log('Adding score: ', {time, balls});
    await this.updateScores();
    const rank = this.getRank(time);
    console.log('Player rank: ' + rank);
    if (this.scores !== null && rank <= 10) {
      AppComponent.angulartics2.eventTrack.next({
        action: 'top10',
        properties: {
          label: 'newtop10',
          category: 'InGame'
        },
      });
      let name = window.prompt('Congratulation, you are in TOP 10 ! Enter your name (10 characters max) :', '');
      if (name === '' || name === null) {
        AppComponent.angulartics2.eventTrack.next({
          action: 'top10',
          properties: {
            label: 'undo',
            category: 'InGame'
          },
        });
        return;
      }
      name = name.trim().slice(0, 10);
      return this.getClientIp().then((ip: any) => {
        // console.log("ip: ", ip);
        this.scores.splice(rank - 1, 0, {
          balls,
          timestamp: (new Date()).getMilliseconds(),
          duration: time,
          // ip: ip.ip,
          name,
          user_agent: navigator.userAgent
        });
        this.scores = this.scores.slice(0, 10); // Keep only 10 scores (top 10)
        this.gameDataService.set(this.apiScoreKey, JSON.stringify(this.scores)).then((result) => {
          if (result.status === 'success') {
            console.log('Score sent to server');
          } else {
            console.log('Error while sending score to server');
          }
        });
        return {code: 'success', result: this.scores};
      });
    } else {
      return {code: 'success', result: this.scores};
    }
  }

  private getRank(duration): number {
    let rank = 1;
    for (const score of this.scores) {
      if (duration > score.duration) {
        break;
      }
      rank++;
    }
    return rank;
  }

  private generateLeaderboardLine(s: Score, maxNameLen: number, maxDeviceLen: number): string {
    const padLeft = (str: string | number, length: number) => {
      return str.toString().padStart(length, ' ');
    };

    const padRight = (str: string | number, length: number) => {
      return str.toString().padEnd(length, ' ');
    };

    const name = padRight(s.name.slice(0, 10), maxNameLen);
    const time = padLeft(this.formatMilliseconds(s.duration), 9);
    const device = padRight(Plateform.deviceName(s.user_agent), maxDeviceLen);
    const balls = padLeft(s.balls, 3);

    return `${name} ${time} (${device}) | ${balls} ENNEMIES`;
  }

  private formatMilliseconds(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(2);
    return `${minutes}:${seconds.padStart(5, '0')}`; // ex: "1:03.45"
  }

  private getClientIp(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      /*const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(): void {
        if (this.readyState === 4) {
          if (this.status === 200) {
            const data = JSON.parse(xhttp.responseText);
            resolve(data);
          }else {
            reject();
          }
        }
      };
      xhttp.open('GET', '//api.ipstack.com/check?access_key=5f3d4ae4b4dceb19f4300c139e4a73d7', true);
      xhttp.send();*/
      resolve();
    });
  }


  onLeave(): void {

  }

  update(delta: number): void {
    super.update(delta);
    if (this.player && this.player.alive) {
      this.player.movementSpeedX = this.mouseMovement.x > 0 ? BALLS_SPEED.MIN : -BALLS_SPEED.MIN;
      this.player.movementSpeedY = this.mouseMovement.y > 0 ? BALLS_SPEED.MIN : -BALLS_SPEED.MIN;
      this.elapsedMs += delta;
      this.timerLabel.text = this.formatMilliseconds(this.elapsedMs) + ' | ' + this.ennemies.length + ' BALLS';
    }
    if (this.player && !this.player.alive && this.board.entities.indexOf(this.player) > -1) {
      this.player.speedY += 5;
      for (const ennemy of this.ennemies) {
        ennemy.speedY += 5;
      }

      if (this.player && !this.player.alive && Plateform.isTouchScreen() && this.board.height < screen.height) {
        this.board.height += (screen.height - this.board.height) / 50;
      }
    }

    if (this.hideTuto === true) {
      this.tuto.opacity -= 1 / (1000 / delta);
      if (this.tuto.opacity <= 0) {
        this.tuto.opacity = 0;
        this.hideTuto = false;
        this.board.removeEntity(this.tuto);
      }
    }
  }
}
