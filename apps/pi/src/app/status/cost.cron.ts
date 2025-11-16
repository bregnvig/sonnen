import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SonnenEvent } from '@sonnen/data';
import { DateTime } from 'luxon';
import { Cost, CostService, EventService } from '../common';

@Injectable()
export class CostCronService {
  #logger = new Logger(CostCronService.name);

  constructor(private service: CostService, private eventService: EventService) {
    this.#logger.debug('CostCronService started');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async reportCost() {
    const now = DateTime.now();
    const cost = (await (this.service.getPrices(now, now.plus({ hour: 23 })))).filter(({ from }) => from.hasSame(now, 'day'));

    const minPrice = cost.reduce((min, item) => !min || item.kWh <= min.kWh ? item : min, undefined);
    const maxPrice = cost.reduce((max, item) => !max || item.kWh >= max.kWh ? item : max, undefined);

    const formatCost = (cost: Cost) => ({
      kWh: cost.kWh,
      from: cost.from.toFormat('HH:mm'),
    });
    const message: SonnenEvent = {
      type: 'info',
      title: 'Priser',
      source: `${ CostCronService.name }:CostInfo`,
      message: `Minimums pris ${ minPrice.kWh } kr/kWh kl. ${ minPrice.from.toFormat('HH:mm') } - Maximums pris ${ maxPrice.kWh } kr/kWh kl. ${ maxPrice.from.toFormat('HH:mm') }`,
      data: {
        minPrice: formatCost(minPrice),
        maxPrice: formatCost(maxPrice),
        day: cost.filter(c => c.from.hour >= 6 && c.from.hour <= 20).map(formatCost),
      },
    };
    await this.eventService.add(message);
    await this.eventService.sendToUsers('Dagens priser', message.message);

  }
}
