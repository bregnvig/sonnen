import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Api } from '@sonnen/integration';

import type { Cost } from './cost.model';

type ElpriserligenuEntry = {
  DKK_per_kWh: number;
  time_start: string;
  time_end: string;
};

function mapToCost(raw: ElpriserligenuEntry): Cost {
  return {
    kWh: raw.DKK_per_kWh,
    from: DateTime.fromISO(raw.time_start),
    to: DateTime.fromISO(raw.time_end),
  };
}

@Injectable()
export class CostService {

  #integration = new Api();

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
        kWh: price.price.total,
      } as Cost)),
    );
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
      if (nextPrice.kWh > currentPrice.kWh) {
        return true;
      }
      periodInHours--;
      nextHour = date.plus({ hours: 1 });
    }
    return false;
  }
}
