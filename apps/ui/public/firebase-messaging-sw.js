// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import {getMessaging} from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-sw.js';

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDvORfZRul7l1rCp4LLucyYZCx_KtDSRBU',
  authDomain: 'sonnen.bregnvig.dk',
  projectId: 'sonnen-86a54',
  storageBucket: 'sonnen-86a54.firebasestorage.app',
  messagingSenderId: '535687833546',
  appId: '1:535687833546:web:783c35e5ca90e359bad133',
  measurementId: 'G-RG8GKSQYWG',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

