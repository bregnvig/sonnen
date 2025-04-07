import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirestoreModule } from '../firestore';
import { SimpleBatteryCheckService } from './simple-battery-check.cron';

@Module({
  imports: [CommonModule, FirestoreModule],
  providers: [SimpleBatteryCheckService],
})
export class SimpleBatteryCheckModule {}
