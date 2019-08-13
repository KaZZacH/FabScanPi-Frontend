import { Injectable } from '@angular/core';
import { PointCloudPoint, PointcloudService } from './pointcloud.service';

@Injectable({providedIn: 'root'})
export class ScanService
{
  public pointcloud: PointcloudService = undefined;
  private pointCloudBuffer: Array<PointcloudService> = [];

  private readonly pointCloudSize: number = 0;
  private readonly onPointCloudSwapEnd: Function;

  constructor(cloudSize: number, onPointCloudSwapEnd: Function)
  {
    this.pointCloudSize = cloudSize;
    this.pointCloudBuffer.push(new PointcloudService(cloudSize, "Fabscan Pointcloud #0"));
    this.pointcloud = this.pointCloudBuffer[0];
    this.onPointCloudSwapEnd = onPointCloudSwapEnd;
  }

  public addPoints(points: Array<PointCloudPoint>)
  {
    let pointsBufferSize: number = points.length * 3;

    if (this.pointcloud.getCloudBufferIndex() + pointsBufferSize <= this.pointcloud.getBufferSize())
    {
      this.pointcloud.addPoints(points);
    }
    else
    {
      console.log("=== SWAPPING ===");
      this.pointCloudBuffer.push(new PointcloudService(this.pointCloudSize, "Fabscan Pointcloud #" + this.pointCloudBuffer.length));
      this.pointcloud.update();
      this.pointcloud = this.pointCloudBuffer[this.pointCloudBuffer.length - 1];
      this.onPointCloudSwapEnd();
      this.addPoints(points);
    }
  }

  public getPointCloudBuffer() { return this.pointCloudBuffer; }
}
