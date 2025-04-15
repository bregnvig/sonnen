import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { collectionPath, User } from '@sonnen/data';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { EventService, SonnenService } from '../common';
import { FirebaseService } from '../firebase';

@Injectable()
export class ProductionCronService {

  readonly #logger = new Logger(ProductionCronService.name);
  latestNotification: DateTime | null = null;

  constructor(private service: SonnenService, private firebase: FirebaseService, private eventService: EventService) {
    this.#logger.debug('ProductionCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async production() {
    const status = await firstValueFrom(this.service.status$);
    const collection = this.firebase.db.collection(collectionPath.production);
    const document = collection.doc(DateTime.now().toFormat('yyyy-MM-dd'));
    await document.set({
      consumption: firestore.FieldValue.arrayUnion({production: status.productionW, timestamp: firestore.Timestamp.now()}),
    }, {merge: true});
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async surplusProduction() {
    const status = await firstValueFrom(this.service.status$);
    const isProductionMoreThanConsuming = status.productionW > status.consumptionAvg;

    if (isProductionMoreThanConsuming && (!this.latestNotification || this.latestNotification.plus({hour: 12}) < DateTime.now())) {
      this.latestNotification = DateTime.now();
      const users = await this.firebase.db.collection(collectionPath.users).where('tokens.0', '!=', null).get().then(
        value => value.docs.map(d => d.data() as User),
      );
      const message = `Produktionen er nu højere end forbruget. Du bruger ${status.consumptionAvg}W men du producerer ${status.productionW}W`;
      await this.eventService.add({
        type: 'info',
        source: `${ProductionCronService.name}:SurplusProduction`,
        message,
      });
      const tokes = users.flatMap(u => u.tokens);
      while (tokes.length > 0) {
        const token = tokes.pop();
        await this.firebase.sendToToken(token, 'Plus på solen', message);
      }
    }
  }
}
