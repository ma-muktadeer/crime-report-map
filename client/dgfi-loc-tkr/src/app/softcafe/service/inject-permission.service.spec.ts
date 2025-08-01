import { TestBed } from '@angular/core/testing';

import { InjectPermissionService } from './inject-permission.service';

describe('InjectPermissionService', () => {
  let service: InjectPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjectPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
