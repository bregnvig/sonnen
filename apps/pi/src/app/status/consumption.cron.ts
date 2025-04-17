import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { collectionPath } from '@sonnen/data';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { SonnenService } from '../common';
import { FirebaseService } from '../firebase';

@Injectable()
export class ConsumptionCronService {

  readonly #logger = new Logger(ConsumptionCronService.name);

  constructor(private service: SonnenService, private firestore: FirebaseService) {
    this.#logger.debug('ConsumptionCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async reportConsumption() {
    const status = await firstValueFrom(this.service.status$);
    await this.firestore.writeDayData(collectionPath.averageConsumption, {consumption: status.consumptionAvg});
    const collection = this.firestore.db.collection(collectionPath.averageConsumption);
    const document = collection.doc(DateTime.now().toFormat('yyyy-MM-dd'));
    await document.set({
      consumption: firestore.FieldValue.arrayUnion({consumption: status.consumptionAvg, timestamp: firestore.Timestamp.now()}),
    }, {merge: true});
  }
}
