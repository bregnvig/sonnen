import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { User } from '@sonnen/data';
import { firstValueFrom } from 'rxjs';
import { UserApiService } from './user-api.service';

export interface UserState {
  user: User | undefined;
  unauthorized: boolean;
  authorized: boolean;
  loading: boolean;
  loaded: boolean;
  error: any | undefined;
}

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState<UserState>({
    user: undefined,
    unauthorized: true,
    authorized: false,
    loading: false,
    loaded: false,
    error: undefined,
  }),
  withMethods((store, service = inject(UserApiService)) => ({
      async updateUser(partialUser: Partial<User>) {
        firstValueFrom(service.updatePlayer(partialUser)).then(
          () => patchState(store, ({user: {...store.user() as User, ...partialUser}})),
          error => patchState(store, {error}),
        );
      },
      async logout() {
        return service.signOut().then(
          () => patchState(store, {user: undefined, authorized: false, unauthorized: true}),
          error => patchState(store, {error}),
        );
      },
    }),
  ),
  withHooks({
    onInit(store) {
      inject(UserApiService).user$.pipe(
        takeUntilDestroyed(),
      ).subscribe({
        next: user => patchState(store, {
          user,
          loaded: true,
          loading: false,
          unauthorized: !user,
          authorized: !!user,
        }),
        error: error => patchState(store, {error, loaded: false, loading: false}),
      });
    },
  }),
);
