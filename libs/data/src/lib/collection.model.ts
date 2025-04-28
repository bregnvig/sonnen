import { DateTime } from 'luxon';

export interface ProductionDay {
  day: DateTime;
  production: { timestamp: DateTime, production: number }[];
}

export interface AverageConsumption {
  timestamp: DateTime;
  consumption: number;
}

export interface AverageConsumptionDay {
  day: DateTime;
  consumption: AverageConsumption[];
}

export interface BatteryDay {
  day: DateTime;
  battery: { timestamp: DateTime, usoc: number }[];
}
