import { DateTime } from 'luxon';

export enum BatterySystemStatus { // If you have a list of possible values.
  Status0 = 0, //Example
  Status49 = 49, //Example
}

export interface BatteryModule {
  balanceChargeRequest: boolean;
  chargeCurrentLimit: number;
  cycleCount: number;
  dischargeCurrentLimit: number;
  fullChargeCapacity: number;
  maximumCellTemperature: number;
  maximumCellVoltage: number;
  maximumCellVoltageNum: number; //Consider creating enum
  maximumModuleCurrent: number;
  maximumModuleDcVoltage: number;
  maximumModuleTemperature: number;
  minimumCellTemperature: number;
  minimumCellVoltage: number;
  minimumCellVoltageNum: number; //Consider creating enum
  minimumModuleCurrent: number;
  minimumModuleDcVoltage: number;
  minimumModuleTemperature: number;
  relativeStateOfCharge: number;
  remainingCapacity: number;
  systemAlarm: boolean;
  systemCurrent: number;
  systemDcVoltage: number;
  systemStatus: BatterySystemStatus; //Using enum
  systemTime: DateTime; // Corrected to Date
  systemWarning: boolean;
}
