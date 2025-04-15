import { Component, inject } from '@angular/core';
import { Messaging, onMessage } from '@angular/fire/messaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MessagePayload } from '@firebase/messaging';
import { filter, first, Observable, switchMap } from 'rxjs';

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

  constructor() {
    const messaging = inject(Messaging);
    const message$ = new Observable<MessagePayload>((sub) => onMessage(messaging, (msg) =>
      sub.next(msg)),
    );

    const snackBar = inject(MatSnackBar);
    message$.subscribe((msg: MessagePayload) => {
      snackBar.open(msg.notification?.title ?? 'Missing title', 'OK', {
        duration: 5000,
      });
    });

    const updates = inject(SwUpdate);
    updates.versionUpdates.pipe(
      filter(event => event.type === 'VERSION_READY'),
      first(),
      switchMap(() => snackBar.open('🤩 Ny version klar', 'OPDATER', {duration: 10000}).onAction()),
      switchMap(() => updates.activateUpdate()),
      first(),
    ).subscribe(() => location.reload());
  }

}
