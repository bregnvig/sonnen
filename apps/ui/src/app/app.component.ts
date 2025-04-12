import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [
    RouterOutlet,

  ],
  selector: 'app-root',
  template: `
    <div class="min-h-screen flex flex-col">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
}
