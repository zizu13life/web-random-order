import { Order } from './../../models/order';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { WebsoketEventService } from 'src/app/modules/websoket/event/services/websoket-event.service';

@Component({
  selector: 'notyf-toast-component',
  styleUrls: ['./order-toastr.component.scss'],
  templateUrl: './order-toastr.component.html',
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate(
          '300ms ease-out',
          keyframes([
            style({
              opacity: 0,
              bottom: '-15px',
              'max-height': 0,
              'max-width': 0,
              'margin-top': 0,
            }),
            style({
              opacity: 0.8,
              bottom: '-3px',
            }),
            style({
              opacity: 1,
              bottom: '0',
              'max-height': '200px',
              'margin-top': '12px',
              'max-width': '400px',
            }),
          ]),
        ),
      ),
      state(
        'active',
        style({
          bottom: '0',
          'max-height': '200px',
          'margin-top': '12px',
          'max-width': '400px',
        }),
      ),
      transition(
        'active => removed',
        animate(
          '300ms ease-out',
          keyframes([
            style({
              opacity: 1,
              transform: 'translateY(0)'
            }),
            style({
              opacity: 0,
              transform: 'translateY(25%)'
            }),
          ]),
        ),
      ),
    ]),
  ],
})
export class NotyfToast extends Toast {
order: Order;
  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
    this.order = this.message as any;
  }
}