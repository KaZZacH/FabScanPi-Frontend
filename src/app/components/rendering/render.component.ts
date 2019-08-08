import { Component, OnInit } from '@angular/core';
import {FabscanComponent} from "../fabscan.component";

const LEFT_MOUSE_BUTTON:   number = 0;
const MIDDLE_MOUSE_BUTTON: number = 1;
const RIGHT_MOUSE_BUTTON:  number = 2;

interface MouseState
{
  leftButtonDown: boolean;
  rightButtonDown: boolean;
  middleButtonDown: boolean;
}

@Component({
  selector: 'fabscan-renderer',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})

export class RenderComponent implements OnInit
{
  private mouseState: MouseState;

  constructor(private fabscan: FabscanComponent){}

  ngOnInit()
  {
    this.mouseState = {leftButtonDown: false, rightButtonDown: false, middleButtonDown: false};
  }

  private onDoubleMouseClick()
  {
    this.fabscan.resetControls();
  }

  private onContextMenu(event)
  {
    event.preventDefault();
    return false;
  }
}
