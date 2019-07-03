import { RenderService } from '../../services/render.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fabscan-renderer',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})

export class RenderComponent implements OnInit {

  private renderService: RenderService = new RenderService();

  ngOnInit() {
    this.renderService.createScene('canvas');
    this.renderService.animate();
  }
}
