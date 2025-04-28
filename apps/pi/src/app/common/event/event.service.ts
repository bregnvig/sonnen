import { Injectable, Logger } from '@nestjs/common';
import { converter } from '@sonnen/backend/firebase';
import { collectionPath, SonnenEvent, User } from '@sonnen/data';
import { firestore } from 'firebase-admin';
import { FirebaseService } from '../../firebase';


@Injectable()
export class EventService {

  #logger = new Logger(EventService.name);

  constructor(private firebase: FirebaseService) {}

  async add(event: SonnenEvent) {
    return this.firebase.db.collection('events').withConverter(converter).add(({
      ...event,
      timestamp: firestore.Timestamp.now(),
    }));
  }

  async sendToUsers(title: string, message: string) {
    const users = await this.firebase.db.collection(collectionPath.users).where('tokens', '!=', null).get().then(
      value => value.docs.map(d => d.data() as User),
    );
    const tokes = users.flatMap(u => u.tokens ?? []);
    this.#logger.debug(`Sending notification to ${tokes.length} users`);
    while (tokes.length > 0) {
      const token = tokes.pop();
      await this.firebase.sendToToken(token, title, message);
    }

  }


}
