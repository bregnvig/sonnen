import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { ConsumptionCronService } from './consumption.cron';
import { ProductionCronService } from './production.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [ConsumptionCronService, ProductionCronService],
})
export class StatusModule { }
