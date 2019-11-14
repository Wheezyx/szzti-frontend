import { TestBed } from '@angular/core/testing';

import { RenterService } from './renter.service';

describe('RenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RenterService = TestBed.get(RenterService);
    expect(service).toBeTruthy();
  });
});
