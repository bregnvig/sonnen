import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'common-sidenav-button',
  template: `
    <button mat-list-item [disabled]="disabled()">
          <span class="flex flex-row items-center">
            <mat-icon>{{ icon() }}</mat-icon>
            <span class="ms-2">
              <ng-content></ng-content>
            </span>
          </span>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, MatIcon],
})
export class SidenavButtonComponent {
  readonly icon = input.required<string>();
  readonly disabled = input<boolean>(false);

}
