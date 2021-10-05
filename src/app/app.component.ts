import {Component, OnInit} from '@angular/core';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import {version, repository, name, author, keywords, description, config} from '../../package.json';
import {Meta, Title} from '@angular/platform-browser';
import {Board} from "@fuwu-yuan/bgew";
import {BouncingBallStep} from "./bouncing-ball/bouncing-ball.step";
import {environment} from "../environments/environment"

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

  constructor(private metatitle: Title, private meta: Meta) {
    if (environment.production) {
      console.log = () => {}; // Silent is gold
    }
    this.initMeta();
    this.initOffline();
  }

  private initOffline() {
    window.addEventListener("load", () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
      }
    });
  }

  private initMeta() {
    // Title
    this.metatitle.setTitle(this.title);
    // Author
    this.meta.updateTag({name:'author', content: author});
    // Keywords
    this.meta.updateTag({name:'keyword', content: keywords.join(", ")});
    // Description
    this.meta.updateTag({name:'description', content: description});
    // og:title
    this.meta.updateTag({property:'og:title', content: this.title});
    // og:description
    this.meta.updateTag({property:'og:description', content: description});
    // og:image
    this.meta.updateTag({property: 'og:image', content: window.location.origin + config.deployuri + "/assets/og/image.jpg"});
    this.meta.updateTag({property: 'og:image:type', content: "image/jpg"});
    this.meta.updateTag({property: 'og:image:width', content: "1200"});
    this.meta.updateTag({property: 'og:image:height', content: "627"});
    this.meta.updateTag({property: 'og:image:alt', content: "Particles game screenshot"});

  }

  ngOnInit(): void {
    let board = new Board("Particles", "1.0.0", 900, 900, document.getElementById("game-container"), "#FFF");
    board.config.game.FPS = 60;
    board.debug.stats = false;
    board.debug.collision = false;
    let bouncingBallStep = new BouncingBallStep(board);

    board.addStep(bouncingBallStep);

    board.step = bouncingBallStep;
    board.start();
  }

  getNameAndVersion() {
    return `${this.title} v${version}`;
  }

}
