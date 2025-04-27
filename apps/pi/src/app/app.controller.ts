import { Controller, Get, Logger, Query } from '@nestjs/common';
import { requiredValue } from '@sonnen/utils';
import { DateTime } from 'luxon';
import { AppService } from './app.service';
import { CostService } from './common';
import { FirebaseService } from './firebase';
import { YesterdaysUSOCBasedBatteryChargeService } from './simple-battery-charge/yesterdays-usoc-based-battery-charge.cron';

@Controller()
export class AppController {
  #logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private chargeService: YesterdaysUSOCBasedBatteryChargeService,
    private readonly costService: CostService,
    private firebase: FirebaseService) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('notification')
  async sendTestNotification(@Query('message') message: string,
    @Query('token') _token: string, @Query('badge') badge?: string, @Query('icon') icon?: string) {
    const token = requiredValue(_token, 'Token');
    this.#logger.debug('Sending test notification', message);
    return this.firebase.sendToToken(token, 'Test notification', message, badge, icon).then(() => {
      this.#logger.debug('Test notification sent');
    }).catch(error => {
      this.#logger.error('Error sending test notification', error);
      throw error;
    });
  }

  @Get('yesterday-usoc')
  async getYesterdayUsoc(@Query('date') dateString: string = DateTime.now().toISODate()) {
    const date = DateTime.fromISO(dateString).startOf('day');
    return this.chargeService.getYesterdaysUSOCWhenProducingMoreThanConsuming(date.isValid ? date : DateTime.now().startOf('day'));
  }

  @Get('more-expensive')
  async getMoreExpensive(@Query('date') dateString: string = DateTime.now().toISODate(), @Query('hours') hours: number = 2) {
    const date = DateTime.fromISO(dateString);
    return this.costService.getsMoreExpensive(date.isValid ? date : DateTime.now().startOf('day'), hours);
  }
}
