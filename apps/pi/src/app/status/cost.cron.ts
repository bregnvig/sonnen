import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SonnenEvent } from '@sonnen/data';
import { firstValueFrom } from 'rxjs';
import { CostService, EventService } from '../common';

@Injectable()
export class CostCronService {
  #logger = new Logger(CostCronService.name);

  constructor(private service: CostService, private eventService: EventService) {
    this.#logger.debug('CostCronService started');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async reportCost() {
    const cost = await firstValueFrom(this.service.getPrices());

    const minPrice = cost.reduce((min, item) => !min || item.kWh <= min.kWh ? item : min, undefined);
    const maxPrice = cost.reduce((max, item) => !max || item.kWh >= max.kWh ? item : max, undefined);

    const message: SonnenEvent = {
      type: 'info',
      source: `${CostCronService.name}:CostInfo`,
      message: `Minimums pris ${minPrice.kWh} kr/kWh kl. ${minPrice.from.toFormat('HH:mm')} - Maximums pris ${maxPrice.kWh} kr/kWh kl. ${maxPrice.from.toFormat('HH:mm')}`,
      data: {
        minPrice,
        maxPrice,
        day: cost.filter(c => c.from.hour >= 8 && c.from.hour <= 20),
      },
    };
    await this.eventService.add(message);
    await this.eventService.sendToUsers('Dagens priser', message.message);

  }
}
