import {Bonus} from './Bonus';
import {Player} from '../player';

export class Shield extends Bonus {
  apply(owner: Player, otherPlayers: Player[]): void {
  }

  protected get Image(): string {
    return './assets/bouncing-ball/images/bonus/Revive.png';
  }

}
