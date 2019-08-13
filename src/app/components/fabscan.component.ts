import * as THREE from 'three';
import {Component, OnInit} from '@angular/core';
import {RenderService} from "../services/render.service";
import {ScanService} from "../services/scan.service";
import {FabscantestService} from "../services/fabscantest.service";

@Component({
  selector: 'fabscan-root',
  templateUrl: './fabscan.component.html'
})

export class FabscanComponent implements OnInit
{
  public scanService: ScanService;
  public renderService: RenderService;
  public fabscantest: FabscantestService;

  constructor() {}

  ngOnInit()
  {
    this.scanService = new ScanService(200000, this.addPointCloudToScene.bind(this));
    this.renderService = new RenderService('canvas', false);
    this.renderService.createScene();
    this.renderService.animate();
    this.addPointCloudToScene();
    this.resetControls();

    this.fabscantest = new FabscantestService(this.scanService, this.renderService);
    this.fabscantest.runTest();
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
    this.scanService.pointcloud.points.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI / 2);
    this.renderService.scene.add(this.scanService.pointcloud.points);
  }
}
