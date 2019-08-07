import * as THREE from 'three';
import { interval, Subscription } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {RenderService} from "../services/render.service";
import {ScanService} from "../services/scan.service";
import {PointCloudPoint} from '../services/pointcloud.service';

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
    this.scanService = new ScanService(20000, this.swapPointCloudsInScene.bind(this));

    this.renderService = new RenderService('canvas');
    this.renderService.createScene();
    this.renderService.scene.add(this.scanService.pointcloud.points);
    this.renderService.camera.lookAt(this.scanService.pointcloud.points.position);
    this.renderService.animate();

    //Test Code for mocking websocket.service: ======================
    const source = interval(1000);
    this.subscription = source.subscribe(() =>
    {
      let randomPoints: Array<PointCloudPoint> = [];
      // let numPoints = Math.floor(1000 + Math.random() * 9000);
      let numPoints = 1000;
      // console.log("Adding " + numPoints + " random Points");
      for (let i = 0; i < numPoints; i++)
      {
        randomPoints.push({
          position: new THREE.Vector3
          (
            (Math.random() - 0.5) * 5000,
            (Math.random() - 0.5) * 5000,
            (Math.random() - 0.5) * 5000
          ),
          color: new THREE.Color
          (
            Math.random(),
            Math.random(),
            Math.random()
          )
        });
        // randomPoints.push(
      }

      this.scanService.addPoints(randomPoints);
    });
    //===============================================================
  }

  /**
   * Swaps the pointclouds in the THREE.Scene
   * @param currentCloud
   * @param nextCloud
   */
  private swapPointCloudsInScene(currentCloud, nextCloud)
  {
    return new Promise((resolve, reject) =>
    {
      // nextCloud.points.applyMatrix(currentCloud.points.matrixWorld);

      nextCloud.points.position.x = currentCloud.points.position.x;
      nextCloud.points.position.y = currentCloud.points.position.y;
      nextCloud.points.position.z = currentCloud.points.position.z;

      nextCloud.points.rotation.x = currentCloud.points.rotation.x;
      nextCloud.points.rotation.y = currentCloud.points.rotation.y;
      nextCloud.points.rotation.z = currentCloud.points.rotation.z;

      // nextCloud.points.rotation = currentCloud.points.rotation;
      // nextCloud.points.scale = currentCloud.points.scale;

      this.renderService.scene.remove(currentCloud.points);
      this.renderService.scene.add(nextCloud.points);
      resolve();
    });
  }
}
