import { Injectable } from '@angular/core';
import * as THREE from "three";
@Injectable()
export class PointcloudService
{

  public points: THREE.Points;
  private currentBufferIndex: number = 0;
  private readonly bufferSize: number = 0;

  private readonly size: number;
  private readonly pointBuffer: Float32Array;
  private readonly renderMaterial: THREE.PointsMaterial;
  private readonly bufferGeometry: THREE.BufferGeometry;

  constructor(size: number)
  {
    console.log("NEW SIZE: " + size);
    this.size = size;
    this.bufferSize = this.size * 3;

    this.bufferGeometry = new THREE.BufferGeometry();

    this.pointBuffer = new Float32Array(this.bufferSize);
    this.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( this.pointBuffer, 3 ));

    this.renderMaterial = new THREE.PointsMaterial({color: 0xff0000, size: 0.1});

    this.points = new THREE.Points(this.bufferGeometry,  this.renderMaterial);

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
  public addPoints(points: Array<THREE.Vector3>)
  {
    let positions = this.bufferGeometry.attributes.position.array as Float32Array;

    points.forEach(point =>
    {
      positions[this.currentBufferIndex++] = point.x;
      positions[this.currentBufferIndex++] = point.y;
      positions[this.currentBufferIndex++] = point.z;
    });

    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
    (this.bufferGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  public getCloudBufferIndex() { return this.currentBufferIndex; }
  public getSize() { return this.size; }
  public getBufferSize() { return this.bufferSize; }

  public getBuffer() { return this.bufferGeometry.attributes.position.array as Float32Array; }
  public setBuffer(buffer: Float32Array)
  {
    (this.bufferGeometry.attributes.position.array as Float32Array).set(buffer);

    this.currentBufferIndex = buffer.length;
    this.bufferGeometry.setDrawRange(0, this.currentBufferIndex);
    (this.bufferGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}
