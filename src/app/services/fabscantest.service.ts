import { Injectable } from '@angular/core';
import * as THREE from "three";
import {interval, Subscription} from "rxjs";
import {PointCloudPoint} from "./pointcloud.service";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {ScanService} from "./scan.service";

import { ConvexBufferGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import {RenderService} from "./render.service";

@Injectable({
  providedIn: 'root'
})

export class FabscantestService {

  //Test stuff
  private subscription: Subscription = undefined;
  private streamingIndex: number = 0;
  private streamingGeometryBufferSize: number = 0;
  private streamingGeometry: THREE.BufferGeometry = undefined;
  private doneUpdateAfterScan: boolean = false;

  private readonly scanService: ScanService;
  private readonly renderService: RenderService;

  private readonly period: number = 1;
  private readonly pointStreamRange: number = 10000;

  constructor(scanService: ScanService, renderService: RenderService)
  {
    this.scanService = scanService;
    this.renderService = renderService;
  }

  public runTest()
  {
    // this.loadPlyAsync('./assets/damaliscus_korrigum.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/scan_20190709-220809_roh.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/Classic side table.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/einstein_high_res.ply').then((geometry) =>
    // this.loadPlyAsync('./assets/einstein_high_res_dual_color.ply').then((geometry) =>
    this.loadPlyAsync('./assets/einstein_cleaned.ply').then((geometry) =>
    {
      this.streamingGeometry = geometry as THREE.BufferGeometry;
      this.streamingGeometryBufferSize = this.streamingGeometry.attributes.position.count * 3;

      const source = interval(this.period);
      this.subscription = source.subscribe(this.scanTick.bind(this));
    }, error =>
    {
      console.error(error);
    });
  }

  private scanTick()
  {
    if (!this.streamingGeometry) return;

    if (this.streamingIndex >= this.streamingGeometryBufferSize)
    {
      if(!this.doneUpdateAfterScan)
      {
        console.log("== SCAN FINISHED ==");
        console.log("BufferCount: " + this.scanService.getPointCloudBuffer().length);

        let pointCount = 0;
        let pointCountSum = 0;
        let bufferAllocCountSum = 0;
        let vertices: Array<THREE.Vector3> = [];


        this.scanService.getPointCloudBuffer().forEach((pointcloud) =>
        {
          pointCount = pointcloud.getSize();
          pointCountSum += pointCount;
          bufferAllocCountSum += pointcloud.getMaxSize();

          let positions = (pointcloud.points.geometry as THREE.BufferGeometry).attributes.position.array;
          for (let idx = 0; idx < pointCount; idx++)
          {
            vertices.push(new THREE.Vector3(positions[idx], positions[idx+1], positions[idx+2]));
          }

          // (pointcloud.points.geometry as THREE.BufferGeometry).attributes.position.array.forEach(())
          // console.log((pointcloud.points.geometry as THREE.BufferGeometry).attributes.position.array);
        });

        console.log("PointCount: " + pointCountSum);
        console.log("PointAllocCount: " + bufferAllocCountSum);
        console.log("Overallocated: " + (bufferAllocCountSum / pointCountSum - 1.0) * 100 + " %");
        console.log("===================");
        console.log(this.scanService);
        this.scanService.pointcloud.update();
        this.doneUpdateAfterScan = true;

        // Meshing test ===
        if (false)
        {
          console.log(vertices);
          let meshMaterial = new THREE.MeshLambertMaterial({color:0xffffff,opacity: 0.5,transparent: true});

          let meshGeometry = new ConvexBufferGeometry(vertices);

          console.log(meshGeometry)

          let meshBack = new THREE.Mesh(meshGeometry, meshMaterial);
          (meshBack.material as THREE.Material).side = THREE.BackSide;
          meshBack.renderOrder = 0;

          let meshFront = new THREE.Mesh(meshGeometry, meshMaterial.clone());
          (meshFront.material as THREE.Material).side = THREE.FrontSide; // front faces
          meshFront.renderOrder = 1;

          this.renderService.scene.add(meshFront);
          this.renderService.scene.add(meshBack);
        }
      }

      return;
    }

    let numPoints = Math.floor(Math.random() * this.pointStreamRange);
    let points: Array<PointCloudPoint> = [];

    if ((this.streamingIndex + (numPoints * 3)) >= this.streamingGeometryBufferSize)
      numPoints = (this.streamingGeometryBufferSize - this.streamingIndex) / 3;

    console.log("SCANNING " + numPoints + " POINTS");
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
}
