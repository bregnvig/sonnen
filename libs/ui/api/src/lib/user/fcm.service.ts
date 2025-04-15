import { inject, Injectable } from '@angular/core';
import { getToken, Messaging } from '@angular/fire/messaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FCMService {

  setupMessaging: () => Promise<void | string>;

  constructor(private snackBar: MatSnackBar) {

    if (location.hostname === 'localhost') {
      this.setupMessaging = () => Promise.resolve();
    } else {
      const messaging = inject(Messaging);
      this.setupMessaging = (): Promise<void | string> => {
        if (Notification.permission === 'denied') {
          return Promise.reject('Notification permission denied');
        }
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const isAlreadyGranted = Notification.permission === 'granted';
            (isAlreadyGranted
                ? Promise.resolve()
                : firstValueFrom(this.snackBar.open('Hvis du vil notifikation skal du trykke OK', 'OK').onAction())
            ).then(
              async () => {
                await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                  type: 'module',
                }).then(serviceWorkerRegistration => getToken(messaging, {
                  serviceWorkerRegistration,
                }).then(token => {
                  isAlreadyGranted && console.log('Already granted', token);
                  resolve(isAlreadyGranted ? undefined : token);
                }).catch(error => reject(error)));
              },
            );
          });
        });
      };
    }
  }

}
