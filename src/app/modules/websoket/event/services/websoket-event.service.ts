import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class WebsoketEventService {

  constructor() {
    this.init();
  }


  init() {
    const socket = io(environment.baseApiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    socket.open();

    socket.on('connect', function () {
      console.log('Connected');


    });

    socket.emit('events', { test: 'test' });
    socket.emit('identity', 0, response =>
      console.log('Identity:', response),
    );

    socket.on('events', function (data) {
      console.log('event', data);
    });
    socket.on('exception', function (data) {
      console.log('event', data);
    });
    socket.on('disconnect', function () {
      console.log('Disconnected');
    });
  }

}
