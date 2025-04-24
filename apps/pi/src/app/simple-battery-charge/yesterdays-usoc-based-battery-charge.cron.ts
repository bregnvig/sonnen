import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SonnenEvent } from '@sonnen/data';
import { CronJob } from 'cron';
import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { EventService, SonnenCollectionService, SonnenService } from '../common';

@Injectable()
export class YesterdaysUSOCBasedBatteryChargeService {
  readonly #logger = new Logger(YesterdaysUSOCBasedBatteryChargeService.name);

  constructor(private service: SonnenService, event: EventService, private collection: SonnenCollectionService, private schedulerRegistry: SchedulerRegistry) {
    this.#logger.debug(process.env.SONNEN_BATTERY_CHECK_CRON, process.env.SONNEN_BATTERY_CHARGE_TIME);
    const maxChargeTime = (parseInt(process.env.SONNEN_BATTERY_CHARGE_TIME) || 30);
    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, async () => {
      const status = await firstValueFrom(this.service.getLatestData());
      const usocYesterday = await this.#getYesterdaysUSOCWhenProducingMoreThanConsuming();
      const minuttes = (maxChargeTime - status.usoc - usocYesterday);

      if (minuttes > 0) {
        await event.add({
          message: `Batteriet er lavt. Oplader i ${minuttes} minutter`,
          timestamp: firestore.Timestamp.now(),
          source: `${YesterdaysUSOCBasedBatteryChargeService.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            chargeTime: minuttes,
            usocYesterday,
          },
        });

        /*
                const success = await firstValueFrom(this.service.charge().pipe(
                  map(() => true),
                ));
                if (!success) return;
        */
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
          // await firstValueFrom(this.service.stop());
        }, minuttes * 60 * 1000);
        try {
          this.schedulerRegistry.deleteTimeout(`yesterdays-usoc-battery-charge-stop`);
        } catch {
          this.#logger.debug('No timeout to delete');
        }
        this.schedulerRegistry.addTimeout(`yesterdays-usoc-battery-charge-stop`, timeout);
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

  async #getYesterdaysUSOCWhenProducingMoreThanConsuming() {
    const yesterday = DateTime.now().minus({days: 1}).startOf('day');
    const batteryDay = await this.collection.getBattery(yesterday);
    const productionDay = await this.collection.getProduction(yesterday);
    const consumptionDay = await this.collection.getAverageConsumption(yesterday);

    const firstTimeProductionMoreThenConsumption = productionDay.production.find((p, index) => p.production > consumptionDay.consumption[index]?.consumption)?.timestamp;

    return batteryDay.battery.find(b => +b.timestamp === +firstTimeProductionMoreThenConsumption)?.usoc ?? 0;
  }
}
