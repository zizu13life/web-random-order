import { ToastrService } from 'ngx-toastr';
import { Order } from './models/order';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { tap, finalize, filter } from 'rxjs/operators';
import { User } from '../user/models/user';
import { UserService } from '../user/service/user.service';
import { OrderService } from './services/order.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/components/servises/auth.service';
import { WebsoketEventService } from '../websoket/event/services/websoket-event.service';
import { WebsocketEvent, WebsocketEventType } from '../websoket/event/models/models';
import { merge } from 'rxjs';
import { NotyfToast } from './components/order-toastr/order-toastr.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  orderLoading = true;

  // order
  order: Order;

  unlinkedOrders: Order[] = [];
  unlinkedOrderPage = 0;
  priorityPalete = ["#c64c50", "#e3cc1e", "#04e772"]

  linkedOrders: Order[] = [];
  linkedOrderPaginationDate = new Date();
  linkedOrderFilterDate = null;

  constructor(public userService: UserService,
    private orderService: OrderService,
    public authService: AuthService,
    private toastr: ToastrService,
    private websoketEventService: WebsoketEventService,
  ) {
    this.prepareDefaulOrder();
    this.watchOrderChange();
  }


  watchOrderChange() {
    this.websoketEventService.onEvent
      .pipe(filter(e => e.type == WebsocketEventType.USER_UPDATE_ORDER_LIST))
      .subscribe(this.reloadUnlinkedOrders.bind(this));

    (this.websoketEventService.onEvent as EventEmitter<WebsocketEvent<Order>>).pipe(
      filter(e => e.type == WebsocketEventType.USER_TAKE_ORDER),
      tap(event => {
        this.toastr.info(event.data as any, null, { toastComponent: NotyfToast, timeOut: 60000 });
      }))
      .subscribe(() => {
        this.reloadLinkedOrders();
        this.reloadUnlinkedOrders();
      });
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

          setTimeout(() => {
            f.form.markAsUntouched();
            f.form.markAsPristine();
          }, 1000)
        });
    }
  }

  remove(order: Order) {
    this.orderService.remove(order.id)
      .pipe(this.orderLoadingPipe())
      .subscribe(() => {
        order.rejectedAt = new Date();
        order.rejectedById = this.authService.currentUser.id;
      });
  }

  askForReject(order: Order) {
    if (confirm("Are you sure?")) {
      this.remove(order);
    }
  }

  linkRandomOrderToMe() {
    this.orderService.linkRandomOrderToMe()
      .pipe(this.orderLoadingPipe())
      .subscribe();
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
    if (this.unlinkedOrderPage) {
      this.unlinkedOrderPage++;
      this.loadUnlinkedOrders();
    }
  }

  loadUnlinkedOrders() {
    this.orderService.getUnlinked(this.unlinkedOrderPage)
      .pipe(this.orderLoadingPipe())
      .subscribe(data => {
        if (data.length == 0) this.unlinkedOrderPage = null;
        this.unlinkedOrders.push(...data);
      });
  }

  /**
   * LINKED
   */

  reloadLinkedOrders() {
    this.linkedOrderPaginationDate = new Date();
    this.linkedOrders = [];
    this.loadLinkedOrders(true);
  }

  loadMoreLinkedOrders() {
    if (this.linkedOrderPaginationDate) {
      this.linkedOrderPaginationDate = this.linkedOrders?.[0]?.linkedAt;
      this.loadLinkedOrders();
    }
  }

  loadLinkedOrders(scrollDown: boolean = false) {
    this.orderService.getLinked(this.linkedOrderPaginationDate, this.linkedOrderFilterDate)
      .pipe(this.orderLoadingPipe())
      .subscribe(data => {
        if (data.length == 0) this.linkedOrderPaginationDate = null;
        this.linkedOrders.unshift(...data.reverse());
        this.scrollDownLinkedListOnNextRepaint = scrollDown;
      });
  }

  private prepareDefaulOrder() {
    this.order = { description: null, name: null, priority: 3 };
  }

  ngOnInit() {
    this.loadUnlinkedOrders();
    this.reloadLinkedOrders();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollDownLinkedListOnNextRepaint = false;
  ngAfterViewChecked() {
    if (this.scrollDownLinkedListOnNextRepaint) {
      this.scrollToBottom();
      setTimeout(() => {
        this.scrollDownLinkedListOnNextRepaint = false;
      }, 0);
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  clearlinkedOrderFilterDate() {
    this.linkedOrderFilterDate = null;
    this.reloadLinkedOrders();
  }

  trackByFn(index, item) {
    return item?.id || index;
  }
}
