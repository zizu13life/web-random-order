import { ToastrModule, ToastrService } from 'ngx-toastr';
import { WebsoketEventModule } from './../websoket/event/websoket-event.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotyfToast } from './components/order-toastr/order-toastr.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSortModule,
    MatIconModule,
    InfiniteScrollModule,
    WebsoketEventModule,
    ToastrModule,
  ],
  declarations: [
    NotyfToast,
    OrderComponent,
  ]
})
export class OrderModule { }
