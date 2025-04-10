import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    //provideZoneChangeDetection({eventCoalescing: true}),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const db = getFirestore();
      if (environment.useEmulator) {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.warn('Using firestore emulator');
        connectAuthEmulator(getAuth(), 'http://localhost:9099');
        console.warn('Using auth emulator');
      }
      return db;
    }),
    provideFunctions(() => {
      const functions = getFunctions(undefined, 'europe-west1');
      if (environment.useEmulator) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
        console.warn('Using functions emulator');
      }
      return functions;
    }),
    provideMessaging(() => getMessaging()),
  ],
};
