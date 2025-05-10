import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { CostService, EventService, SonnenService } from '../common';
import { FirebaseService } from '../firebase';

@Injectable()
export class AfternoonChargeService {

  #logger = new Logger(AfternoonChargeService.name);

  constructor(private sonnenService: SonnenService, private schedulerRegistry: SchedulerRegistry, private costService: CostService, private eventService: EventService, private firebase: FirebaseService) {
    this.#logger.debug('AfternoonChargeService started');
  }

  @Cron('0 15 * * *') // Runs every day at 15:00 (3 PM)
  async afternoonChargeCheck() {

    const now = DateTime.now();
    const usoc = await firstValueFrom(this.sonnenService.usoc$);
    const price = (await firstValueFrom(this.costService.getPrices(now))).find(price => price.from.hasSame(now, 'hour'));

    this.#logger.debug(`AfternoonChargeService: ${usoc}%, price: ${price?.kWh} kr/kWh`);

    const chargeTime = usoc < 75 ? 100 - usoc : 0;

    if (chargeTime > 0) {
      const startDelay = now.set({hour: 17, minute: 0, second: 0, millisecond: 0}).minus({minutes: chargeTime}).diff(now, 'milliseconds').milliseconds;
      const stopDelay = now.set({hour: 17, minute: 0, second: 0, millisecond: 0}).diff(now, 'milliseconds').milliseconds;

      const start = setTimeout(async () => {
        await firstValueFrom(this.sonnenService.charge());
      }, startDelay);
      const stop = setTimeout(async () => {
        await firstValueFrom(this.sonnenService.stop());
      }, stopDelay);
      await this.eventService.sendToUsers('Eftermiddagsopladning', `Batteriet er på ${usoc}%. Vil blive opladet i ${chargeTime} minutter`);
      await this.eventService.add({
        type: 'info',
        title: 'Opladning',
        source: `${AfternoonChargeService.name}:AfternoonCharge`,
        message: `Batteriet er på ${usoc}%. Vil blive opladet i ${chargeTime} minutter`,
        data: {
          usoc,
          cost: price?.kWh,
        },
      });
      this.schedulerRegistry.addTimeout('afternoon-charge-start', start);
      this.schedulerRegistry.addTimeout('afternoon-charge-stop', stop);
    } else {
      await this.eventService.add({
        type: 'info',
        title: 'Opladning',
        source: `${AfternoonChargeService.name}:AfternoonCharge`,
        message: `Batteriet er på ${usoc}%. Der er ingen grund til at oplade 👍`,
        data: {
          usoc,
          cost: price?.kWh,
        },
      });
    }
  }
}
