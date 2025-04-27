import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { BatteryCronService } from './battery.cron';
import { ConsumptionCronService } from './consumption.cron';
import { CostCronService } from './cost.cron';
import { ProductionCronService } from './production.cron';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [
    ConsumptionCronService,
    ProductionCronService,
    BatteryCronService,
    CostCronService
  ],
})
export class StatusModule { }
