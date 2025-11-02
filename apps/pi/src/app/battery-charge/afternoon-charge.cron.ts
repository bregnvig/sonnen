import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { CostService, EventService, SonnenService } from '../common';
import { FirebaseService } from '../firebase';
import SunCalc from 'suncalc';

@Injectable()
export class AfternoonChargeCronJob {

  #logger = new Logger(AfternoonChargeCronJob.name);

  constructor(private sonnenService: SonnenService, private schedulerRegistry: SchedulerRegistry, private costService: CostService, private eventService: EventService, private firebase: FirebaseService) {
    this.#logger.debug('AfternoonChargeService started');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async planChargeCheck() {
    this.#logger.debug('AfternoonChargeService started');
    const times = SunCalc.getTimes(new Date(), parseFloat(process.env.SONNEN_LATITUDE), parseFloat(process.env.SONNEN_LONGITUDE));
    const sunset = DateTime.fromJSDate(times.sunsetStart);
    const milliseconds = sunset.diff(DateTime.now(), 'milliseconds').milliseconds;
    this.#logger.debug(`Sunset ${sunset.toFormat('HH:mm')}. ${(milliseconds / 60000).toFixed(0)} minutes from now`);
    const chargeCheck = setTimeout(() => this.afternoonChargeCheck(sunset), milliseconds);
    this.schedulerRegistry.addTimeout('afternoon-charge-check', chargeCheck);
  }

  async afternoonChargeCheck(sunset: DateTime) {

    const now = DateTime.now();

    const usoc = await firstValueFrom(this.sonnenService.usoc$);
    const chargeTime = usoc < 75 ? 100 - usoc : 0;

    if (chargeTime > 0) {
      const price = (await firstValueFrom(this.costService.getPrices(sunset.minus({ minutes: chargeTime })))).find(price => price.from.hasSame(now, 'hour'));
      this.#logger.debug(`AfternoonChargeService: ${ usoc }%, price: ${ price?.kWh } kr/kWh`);
      const startDelay = sunset.minus({ minutes: chargeTime }).diff(now, 'milliseconds').milliseconds;
      const stopDelay = sunset.diff(now, 'milliseconds').milliseconds;
      const chargePrice = (parseInt(process.env.SONNEN_BATTERY_CHARGE_WATTS) / 1000) * (chargeTime / 60) * (price?.kWh ?? 0);

      const start = setTimeout(async () => {
        await firstValueFrom(this.sonnenService.charge());
      }, startDelay);
      const stop = setTimeout(async () => {
        await firstValueFrom(this.sonnenService.stop());
      }, stopDelay);

      await this.eventService.sendToUsers('Eftermiddagsopladning', `Batteriet er på ${ usoc }%. Vil blive opladet i ${ chargeTime } minutter. Starter ${ DateTime.now().plus({ millisecond: startDelay }).toFormat('HH:mm') }. Koster ${chargePrice} kr.`);
      await this.eventService.add({
        type: 'info',
        title: 'Opladning',
        source: `${ AfternoonChargeCronJob.name }:AfternoonCharge`,
        message: `
        Batteriet er på ${ usoc }%. Vil blive opladet i ${ chargeTime } minutter.
        Starter ${ DateTime.now().plus({ millisecond: startDelay }).toFormat('HH:mm') }.
        Slutter ${ DateTime.now().plus({ millisecond: stopDelay }).toFormat('HH:mm') }.
        Koster ${chargePrice} kr.
        `.trim(),
        data: {
          usoc,
          cost: price?.kWh,
        },
      });
      this.schedulerRegistry.addTimeout('afternoon-charge-start', start);
      this.schedulerRegistry.addTimeout('afternoon-charge-stop', stop);
    } else {
      const price = (await firstValueFrom(this.costService.getPrices(sunset.minus({ minutes: chargeTime })))).find(price => price.from.hasSame(now, 'hour'));
      await this.eventService.add({
        type: 'info',
        title: 'Opladning',
        source: `${ AfternoonChargeCronJob.name }:AfternoonCharge`,
        message: `Batteriet er på ${ usoc }%. Der er ingen grund til at oplade 👍`,
        data: {
          usoc,
          cost: price?.kWh,
        },
      });
    }
  }
}
