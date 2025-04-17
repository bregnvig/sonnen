import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { firstValueFrom, map } from 'rxjs';
import { EventService, SonnenService } from '../common';
import { FirebaseService } from '../firebase';

export class BatteryCronService {
  readonly #logger = new Logger(BatteryCronService.name);

  #eventAt?: DateTime;
  minUSOC = 100;

  constructor(private eventService: EventService, private service: SonnenService, private firebase: FirebaseService) {
    this.#logger.debug('BatteryCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async minimumBatteryLevel() {
    const usoc = await firstValueFrom(this.service.status$.pipe(
      map(({usoc}) => usoc),
    ));
    await this.firebase.writeDayData('battery', {usoc});
    this.minUSOC = Math.min(this.minUSOC, usoc);
    const now = DateTime.now();
    if (now.hour === 10 && this.#eventAt.day < now.day) {
      this.#eventAt = now;
      const message = `Minimum batteri niveau var ${this.minUSOC}%`;
      await this.eventService.add({
        type: 'info',
        source: `${BatteryCronService.name}:MinimumBatteryLevel`,
        message,
      });
      await this.firebase.sendToUsers('Minimum batteri', message);

    }
  }
}
