import { Injectable } from '@nestjs/common';
import { SonnenEvent } from '@sonnen/data';
import { firestore } from 'firebase-admin';
import { FirebaseService } from '../../firebase';


@Injectable()
export class EventService {

  constructor(private firebase: FirebaseService) {}

  async add(event: SonnenEvent) {
    return this.firebase.db.collection('events').add(({
      ...event,
      timestamp: firestore.Timestamp.now(),
    }));
  }
}
