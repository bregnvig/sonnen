import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SonnenEvent } from '@sonnen/data';
import { CronJob } from 'cron';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import * as process from 'node:process';
import { firstValueFrom, map } from 'rxjs';
import { CostService, EventService, SonnenService } from '../common';
import { ChargeService } from './charge.service';

/**
 * This service is used to charge the battery based on yesterdays consumption between 4 and when there were a surplus production..
 * Based on the consumption and the current battery level, it will charge the battery for a certain amount of time.
 */
@Injectable()
export class YesterdaysConsumptionBasedBatteryChargeCronJob {
  readonly #logger = new Logger(YesterdaysConsumptionBasedBatteryChargeCronJob.name);

  constructor(service: SonnenService, event: EventService, chargeService: ChargeService, costService: CostService, schedulerRegistry: SchedulerRegistry) {
    this.#logger.debug(process.env.SONNEN_BATTERY_CHECK_CRON, process.env.SONNEN_BATTERY_CHARGE_TIME, process.env.SONNEN_BATTERY_CHARGE_WATTS);
    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, async () => {
      const status = await firstValueFrom(service.getLatestData());
      const yesterdaysSurplusProduction = await chargeService.getSurplusProduction();
      const periodBeforeChargeInHours = DateTime.now().diff(yesterdaysSurplusProduction.battery.timestamp.plus({ day: 1 }), 'hours').hours;
      const getsMoreExpensive = await costService.itGetsMoreExpensive(DateTime.now(), periodBeforeChargeInHours);
      const minuttes = await chargeService.getChargeTimeBasedOnExpectedConsumptionDatesProductionAndCurrentBatteryStatus(DateTime.now().minus({ day: 1 }));

      if (minuttes > 0 && getsMoreExpensive) {
        await event.add({
          title: 'Opladning',
          message: `Batteriet er lavt. Oplader i ${minuttes} minutter`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysConsumptionBasedBatteryChargeCronJob.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            chargeTime: minuttes,
            yesterdaysSurplusProduction,
            periodBeforeChargeInHours,
            getsMoreExpensive,
          },
        });

        const success = await firstValueFrom(service.charge().pipe(
          map(() => true),
        ));
        if (!success) return;
        const timeout = setTimeout(async () => {
          const usoc = (await firstValueFrom(service.getLatestData())).usoc;
          await event.add({
            title: 'Opladning',
            message: `Færdig med at oplade`,
            source: `${YesterdaysConsumptionBasedBatteryChargeCronJob.name}:ChargeStatus`,
            type: 'info',
            data: {
              usoc,
            },
          });
          await firstValueFrom(service.stop());
        }, minuttes * 60 * 1000);
        try {
          schedulerRegistry.deleteTimeout(`yesterdays-usoc-battery-charge-stop`);
        } catch {
          this.#logger.debug('No timeout to delete');
        }
        schedulerRegistry.addTimeout(`yesterdays-usoc-battery-charge-stop`, timeout);
      } else if (!getsMoreExpensive) {
        await event.add({
          message: `Strømmen bliver billigere, så der er ingen grund til at oplade`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysConsumptionBasedBatteryChargeCronJob.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            usocYesterday: yesterdaysSurplusProduction,
            periodBeforeChargeInHours,
            getsMoreExpensive,
          },
        } as SonnenEvent);
      } else {
        await event.add({
          message: `Der er rigeligt med batteri`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysConsumptionBasedBatteryChargeCronJob.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            usocYesterday: yesterdaysSurplusProduction,
          },
        } as SonnenEvent);
      }
    });
    schedulerRegistry.addCronJob('yesterdays-usoc-battery-check', job);
    job.start();
  }
}
