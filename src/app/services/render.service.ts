import * as THREE from 'three';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

export class RenderService
{
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;

  private canvas: HTMLCanvasElement;
  private light: THREE.AmbientLight;

  constructor() {}

  public createScene(elementId: string): void
  {
    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true, antialias: true});

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xFFFFFF, 0.2);
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.scene = new THREE.Scene();

    let aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    this.camera.position.set( 0, 20, 100 );
    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight( 0xFFFFFF );
    this.light.position.x = 500;
    this.light.position.y = 500;
    this.light.position.z = 500;
    this.scene.add(this.light);
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

  private render()
  {
    requestAnimationFrame(() =>
    {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
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
