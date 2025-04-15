import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFile } from 'node:fs/promises';

@Injectable()
export class FirebaseService {
  readonly #logger = new Logger(FirebaseService.name);

  #db: admin.firestore.Firestore;
  #app: admin.app.App;

  constructor() {
    this.#logger.debug('FirestoreService started');
  }

  async init() {
    this.#logger.debug(`Firestore project initializing`);
    const credential = await readFile(process.env.SONNEN_FIREBASE_ADMIN_SDK, 'utf-8')
      .then(data => JSON.parse(data));
    this.#logger.debug(`Firestore project "${credential.project_id} has been read`);
    this.#app = admin.initializeApp({credential: admin.credential.cert(credential)});
    this.#db = this.#app.firestore();
    this.#logger.debug(`Firestore project "${credential.project_id} has been initialized`);
  }

  get db() {
    if (!this.#db) {
      throw new Error('Firestore not initialized');
    }
    return this.#db;
  }

  async sendToToken(token: string, title: string, body: string) {
    return this.#app.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          badge: 'https://sonnen.bregnvig.dk/icons/icon-192x192.png',
          icon: 'https://sonnen.bregnvig.dk/icons/icon-192x192.png',
        },
      },
    });
  }

}
