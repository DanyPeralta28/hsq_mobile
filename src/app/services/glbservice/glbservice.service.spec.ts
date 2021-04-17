import { TestBed } from '@angular/core/testing';

import { GlbserviceService } from './glbservice.service';

describe('GlbserviceService', () => {
  let service: GlbserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlbserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
