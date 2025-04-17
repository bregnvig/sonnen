import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { SimpleBatteryChargeService } from './simple-battery-charge.cron';

@Module({
  imports: [CommonModule],
  providers: [SimpleBatteryChargeService],
})
export class SimpleBatteryChargeModule {}
