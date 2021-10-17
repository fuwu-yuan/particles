import {GameStep, Board, Entities} from '@fuwu-yuan/bgew';
import {MainMenu} from '../ui/main.menu';

export class MainStep extends GameStep {

  name = 'main';
  private background: Entities.Video;
  private overlay: Entities.Rectangle;
  private mainMenu: MainMenu;

  constructor(board: Board) {
    super(board);
    this.background = new Entities.Video(
      './assets/bouncing-ball/videos/mainmenu_background.mp4',
      0,
      0,
      this.board.width,
      this.board.height);
    this.background.mute();
    this.overlay = new Entities.Rectangle(0, 0, this.board.width, this.board.height,
      'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.5)');
    this.mainMenu = new MainMenu(0, 0, this.board.width, this.board.height);
  }

  onEnter(data: any): void {
    this.board.addEntity(this.background);
    this.board.addEntity(this.overlay);
    this.board.addEntity(this.mainMenu);
  }

  onLeave(): void {
  }
}
