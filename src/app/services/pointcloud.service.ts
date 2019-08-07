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

  private readonly size: number = 0;
  private readonly bufferSize: number = 0;

  private readonly positionBuffer: Float32Array = [];
  private readonly colorBuffer: Float32Array = [];

  private readonly renderMaterial: THREE.PointsMaterial;
  private readonly bufferGeometry: THREE.BufferGeometry;

  constructor(size: number)
  {
    console.log("NEW SIZE: " + size);
    this.size = size;
    this.bufferSize = this.size * 3;

    this.bufferGeometry = new THREE.BufferGeometry();

    this.positionBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( this.positionBuffer, 3 ));

    this.colorBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( this.colorBuffer, 3 ));

    this.renderMaterial = new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: 18.0});

    this.points = new THREE.Points(this.bufferGeometry,  this.renderMaterial);
    this.points.name = "Fabscan Pointcloud";

    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
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

    points.forEach(point =>
    {
      positions[this.currentBufferIndex++] = point.position.x;
      colors[this.currentBufferIndex] = point.color.r;

      positions[this.currentBufferIndex++] = point.position.y;
      colors[this.currentBufferIndex] = point.color.g;

      positions[this.currentBufferIndex++] = point.position.z;
      colors[this.currentBufferIndex] = point.color.b;
    });

    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
    (this.bufferGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.bufferGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  public getCloudBufferIndex() { return this.currentBufferIndex; }
  public getSize() { return this.size; }
  public getBufferSize() { return this.bufferSize; }

  public getPositionBuffer() { return this.bufferGeometry.attributes.position.array as Float32Array; }
  public setPositionBuffer(buffer: Float32Array)
  {
    (this.bufferGeometry.attributes.position.array as Float32Array).set(buffer);

    this.currentBufferIndex = buffer.length;
    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
    (this.bufferGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  public getColorBuffer() { return this.bufferGeometry.attributes.color.array as Float32Array; }
  public setColorBuffer(buffer: Float32Array)
  {
    (this.bufferGeometry.attributes.color.array as Float32Array).set(buffer);

    this.currentBufferIndex = buffer.length;
    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
    (this.bufferGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }
}
