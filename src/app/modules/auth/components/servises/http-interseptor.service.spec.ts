/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpInterseptorService } from './http-interseptor.service';

describe('Service: HttpInterseptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpInterseptorService]
    });
  });

  it('should ...', inject([HttpInterseptorService], (service: HttpInterseptorService) => {
    expect(service).toBeTruthy();
  }));
});
