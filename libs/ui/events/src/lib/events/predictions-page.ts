import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventApiService } from '@sonnen/api';
import { EventsList } from './events-list';

@Component({
  selector: 'lib-events',
  template: `
    <lib-events-list [events]="events()"/>
  `,
  imports: [
    EventsList,
  ],
})

export class PredictionsPage {
  events = toSignal(inject(EventApiService).predictions$);

}
