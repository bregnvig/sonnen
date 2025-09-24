import { Controller, Get, Logger, ParseIntPipe, Query } from '@nestjs/common';
import { requiredValue } from '@sonnen/utils';
import { DateTime } from 'luxon';
import { AppService } from './app.service';
import { ChargeService } from './battery-charge';
import { CostService } from './common';
import { FirebaseService } from './firebase';

@Controller()
export class AppController {
  #logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private chargeService: ChargeService,
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

  @Get('surplus')
  async getSurplus(@Query('date') dateString: string = DateTime.now().toISODate()) {
    const date = DateTime.fromISO(dateString).startOf('day');
    return this.chargeService.getSurplusProduction(date.isValid ? date : DateTime.now().startOf('day'));
  }

  @Get('charge-time')
  async getChargeTime(@Query('date') dateString: string = DateTime.now().toISODate()) {
    const date = DateTime.fromISO(dateString);
    return this.chargeService.getChargeTimeBasedOnExpectedConsumptionDatesProductionAndCurrentBatteryStatus(date.isValid ? date : DateTime.now().startOf('day'));
  }

  @Get('more-expensive')
  async getMoreExpensive(@Query('date') dateString: string = DateTime.now().toISODate(), @Query('hours', ParseIntPipe) hours = 2) {
    const date = DateTime.fromISO(dateString);
    return this.costService.itGetsMoreExpensive(date.isValid ? date : DateTime.now().startOf('day'), hours);
  }
}
