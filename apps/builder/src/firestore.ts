import { requiredValue } from '@sonnen/utils';
import * as admin from 'firebase-admin';
import { readFile } from 'fs/promises';

let db: admin.firestore.Firestore | undefined;

export const initializeFirestore = async () => {

  const uri = requiredValue(process.env.SONNEN_FIREBASE_ADMIN_SDK, 'Firebase Admin SDK');
  const credential = await readFile(uri, 'utf-8')
    .then(data => JSON.parse(data));
  const app = admin.initializeApp({credential: admin.credential.cert(credential)});
  return db = app.firestore();
};

export const firestore = () => {
  return requiredValue(db, 'Firestore not initialized');
};
