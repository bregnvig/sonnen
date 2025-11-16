import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore, limit, orderBy, query, where } from '@angular/fire/firestore';
import { collectionPath, SonnenEvent } from '@sonnen/data';
import { map, Observable } from 'rxjs';
import { converter } from '../converter';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {

  events$: Observable<SonnenEvent[]>;
  predictions$: Observable<SonnenEvent[]>;

  constructor() {
    const afs = inject(Firestore);
    this.events$ = collectionData(
      query(
        collection(afs, collectionPath.events).withConverter<SonnenEvent>(converter.timestamp<SonnenEvent>()),
        where('source', '!=', 'PredictSolarProductionService:Prediction'),
        orderBy('timestamp', 'desc'),
        limit(50),
      ),
    ).pipe(
      map(events => events.filter(event => !event.source?.startsWith('PredictSolarProductionService')).slice(0, 40)),
    );
    this.predictions$ = collectionData(
      query(
        collection(afs, collectionPath.events).withConverter<SonnenEvent>(converter.timestamp<SonnenEvent>()),
        where('source', '==', 'PredictSolarProductionService:Prediction'),
        orderBy('timestamp', 'desc'),
        limit(20),
      ),
    );
  }
}
