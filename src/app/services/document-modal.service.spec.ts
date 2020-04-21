import { TestBed } from '@angular/core/testing';

import { DocumentModalService } from './document-modal.service';

describe('DocumentModalService', () => {
  let service: DocumentModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
