import {Component, OnInit} from '@angular/core';
import {Board} from "@fuwu-yuan/bgew";
import {BouncingBallStep} from "./bouncing-ball/bouncing-ball.step";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'particles';

  ngOnInit(): void {
    let board = new Board("Particles", "1.0.0", 900, 900, document.getElementById("game-container"), "#FFF");
    board.config.game.FPS = 60;
    board.debug.stats = true;
    board.debug.collision = false;
    let bouncingBallStep = new BouncingBallStep(board);

    board.addStep(bouncingBallStep);

    board.step = bouncingBallStep;
    board.start();
  }

}
