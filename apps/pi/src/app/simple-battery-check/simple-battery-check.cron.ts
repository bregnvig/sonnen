import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { SonnenService } from '../common';

@Injectable()
export class SimpleBatteryCheckService {
  readonly #logger = new Logger(SimpleBatteryCheckService.name);

  constructor(private service: SonnenService, private schedulerRegistry: SchedulerRegistry) {
    this.#logger.debug('SimpleBatteryCheckService', process.env.SONNEN_BATTERY_CHECK_CRON, process.env.SONNEN_BATTERY_CHARGE_TIME);
    const maxChargeTime = (parseInt(process.env.SONNEN_BATTERY_CHARGE_TIME) || 30);
    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, async () => {

      const status = await firstValueFrom(this.service.getLatestData());
      const Minuttes = (maxChargeTime - status.usoc);
      this.#logger.debug(`Charge minutes: ${Minuttes}`);

      if (Minuttes > 0) {
        this.#logger.warn(`Battery low. Charge battery for ${Minuttes} minutes`);
        await firstValueFrom(this.service.charge());
        const timeout = setTimeout(async () => {
          this.#logger.log('Battery charge timeout. Stop charging');
          this.#logger.log(`Battery level ${(await firstValueFrom(this.service.getLatestData())).usoc}`);
          await firstValueFrom(this.service.stop());
        }, Minuttes * 60 * 1000);
        this.schedulerRegistry.addTimeout(`battery-charge-stop`, timeout);
      } else {
        this.#logger.log('Sufficient battery level', status.usoc);
      }
    });
    schedulerRegistry.addCronJob('battery-check', job);
    job.start();
  }

}
