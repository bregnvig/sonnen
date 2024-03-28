import { DateTime } from 'luxon';

export interface ProductionSet {
  timestamp: DateTime;
  production: number;
  consumption: number;
  batteryCharge: number;
  batteryDischarge: number;
  gridFeedIn: number;
  gridConsumption: number;
  batteryStateOfCharge: number;
  directConsumption: number;
}
