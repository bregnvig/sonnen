import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { AfternoonChargeCronJob } from './afternoon-charge.cron';
import { ChargeService } from './charge.service';
import { YesterdaysConsumptionBasedBatteryChargeCronJob } from './yesterdays-consumption-charge.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [YesterdaysConsumptionBasedBatteryChargeCronJob, AfternoonChargeCronJob, ChargeService],
  exports: [ChargeService, AfternoonChargeCronJob, YesterdaysConsumptionBasedBatteryChargeCronJob],
})
export class BatteryChargeModule {
}
