import {Component, OnInit} from '@angular/core';
import {RenderService} from "../services/render.service";
import {ScanService} from "../services/scan.service";

@Component({
  selector: 'fabscan-root',
  templateUrl: './fabscan.component.html'
})

export class FabscanComponent implements OnInit
{
  private title = 'FabScanPi-Frontend-ng7';
  private scanService: ScanService;
  private renderService: RenderService;

  constructor() {}

  ngOnInit()
  {
    this.scanService = new ScanService();

    this.renderService = new RenderService();
    this.renderService.animate();
    this.renderService.createScene('canvas');
    this.renderService.scene.add(this.scanService.pointcloud.points);
    this.renderService.camera.lookAt(this.scanService.pointcloud.points.position);

  }
}
