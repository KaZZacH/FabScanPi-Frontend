import { Component, OnInit } from '@angular/core';
import {FabscanComponent} from "../fabscan.component";

@Component({
  selector: 'fabscan-renderer',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})

export class RenderComponent implements OnInit
{

  private isLeftButtonDown: boolean = false;

  constructor(){}

  ngOnInit()
  {}
}
