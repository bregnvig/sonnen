import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore, limit, orderBy, query } from '@angular/fire/firestore';
import { collectionPath, SonnenEvent } from '@sonnen/data';
import { Observable } from 'rxjs';
import { converter } from '../converter';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {

  events$: Observable<SonnenEvent[]>;

  constructor(private afs: Firestore) {
    this.events$ = collectionData(
      query(
        collection(afs, collectionPath.events).withConverter<SonnenEvent>(converter.timestamp<SonnenEvent>()),
        orderBy('timestamp', 'desc'),
        limit(5),
      ),
    );
  }
}
