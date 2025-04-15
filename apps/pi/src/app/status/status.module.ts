import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { ConsumptionCronService } from './consumption.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [ConsumptionCronService],
})
export class StatusModule {}
