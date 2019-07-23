import * as THREE from 'three';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RenderService {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;

  private light: THREE.AmbientLight;

  createScene(elementId: string): void {
    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true, antialias: true});

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xFFFFFF, 0.2);
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight( 0xFFFFFF );
    this.light.position.z = 10;
    this.scene.add(this.light);

    //create a blue LineBasicMaterial
    var material = new THREE.PointsMaterial( { color: 0x0000ff, size: 12 } );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -2, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, 2, 0) );
    // geometry.vertices.push(new THREE.Vector3( 2, 0, 0) );

    var line = new THREE.Line( geometry, material );

    this.scene.add( line );
    // this.scene.add(this.cube);
  }

  animate(): void {
    window.addEventListener('DOMContentLoaded', () => {
      this.render();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    // this.cube.position.x = 0;
    // this.cube.position.y = 0;
    // this.cube.position.z = 0;
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }
}
