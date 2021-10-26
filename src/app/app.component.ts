import {Component, OnInit} from '@angular/core';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';
import {version, repository, name, author, keywords, description, config} from '../../package.json';
import {Meta, Title} from '@angular/platform-browser';
import {Board} from '@fuwu-yuan/bgew';
import {BouncingBallStep} from './bouncing-ball/bouncing-ball.step';
import {environment} from '../environments/environment';
import {Plateform} from './helpers/plateform';
import { Angulartics2Matomo } from 'angulartics2/matomo';
import {Angulartics2} from 'angulartics2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public static angulartics2Matomo;
  public static angulartics2;

  title = 'Particles - Don\'t touch red balls!';
  gameengine = 'BGEW GameEngine';
  currentYear: number = new Date().getFullYear();
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faMailBulk = faMailBulk;
  name = name;
  sources = repository.url;
  bannerClosed = false;

  constructor(
    private metatitle: Title,
    private meta: Meta,
    private angulartics2Matomo: Angulartics2Matomo,
    private angulartics2: Angulartics2
  ) {
    AppComponent.angulartics2Matomo = angulartics2Matomo;
    AppComponent.angulartics2 = angulartics2;
    if (environment.production) {
      angulartics2Matomo.startTracking();
      console.log = () => {}; // Silent is gold
    }
    this.initMeta();
  }

  private initMeta(): void {
    // Title
    this.metatitle.setTitle(this.title + ' | ' + this.gameengine);
    // Author
    this.meta.updateTag({name: 'author', content: author});
    // Keywords
    this.meta.updateTag({name: 'keyword', content: keywords.join(', ')});
    // Description
    this.meta.updateTag({name: 'description', content: description});
    // og:title
    this.meta.updateTag({property: 'og:title', content: this.title + ' | ' + this.gameengine});
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
    const board = new Board('Particles', '1.0.0', 900, 900, document.getElementById('game-container'), '#FFF');
    board.config.game.FPS = 60;
    board.debug.stats = false;
    board.debug.collision = false;
    const bouncingBallStep = new BouncingBallStep(board);

    board.addStep(bouncingBallStep);

    board.step = bouncingBallStep;
    board.start();

    board.canvas.addEventListener('click', (event: MouseEvent) => {
      if (!this.bannerClosed) {
        this.closeBanner(event);
      }
    }, { once: true });
  }

  getNameAndVersion(): string {
    return `${this.title} v${version}`;
  }

  closeBanner(event: MouseEvent): void {
      event.preventDefault();
      this.bannerClosed = true;
      const smartBanner = document.getElementById('smart-banner');
      smartBanner.style.marginTop = (0 - smartBanner.clientHeight) + 'px';
  }

  showInstallHelper(event: MouseEvent): void {
    event.preventDefault();
    const helper = document.querySelector('#pwa-install-helpers .ios') as HTMLElement;
    helper.style.display = 'block';
    this.closeBanner(event);
    AppComponent.angulartics2.eventTrack.next({
      action: 'show-install-helper',
      properties: { category: 'PWA' }
    });
  }

  closeHelper(event: MouseEvent, plateform: string): void {
    event.preventDefault();
    const helper = document.querySelector('#pwa-install-helpers .' + plateform) as HTMLElement;
    helper.style.display = 'none';
    AppComponent.angulartics2.eventTrack.next({
      action: 'close-install-helper',
      properties: { category: 'PWA' }
    });
  }

  get isIos(): boolean {
    return ['iPhone', 'iPod', 'iPad'].indexOf(Plateform.deviceName()) > -1;
  }

  get deviceName(): string {
    return Plateform.deviceName();
  }

  isTouchScreen(): boolean {
    return Plateform.isTouchScreen();
  }
}
