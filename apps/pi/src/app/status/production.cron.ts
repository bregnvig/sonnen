import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { collectionPath } from '@sonnen/data';
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
    await this.firebase.writeDayData(collectionPath.production, {production: status.productionW});
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async surplusProduction() {
    const status = await firstValueFrom(this.service.status$);
    const isProductionMoreThanConsuming = status.productionW > status.consumptionAvg;

    if (isProductionMoreThanConsuming && (!this.latestNotification || this.latestNotification.plus({hour: 12}) < DateTime.now())) {
      this.latestNotification = DateTime.now();
      const message = `Produktionen er nu højere end forbruget. Du bruger ${status.consumptionAvg}W men du producerer ${status.productionW}W`;
      await this.eventService.add({
        type: 'info',
        source: `${ProductionCronService.name}:SurplusProduction`,
        message,
      });
      await this.firebase.sendToUsers('Plus på solen', message);
    }
  }
}
