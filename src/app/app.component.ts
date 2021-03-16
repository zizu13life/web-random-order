import { Component } from '@angular/core';
import { WebsoketEventService } from './modules/websoket/event/services/websoket-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private websoketEventService: WebsoketEventService){
    
  }
}
