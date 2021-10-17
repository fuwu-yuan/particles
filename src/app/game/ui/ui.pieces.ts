import {Entities} from '@fuwu-yuan/bgew';

abstract class UiPiece extends Entities.Image {

  protected _sprites = {
    blue: {
      img: document.createElement('img'),
      sheet: {SubTexture: [{'-name': 'blue_boxCheckmark.png', '-x': '380', '-y': '36', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'blue_boxCross.png', '-x': '380', '-y': '0', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'blue_boxTick.png', '-x': '386', '-y': '210', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'blue_button00.png', '-x': '0', '-y': '94', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button01.png', '-x': '190', '-y': '49', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'blue_button02.png', '-x': '190', '-y': '0', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button03.png', '-x': '0', '-y': '49', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'blue_button04.png', '-x': '0', '-y': '0', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button05.png', '-x': '0', '-y': '192', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'blue_button06.png', '-x': '288', '-y': '194', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button07.png', '-x': '239', '-y': '194', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button08.png', '-x': '190', '-y': '194', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'blue_button09.png', '-x': '339', '-y': '94', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button10.png', '-x': '290', '-y': '94', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'blue_button11.png', '-x': '337', '-y': '184', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_button12.png', '-x': '290', '-y': '139', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'blue_button13.png', '-x': '0', '-y': '143', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'blue_checkmark.png', '-x': '337', '-y': '233', '-width': '21', '-height': '20', '-self-closing': 'true'}, {'-name': 'blue_circle.png', '-x': '386', '-y': '174', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'blue_cross.png', '-x': '0', '-y': '237', '-width': '18', '-height': '18', '-self-closing': 'true'}, {'-name': 'blue_panel.png', '-x': '190', '-y': '94', '-width': '100', '-height': '100', '-self-closing': 'true'}, {'-name': 'blue_sliderDown.png', '-x': '416', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'blue_sliderLeft.png', '-x': '339', '-y': '143', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'blue_sliderRight.png', '-x': '378', '-y': '143', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'blue_sliderUp.png', '-x': '388', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'blue_tick.png', '-x': '18', '-y': '239', '-width': '17', '-height': '17', '-self-closing': 'true'}]}
    },
    green: {
      img: document.createElement('img'),
      sheet: {SubTexture: [{'-name': 'green_boxCheckmark.png', '-x': '380', '-y': '0', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'green_boxCross.png', '-x': '380', '-y': '36', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'green_boxTick.png', '-x': '386', '-y': '210', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'green_button00.png', '-x': '0', '-y': '0', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button01.png', '-x': '0', '-y': '49', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'green_button02.png', '-x': '0', '-y': '94', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button03.png', '-x': '0', '-y': '192', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'green_button04.png', '-x': '190', '-y': '0', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button05.png', '-x': '190', '-y': '49', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'green_button06.png', '-x': '337', '-y': '184', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button07.png', '-x': '339', '-y': '94', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button08.png', '-x': '290', '-y': '139', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'green_button09.png', '-x': '190', '-y': '194', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button10.png', '-x': '290', '-y': '94', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'green_button11.png', '-x': '288', '-y': '194', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_button12.png', '-x': '239', '-y': '194', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'green_button13.png', '-x': '0', '-y': '143', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'green_checkmark.png', '-x': '337', '-y': '233', '-width': '21', '-height': '20', '-self-closing': 'true'}, {'-name': 'green_circle.png', '-x': '386', '-y': '174', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'green_cross.png', '-x': '0', '-y': '237', '-width': '18', '-height': '18', '-self-closing': 'true'}, {'-name': 'green_panel.png', '-x': '190', '-y': '94', '-width': '100', '-height': '100', '-self-closing': 'true'}, {'-name': 'green_sliderDown.png', '-x': '388', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'green_sliderLeft.png', '-x': '378', '-y': '143', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'green_sliderRight.png', '-x': '339', '-y': '143', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'green_sliderUp.png', '-x': '416', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'green_tick.png', '-x': '18', '-y': '237', '-width': '17', '-height': '17', '-self-closing': 'true'}]}
    },
    grey: {
      img: document.createElement('img'),
      sheet: {SubTexture: [{'-name': 'grey_arrowDownGrey.png', '-x': '78', '-y': '498', '-width': '15', '-height': '10', '-self-closing': 'true'}, {'-name': 'grey_arrowDownWhite.png', '-x': '123', '-y': '496', '-width': '15', '-height': '10', '-self-closing': 'true'}, {'-name': 'grey_arrowUpGrey.png', '-x': '108', '-y': '498', '-width': '15', '-height': '10', '-self-closing': 'true'}, {'-name': 'grey_arrowUpWhite.png', '-x': '93', '-y': '498', '-width': '15', '-height': '10', '-self-closing': 'true'}, {'-name': 'grey_box.png', '-x': '147', '-y': '433', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'grey_boxCheckmark.png', '-x': '147', '-y': '469', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'grey_boxCross.png', '-x': '185', '-y': '433', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'grey_boxTick.png', '-x': '190', '-y': '198', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'grey_button00.png', '-x': '0', '-y': '143', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'grey_button01.png', '-x': '0', '-y': '188', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button02.png', '-x': '0', '-y': '98', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'grey_button03.png', '-x': '0', '-y': '331', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button04.png', '-x': '0', '-y': '286', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'grey_button05.png', '-x': '0', '-y': '0', '-width': '195', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button06.png', '-x': '0', '-y': '49', '-width': '191', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button07.png', '-x': '195', '-y': '0', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button08.png', '-x': '240', '-y': '49', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button09.png', '-x': '98', '-y': '433', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'grey_button10.png', '-x': '191', '-y': '49', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button11.png', '-x': '0', '-y': '433', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'grey_button12.png', '-x': '244', '-y': '0', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button13.png', '-x': '49', '-y': '433', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'grey_button14.png', '-x': '0', '-y': '384', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_button15.png', '-x': '0', '-y': '237', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'grey_checkmarkGrey.png', '-x': '99', '-y': '478', '-width': '21', '-height': '20', '-self-closing': 'true'}, {'-name': 'grey_checkmarkWhite.png', '-x': '78', '-y': '478', '-width': '21', '-height': '20', '-self-closing': 'true'}, {'-name': 'grey_circle.png', '-x': '185', '-y': '469', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'grey_crossGrey.png', '-x': '120', '-y': '478', '-width': '18', '-height': '18', '-self-closing': 'true'}, {'-name': 'grey_crossWhite.png', '-x': '190', '-y': '318', '-width': '18', '-height': '18', '-self-closing': 'true'}, {'-name': 'grey_panel.png', '-x': '190', '-y': '98', '-width': '100', '-height': '100', '-self-closing': 'true'}, {'-name': 'grey_sliderDown.png', '-x': '190', '-y': '234', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'grey_sliderEnd.png', '-x': '138', '-y': '478', '-width': '8', '-height': '10', '-self-closing': 'true'}, {'-name': 'grey_sliderHorizontal.png', '-x': '0', '-y': '380', '-width': '190', '-height': '4', '-self-closing': 'true'}, {'-name': 'grey_sliderLeft.png', '-x': '0', '-y': '478', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'grey_sliderRight.png', '-x': '39', '-y': '478', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'grey_sliderUp.png', '-x': '190', '-y': '276', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'grey_sliderVertical.png', '-x': '208', '-y': '318', '-width': '4', '-height': '100', '-self-closing': 'true'}, {'-name': 'grey_tickGrey.png', '-x': '190', '-y': '336', '-width': '17', '-height': '17', '-self-closing': 'true'}, {'-name': 'grey_tickWhite.png', '-x': '190', '-y': '353', '-width': '17', '-height': '17', '-self-closing': 'true'}]}
    },
    red: {
      img: document.createElement('img'),
      sheet: {SubTexture: [{'-name': 'red_boxCheckmark.png', '-x': '380', '-y': '0', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'red_boxCross.png', '-x': '380', '-y': '36', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'red_boxTick.png', '-x': '386', '-y': '178', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'red_button00.png', '-x': '0', '-y': '0', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'red_button01.png', '-x': '0', '-y': '45', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button02.png', '-x': '0', '-y': '94', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'red_button03.png', '-x': '337', '-y': '188', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button04.png', '-x': '339', '-y': '98', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button05.png', '-x': '290', '-y': '98', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'red_button06.png', '-x': '288', '-y': '198', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button07.png', '-x': '290', '-y': '143', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'red_button08.png', '-x': '239', '-y': '198', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button09.png', '-x': '190', '-y': '198', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'red_button10.png', '-x': '190', '-y': '49', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button11.png', '-x': '190', '-y': '0', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_button12.png', '-x': '0', '-y': '188', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'red_button13.png', '-x': '0', '-y': '139', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'red_checkmark.png', '-x': '0', '-y': '233', '-width': '21', '-height': '20', '-self-closing': 'true'}, {'-name': 'red_circle.png', '-x': '386', '-y': '214', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'red_cross.png', '-x': '21', '-y': '233', '-width': '18', '-height': '18', '-self-closing': 'true'}, {'-name': 'red_panel.png', '-x': '190', '-y': '98', '-width': '100', '-height': '100', '-self-closing': 'true'}, {'-name': 'red_sliderDown.png', '-x': '388', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'red_sliderLeft.png', '-x': '339', '-y': '147', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'red_sliderRight.png', '-x': '378', '-y': '147', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'red_sliderUp.png', '-x': '416', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'red_tick.png', '-x': '39', '-y': '233', '-width': '17', '-height': '17', '-self-closing': 'true'}]}
    },
    yellow: {
      img: document.createElement('img'),
      sheet: {SubTexture: [{'-name': 'yellow_boxCheckmark.png', '-x': '380', '-y': '36', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'yellow_boxCross.png', '-x': '380', '-y': '0', '-width': '38', '-height': '36', '-self-closing': 'true'}, {'-name': 'yellow_boxTick.png', '-x': '386', '-y': '174', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'yellow_button00.png', '-x': '190', '-y': '45', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button01.png', '-x': '190', '-y': '0', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'yellow_button02.png', '-x': '0', '-y': '188', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button03.png', '-x': '0', '-y': '49', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'yellow_button04.png', '-x': '0', '-y': '139', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button05.png', '-x': '0', '-y': '94', '-width': '190', '-height': '45', '-self-closing': 'true'}, {'-name': 'yellow_button06.png', '-x': '190', '-y': '194', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button07.png', '-x': '239', '-y': '194', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button08.png', '-x': '290', '-y': '143', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'yellow_button09.png', '-x': '290', '-y': '94', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button10.png', '-x': '337', '-y': '188', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'yellow_button11.png', '-x': '339', '-y': '94', '-width': '49', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_button12.png', '-x': '288', '-y': '194', '-width': '49', '-height': '45', '-self-closing': 'true'}, {'-name': 'yellow_button13.png', '-x': '0', '-y': '0', '-width': '190', '-height': '49', '-self-closing': 'true'}, {'-name': 'yellow_checkmark.png', '-x': '337', '-y': '233', '-width': '21', '-height': '20', '-self-closing': 'true'}, {'-name': 'yellow_circle.png', '-x': '386', '-y': '210', '-width': '36', '-height': '36', '-self-closing': 'true'}, {'-name': 'yellow_cross.png', '-x': '0', '-y': '237', '-width': '18', '-height': '18', '-self-closing': 'true'}, {'-name': 'yellow_panel.png', '-x': '190', '-y': '94', '-width': '100', '-height': '100', '-self-closing': 'true'}, {'-name': 'yellow_sliderDown.png', '-x': '388', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'yellow_sliderLeft.png', '-x': '339', '-y': '143', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'yellow_sliderRight.png', '-x': '378', '-y': '143', '-width': '39', '-height': '31', '-self-closing': 'true'}, {'-name': 'yellow_sliderUp.png', '-x': '416', '-y': '72', '-width': '28', '-height': '42', '-self-closing': 'true'}, {'-name': 'yellow_tick.png', '-x': '18', '-y': '237', '-width': '17', '-height': '17', '-self-closing': 'true'}]}
    },
  };
  protected _color: UIColor;

  constructor(x: number, y: number, width: number, height: number, color: UIColor,
              sourceX: number = null, sourceY: number = null, sourceH: number = null, sourceW: number = null) {
    super('', x, y, width, height, sourceX, sourceY, sourceW, sourceH);
    this._sprites.blue.img.src = 'assets/bouncing-ball/images/UIpack/Spritesheet/blueSheet.png';
    this._sprites.green.img.src = 'assets/bouncing-ball/images/UIpack/Spritesheet/greenSheet.png';
    this._sprites.grey.img.src = 'assets/bouncing-ball/images/UIpack/Spritesheet/greySheet.png';
    this._sprites.red.img.src = 'assets/bouncing-ball/images/UIpack/Spritesheet/redSheet.png';
    this._sprites.yellow.img.src = 'assets/bouncing-ball/images/UIpack/Spritesheet/yellowSheet.png';
    this.color = color;
  }

  set color(color: UIColor) {
    this._color = color;
    this._image = this._sprites[color].img;
  }

  protected getSpriteDataByName(name: string): { sourceX: number, sourceY: number, sourceH: number, sourceW: number } {
    const sheet = this._sprites[this._color].sheet;
    const sprite = sheet.SubTexture.find(s => {
      return s['-name'].toLowerCase() === `${this._color}_${name.toLowerCase()}.png`;
    });
    return {
      sourceX: parseInt(sprite['-x'], 10),
      sourceY: parseInt(sprite['-y'], 10),
      sourceW: parseInt(sprite['-width'], 10),
      sourceH: parseInt(sprite['-height'], 10),
    };
  }
}

class UINamedPiece extends UiPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor, pieceName: string) {
    super(x, y, width, height, color);
    const sprite = this.getSpriteDataByName(pieceName);
    this._sourceX = sprite.sourceX;
    this._sourceY = sprite.sourceY;
    this._sourceH = sprite.sourceH;
    this._sourceW = sprite.sourceW;
  }
}

/*******************
 ***** BUTTONS *****
 *******************/

abstract class Button extends UiPiece {
  protected _UP: { sourceX: number, sourceY: number, sourceH: number, sourceW: number };
  protected _DOWN: { sourceX: number, sourceY: number, sourceH: number, sourceW: number };
  protected _isDown: boolean = false;
  protected _text = '';
  protected _fontSize = 15;
  protected _fontFamily = 'sans-serif';
  protected _fontColor = 'black';

  constructor(x: number, y: number, width: number, height: number, color: UIColor,
              text: string|{text: string, fontSize: number, fontFamily?: string, fontColor?: string} = '',
              buttonState: 'up'|'down' = 'up') {
    super(x, y, width, height, color);
    const {UP: UP1} = this;
    this._UP = this.getSpriteDataByName(UP1);
    const {DOWN: DOWN1} = this;
    this._DOWN = this.getSpriteDataByName(DOWN1);
    this[buttonState]();
    if (text instanceof Object) {
      this._text = text.text;
      this._fontSize = text.fontSize;
      if (text.fontFamily) {
        this._fontFamily = text.fontFamily;
      }
      if (text.fontColor) {
        this._fontColor = text.fontColor;
      }
    }else {
      this._text = text;
    }
  }

  up(): void {
    this._isDown = false;
    this._sourceX = this._UP.sourceX;
    this._sourceY = this._UP.sourceY;
    this._sourceW = this._UP.sourceW;
    this._sourceH = this._UP.sourceH;
  }

  down(): void {
    this._isDown = true;
    this._sourceX = this._DOWN.sourceX;
    this._sourceY = this._DOWN.sourceY;
    this._sourceW = this._DOWN.sourceW;
    this._sourceH = this._DOWN.sourceH;
  }

  isDown(): boolean {
    return this._isDown;
  }

  isUp(): boolean {
    return !this._isDown;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.font = this._fontSize + 'px ' + this._fontFamily;
    ctx.fillStyle = this._fontColor;
    const textMeasurement = ctx.measureText(this._text);
    ctx.fillText(
      this._text,
      this.x + this.width / 2 - textMeasurement.width / 2,
      this.y + this.height / 2 + textMeasurement.fontBoundingBoxAscent / 4
    );
  }

  abstract get UP(): string;
  abstract get DOWN(): string;
}

export class Button1 extends Button {
  get UP(): string { return 'button00'; }
  get DOWN(): string { return 'button01'; }
}

export class Button2 extends Button {
  get UP(): string { return 'button02'; }
  get DOWN(): string { return 'button03'; }
}

export class Button3 extends Button {
  get UP(): string { return 'button04'; }
  get DOWN(): string { return 'button05'; }
}

/**
 * This button does not have a DOWN state. UP and DOWN are same image
 */
export class Button4 extends Button {
  get UP(): string { return 'button13'; }
  get DOWN(): string { return 'button13'; }
}

export class ButtonSquare1 extends Button {
  get UP(): string { return 'button07'; }
  get DOWN(): string { return 'button08'; }
}

export class ButtonSquare2 extends Button {
  get UP(): string { return 'button09'; }
  get DOWN(): string { return 'button10'; }
}

export class ButtonSquare3 extends Button {
  get UP(): string { return 'button11'; }
  get DOWN(): string { return 'button12'; }
}

/**
 * This button does not have a DOWN state. UP and DOWN are same image
 */
export class ButtonSquare4 extends Button {
  get UP(): string { return 'button06'; }
  get DOWN(): string { return 'button06'; }
}

/*****************
 ***** PANEL *****
 *****************/

export class Panel extends UiPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color);
    const sprite = this.getSpriteDataByName('panel');
    this._sourceX = sprite.sourceX;
    this._sourceY = sprite.sourceY;
    this._sourceH = sprite.sourceH;
    this._sourceW = sprite.sourceW;
  }
}

/******************
 ***** INPUTS *****
 ******************/

export class Checkbox extends UiPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor,
              type: CheckboxType = CheckboxType.CHECKMARK, checked: boolean = false) {
    super(x, y, width, height, color);
    let sprite;
    if (checked) {
      sprite = this.getSpriteDataByName('box' + type);
    }else {
      this._color = UIColor.GREY;
      sprite = this.getSpriteDataByName('box');
    }
    this._sourceX = sprite.sourceX;
    this._sourceY = sprite.sourceY;
    this._sourceH = sprite.sourceH;
    this._sourceW = sprite.sourceW;
  }
}

class UINamedPieceGrayedable extends UINamedPiece {
  private _oldColor: UIColor;

  constructor(x: number, y: number, width: number, height: number, color: UIColor, name: string) {
    super(x, y, width, height, color, name + (color === UIColor.GREY ? 'White' : ''));
  }

  set grayed(grayed: boolean) {
    let sprite;
    if (grayed) {
      this._oldColor = this._color;
      this._color = UIColor.GREY;
      sprite = this.getSpriteDataByName(name + 'Grey');
    }else {
      this._color = this._oldColor;
      sprite = name + (this._color === UIColor.GREY ? 'White' : '');
    }
    this._sourceX = sprite.sourceX;
    this._sourceY = sprite.sourceY;
    this._sourceH = sprite.sourceH;
    this._sourceW = sprite.sourceW;
  }
}

export class Checkmark extends UINamedPieceGrayedable {

  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'checkmark');
  }
}
export class Circle extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'circle');
  }
}
export class Cross extends UINamedPieceGrayedable {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'cross' + (color === UIColor.GREY ? 'White' : ''));
  }
}
export class Tick extends UINamedPieceGrayedable {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'tick' + (color === UIColor.GREY ? 'White' : ''));
  }
}
export class SliderDown extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'sliderDown');
  }
}
export class SliderLeft extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'sliderLeft');
  }
}
export class SliderRight extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'sliderRight');
  }
}
export class SliderUp extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number, color: UIColor) {
    super(x, y, width, height, color, 'sliderUp');
  }
}

/* ONLY GREY */

// Sliders
export class SliderHorizontal extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'sliderHorizontal');
  }
}
export class SliderVertical extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'sliderVertical');
  }
}

// Arrows
export class ArrowDownGrey extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'arrowDownGrey');
  }
}
export class ArrowDownWhite extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'arrowDownWhite');
  }
}
export class ArrowUpGrey extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'arrowUpGrey');
  }
}
export class ArrowUpWhite extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'arrowUpWhite');
  }
}

export class CheckmarkGrayed extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'checkmarkGrey');
  }
}
export class CrossGrayed extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'crossGrey');
  }
}
export class TickGrayed extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'tickGrey');
  }
}

export class SliderEnd extends UINamedPiece {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height, UIColor.GREY, 'sliderEnd');
  }
}

export enum CheckboxType {
  CHECKMARK = 'Checkmark',
  CROSS = 'Cross',
  TICK = 'Tick'
}

export enum UIColor {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  RED = 'red',
  YELLOW = 'yellow'
}
