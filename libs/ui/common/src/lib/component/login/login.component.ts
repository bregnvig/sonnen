import { Component, computed, effect, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PlayerApiService, PlayerStore } from '@f2020/api';
import { isNullish } from '@f2020/tools';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'common-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatButtonModule,
    LoadingComponent,
  ],
})
export class LoginComponent {

  isAuthorizationKnown: Signal<boolean>;
  isUnauthorized: Signal<boolean>;

  constructor(private service: PlayerApiService, private router: Router) {
    const store = inject(PlayerStore);
    effect(() => store.authorized() && this.router.navigate(['']));
    this.isUnauthorized = store.unauthorized;
    this.isAuthorizationKnown = computed(() => !isNullish(store.authorized()));
  }

  loginWithGoogle() {
    this.router.navigate(['/'])
      .then(() => this.service.signInWithGoogle());
  }

  loginWithFacebook() {
    this.router.navigate(['/'])
      .then(() => this.service.signInWithFacebook());
  }

}
