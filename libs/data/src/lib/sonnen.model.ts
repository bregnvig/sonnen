import { DateTime } from 'luxon';

export interface SonnenDay {
  timestamp: DateTime;
  producedEnergy: number;
  consumedEnergy: number;
  batteryChargedEnergy: number;
  batteryDischargedEnergy: number;
  gridFeedinEnergy: number;
  gridPurchaseEnergy: number;
}

export interface SonnenMeasurement {
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
