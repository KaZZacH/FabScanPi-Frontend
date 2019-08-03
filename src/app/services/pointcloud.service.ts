import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable({providedIn: 'root'})

export class PointcloudService
{

  public points: THREE.Points;
  private readonly size: number;

  private readonly pointsFlatArray: Float32Array;
  private readonly renderMaterial: THREE.PointsMaterial;
  private readonly bufferGeometry: THREE.BufferGeometry;

  constructor(size: number)
  {
    this.size = size;

    // geometry
    this.bufferGeometry = new THREE.BufferGeometry();

    // attributes
    this.pointsFlatArray = new Float32Array(this.size * 3); // 3 vertices per point
    this.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( this.pointsFlatArray, 3 ));

    // material
    this.renderMaterial = new THREE.PointsMaterial({color: 0xff0000, size: 0.1});
    this.points = new THREE.Points(this.bufferGeometry,  this.renderMaterial);

    // points
    let x, y, z, index;
    let positions = this.bufferGeometry.attributes.position.array as Float32Array;

    x = y = z = index = 0;
    for (let i = 0; i < this.size; i++)
    {

      positions[index++] = x;

      positions[index++] = y;
      positions[index++] = z;
      x = (Math.random() - 0.5) * 50;
      y = (Math.random() - 0.5) * 50;
      z = (Math.random() - 0.5) * 50;
    }

    this.bufferGeometry.attributes.position.array = positions;
    (this.bufferGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
  }
}
