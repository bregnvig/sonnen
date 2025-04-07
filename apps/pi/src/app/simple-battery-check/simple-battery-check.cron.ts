import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { collectionPath, SonnenEvent } from '@sonnen/data';
import { CronJob } from 'cron';
import { firestore } from 'firebase-admin';
import * as process from 'node:process';
import { catchError, firstValueFrom, map } from 'rxjs';
import { SonnenService } from '../common';
import { FirestoreService } from '../firestore';

@Injectable()
export class SimpleBatteryCheckService {
  readonly #logger = new Logger(SimpleBatteryCheckService.name);

  constructor(private service: SonnenService, fs: FirestoreService, private schedulerRegistry: SchedulerRegistry) {
    this.#logger.debug('SimpleBatteryCheckService', process.env.SONNEN_BATTERY_CHECK_CRON, process.env.SONNEN_BATTERY_CHARGE_TIME);
    const maxChargeTime = (parseInt(process.env.SONNEN_BATTERY_CHARGE_TIME) || 30);
    const job = new CronJob(process.env.SONNEN_BATTERY_CHECK_CRON, async () => {
      const db = fs.db;
      const status = await firstValueFrom(this.service.getLatestData());
      const minuttes = (maxChargeTime - status.usoc);
      this.#logger.debug(`Charge minutes: ${minuttes}`);

      if (minuttes > 0) {
        await db.doc(collectionPath.events).set({
          message: `Battery low. Charge battery for ${minuttes} minutes`,
          timestamp: firestore.Timestamp.now(),
          source: `${SimpleBatteryCheckService.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
            chargeTime: minuttes,
          },
        } as SonnenEvent);

        const success = await firstValueFrom(this.service.charge().pipe(
          map(() => true),
          catchError(async error => db.doc(collectionPath.events).set({
              timestamp: firestore.Timestamp.now(),
              source: `${SimpleBatteryCheckService.name}:ChargeError`,
              type: 'error',
              message: error.message,
            } as SonnenEvent).then(() => this.service.automaticMode().pipe(map(() => false))),
          ),
        ));
        if (!success) return;
        const timeout = setTimeout(async () => {
          const usoc = (await firstValueFrom(this.service.getLatestData())).usoc;
          await db.doc(collectionPath.events).set({
            message: `Battery charge timeout. Stop charging`,
            timestamp: firestore.Timestamp.now(),
            source: `${SimpleBatteryCheckService.name}:ChargeStatus`,
            type: 'info',
            data: {
              usoc,
            },
          } as SonnenEvent);
          await firstValueFrom(this.service.stop());
        }, minuttes * 60 * 1000);
        try {
          this.schedulerRegistry.deleteTimeout(`battery-charge-stop`);
        } catch {
          this.#logger.debug('No timeout to delete');
        }
        this.schedulerRegistry.addTimeout(`battery-charge-stop`, timeout);
      } else {
        await db.doc(collectionPath.events).set({
          message: `Sufficient battery level`,
          timestamp: firestore.Timestamp.now(),
          source: `${SimpleBatteryCheckService.name}:ChargeStatus`,
          type: 'info',
          data: {
            usoc: status.usoc,
          },
        } as SonnenEvent);
      }
    });
    schedulerRegistry.addCronJob('battery-check', job);
    job.start();
  }

}
