import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { HttpInterceptorService } from '../auth/components/servises/http-interseptor.service';


@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
  ],
  exports: [
    HttpClientModule,
  ]
})
export class SharedHttpModule { }
