import { Order } from './../models/order';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { pipe } from 'rxjs';


const BASE_URL = environment.baseApiUrl + 'orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  onChange = new EventEmitter();

  constructor(private http: HttpClient) { }

  getUnlinked(page: number = 0) {
    return this.http.get<Order[]>(BASE_URL + '/unlinked', { params: { page: page?.toString() } })
      .pipe(map(orders => orders.map(order => this.converter(order))));
  }

  getLinked(date: Date = new Date(), flterDate: Date) {
    return this.http.get<Order[]>(BASE_URL + '/linked', { params: { date: date?.toString(), flterDate: flterDate?.toString() || '' } })
      .pipe(map(orders => orders.map(order => this.converter(order))));
  }

  create(order: Order) {
    return this.http.post<Order>(BASE_URL, order)
      .pipe(this.onChangePipe(), map(order => this.converter(order)));
  }

  linkRandomOrderToMe() {
    return this.http.post<Order>(BASE_URL + '/link/random/to/me', null)
      .pipe(this.onChangePipe(), map(order => this.converter(order)));
  }

  remove(id: number) {
    return this.http.delete(BASE_URL + '/' + id)
      .pipe(this.onChangePipe());
  }

  onChangePipe<T>() {
    return tap<T>(() => this.onChange.emit());
  }

  converter(order: Order) {
    order.linkedAt = order.linkedAt ? new Date(order.linkedAt) : null;
    return order;
  }
}
