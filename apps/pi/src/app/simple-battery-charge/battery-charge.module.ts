import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { AfternoonChargeService } from './afternoon-charge.cron';
import { SimpleBatteryChargeService } from './simple-battery-charge.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [SimpleBatteryChargeService, AfternoonChargeService],
})
export class BatteryChargeModule {}
