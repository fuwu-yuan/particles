import {Component, OnInit} from '@angular/core';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import {version, repository, name, author, keywords, description, config} from '../../package.json';
import {Meta, Title} from '@angular/platform-browser';
import {Board} from "@fuwu-yuan/bgew";
import {BouncingBallStep} from "./bouncing-ball/bouncing-ball.step";

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
    // Title
    this.initMeta();
    // Author
    this.meta.addTag({name:'author', content: author});
    // Keywords
    this.meta.addTag({name:'keyword', content: keywords.join(", ")});
    // Description
    this.meta.addTag({name:'description', content: description});
    // og:title
    this.meta.addTag({property:'og:title', content: this.title});
    // og:description
    this.meta.addTag({property:'og:description', content: description});
    // og:image
    this.meta.addTag({property: 'og:image', content: window.location.origin + config.deployuri + "/assets/og/image.jpg"});
    this.meta.addTag({property: 'og:image:type', content: "image/jpg"});
    this.meta.addTag({property: 'og:image:width', content: "1200"});
    this.meta.addTag({property: 'og:image:height', content: "627"});
    this.meta.addTag({property: 'og:image:alt', content: "Particles game screenshot"});
  }

  private initMeta() {
    this.metatitle.setTitle(this.title);

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
