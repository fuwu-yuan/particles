import {Component, OnInit} from '@angular/core';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';
import {version, repository, name, author, keywords, description, config} from '../../package.json';
import {Meta, Title} from '@angular/platform-browser';
import {Board} from '@fuwu-yuan/bgew';
import {SingleplayerStep} from './game/steps/singleplayer.step';
import {environment} from '../environments/environment';
import {Plateform} from './game/helpers/plateform';
import {MainStep} from './game/steps/main.step';
import {OpeningStep} from './game/steps/opening.step';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Particles - Don\'t touch red balls! | BGEW Game';
  currentYear: number = new Date().getFullYear();
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faMailBulk = faMailBulk;
  name = name;
  sources = repository.url;
  images: string[];

  constructor(private metatitle: Title, private meta: Meta) {
    if (environment.production) {
      console.log = () => {}; // Silent is gold
    }
    this.initMeta();
    this.preloadImages();
  }

  private preloadImages(): void {
    this.images = [
      /* Balls */
      'assets/bouncing-ball/images/balls/blue_ball.png',
      'assets/bouncing-ball/images/balls/green_ball.png',
      'assets/bouncing-ball/images/balls/purple_ball.png',
      'assets/bouncing-ball/images/balls/red_ball.png',
      'assets/bouncing-ball/images/balls/yellow_ball.png',
      /* Bonus */
      'assets/bouncing-ball/images/bonus/BigBall.png',
      'assets/bouncing-ball/images/bonus/InvControl.png',
      'assets/bouncing-ball/images/bonus/Invisible.png',
      'assets/bouncing-ball/images/bonus/Invulnerable.png',
      'assets/bouncing-ball/images/bonus/NoBorders.png',
      'assets/bouncing-ball/images/bonus/Random.png',
      'assets/bouncing-ball/images/bonus/Revive.png',
      'assets/bouncing-ball/images/bonus/Rockets.png',
      'assets/bouncing-ball/images/bonus/Shield.png',
      'assets/bouncing-ball/images/bonus/Speed.png',
      /* Opening */
      'assets/splashscreens/desktop_splash.jpg'
    ];
  }

  private initMeta(): void {
    // Title
    this.metatitle.setTitle(this.title);
    // Author
    this.meta.updateTag({name: 'author', content: author});
    // Keywords
    this.meta.updateTag({name: 'keyword', content: keywords.join(', ')});
    // Description
    this.meta.updateTag({name: 'description', content: description});
    // og:title
    this.meta.updateTag({property: 'og:title', content: this.title});
    // og:description
    this.meta.updateTag({property: 'og:description', content: description});
    // og:image
    this.meta.updateTag({property: 'og:image', content: window.location.origin + config.deployuri + '/assets/og/image.jpg'});
    this.meta.updateTag({property: 'og:image:type', content: 'image/jpg'});
    this.meta.updateTag({property: 'og:image:width', content: '1200'});
    this.meta.updateTag({property: 'og:image:height', content: '627'});
    this.meta.updateTag({property: 'og:image:alt', content: 'Particles game screenshot'});

  }

  ngOnInit(): void {
    const board = new Board(name, version, 900, 900, document.getElementById('game-container'), '#FFF');
    board.config.game.FPS = 60;
    board.debug.stats = false;
    board.debug.collision = false;

    const openingStep = new OpeningStep(board);
    const mainStep = new MainStep(board);
    const singleplayerStep = new SingleplayerStep(board);

    board.addSteps([
      openingStep,
      mainStep,
      singleplayerStep
    ]);

    board.step = openingStep;
    board.start();
  }

  getNameAndVersion(): string {
    return `${this.title} v${version}`;
  }

  closeBanner(event: MouseEvent): void {
      event.preventDefault();
      const smartBanner = document.getElementById('smart-banner');
      smartBanner.style.marginTop = (0 - smartBanner.clientHeight) + 'px';
  }

  showInstallHelper(event: MouseEvent): void {
    event.preventDefault();
    const helper = document.querySelector('#pwa-install-helpers .ios') as HTMLElement;
    helper.style.display = 'block';
    this.closeBanner(event);
  }

  closeHelper(event: MouseEvent, plateform: string): void {
    event.preventDefault();
    const helper = document.querySelector('#pwa-install-helpers .' + plateform) as HTMLElement;
    helper.style.display = 'none';
  }

  get isIos(): boolean {
    return ['iPad', 'iPod', 'iPhone'].indexOf(Plateform.deviceName()) > -1;
  }
}
