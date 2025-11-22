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

  async getPrices(from: DateTime = DateTime.now(), to = DateTime.now()): Promise<Cost[]> {
    try {
      const result_1 = await this.#integration.api.pricesList({
        supplierId: process.env.STROMLIGNING_SUPPLIER_ID,
        productId: process.env.STROMLIGNING_PRODUCT_ID,
        customerGroupId: process.env.STROMLIGNING_CUSTOMER_GROUP_ID,
        from: from.toISO(),
        to: to.toISO(),
      });
      return result_1.data.prices.map(price => ({
        date: DateTime.fromISO(price.date),
        total: price.price.total,
        distribution: price.details.distribution.total,
        electricity: price.details.electricity.total,
        electricityTax: price.details.electricityTax.total,
        transmission: Object.values(price.details.transmission).reduce((acc, details) => acc + details.total, 0),
        surcharge: price.details.surcharge.total,
      } as Cost));
    } catch {
      this.#logger.warn('Falling back to Elpriser lige nu');
      return await this.#getPricesUsingElpriserNu(from);
    }
  }

  async itGetsMoreExpensive(date: DateTime, periodInHours: number) {

    const prices = await this.getPrices(date, date.plus({ hour: periodInHours }));
    const currentPrice = prices.find(price => price.date.hasSame(date, 'hour'));

    if (!currentPrice) {
      return true;
    }

    if (prices.length === 0) {
      return false;
    }

    const meanPrice = prices.reduce((sum, price) => sum + price.total, 0) / prices.length;
    this.#logger.debug(`The current price at ${ date.toISOTime() } is ${ currentPrice.total.toFixed(2) }. Mean price is ${ meanPrice }`);
    return meanPrice > currentPrice.total;
  }

  async getTotalCost(date: DateTime, chargeMinuttes: number, chargeWatts: number = parseInt(process.env.SONNEN_BATTERY_CHARGE_WATTS)): Promise<number> {
    const endDate = date.plus({ minutes: chargeMinuttes });
    // Fetch prices for the period, plus some buffer to determine interval length.
    const prices = await this.getPrices(date, endDate.plus({ hours: 1 }));

    if (prices.length < 2) { // Need at least 2 to determine interval
      this.#logger.warn(`Not enough price data for ${ date.toISO() }. Cannot calculate cost.`);
      return 0;
    }

    const priceIntervalInMinutes = prices[1].date.diff(prices[0].date, 'minutes').minutes;
    if (priceIntervalInMinutes <= 0) {
      this.#logger.error('Invalid price interval calculated. Cannot calculate cost.');
      return 0;
    }

    const chargeKW = chargeWatts / 1000;

    // Find the index of the price active at the start of the charge.
    let priceIdx = prices.findIndex(p => p.date > date);
    if (priceIdx === -1) { // all prices are before or at the date
      priceIdx = prices.length - 1; // Use the last available price
    } else {
      priceIdx -= 1;
    }

    if (priceIdx < 0) {
      this.#logger.warn(`Could not find price data at or before ${ date.toISO() }.`);
      return 0;
    }

    // We use reduce for a functional approach to calculating the cost.
    // The accumulator `state` holds the total cost, remaining minutes, and the current time.
    const finalState = prices
      .slice(priceIdx) // Start from the relevant price interval
      .reduce((state, currentPrice, index, relevantPrices) => {
        if (state.remainingMinutes <= 0) {
          return state; // Charge is complete, no more cost to add.
        }

        const nextPrice = relevantPrices[index + 1];
        const intervalEnd = nextPrice ? nextPrice.date : currentPrice.date.plus({ minutes: priceIntervalInMinutes });

        // Calculate how many minutes of the charge fall into the current price interval.
        const minutesToProcess = Math.min(state.remainingMinutes, intervalEnd.diff(state.effectiveTime, 'minutes').minutes);

        if (minutesToProcess <= 0) {
          return state; // No time spent in this interval, effectiveTime is after this interval.
        }

        const hoursToProcess = minutesToProcess / 60;
        const costForInterval = currentPrice.total * chargeKW * hoursToProcess;

        // Return the new state for the next iteration.
        return {
          totalCost: state.totalCost + costForInterval,
          remainingMinutes: state.remainingMinutes - minutesToProcess,
          effectiveTime: state.effectiveTime.plus({ minutes: minutesToProcess }),
        };
      }, { totalCost: 0, remainingMinutes: chargeMinuttes, effectiveTime: date });

    if (finalState.remainingMinutes > 0) {
      this.#logger.warn(`Price data was insufficient to cover the full charge duration. ${ finalState.remainingMinutes } minutes were not costed.`);
    }

    return finalState.totalCost;
  }

  #getPricesUsingElpriserNu(date: DateTime = DateTime.now(), region: 'DK2' | 'DK1' = 'DK2'): Promise<Cost[]> {
    function mapToCost(raw: ElpriserligenuEntry): Cost {
      return {
        total: raw.DKK_per_kWh,
        date: DateTime.fromISO(raw.time_start),
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
