import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { AfternoonChargeService } from './afternoon-charge.cron';
import { YesterdaysUSOCBasedBatteryChargeService } from './yesterdays-usoc-based-battery-charge.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [YesterdaysUSOCBasedBatteryChargeService, AfternoonChargeService],
  exports: [YesterdaysUSOCBasedBatteryChargeService]
})
export class BatteryChargeModule { }
