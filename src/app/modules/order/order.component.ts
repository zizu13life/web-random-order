import { Order } from './models/order';
import { Component, OnInit } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { User } from '../user/models/user';
import { UserService } from '../user/service/user.service';
import { OrderService } from './services/order.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/components/servises/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderLoading = true;

  // order
  order: Order;

  unlinkedOrders: Order[] = [];
  unlinkedOrderPage = 0;
  priorityPalete = ["#04e772", "#14b85b", "#188c42", "#1b5f26", "#a6b760", "#e3cc1e", "#d6aa30", "#c98741", "#c98741", "#8c0f13", "#c64c50"]

  linkedOrders: Order[] = [];
  linkedOrderDate = new Date();


  constructor(public userService: UserService,
    private orderService: OrderService,
    public authService: AuthService,
  ) {
    this.prepareDefaulOrder();
    this.watchOrderChange();
  }

  watchOrderChange() {
    this.orderService.onChange.subscribe(this.reloadUnlinkedOrders.bind(this));
  }

  orderLoadingPipe<T>() {
    this.orderLoading = true;
    return finalize<T>(() => this.orderLoading = false);
  }

  addNewOrder(f: NgForm) {
    if (f.valid) {
      this.orderService.create(this.order)
        .pipe(this.orderLoadingPipe())
        .subscribe(data => {
          this.prepareDefaulOrder();
          (document.activeElement as HTMLElement).blur();
          setTimeout(() => {
            f.form.markAsUntouched();
          })
        });
    }
  }

  remove(order: Order) {
    this.orderService.remove(order.id)
      .pipe(this.orderLoadingPipe())
      .subscribe();
  }

  linkRandomOrderToMe() {
    this.orderService.linkRandomOrderToMe()
      .pipe(this.orderLoadingPipe())
      .subscribe(() => {
        this.reloadLinkedOrders();
      });
  }

  /**
   * UNLINKED
   */

  reloadUnlinkedOrders() {
    this.unlinkedOrderPage = 0;
    this.unlinkedOrders = [];
    this.loadUnlinkedOrders();
  }

  loadMoreUnlinkedOrders() {
    if(this.unlinkedOrderPage){
      this.unlinkedOrderPage++;
      this.loadUnlinkedOrders();
    }    
  }

  loadUnlinkedOrders() {
    this.orderService.getUnlinked(this.unlinkedOrderPage)
      .pipe(this.orderLoadingPipe())
      .subscribe(data => {
        if(data.length == 0) this.unlinkedOrderPage = null;
        this.unlinkedOrders.push(...data);
      });
  }

  /**
   * LINKED
   */

  reloadLinkedOrders() {
    this.linkedOrderDate = new Date();
    this.linkedOrders = [];
    this.loadLinkedOrders();
  }

  loadMoreLinkedOrders() {
    if (this.linkedOrderDate) {
      this.linkedOrderDate = this.linkedOrders?.[0]?.linkedAt;
      this.loadLinkedOrders();
    }
  }

  loadLinkedOrders() {
    this.orderService.getLinked(this.linkedOrderDate)
      .pipe(this.orderLoadingPipe())
      .subscribe(data => {
        if (data.length == 0) this.linkedOrderDate = null;
        this.linkedOrders.push(...data.reverse());
      });

  }

  private prepareDefaulOrder() {
    this.order = { description: null, name: null, priority: 1 };
  }

  ngOnInit() {
    this.loadUnlinkedOrders();
    this.loadLinkedOrders();
  }

  trackByFn(index, item) {
    return item?.id || index;
  }
}
