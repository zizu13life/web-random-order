import { environment } from 'src/environments/environment';
import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { WebsocketEvent } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class WebsoketEventService {
  onEvent = new EventEmitter<WebsocketEvent<any>>();

  constructor() {
    this.init();
  }

  init() {
    const socket = io(environment.baseApiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', function () {
      console.log('Connected');
    });

    socket.emit('events', {});

    socket.on('events', (data) => {
      console.log('event', data);
      this.onEvent.emit(data);
    });

    socket.on('exception', function (data) {
      console.log('event', data);
    });

    socket.on('disconnect', function () {
      console.log('Disconnected');
    });
  }

}
