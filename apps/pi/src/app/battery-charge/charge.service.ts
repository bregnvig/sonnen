import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { SonnenCollectionService, SonnenService } from '../common';
import { AverageConsumptionDay, BatteryDay, ProductionDay } from '@sonnen/data';

@Injectable()
export class ChargeService {
  readonly #logger = new Logger(ChargeService.name);

  constructor(private sonnen: SonnenService, private collection: SonnenCollectionService) {
  }

  /**
   * Returns consumption, production and battery data for date when the production was higher than the consumption.
   * @param date
   */
  async getSurplusProduction(date = DateTime.now().minus({ days: 1 }).startOf('day')): Promise<{
    battery: BatteryDay['battery'][0],
    production: ProductionDay['production'][0],
    consumption: AverageConsumptionDay['consumption'][0]
  } | undefined> {
    try {
      const batteryDay = await this.collection.getBattery(date);
      const productionDay = await this.collection.getProduction(date);
      const consumptionDay = await this.collection.getAverageConsumption(date);

      const firstTimeProductionMoreThenConsumption = this.#findFirstSurplusTimestamp(productionDay, consumptionDay);

      return firstTimeProductionMoreThenConsumption ? {
        battery: batteryDay.battery.find(b => b.timestamp.hasSame(firstTimeProductionMoreThenConsumption, 'minute')),
        production: productionDay.production.find(p => p.timestamp.hasSame(firstTimeProductionMoreThenConsumption, 'minute')),
        consumption: consumptionDay.consumption.find(c => c.timestamp.hasSame(firstTimeProductionMoreThenConsumption, 'minute')),
      } : undefined;
    } catch (error) {
      this.#logger.error(error);
    }
    return undefined;
  }

  async getChargeTimeBasedOnExpectedConsumptionDatesProductionAndCurrentBatteryStatus(date = DateTime.now().minus({ days: 1 }).startOf('day')) {
    const productionDay = await this.collection.getProduction(date).catch(() => null as ProductionDay);
    const consumptionDay = await this.collection.getAverageConsumption(date).catch(() => null as AverageConsumptionDay);

    const firstTimeProductionMoreThenConsumption = this.#findFirstSurplusTimestamp(productionDay, consumptionDay);
    if (!firstTimeProductionMoreThenConsumption) {
      return this.getChargeMinutesByUSOC();
    }

    const consumption = consumptionDay.consumption.filter(c => c.timestamp >= date && c.timestamp <= firstTimeProductionMoreThenConsumption);
    const production = productionDay.production.filter(c => c.timestamp >= date && c.timestamp <= firstTimeProductionMoreThenConsumption);

    const averageConsumption = consumption.reduce((acc, c) => acc + c.consumption, 0) / consumption.length;
    const averageProduction = production.reduce((acc, c) => acc + c.production, 0) / consumption.length;

    const status = await firstValueFrom(this.sonnen.status$);
    const Wh = ((averageConsumption - averageProduction) * (firstTimeProductionMoreThenConsumption.diff(date, 'minutes').minutes)) / 60;
    const insufficientWh = Wh - status.remainingCapacityWh;
    this.#logger.log('Charge time', `Remaining capacity: ${ status.remainingCapacityWh } Wh, Consumption: ${ averageConsumption } W, Production: ${ averageProduction } W, Time: ${ firstTimeProductionMoreThenConsumption.diff(date, 'minutes').minutes } minutes, Insufficient Wh: ${ insufficientWh } Wh`);
    return insufficientWh < 0
      ? 0
      : insufficientWh / parseInt(process.env.SONNEN_BATTERY_CHARGE_WATTS) * 60;
  }

  async getChargeMinutesByUSOC(target = 100): Promise<number> {
    // Antal minutter = ( (Batterikapacitet i Wh * (Målprocent - Startprocent) / 100) / Ladeeffekt i W ) * 60
    const capacity = await firstValueFrom(this.sonnen.getCapacity());
    const status = await firstValueFrom(this.sonnen.status$);
    const effect = parseInt(process.env.SONNEN_BATTERY_CHARGE_WATTS);
    return (((capacity * (target - status.usoc) / 100) / effect) * 60) + 7; // 7 adds it throttle nearing full charge
  }

  #findFirstSurplusTimestamp(productionDay: ProductionDay, consumptionDay: AverageConsumptionDay): DateTime | undefined {
    if (!productionDay?.production || !consumptionDay?.consumption) {
      return undefined;
    }

    const surplusWindowMinutes = 30;
    const surplusThreshold = 15; // More often than not

    const firstSurplusIndex = productionDay.production.findIndex((_, index, production) => {
      if (index > production.length - surplusWindowMinutes) {
        return false;
      }
      let surplusCount = 0;
      for (let i = 0; i < surplusWindowMinutes; i++) {
        const productionItem = production[index + i];
        const consumptionItem = consumptionDay.consumption[index + i];
        const isProducingMoreThanConsuming = productionItem && consumptionItem && productionItem.production > consumptionItem.consumption;
        if (i === 0 && !isProducingMoreThanConsuming) return false;
        if (isProducingMoreThanConsuming) {
          surplusCount++;
        }
      }
      if (surplusCount > surplusThreshold) {
        this.#logger.debug(`Produces more at ${ _.timestamp.toISO() }`);
        const p = Array.from({ length: surplusWindowMinutes }).map((_, i) => production[index + i].production).join(', ');
        const c = Array.from({ length: surplusWindowMinutes }).map((_, i) => consumptionDay.consumption[index + i].consumption).join(', ');
        this.#logger.debug(p);
        this.#logger.debug(c);
      }
      return surplusCount > surplusThreshold;
    });

    return firstSurplusIndex > -1 ? productionDay.production[firstSurplusIndex].timestamp : undefined;
  }

}
