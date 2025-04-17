import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserStore } from '@sonnen/api';
import { SidebarComponent } from '@sonnen/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    MatToolbarModule,
    MatIconButton,
    MatSidenavModule,
    MatListModule,
    MatIcon,
    RouterOutlet,
    SidebarComponent,
    RouterLink,
  ],
})
export class HomeComponent {
  #breakpointObserver = inject(BreakpointObserver);
  user = inject(UserStore).user;

  isHandset = toSignal(this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches)));

  logout() {

  }

}
