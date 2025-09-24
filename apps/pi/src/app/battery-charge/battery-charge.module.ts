import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirebaseModule } from '../firebase';
import { ChargeService } from './charge.service';

@Module({
  imports: [CommonModule, FirebaseModule],
  providers: [ChargeService],
  // providers: [YesterdaysConsumptionBasedBatteryChargeService, AfternoonChargeService, ChargeService],
  exports: [ChargeService],
})
export class BatteryChargeModule { }
