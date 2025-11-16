import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { SonnenEvent } from '@sonnen/data';

@Component({
  selector: 'lib-event-card',
  imports: [
    DatePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    TitleCasePipe,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ (event().title) | titlecase }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="flex flex-col gap-2">
          <p>{{ event().message }}</p>
          @if (event().data) {
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>Info</mat-panel-title>
              </mat-expansion-panel-header>
              <!-- @formatter:off -->
@if (data(); as data) {
  <pre class="font-mono"><code>{{ data }}</code></pre>
}
              <!-- @formatter:on -->
            </mat-expansion-panel>
          }
          <small class="text-tiny">{{ +(event().timestamp ?? 0) | date: 'short' }}</small>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCard {
  event = input.required<SonnenEvent>();
  data = computed(() => {
    const event = this.event();
    return event?.data ? JSON.stringify(event.data, null, 2) : null
  })
}
