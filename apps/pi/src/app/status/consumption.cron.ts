import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { SonnenCollectionService, SonnenService } from '../common';

@Injectable()
export class ConsumptionCronService {

  readonly #logger = new Logger(ConsumptionCronService.name);

  constructor(private service: SonnenService, private collection: SonnenCollectionService) {
    this.#logger.debug('ConsumptionCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async reportConsumption() {
    const status = await firstValueFrom(this.service.status$);
    await this.collection.updateAverageConsumption(status.consumptionAvg);
  }
}
