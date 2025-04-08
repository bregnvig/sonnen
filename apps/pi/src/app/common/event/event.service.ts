import { Injectable } from '@nestjs/common';
import { SonnenEvent } from '@sonnen/data';
import { FirestoreService } from '../../firestore';


@Injectable()
export class EventService {

  constructor(private firestore: FirestoreService) {}

  async add(event: SonnenEvent) {
    return this.firestore.db.collection('events').add(event);
  }
}
