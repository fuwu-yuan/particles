import {Entities} from '@fuwu-yuan/bgew'

export class Wall extends Entities.Rectangle {

  constructor(x: number,
              y: number,
              width: number,
              height: number,
              strokeColor: string|null = null,
              fillColor: string|null = null,
              hoverStrokeColor: string|null = null,
              hoverFillColor: string|null = null,
              clickStrokeColor: string|null = null,
              clickFillColor: string|null = null,
              radius: {tl: number, tr: number, br: number, bl: number}|null = null) {
    super(x, y, width, height, strokeColor, fillColor, hoverStrokeColor, hoverFillColor, clickStrokeColor, clickFillColor, radius);
  }
}
