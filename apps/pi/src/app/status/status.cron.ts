import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { collectionPath } from '@sonnen/data';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { SonnenService } from '../common';
import { FirestoreService } from '../firestore';

@Injectable()
export class StatusCronService {

  readonly #logger = new Logger(StatusCronService.name);

  constructor(private service: SonnenService, private firestore: FirestoreService) {
    this.#logger.debug('StatusCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleStatus() {
    const status = await firstValueFrom(this.service.getStatus());
    const collection = this.firestore.db.collection(collectionPath.averageConsumption);
    const document = await collection.doc(DateTime.now().toFormat('yyyy-MM-dd'));
    await document.set({
      consumption: firestore.FieldValue.arrayUnion({consumption: status.consumptionAvg, timestamp: firestore.Timestamp.now()}),
    }, {merge: true});

    this.#logger.log(`Average consumption ${status.consumptionAvg}W`);
  }
}
