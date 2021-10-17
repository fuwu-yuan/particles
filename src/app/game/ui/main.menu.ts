import {Board, Entities} from '@fuwu-yuan/bgew';
import {Button1, Circle, UIColor} from './ui.pieces';

const BUTTONS_WIDTH = 317;
const BUTTONS_HEIGHT = 69;
const CIRCLE_SIZE = 78;

export class MainMenu extends Entities.Container {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }


  init(board: Board): void {
    super.init(board);

    this.initTitle();
    this.initSinglePlayerButton();
    this.initMultiplayerButton();
    this.initOptionsButton();
    this.initSocialButtons();
  }

  private initTitle(): void {
    const title = new Entities.Label(0, 100, 'Don\'t touch red balls', this.board.ctx);
    title.fontColor = 'white';
    title.fontFamily = 'KenvectorFutureRegular';
    title.fontSize = 50;
    title.x = 75;
    this.addEntity(title);
  }

  private initSinglePlayerButton(): void {
    const button = new Button1(0, 0, BUTTONS_WIDTH, BUTTONS_HEIGHT, UIColor.BLUE,
      { text: 'Singleplayer', fontSize: 30, fontColor: 'white', fontFamily: 'KenvectorFutureRegular' });
    const container = new Entities.Container(this.width / 2 - BUTTONS_WIDTH / 2, 275, BUTTONS_WIDTH, BUTTONS_HEIGHT, [button]);
    this.addEntity(container);
    button.onMouseEvent('click', () => {
      this.board.moveToStep('singleplayer');
    }, {once: false});
    button.onMouseEvent('mouseenter', () => {
      console.log("enter");
      button.zoom = 1.05;
    });
    button.onMouseEvent('mouseleave', () => {
      console.log("leave");
      button.zoom = 1;
    });
    button.onMouseEvent('mousemove', () => {
      console.log("move");
    });
  }

  private initMultiplayerButton(): void {
    const button = new Button1(0, 0, BUTTONS_WIDTH, BUTTONS_HEIGHT, UIColor.BLUE,
      { text: 'Multiplayer', fontSize: 30, fontColor: 'white', fontFamily: 'KenvectorFutureRegular' });
    const container = new Entities.Container(this.width / 2 - BUTTONS_WIDTH / 2, 415, BUTTONS_WIDTH, BUTTONS_HEIGHT, [button]);
    this.addEntity(container);
    button.onMouseEvent('click', () => {
      this.board.moveToStep('multiplayer');
    }, {once: false});
  }

  private initOptionsButton(): void {
    const button = new Button1(0, 0, BUTTONS_WIDTH, BUTTONS_HEIGHT, UIColor.BLUE,
      { text: 'Options', fontSize: 30, fontColor: 'white', fontFamily: 'KenvectorFutureRegular' });
    const container = new Entities.Container(this.width / 2 - BUTTONS_WIDTH / 2, 555, BUTTONS_WIDTH, BUTTONS_HEIGHT, [button]);
    this.addEntity(container);
    button.onMouseEvent('click', () => {
      this.board.moveToStep('options');
    }, {once: false});
  }

  private initSocialButtons(): void {
    // Social center
    const button1 = new Circle(0, 0, CIRCLE_SIZE, CIRCLE_SIZE, UIColor.BLUE);
    const container1 = new Entities.Container(this.width / 2 - CIRCLE_SIZE / 2, 695, CIRCLE_SIZE, CIRCLE_SIZE, [button1]);
    this.addEntity(container1);
    // Social left
    const button2 = new Circle(0, 0, CIRCLE_SIZE, CIRCLE_SIZE, UIColor.BLUE);
    const container2 = new Entities.Container(container1.x - CIRCLE_SIZE - 42, 695, CIRCLE_SIZE, CIRCLE_SIZE, [button2]);
    this.addEntity(container2);
    // Social right
    const button3 = new Circle(0, 0, CIRCLE_SIZE, CIRCLE_SIZE, UIColor.BLUE);
    const container3 = new Entities.Container(container1.x + CIRCLE_SIZE + 42, 695, CIRCLE_SIZE, CIRCLE_SIZE, [button3]);
    this.addEntity(container3);
  }
}
