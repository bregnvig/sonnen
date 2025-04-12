import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { EventApiService } from '@sonnen/api';
import { CardPageComponent } from '@sonnen/common';

@Component({
  selector: 'events-page',
  imports: [CommonModule, CardPageComponent, MatCard, MatCardHeader, MatCardContent, MatCardTitle, TitleCasePipe],
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
            {{ event.message }}
          </mat-card-content>
        </mat-card>
      }

    </common-card-page>
  `,
  styles: ``,
})
export class EventsComponent {
  events = toSignal(inject(EventApiService).events$);
}
