import { TestBed } from '@angular/core/testing';

import { ConnectionInterfaceService } from './connection-interface.service';

describe('ConnectionInterfaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectionInterfaceService = TestBed.get(ConnectionInterfaceService);
    expect(service).toBeTruthy();
  });
});
