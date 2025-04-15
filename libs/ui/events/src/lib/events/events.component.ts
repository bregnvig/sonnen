import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { EventApiService } from '@sonnen/api';
import { CardPageComponent } from '@sonnen/common';

@Component({
  selector: 'events-page',
  imports: [CommonModule, CardPageComponent, MatCard, MatCardHeader, MatCardContent, MatCardTitle, TitleCasePipe, DatePipe],
  template: `
    <common-card-page>
      @for (event of events(); track $index) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              {{ event.type | titlecase }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="flex flex-col gap-2">
              <p>{{ event.message }}</p>
              @if (data()[$index]; as data) {
                <pre>
                  <code>{{ data }}</code>
                </pre>
              }
              <small class="text-tiny">{{ +(event.timestamp ?? 0) | date: 'short' }}</small>
            </div>
          </mat-card-content>
        </mat-card>
      }

    </common-card-page>
  `,
  styles: ``,
})
export class EventsComponent {
  events = toSignal(inject(EventApiService).events$);
  data = computed(() => {
    const events = this.events();
    if (events?.length) {
      return events.map(event => event.data ? JSON.stringify(event.data, null, 2) : null);
    }
    return [];
  });
}
