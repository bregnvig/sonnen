import { Controller, Get, Logger, ParseIntPipe, Post, Query } from '@nestjs/common';
import { requiredValue } from '@sonnen/utils';
import { DateTime } from 'luxon';
import { AppService } from './app.service';
import {
  AfternoonChargeCronJob,
  ChargeService,
  YesterdaysConsumptionBasedBatteryChargeCronJob,
} from './battery-charge';
import { CostService, SonnenService } from './common';
import { FirebaseService } from './firebase';
import { firstValueFrom, map } from 'rxjs';

@Controller()
export class AppController {
  #logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private chargeService: ChargeService,
    afternoonChargeCheck: AfternoonChargeCronJob,
    private yesterdayService: YesterdaysConsumptionBasedBatteryChargeCronJob,
    private readonly costService: CostService,
    private readonly sonnenService: SonnenService,
    private firebase: FirebaseService) {
    const now = DateTime.now();
    now.hour > 1 && afternoonChargeCheck.planChargeCheck();
  }

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

  @Get('prices')
  async getPrices() {
    const from = DateTime.now().startOf('day');
    const to = DateTime.now().endOf('day');
    return this.costService.getPrices(from, to);
  }

  @Get('cost')
  async getCost(@Query('date') dateString: string = DateTime.now().toISODate(), @Query('minuttes') minuttes: number) {
    return this.costService.getTotalCost(DateTime.fromISO(dateString), minuttes);
  }

  @Post('mode')
  async setMode(@Query('mode') mode: 'automatic' | 'manual') {
    await firstValueFrom(mode === 'automatic' ? this.sonnenService.automaticMode() : this.sonnenService.manualMode());
    return firstValueFrom(this.sonnenService.status$.pipe(map(status => status.operatingMode)));
  }

  @Get('best-charge-time')
  async getBestChargeTime(@Query('date') dateString: string = DateTime.now().toISODate(), @Query('minuttes') minuttes: number, @Query('period') period = 8) {
    return this.yesterdayService.getOptimalChargeTime(DateTime.fromISO(dateString), minuttes, period);
  }

  @Get('battery-data')
  async getBatteryData() {
    return this.sonnenService.getBatteryData();
  }

  @Get('is-charging')
  async getChargeStatus() {
    return this.sonnenService.chargeStatus.value;
  }

  @Get('more-expensive')
  async getMoreExpensive(@Query('date') dateString: string = DateTime.now().toISODate(), @Query('hours', ParseIntPipe) hours = 2) {
    const date = DateTime.fromISO(dateString);
    return this.costService.itGetsMoreExpensive(date.isValid ? date : DateTime.now().startOf('day'), hours);
  }
}
