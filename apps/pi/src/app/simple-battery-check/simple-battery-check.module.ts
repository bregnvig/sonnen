import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { SimpleBatteryCheckService } from './simple-battery-check.cron';

@Module({
  imports: [CommonModule],
  providers: [SimpleBatteryCheckService],
})
export class SimpleBatteryCheckModule {}
