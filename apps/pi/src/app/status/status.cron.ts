import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { SonnenService } from '../common';

@Injectable()
export class StatusCronService {

  readonly #logger = new Logger(StatusCronService.name);

  constructor(private service: SonnenService) {
    this.#logger.debug('StatusCronService started');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleStatus() {
    const status = await firstValueFrom(this.service.getStatus());
    this.#logger.log(`Average consumption ${status.consumptionAvg}W`);
  }
}
