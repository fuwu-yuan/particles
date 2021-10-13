import {Bonus} from "./Bonus";
import {Player} from "../player";

export class Shield extends Bonus {
  apply(owner: Player, otherPlayers: Player[]) {
  }

  protected get Image(): string {
    return "./assets/bouncing-ball/images/bonus/Speed.png";
  }

}
