import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Route, Router } from '@angular/router';
import { UserStore } from '@sonnen/api';
import { isNullish } from '@sonnen/utils';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeComponent } from './home/home.component';
import { OriginalNavComponent } from './original-nav/original-nav.component';

const mustBeAuthorized = () => {
  const store = inject(UserStore);
  const router = inject(Router);

  return toObservable(store.unauthorized).pipe(
    filter(unauthorized => !isNullish(unauthorized)),
    map(unauthorized => unauthorized ? router.navigate(['login']).then(() => false) : true),
  );

};

export const appRoutes: Route[] = [
  {
    path: 'original',
    component: OriginalNavComponent,
  },
  {
    path: 'login',
    loadComponent: () => import('@sonnen/common').then(({LoginComponent}) => LoginComponent),
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [mustBeAuthorized],
    children: [
      {
        path: 'events',
        loadChildren: () => import('@sonnen/events').then(m => m.EventsRoutes),
      },

    ],

  },

];
