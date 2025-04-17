import { Injectable, Logger } from '@nestjs/common';
import { collectionPath, User } from '@sonnen/data';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
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

  async writeDayData<T>(collection: string, data: T) {
    const collectionRef = this.db.collection(collection);
    const document = collectionRef.doc(DateTime.now().toFormat('yyyy-MM-dd'));
    await document.set({
      [collection]: firestore.FieldValue.arrayUnion({...data, timestamp: firestore.Timestamp.now()}),
    }, {merge: true});

  }

  async sendToUsers(title: string, message: string) {
    const users = await this.db.collection(collectionPath.users).where('tokens.0', '!=', null).get().then(
      value => value.docs.map(d => d.data() as User),
    );
    const tokes = users.flatMap(u => u.tokens);
    while (tokes.length > 0) {
      const token = tokes.pop();
      await this.sendToToken(token, title, message);
    }

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
