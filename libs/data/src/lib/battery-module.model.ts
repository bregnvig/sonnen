import { DateTime } from 'luxon';

export enum BatterySystemStatus { // If you have a list of possible values.
  Status0 = 0, //Example
  Status49 = 49, //Example
}

export interface BatteryModule {
  /**
   * Module request for balance charge, 0 for false, 1 for true
   * Boolean
   */
  balanceChargeRequest: boolean;

  /**
   * Module charge current limit in A
   * Float
   */
  chargeCurrentLimit: number;

  /**
   * Number of charge/discharge cycles
   * Integer
   */
  cycleCount: number;

  /**
   * Module discharge current limit in A
   * Float
   */
  dischargeCurrentLimit: number;

  /**
   * Fullcharge capacity in Ah
   * Float
   */
  fullChargeCapacity: number;

  /**
   * Max cell temperature in °C
   * Float
   */
  maximumCellTemperature: number;

  /**
   * Max cell voltage in V
   * Float
   */
  maximumCellVoltage: number;

  /**
   * Maximum cell voltage number (enum)
   * Integer
   */
  maximumCellVoltageNum: number;

  /**
   * Max module DC current in A
   * Float
   */
  maximumModuleCurrent: number;

  /**
   * Max module DC voltage in V
   * Float
   */
  maximumModuleDcVoltage: number;

  /**
   * Max module DC temperature in °C
   * Float
   */
  maximumModuleTemperature: number;

  /**
   * Min cell temperature in °C
   * Float
   */
  minimumCellTemperature: number;

  /**
   * Min cell voltage in V
   * Float
   */
  minimumCellVoltage: number;

  /**
   * Minimum cell voltage number (enum)
   * Integer
   */
  minimumCellVoltageNum: number;

  /**
   * Min module current in A
   * Float
   */
  minimumModuleCurrent: number;

  /**
   * Min module voltage in V
   * Float
   */
  minimumModuleDcVoltage: number;

  /**
   * Min module temperature in °C
   * Float
   */
  minimumModuleTemperature: number;

  /**
   * Relative state of charge in %
   * Float
   */
  relativeStateOfCharge: number;

  /**
   * Remaining capacity in Ah
   * Float
   */
  remainingCapacity: number;

  /**
   * System alarm, 0 for false, 1 for true
   * Boolean
   */
  systemAlarm: boolean;

  /**
   * System current in A
   * Float
   */
  systemCurrent: number;

  /**
   * System battery voltage in V
   * Float
   */
  systemDcVoltage: number;

  /**
   * System status
   * BatterySystemStatus enum
   */
  systemStatus: BatterySystemStatus;

  /**
   * System time
   * DateTime
   */
  systemTime: DateTime;

  /**
   * System warning, 0 for false, 1 for true
   * Boolean
   */
  systemWarning: boolean;
}
