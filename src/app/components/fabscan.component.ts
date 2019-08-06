import * as THREE from 'three';
import { interval, Subscription } from 'rxjs';
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
  public scanService: ScanService;
  public renderService: RenderService;

  private subscription: Subscription;

  constructor() {}

  ngOnInit()
  {
    this.scanService = new ScanService(20000, this.onPointCloudSwapEnd.bind(this));

    this.renderService = new RenderService();
    this.renderService.createScene('canvas');
    this.renderService.scene.add(this.scanService.pointcloud.points);
    this.renderService.camera.lookAt(this.scanService.pointcloud.points.position);
    this.renderService.animate();

    //Test
    const source = interval(1000);
    this.subscription = source.subscribe(() =>
    {
      let randomPoints = [];
      // let numPoints = Math.floor(1000 + Math.random() * 9000);
      let numPoints = 1000;
      // console.log("Adding " + numPoints + " random Points");
      for (let i = 0; i < numPoints; i++)
      {
        randomPoints.push(new THREE.Vector3(
          (Math.random() - 0.5) * 5000,
          (Math.random() - 0.5) * 5000,
          (Math.random() - 0.5) * 5000
        ));
      }

      this.scanService.addPoints(randomPoints);
    });
  }

  /**
   * Swaps the pointclouds in the THREE.Scene
   * @param currentCloud
   * @param nextCloud
   */
  private onPointCloudSwapEnd(currentCloud, nextCloud)
  {
    return new Promise((resolve, reject) =>
    {
      this.renderService.scene.remove(currentCloud.points);
      this.renderService.scene.add(nextCloud.points);
      resolve();
    });
  }
}
