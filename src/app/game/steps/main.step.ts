import {GameStep, Board, Entities} from '@fuwu-yuan/bgew';
import {MainMenu} from '../ui/main.menu';

export class MainStep extends GameStep {

  name = 'main';

  constructor(board: Board) {
    super(board);
  }

  onEnter(data: any): void {
    const background = new Entities.Video(
      './assets/bouncing-ball/videos/mainmenu_background.mp4',
      0,
      0,
      this.board.width,
      this.board.height);
    const overlay = new Entities.Rectangle(0, 0, this.board.width, this.board.height,
      'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.5)');
    const mainMenu = new MainMenu(0, 0, this.board.width, this.board.height);
    this.board.addEntity(background);
    this.board.addEntity(overlay);
    this.board.addEntity(mainMenu);
  }

  onLeave(): void {
  }

}
