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
 * This service is used to charge the battery based on the USOC level from yesterday.
 * If the USOC was high when the production exceeded the consumption, it will charge the battery for a shorter time based on the USOC level.
 */
@Injectable()
export class YesterdaysUSOCBasedBatteryChargeService {
  readonly #logger = new Logger(YesterdaysUSOCBasedBatteryChargeService.name);

  constructor(private service: SonnenService, event: EventService, private costService: CostService, chargeService: ChargeService, private schedulerRegistry: SchedulerRegistry) {
    this.#logger.debug(process.env.SONNEN_BATTERY_CHECK_CRON, process.env.SONNEN_BATTERY_CHARGE_TIME);
    const maxChargeTime = (parseInt(process.env.SONNEN_BATTERY_CHARGE_TIME) || 30);
    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, async () => {
      const status = await firstValueFrom(this.service.getLatestData());
      const usocYesterday = (await chargeService.getSurplusProduction()).battery;
      const periodBeforeCharge = DateTime.now().diff(usocYesterday.timestamp.plus({day: 1}), 'hours').hours;
      const getsMoreExpensive = await this.costService.itGetsMoreExpensive(DateTime.now(), periodBeforeCharge);
      const minuttes = (maxChargeTime - status.usoc - (usocYesterday?.usoc ?? 0));

      if (minuttes > 0 && getsMoreExpensive) {
        await event.add({
          message: `Batteriet er lavt. Oplader i ${minuttes} minutter`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysUSOCBasedBatteryChargeService.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            chargeTime: minuttes,
            usocYesterday,
            periodBeforeCharge,
            getsMoreExpensive,
          },
        });

        const success = await firstValueFrom(this.service.charge().pipe(
          map(() => true),
        ));
        if (!success) return;
        const timeout = setTimeout(async () => {
          const usoc = (await firstValueFrom(this.service.getLatestData())).usoc;
          await event.add({
            message: `Færdig med at oplade`,
            source: `${YesterdaysUSOCBasedBatteryChargeService.name}:ChargeStatus`,
            type: 'info',
            data: {
              usoc,
            },
          });
          await firstValueFrom(this.service.stop());
        }, minuttes * 60 * 1000);
        try {
          this.schedulerRegistry.deleteTimeout(`yesterdays-usoc-battery-charge-stop`);
        } catch {
          this.#logger.debug('No timeout to delete');
        }
        this.schedulerRegistry.addTimeout(`yesterdays-usoc-battery-charge-stop`, timeout);
      } else if (!getsMoreExpensive) {
        await event.add({
          message: `Strømmen bliver billigere, så der er ingen grund til at oplade`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysUSOCBasedBatteryChargeService.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            usocYesterday,
            periodBeforeCharge,
            getsMoreExpensive,
          },
        } as SonnenEvent);
      } else {
        await event.add({
          message: `Der er rigeligt med batteri`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysUSOCBasedBatteryChargeService.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            usocYesterday,
          },
        } as SonnenEvent);
      }
    });
    schedulerRegistry.addCronJob('yesterdays-usoc-battery-check', job);
    job.start();
  }

}
