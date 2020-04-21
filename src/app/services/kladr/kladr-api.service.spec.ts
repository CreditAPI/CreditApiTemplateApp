import { TestBed } from '@angular/core/testing';

import { KladrApiService } from './kladr-api.service';

describe('KladrApiService', () => {
  let service: KladrApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KladrApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
