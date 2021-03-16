/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebsoketEventService } from './websoket-event.service';

describe('Service: WebsoketEvent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsoketEventService]
    });
  });

  it('should ...', inject([WebsoketEventService], (service: WebsoketEventService) => {
    expect(service).toBeTruthy();
  }));
});
