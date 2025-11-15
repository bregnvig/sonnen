import { Injectable, Logger } from '@nestjs/common';
import { converter } from '@sonnen/backend/firebase';
import { collectionPath, documentPath, SonnenEvent, User } from '@sonnen/data';
import { firestore } from 'firebase-admin';
import { FirebaseService } from '../../firebase';


@Injectable()
export class EventService {

  #logger = new Logger(EventService.name);

  constructor(private firebase: FirebaseService) {
  }

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
    this.#logger.debug(`Sending notification to ${ tokes.length } users`);
    while (tokes.length > 0) {
      const token = tokes.pop();
      try {
        await this.firebase.sendToToken(token, title, message);
      } catch (error) {
        const user = users.find(u => u.tokens.includes(token));

        this.#logger.warn(`Unable to send to ${ token }. User ${ user?.displayName ?? 'Unknown' }`);
        this.#logger.error(error);
        if(user) {
          const prunedTokens = user.tokens.filter(existingToken => existingToken !== token);
          await this.firebase.db.doc(documentPath.user(user.uid)).update({
            tokens: prunedTokens
          })
        }
      }
    }

  }


}
