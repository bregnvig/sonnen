import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { firstValueFrom, map } from 'rxjs';
import { EventService, SonnenService } from '../common';
import { FirebaseService } from '../firebase';

@Injectable()
export class BatteryCronService {
  readonly #logger = new Logger(BatteryCronService.name);

  minUSOC = 100;
  minTimestamp?: DateTime;

  constructor(private eventService: EventService, private service: SonnenService, private firebase: FirebaseService) {
    this.#logger.debug('BatteryCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async minimumBatteryLevel() {
    const usoc = await firstValueFrom(this.service.status$.pipe(
      map(({usoc}) => usoc),
    ));
    await this.firebase.writeDayData('battery', {usoc});
    if (this.minUSOC > usoc) {
      this.minUSOC = usoc;
      this.minTimestamp = DateTime.now();
    }
  }

  @Cron('0 10 * * *')
  async reportMinimumBatteryLevel() {
    const usoc = await firstValueFrom(this.service.status$.pipe(
      map(({usoc}) => usoc),
    ));
    const message = `Minimum batteri niveau var ${this.minUSOC}% kl. ${this.minTimestamp?.toFormat('HH:mm')}`;
    await this.eventService.add({
      type: 'info',
      source: `${BatteryCronService.name}:MinimumBatteryLevel`,
      message,
      data: {
        usoc,
        minUSOC: this.minUSOC,
        minTimestamp: this.minTimestamp?.toFormat('HH:mm'),
      },
    });
    await this.firebase.sendToUsers('Minimum batteri', message);
  }
}
