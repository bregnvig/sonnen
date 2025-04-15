import { Injectable } from '@nestjs/common';
import { SonnenEvent } from '@sonnen/data';
import { FirebaseService } from '../../firebase';


@Injectable()
export class EventService {

  constructor(private firebase: FirebaseService) {}

  async add(event: SonnenEvent) {
    return this.firebase.db.collection('events').add(event);
  }
}
