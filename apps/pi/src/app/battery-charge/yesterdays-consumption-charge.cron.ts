import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SonnenEvent } from '@sonnen/data';
import { CronJob } from 'cron';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { CostService, EventService, SonnenService } from '../common';
import { ChargeService } from './charge.service';

/**
 * This service is used to charge the battery based on yesterday consumption between 4 and when there were a surplus production.
 * Based on the consumption and the current battery level, it will charge the battery for a certain amount of time.
 */
@Injectable()
export class YesterdaysConsumptionBasedBatteryChargeCronJob {
  readonly #logger = new Logger(YesterdaysConsumptionBasedBatteryChargeCronJob.name);

  constructor(private service: SonnenService, private event: EventService, chargeService: ChargeService, private costService: CostService, private schedulerRegistry: SchedulerRegistry) {
    this.#logger.debug(process.env.SONNEN_BATTERY_CHECK_CRON, process.env.SONNEN_BATTERY_CHARGE_WATTS);
    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, async () => {
      const status = await firstValueFrom(service.getLatestData());
      const yesterdaysSurplusProduction = await chargeService.getSurplusProduction();
      const periodBeforeSurplusProductionInHours = yesterdaysSurplusProduction ? DateTime.now().diff(yesterdaysSurplusProduction.battery.timestamp.plus({ day: 1 }), 'hours').hours : undefined;
      const itGetsMoreExpensive = await costService.itGetsMoreExpensive(DateTime.now().set({
        hour: 6,
        minute: 0,
        second: 0,
      }), periodBeforeSurplusProductionInHours ?? 8);
      const minuttes = await chargeService.getChargeTimeBasedOnExpectedConsumptionDatesProductionAndCurrentBatteryStatus(DateTime.now().minus({ day: 1 }));
      if (minuttes > 0 && itGetsMoreExpensive) {
        const bestChargeTime = await this.getOptimalChargeTime(DateTime.now(), minuttes, periodBeforeSurplusProductionInHours);
        const chargePrice = await this.costService.getTotalCost(bestChargeTime, minuttes);
        await event.sendToUsers('Nat opladning', `Batteriet er på ${ status.usoc }%. Vil blive opladet i ${ minuttes.toFixed(2) } minutter. Starter ${ bestChargeTime.toFormat('HH:mm') }. Koster ${ chargePrice.toFixed(2) } kr.`);
        await event.add({
          title: 'Opladning',
          message: `Batteriet er lavt. Oplader i ${ minuttes } minutter`,
          timestamp: firestore.Timestamp.fromDate(bestChargeTime.toJSDate()),
          source: `${ YesterdaysConsumptionBasedBatteryChargeCronJob.name }:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            chargeTime: minuttes,
            price: chargePrice,
            yesterdaysSurplusProduction: yesterdaysSurplusProduction ?? -1,
            periodBeforeSurplusProductionInHours: periodBeforeSurplusProductionInHours ?? -1,
            getsMoreExpensive: itGetsMoreExpensive,
          },
        });

        const startsAt = Math.max(0, bestChargeTime.diff(DateTime.now(), 'milliseconds').milliseconds);
        const start = setTimeout(() => {
          firstValueFrom(service.charge())
            .then(() => this.#logger.debug(`Charging started successfully`))
            .catch(error => this.#logger.warn(`Unable to start charging`, error));
        }, startsAt);

        const stopAt = startsAt + (minuttes * 60 * 1000);
        const stop = setTimeout(async () => {
          const usoc = (await firstValueFrom(service.getLatestData())).usoc;
          await event.sendToUsers('Nat opladning afsluttet', `Batteriet er nu på ${ usoc }%`);
          await event.add({
            title: 'Opladning',
            message: `Færdig med at oplade`,
            source: `${ YesterdaysConsumptionBasedBatteryChargeCronJob.name }:ChargeStatus`,
            type: 'info',
            data: {
              usoc,
            },
          });
          await firstValueFrom(service.charge('0'));
        }, stopAt);
        await this.#addPause(!!yesterdaysSurplusProduction, stopAt);
        this.#cancelPreviousTimer(`yesterdays-consumption-charge-start`);
        this.#cancelPreviousTimer(`yesterdays-consumption-charge-stop`);
        schedulerRegistry.addTimeout(`yesterdays-consumption-charge-start`, start);
        schedulerRegistry.addTimeout(`yesterdays-consumption-charge-stop`, stop);
        chargeService.monitorChargeStatus(startsAt, stopAt - 5000);
      } else if (!itGetsMoreExpensive) {
        await event.add({
          message: `Strømmen bliver billigere, så der er ingen grund til at oplade`,
          timestamp: firestore.Timestamp.now(),
          source: `${ YesterdaysConsumptionBasedBatteryChargeCronJob.name }:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            usocYesterday: yesterdaysSurplusProduction ?? -1,
            periodBeforeSurplusProductionInHours: periodBeforeSurplusProductionInHours ?? -1,
            getsMoreExpensive: itGetsMoreExpensive,
          },
        } as SonnenEvent);
      } else {
        await event.add({
          message: `Der er rigeligt med batteri`,
          timestamp: firestore.Timestamp.now(),
          source: `${ YesterdaysConsumptionBasedBatteryChargeCronJob.name }:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            usocYesterday: yesterdaysSurplusProduction ?? -1,
          },
        } as SonnenEvent);
      }
    });
    schedulerRegistry.addCronJob('yesterdays-consumption-check', job);
    job.start();
  }

  async getOptimalChargeTime(date: DateTime, chargeMinuttes: number, periodBeforeSurplusProductionInHours = 8): Promise<DateTime> {
    const prices = await this.costService.getPrices(date, date.plus({ hours: periodBeforeSurplusProductionInHours }));

    if (prices.length === 0) {
      this.#logger.warn('No price data available. Cannot determine optimal charge time. Starting now.');
      return date;
    }

    // Dynamically determine price interval from the data
    const priceIntervalInMinutes = prices[1].date.diff(prices[0].date, 'minutes').minutes;

    if (priceIntervalInMinutes <= 0) {
      this.#logger.warn('Invalid price interval calculated. Cannot determine optimal charge time. Starting now.');
      return date;
    }

    const fullIntervalsToCharge = Math.floor(chargeMinuttes / priceIntervalInMinutes);
    const partialIntervalToChargeMinutes = chargeMinuttes % priceIntervalInMinutes;
    const partialIntervalFraction = partialIntervalToChargeMinutes / priceIntervalInMinutes;

    const intervalsNeededForOneCharge = fullIntervalsToCharge + (partialIntervalFraction > 0 ? 1 : 0);

    if (prices.length < intervalsNeededForOneCharge) {
      this.#logger.warn(`Not enough price data. Have data for ${ prices.length } intervals, but need ${ intervalsNeededForOneCharge } intervals to calculate one charge window. Starting now.`);
      return date;
    }

    // To find the best start time, we'll use a functional approach.
    // 1. Create an array of all possible start indices for a sliding window.
    // 2. Use `reduce` to iterate through each start index, calculate the cost of the charging window,
    //    and keep track of the window with the minimum cost found so far.
    const startIndices = Array.from({ length: prices.length - intervalsNeededForOneCharge + 1 }, (_, i) => i);

    const result = startIndices.reduce((best, i) => {
      // For each start index, calculate the cost of the window.
      const fullIntervalsCost = prices
        .slice(i, i + fullIntervalsToCharge)
        .reduce((sum, price) => sum + price.total, 0);

      const windowCost = fullIntervalsCost + (partialIntervalFraction > 0 ? prices[i + fullIntervalsToCharge].total * partialIntervalFraction : 0);

      // If the current window is cheaper, it becomes the new best.
      if (windowCost < best.cost) {
        return { cost: windowCost, startTime: prices[i].date };
      }
      return best;
    }, { cost: Infinity, startTime: date });
    this.#logger.debug(`Best start time ${ result.startTime.toISOTime() }. Price ${ result.cost.toFixed(2) }`);
    return result.startTime;
  }

  #cancelPreviousTimer(name: string) {
    try {
      this.schedulerRegistry.doesExist('timeout', name) && this.schedulerRegistry.deleteTimeout(name);
    } catch {
      this.#logger.debug(`No '${ name }' timeout to delete`);
    }
  }

  async #addPause(hadSurplusProductionYesterday: boolean, stopChargingAt: number) {
    this.#cancelPreviousTimer('yesterdays-consumption-pause');
    const stop = DateTime.now().set({
      hour: hadSurplusProductionYesterday ? 6 : 7,
      minute: 30,
    }).diffNow('milliseconds').milliseconds;
    this.schedulerRegistry.addTimeout(
      'yesterdays-consumption-pause',
      setTimeout(async () => {
        await this.event.sendToUsers('Pause afsluttet', 'Batteriet vil igen blive benyttet');
        await firstValueFrom(this.service.automaticMode());
      }, Math.max(stop, stopChargingAt)),
    );
  }
}
