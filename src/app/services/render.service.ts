import * as THREE from 'three';
import { Injectable } from '@angular/core';
import Stats from '../lib/stats.lib.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {Material} from "three";

const VECTOR_UP: THREE.Vector3 = new THREE.Vector3(0,1,0);
const VECTOR_RIGHT: THREE.Vector3 = new THREE.Vector3(1,0,0);
const VECTOR_FORWARD: THREE.Vector3 = new THREE.Vector3(0,0,1);

@Injectable({providedIn: 'root'})
export class RenderService
{
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  private axes: THREE.AxesHelper;
  private grid: THREE.GridHelper;
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
    document.body.appendChild(this.stats.dom);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new THREE.Color(0.56,0.56,0.56), 0.2);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();

    // camera-----------------------------------------------------------------------------------------------------------
    let aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
    this.camera.position.set(100,100,100);
    this.scene.add(this.camera);

    // controls---------------------------------------------------------------------------------------------------------
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 500;
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.1;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.0;
    this.controls.panSpeed = 0.1;
    this.controls.enablePan = true;

    // light---------------------------------------------------------------------------------------------------------
    this.light = new THREE.AmbientLight( 0xFFFFFF );
    this.light.position.x = 500;
    this.light.position.y = 500;
    this.light.position.z = 500;
    this.scene.add(this.light);

    this.grid = new THREE.GridHelper(250, 50,
      new THREE.Color(0.75, 0.75, 0.75),
      new THREE.Color(0.5,0.5,0.5)
    );
    (this.grid.material as Material).opacity = 0.25;
    (this.grid.material as Material).transparent = true;
    this.scene.add(this.grid);

    this.axes = new THREE.AxesHelper(40);
    this.scene.add(this.axes);
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

    this.controls.update();
    // this.scene.getObjectByName("Fabscan Pointcloud").rotation.z -= 0.0035;

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

    this.renderer.setSize(width, height);
  }

}
