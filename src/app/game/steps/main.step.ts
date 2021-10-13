import {GameStep, Board} from "@fuwu-yuan/bgew"

export class MainStep extends GameStep {

  name: string = "main";

  constructor(board: Board) {
    super(board);
  }

  onEnter(data: any): void {
  }

  onLeave(): void {
  }

}
