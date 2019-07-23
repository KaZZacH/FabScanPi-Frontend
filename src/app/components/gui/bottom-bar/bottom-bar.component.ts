import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fabscan-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  clickMain() {
    console.log('TEST');
  }
}
