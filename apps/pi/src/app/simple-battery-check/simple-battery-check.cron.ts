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
    this.#logger.debug('SimpleBatteryCheckService constructor', process.env.SONNEN_BATTERY_CHECK_CRON);

    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, () => {
      firstValueFrom(this.service.getLatestData()).then(data => {
        if (data.usoc < 3) {
          this.#logger.warn('Battery low', data.usoc);
          firstValueFrom(this.service.charge()).then(() => {
            const timeout = setTimeout(() => firstValueFrom(this.service.stop()), 1000 * 60 * 20);
            this.schedulerRegistry.addTimeout(`battery-charge-stop`, timeout);
          });
        }
      });
    });
    schedulerRegistry.addCronJob('battery-check', job);
    job.start();
  }

}
