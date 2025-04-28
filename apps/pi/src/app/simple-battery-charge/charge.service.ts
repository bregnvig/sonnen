import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { SonnenCollectionService, SonnenService } from '../common';

@Injectable()
export class ChargeService {
  readonly #logger = new Logger(ChargeService.name);

  constructor(private sonnen: SonnenService, private collection: SonnenCollectionService) {
  }

  /**
   * Returns consumption, production and battery data for date when the production was higher than the consumption.
   * @param date
   */
  async getSurplusProduction(date = DateTime.now().minus({days: 1}).startOf('day')) {
    const batteryDay = await this.collection.getBattery(date);
    const productionDay = await this.collection.getProduction(date);
    const consumptionDay = await this.collection.getAverageConsumption(date);

    const firstTimeProductionMoreThenConsumption = productionDay.production.find((p, index) => p.production > consumptionDay.consumption[index]?.consumption)?.timestamp;

    return {
      battery: batteryDay.battery.find(b => b.timestamp.hasSame(firstTimeProductionMoreThenConsumption, 'minute')),
      production: productionDay.production.find(p => p.timestamp.hasSame(firstTimeProductionMoreThenConsumption, 'minute')),
      consumption: consumptionDay.consumption.find(c => c.timestamp.hasSame(firstTimeProductionMoreThenConsumption, 'minute')),
    };
  }

  async getChargeTimeBasedOnExpectedConsumptionDatesProductionAndCurrentBatteryStatus(date = DateTime.now().minus({days: 1}).startOf('day')) {
    const productionDay = await this.collection.getProduction(date);
    const consumptionDay = await this.collection.getAverageConsumption(date);

    const firstTimeProductionMoreThenConsumption = productionDay.production.find((p, index) => p.production > consumptionDay.consumption[index]?.consumption)?.timestamp;

    const consumption = consumptionDay.consumption.filter(c => c.timestamp >= date && c.timestamp <= firstTimeProductionMoreThenConsumption);

    const average = consumption.reduce((acc, c) => acc + c.consumption, 0) / consumption.length;

    const status = await firstValueFrom(this.sonnen.status$);
    const Wh = (average * (firstTimeProductionMoreThenConsumption.diff(date, 'minutes').minutes)) / 60;
    const insufficientWh = Wh - status.remainingCapacityWh;
    this.#logger.log('Charge time', `Remaining capacity: ${status.remainingCapacityWh} Wh, Consumption: ${average} W, Time: ${firstTimeProductionMoreThenConsumption.diff(date, 'minutes').minutes} minutes, Insufficient Wh: ${insufficientWh} Wh`);
    return insufficientWh < 0
      ? 0
      : insufficientWh / parseInt(process.env.SONNEN_BATTERY_CHARGE_WATTS) * 60;
  }


}
