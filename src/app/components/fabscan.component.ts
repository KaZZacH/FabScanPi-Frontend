import * as THREE from 'three';
import { interval, Subscription } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {RenderService} from "../services/render.service";
import {ScanService} from "../services/scan.service";
import {PointCloudPoint} from '../services/pointcloud.service';
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

@Component({
  selector: 'fabscan-root',
  templateUrl: './fabscan.component.html'
})

export class FabscanComponent implements OnInit
{
  private title = 'FabScanPi-Frontend-ng7';
  public scanService: ScanService;
  public renderService: RenderService;

  //Test stuff
  private subscription: Subscription = undefined;
  private streamingIndex: number = 0;
  private streamingGeometryBufferSize: number = 0;
  private streamingGeometry: THREE.BufferGeometry = undefined;
  private doneUpdateAfterScan: boolean = false;

  constructor() {}

  ngOnInit()
  {
    this.scanService = new ScanService(200000, this.addPointCloudToScene.bind(this));

    this.renderService = new RenderService('canvas');
    this.renderService.createScene();
    this.renderService.animate();
    this.addPointCloudToScene().then(() =>
    {
      this.resetControls();
      this.runTest();
    });
  }

  private runTest()
  {
    // ply comes in LH orientation, but OGL is RH
    // this.scanService.pointcloud.points.scale.x = 0.1;
    // this.scanService.pointcloud.points.scale.y = 0.1;
    // this.scanService.pointcloud.points.scale.z = 0.1;
    // this.loadPlyAsync('./assets/damaliscus_korrigum.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/scan_20190709-220809_roh.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/Classic side table.ply').then((geometry) =>
    //this.loadPlyAsync('./assets/einstein_high_res.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/einstein_high_res_dual_color.ply').then((geometry) =>
    this.loadPlyAsync('./assets/einstein_cleaned.ply').then((geometry) =>
    {
      this.streamingGeometry = geometry as THREE.BufferGeometry;
      this.streamingGeometryBufferSize = this.streamingGeometry.attributes.position.count * 3;

      const source = interval(1000);
      this.subscription = source.subscribe(this.scanTick.bind(this));
    }, error =>
    {
      console.error(error);
    });
  }

  private scanTick()
  {

    if (!this.streamingGeometry)
      return;

    if (this.streamingIndex >= this.streamingGeometryBufferSize)
    {
      if(!this.doneUpdateAfterScan)
      {
        console.log("== SCAN FINISHED ==");
        this.scanService.pointcloud.update();
        this.doneUpdateAfterScan = true;
      }
      return;
    }

    let numPoints = 1000;
    let points: Array<PointCloudPoint> = [];

    if ((this.streamingIndex + (numPoints * 3)) >= this.streamingGeometryBufferSize)
      numPoints = (this.streamingGeometryBufferSize - this.streamingIndex) / 3;

    let positions = this.streamingGeometry.attributes.position;
    let colors = this.streamingGeometry.attributes.color;

    for (let i = 0; i < numPoints; i++)
    {
      let position = new THREE.Vector3();
      let color = new THREE.Color();

      position.x = positions.array[this.streamingIndex];
      color.r = colors ? colors.array[this.streamingIndex] : 1.0;
      this.streamingIndex++;

      position.y = positions.array[this.streamingIndex];
      color.g = colors ? colors.array[this.streamingIndex] : 0.5;
      this.streamingIndex++;

      position.z = positions.array[this.streamingIndex];
      color.b = colors ? colors.array[this.streamingIndex] : 0.0;
      this.streamingIndex++;

      points.push({position: position, color: color});
    }

    this.scanService.addPoints(points);
  }

  private loadPlyAsync(path: string)
  {
    return new Promise((resolve, reject) =>
    {
      let loader = new PLYLoader();
      loader.load( path, (geometry) =>
      {
        resolve(geometry);
      }, (event) =>
      {
        console.log(event);
      }, (error) =>
      {
        reject(error);
      });
    });
  }

  public resetControls()
  {
    let lookAt: THREE.Vector3 = new THREE.Vector3();
    this.scanService.pointcloud.points.position.copy(lookAt);
    lookAt.add(new THREE.Vector3(0, 25, 0));
    this.renderService.camera.position.set(100,100,100);
    this.renderService.controls.target = lookAt;
    this.renderService.camera.lookAt(lookAt);
  }

  /**
   * Swaps the pointclouds in the THREE.Scene
   */
  private addPointCloudToScene()
  {
    return new Promise((resolve) =>
    {
      this.scanService.pointcloud.points.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI / 2);
      this.renderService.scene.add(this.scanService.pointcloud.points);
      resolve();
    });
  }
}
