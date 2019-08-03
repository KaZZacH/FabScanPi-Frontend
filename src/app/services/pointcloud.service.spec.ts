import { TestBed } from '@angular/core/testing';

import { PointcloudService } from './pointcloud.service';

describe('PointcloudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PointcloudService = TestBed.get(PointcloudService);
    expect(service).toBeTruthy();
  });
});
