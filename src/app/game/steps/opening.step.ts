import {GameStep, Board, Entities} from '@fuwu-yuan/bgew';
import {MainMenu} from '../ui/main.menu';

export class OpeningStep extends GameStep {

  name = 'opening';

  constructor(board: Board) {
    super(board);
  }

  onEnter(data: any): void {
    this.addOpeningScreen();
  }

  addOpeningScreen(): void {
    // Opening image
    const opening = new Entities.Image('./assets/splashscreens/desktop_splash.jpg', 0, 0, this.board.width, this.board.height);
    opening.onMouseEvent('click', () => {
      this.board.moveToStep('main', {}, {color: 'black', duration: 500});
    }, {once: true});
    this.board.addEntity(opening);
  }

  onLeave(): void {
  }
}
