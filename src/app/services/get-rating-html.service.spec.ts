import { TestBed } from '@angular/core/testing';

import { GetRatingHtmlService } from './get-rating-html.service';

describe('GetRatingHtmlService', () => {
  let service: GetRatingHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRatingHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
