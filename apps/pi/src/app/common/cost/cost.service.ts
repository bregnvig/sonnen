import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

import type { Cost } from './cost.model';
import { stromligning } from '@sonnen/integration';
import { firstValueFrom, map } from 'rxjs';

type ElpriserligenuEntry = {
  DKK_per_kWh: number;
  time_start: string;
  time_end: string;
};


@Injectable()
export class CostService {

  #integration = stromligning;
  #logger = new Logger(CostService.name);

  constructor(private http: HttpService) {
  }

  getPrices(from: DateTime = DateTime.now(), to = DateTime.now()): Promise<Cost[]> {
    return this.#integration.api.pricesList({
      supplierId: process.env.STROMLIGNING_SUPPLIER_ID,
      productId: process.env.STROMLIGNING_PRODUCT_ID,
      customerGroupId: process.env.STROMLIGNING_CUSTOMER_GROUP_ID,
      from: from.toISO(),
      to: to.toISO(),
    }).then(result => result.data.prices.map(price => ({
        from: DateTime.fromISO(price.date),
        to: DateTime.fromISO(price.date).plus({ hour: 1 }),
        total: price.price.total,
        distribution: price.details.distribution.total,
        electricity: price.details.electricity.total,
        electricityTax: price.details.electricityTax.total,
        transmission: Object.values(price.details.transmission).reduce((acc, details) => acc + details.total, 0),
        surcharge: price.details.surcharge.total,
      } as Cost)),
    ).catch(() => {
      this.#logger.warn('Falling back to Elpriser lige nu');
      return this.#getPricesUsingElpriserNu(from);
    });
  }

  async itGetsMoreExpensive(date: DateTime, periodInHours: number) {

    const prices = await this.getPrices(date, date.plus({ hour: periodInHours }));
    const currentPrice = prices.find(price => price.from.hasSame(date, 'hour'));

    if (!currentPrice) {
      return true;
    }

    periodInHours = Math.abs(periodInHours);
    let nextHour = date.plus({ hours: 1 });
    while (periodInHours > 0) {
      const nextPrice = prices.find(price => price.from.hasSame(nextHour, 'hour'));
      if (nextPrice.total > currentPrice.total) {
        return true;
      }
      periodInHours--;
      nextHour = date.plus({ hours: 1 });
    }
    return false;
  }

  #getPricesUsingElpriserNu(date: DateTime = DateTime.now(), region: 'DK2' | 'DK1' = 'DK2'): Promise<Cost[]> {
    function mapToCost(raw: ElpriserligenuEntry): Cost {
      return {
        total: raw.DKK_per_kWh,
        from: DateTime.fromISO(raw.time_start),
        to: DateTime.fromISO(raw.time_end),
      };
    }

    const year = date.toFormat('yyyy');
    const month = date.toFormat('MM');
    const day = date.toFormat('dd');
    return firstValueFrom(this.http.get<ElpriserligenuEntry[]>(`https://elprisenligenu.dk/api/v1/prices/${ year }/${ month }-${ day }_${ region }.json`).pipe(
      map(response => response.data),
      map(data => data.map(mapToCost)),
    ));
  }
}
