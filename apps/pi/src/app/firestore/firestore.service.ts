import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFile } from 'node:fs/promises';

@Injectable()
export class FirestoreService {
  readonly #logger = new Logger(FirestoreService.name);

  #db: admin.firestore.Firestore;

  constructor() {
    this.#logger.debug('FirestoreService started');
  }

  async init() {
    this.#logger.debug(`Firestore project initializing`);
    const credential = await readFile(process.env.SONNEN_FIREBASE_ADMIN_SDK, 'utf-8')
      .then(data => JSON.parse(data));
    this.#logger.debug(`Firestore project "${credential.project_id} has been read`);
    const app = admin.initializeApp({credential: admin.credential.cert(credential)});
    this.#db = app.firestore();
    this.#logger.debug(`Firestore project "${credential.project_id} has been initialized`);
  }

  get db() {
    if (!this.#db) {
      throw new Error('Firestore not initialized');
    }
    return this.#db;
  }

}
