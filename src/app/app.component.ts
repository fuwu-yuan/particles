import {Component, OnInit} from '@angular/core';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import {version, repository, name} from '../../package.json';
import {Board} from "@fuwu-yuan/bgew";
import {BouncingBallStep} from "./bouncing-ball/bouncing-ball.step";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Particles';
  currentYear: number = new Date().getFullYear();
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faMailBulk = faMailBulk;
  name = name;
  sources = repository.url;

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
