import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { CardPageComponent, LoadingComponent } from '@sonnen/common';
import { EventCard } from './event-card';
import { SonnenEvent } from '@sonnen/data';

@Component({
  selector: 'lib-events-list',
  imports: [CommonModule, CardPageComponent, EventCard, LoadingComponent],
  template: `
    <common-card-page>
      @if (events(); as events) {
        @for (event of events; track $index) {
          <lib-event-card [event]="event"/>
        }
      } @else {
        <common-loading/>
      }
    </common-card-page>
  `,
  styles: ``,
})
export class EventsList {
  events = input.required<SonnenEvent[] | undefined>();
}
