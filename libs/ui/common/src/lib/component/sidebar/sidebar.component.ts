import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { UserStore } from '@sonnen/api';
import { SidenavButtonComponent } from './sidenav-button/sidenav-button.component';

@Component({
  selector: 'common-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatListModule, MatDividerModule, RouterLink, SidenavButtonComponent, NgOptimizedImage],
})
export class SidebarComponent {

  closing = output<void>();
  user = inject(UserStore).user;
}
