import {Ball} from './Ball';
import {Result} from '@fuwu-yuan/bgew';
import {Wall} from './wall';

const IMAGE = './assets/bouncing-ball/images/balls/red_ball.png';

export class Ennemy extends Ball {

  private _stopped = false;

  constructor(x: number,
              y: number,
              radius) {
    super(x, y, radius, '#ED553B', IMAGE);
  }

  get stopped(): boolean {
    return this._stopped;
  }

  set stopped(value: boolean) {
    this._stopped = value;
  }
}
