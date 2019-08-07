import * as THREE from 'three';
import { Injectable } from '@angular/core';
import Stats from '../lib/stats.lib.js';

@Injectable({providedIn: 'root'})
export class RenderService
{
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;

  private stats: Stats;
  private light: THREE.AmbientLight;
  private readonly canvas: HTMLCanvasElement;

  constructor(elementId: string)
  {
    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
  }

  public createScene(): void
  {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true, antialias: true});

    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new THREE.Color(0.56,0.56,0.56), 0.2);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();

    let aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    this.camera.position.set(100,100,100);
    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight( 0xFFFFFF );
    this.light.position.x = 500;
    this.light.position.y = 500;
    this.light.position.z = 500;
    this.scene.add(this.light);

    this.scene.add(new THREE.AxesHelper(80));
  }

  public animate(): void
  {
    window.addEventListener('DOMContentLoaded', () =>
    {
      this.render();
    });

    window.addEventListener('resize', () =>
    {
      this.resize();
    });
  }

  public updateCamera(movementX: number, movementY: number)
  {
    console.log("UPDATE CAMERA");
    console.log(movementX);
    console.log(movementY);
  }

  private render()
  {
    requestAnimationFrame(() =>
    {
      this.render();
    });

    this.scene.getObjectByName("Fabscan Pointcloud").rotation.z += 0.01;

    this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  private resize()
  {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

}
