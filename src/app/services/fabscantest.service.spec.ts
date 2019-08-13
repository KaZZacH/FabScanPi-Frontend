import { TestBed } from '@angular/core/testing';

import { FabscantestService } from './fabscantest.service';

describe('FabscantestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FabscantestService = TestBed.get(FabscantestService);
    expect(service).toBeTruthy();
  });
});
