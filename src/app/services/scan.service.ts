import { Injectable } from '@angular/core';
import { PointCloudPoint, PointcloudService } from './pointcloud.service';

@Injectable({providedIn: 'root'})
export class ScanService
{
  public pointcloud: PointcloudService = undefined;

  private isSwapingClouds: boolean = false;
  private swapPointcloudCache: Array<PointCloudPoint>;
  private pointCloudsBuffer: Array<PointcloudService> = [];


  private readonly pointCloudSize: number = 0;
  private readonly onPointCloudSwapEnd: Function;

  constructor(cloudSize: number, onPointCloudSwapEnd: Function)
  {
    this.pointCloudSize = cloudSize;
    this.pointCloudsBuffer.push(new PointcloudService(cloudSize));
    this.pointcloud = this.pointCloudsBuffer[this.pointCloudsBuffer.length - 1];
    this.onPointCloudSwapEnd = onPointCloudSwapEnd;
  }

  public addPoints(points: Array<PointCloudPoint>)
  {
    if (this.isSwapingClouds)
    {
      this.swapPointcloudCache.push(...points);
      return;
    }

    let pointsBufferSize: number = points.length * 3;

    if (this.pointcloud.getCloudBufferIndex() + pointsBufferSize <= this.pointcloud.getBufferSize())
    {
      // if (points === this.swapPointcloudCache)
      //   console.log("=== APPLYING CACHED POINTS TO CLOUD SINCE SWAP IS OVER: " + points.length + " ===");

      this.pointcloud.addPoints(points);
      // At this point, it is always save to clear the swap cache. If we reach this point
      // and getting called by the swap promise chaine, then we have to reset the cache anyways.
      this.swapPointcloudCache = [];
    }
    else
    {
      this.isSwapingClouds = true;

      this.swapPointClouds().then(() =>
      {
        //Calls the Fabscan root to swap the objects inside THREE.Scene.
        this.pointcloud = this.pointCloudsBuffer[this.pointCloudsBuffer.length - 1];
        this.onPointCloudSwapEnd().then(() =>
        {
          this.isSwapingClouds = false;
          this.addPoints(this.swapPointcloudCache);
          this.addPoints(points);
        }).catch((error) =>
        {
          console.error(error);
        });
      }).catch((error) =>
      {
        console.error(error);
      });
    }
  }

  private swapPointClouds()
  {
    return new Promise((resolve) =>
    {
      this.pointCloudsBuffer.push(new PointcloudService(this.pointCloudSize));
      console.log("Swaping cloud");
      console.log(this.pointCloudsBuffer);
      resolve();
    });
  }

}
