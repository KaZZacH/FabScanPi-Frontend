import { Injectable } from '@angular/core';
import * as THREE from "three";

export interface PointCloudPoint
{
  position: THREE.Vector3;
  color: THREE.Color;
}

@Injectable()
export class PointcloudService
{
  public points: THREE.Points;
  private currentBufferIndex: number = 0;

  private lastUpdate: number = 0;
  private filledSize: number = 0;
  private readonly maxSize: number = 0;
  private readonly bufferSize: number = 0;

  private readonly updateInterval: number = 100;
  private readonly positionBuffer: Float32Array = undefined;
  private readonly colorBuffer: Float32Array = undefined;

  private readonly renderMaterial: THREE.PointsMaterial = undefined;
  private readonly bufferGeometry: THREE.BufferGeometry = undefined;

  private readonly debugMode: boolean = true;
  private readonly debugColor: THREE.Color;

  constructor(size: number, name: string)
  {
    this.maxSize = size;
    this.bufferSize = this.maxSize * 3;

    this.bufferGeometry = new THREE.BufferGeometry();

    this.positionBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( this.positionBuffer, 3 ));

    this.colorBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( this.colorBuffer, 3 ));

    this.renderMaterial = new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: 0.1, fog: true});

    this.points = new THREE.Points(this.bufferGeometry,  this.renderMaterial);
    this.points.name = name;

    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);

    if (this.debugMode)
      this.debugColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  }

  /**
   * WARNING: This function will be called by the ScanService.
   * Do not call this function directly, since it is implicitly asserted that
   *    this.currentBufferIndex + points.lenght * 3 <= this.size
   * is true.
   *
   * @param points
   * The points to be added.
   */
  public addPoints(points: Array<PointCloudPoint>)
  {
    let positions = this.bufferGeometry.attributes.position.array as Float32Array;
    let colors = this.bufferGeometry.attributes.color.array as Float32Array;

    let pointColor: THREE.Color = this.debugColor;

    points.forEach(point =>
    {
      if (!this.debugMode)
        pointColor = point.color;

      positions[this.currentBufferIndex] = point.position.x;
      colors[this.currentBufferIndex] = pointColor.r;
      this.currentBufferIndex++;
      positions[this.currentBufferIndex] = point.position.y;
      colors[this.currentBufferIndex] = pointColor.g;
      this.currentBufferIndex++;
      positions[this.currentBufferIndex] = point.position.z;
      colors[this.currentBufferIndex] = pointColor.b;
      this.currentBufferIndex++;

      this.filledSize++;
    });

    if (Date.now() >= this.lastUpdate + this.updateInterval)
      this.update();
  }

  public update()
  {
    (this.bufferGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.bufferGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
    this.bufferGeometry.computeBoundingSphere();
    this.lastUpdate = Date.now();
  }

  public dispose()
  {
    this.bufferGeometry.dispose();
    this.renderMaterial.dispose();
  }

  public getCloudBufferIndex() { return this.currentBufferIndex; }
  public getSize() { return this.filledSize; }
  public getMaxSize() { return this.maxSize; }
  public getBufferSize() { return this.bufferSize; }

  public getPositionBuffer() { return this.bufferGeometry.attributes.position.array as Float32Array; }
  public setPositionBuffer(buffer: Float32Array)
  {
    (this.bufferGeometry.attributes.position.array as Float32Array).set(buffer);
    this.currentBufferIndex = buffer.length;
  }

  public getColorBuffer() { return this.bufferGeometry.attributes.color.array as Float32Array; }
  public setColorBuffer(buffer: Float32Array)
  {
    (this.bufferGeometry.attributes.color.array as Float32Array).set(buffer);
    this.currentBufferIndex = buffer.length;
  }
}
