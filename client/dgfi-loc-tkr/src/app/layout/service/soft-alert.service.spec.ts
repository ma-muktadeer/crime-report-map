import { TestBed } from '@angular/core/testing';

import { SoftAlertService } from './soft-alert.service';

describe('SoftAlertService', () => {
  let service: SoftAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
