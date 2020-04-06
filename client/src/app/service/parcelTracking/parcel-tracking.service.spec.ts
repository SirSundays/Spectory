import { TestBed } from '@angular/core/testing';

import { ParcelTrackingService } from './parcel-tracking.service';

describe('ParcelTrackingService', () => {
  let service: ParcelTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcelTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
