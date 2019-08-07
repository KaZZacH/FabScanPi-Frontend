import { Injectable } from '@angular/core';
import { PointCloudPoint, PointcloudService } from './pointcloud.service';

@Injectable({providedIn: 'root'})
export class ScanService
{
  public pointcloud: PointcloudService = undefined;

  private swapIndex: number = 0;
  private isSwapingClouds: boolean = false;
  private swapPointcloudCache: Array<PointCloudPoint>;
  private swapPointCloudsBuffer: Array<PointcloudService> = [undefined, undefined];
  private readonly swapMemIncFactor: number = 1.6;

  private readonly onPointCloudSwapEnd: Function;

  constructor(initialPointCloudSize: number, onPointCloudSwapEnd: Function)
  {
    this.swapPointCloudsBuffer[this.swapIndex] = new PointcloudService(initialPointCloudSize);
    this.pointcloud = this.swapPointCloudsBuffer[this.swapIndex];
    this.onPointCloudSwapEnd = onPointCloudSwapEnd;
  }

  public addPoints(points: Array<PointCloudPoint>)
  {
    if (this.isSwapingClouds)
    {
      console.log("=== CACHING INCOMING POINT SINCE SWAP IN PROGRESS ===");
      this.swapPointcloudCache.push(...points);
      return;
    }

    let pointsBufferSize: number = points.length * 3;

    if (this.pointcloud.getCloudBufferIndex() + pointsBufferSize <= this.pointcloud.getBufferSize())
    {
      if (points === this.swapPointcloudCache)
        console.log("=== APPLYING CACHED POINTS TO CLOUD SINCE SWAP IS OVER: " + points.length + " ===");

      this.pointcloud.addPoints(points);
      // At this point, it is always save to clear the swap cache. If we reach this point
      // and getting called by the swap promise chaine, then we have to reset the cache anyways.
      this.swapPointcloudCache = [];
    }
    else
    {
      this.isSwapingClouds = true;

      let currBufferIdx = this.swapIndex;
      let nextBufferIdx = (this.swapIndex + 1) % 2;

      this.swapPointClouds(currBufferIdx, nextBufferIdx).then(() =>
      {
        //Calls the Fabscan root to swap the objects inside THREE.Scene.
        this.onPointCloudSwapEnd(this.pointcloud, this.swapPointCloudsBuffer[nextBufferIdx]).then(() =>
        {
          this.swapIndex = nextBufferIdx;
          this.pointcloud = this.swapPointCloudsBuffer[this.swapIndex];
          this.isSwapingClouds = false;
          this.addPoints(this.swapPointcloudCache);
        }).catch((error) =>
        {
          console.log(error);
        });
      }).catch((error) =>
      {
        console.log(error);
      });
    }
  }

  private swapPointClouds(currBufferIdx: number, nextBufferidx: number)
  {
    return new Promise((resolve, reject) =>
    {

      this.swapPointCloudsBuffer[nextBufferidx] = new PointcloudService
      (
          Math.floor(this.swapPointCloudsBuffer[currBufferIdx].getSize() * this.swapMemIncFactor)
      );

      console.log(this.swapPointCloudsBuffer[nextBufferidx]);

      this.swapPointCloudsBuffer[nextBufferidx].setPositionBuffer(this.swapPointCloudsBuffer[currBufferIdx].getPositionBuffer());
      this.swapPointCloudsBuffer[nextBufferidx].setColorBuffer(this.swapPointCloudsBuffer[currBufferIdx].getColorBuffer());
      resolve();
    });
  }

}
