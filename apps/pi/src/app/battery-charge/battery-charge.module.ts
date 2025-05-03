import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { AfternoonChargeService } from './afternoon-charge.cron';
import { ChargeService } from './charge.service';
import { YesterdaysConsumptionBasedBatteryChargeService } from './yesterdays-consumption-charge.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [YesterdaysConsumptionBasedBatteryChargeService, AfternoonChargeService, ChargeService],
  exports: [ChargeService],
})
export class BatteryChargeModule {}
