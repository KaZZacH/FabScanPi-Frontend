import { Component, OnInit } from '@angular/core';
import {FabscanComponent} from "../fabscan.component";

@Component({
  selector: 'fabscan-renderer',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})

export class RenderComponent implements OnInit
{
  constructor(private fabscan: FabscanComponent){}

  ngOnInit() {}

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
