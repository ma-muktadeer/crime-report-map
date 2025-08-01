import { TestBed } from '@angular/core/testing';

import { NabItemsService } from './nab-items.service';

describe('NabItemsService', () => {
  let service: NabItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NabItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
