import { Component, computed, effect, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserApiService, UserStore } from '@sonnen/api';
import { isNullish } from '@sonnen/utils';
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

  constructor(private service: UserApiService, private router: Router) {
    const store = inject(UserStore);
    effect(() => store.authorized() && this.router.navigate(['']));
    this.isUnauthorized = store.unauthorized;
    this.isAuthorizationKnown = computed(() => !isNullish(store.authorized()));
  }

  loginWithGoogle() {
    this.router.navigate(['/'])
      .then(() => this.service.signInWithGoogle());
  }

}
