import { Injectable } from '@angular/core';
import {PointcloudService} from "./pointcloud.service";
import {RenderService} from "./render.service";

@Injectable({providedIn: 'root'})

export class ScanService
{
  public pointcloud: PointcloudService;
  private swapPointcloud: PointcloudService;

  constructor()
  {
    this.pointcloud = new PointcloudService(10000);
  }
}
