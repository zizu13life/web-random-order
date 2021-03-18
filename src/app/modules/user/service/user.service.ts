import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, USER_API_BASE_URL } from '../models/user';
import { WebsoketEventService } from '../../websoket/event/services/websoket-event.service';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WebsocketEvent, WebsocketEventType } from '../../websoket/event/models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  activeUsers = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient, private websoketEventService: WebsoketEventService) {
    this.listenActiveUsers();
  }

  private listenActiveUsers() {
    this.getAllActive().subscribe(users => this.activeUsers.next(users));

    this.websoketEventService.onEvent
      .pipe(map(e => e as WebsocketEvent<User>))
      .subscribe(event => {
        switch (event.type) {
          case WebsocketEventType.USER_CONNECTED: {
            const index = this.activeUsers.value.findIndex(u => u.id == event.data.id);
            if (index == -1) {
              this.activeUsers.value.push(event.data);
              this.activeUsers.next(this.activeUsers.value);
            }
            break;
          }
          case WebsocketEventType.USER_DISCONNECTED: {
            const index = this.activeUsers.value.findIndex(u => u.id == event.data.id);
            if (index != -1) {
              this.activeUsers.value.splice(index, 1);
              this.activeUsers.next(this.activeUsers.value);
            }
            break;
          }
        }
      })
  }

  getAccount() {
    return this.http.get<User>(USER_API_BASE_URL + '/me');
  }

  getAccountWithAuthDetails() {
    return this.http.get<{ user: User, exp: number }>(USER_API_BASE_URL + '/me/account');
  }

  getAllActive() {
    return this.http.get<User[]>(USER_API_BASE_URL + '/active');
  }

  getAll() {
    return this.http.get<User[]>(USER_API_BASE_URL);
  }

}
