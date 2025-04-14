import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService, UserStore } from '@sonnen/api';

@Component({
  selector: 'app-splash.flex-auto',
  template: `
    <div class="w-full h-screen flex flex-col items-center justify-center" (click)="login()">
      <img src="splash.png" alt="splash" class="object-cover">
    </div>
  `,
  imports: [],
})

export class SplashComponent {
  #service = inject(UserApiService);

  constructor() {
    const router = inject(Router);
    const store = inject(UserStore);
    effect(() => {
      const isAuthorized = store.authorized();
      isAuthorized && router.navigate(['/events']);
    });
  }

  login() {
    this.#service.signInWithGoogle();
  }
}
