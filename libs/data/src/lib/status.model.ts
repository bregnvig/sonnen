// Example usage with Date for Timestamp (and improvements):
export enum SystemStatus {
  OnGrid = 'OnGrid',
  OffGrid = 'OffGrid', // Add other possible status values here
  // ...
}

export enum OperatingMode { //If you know the meaning of OperatingMode
  Manual = '1',
  SelfConsumption = '2',
}


export interface Status {
  /**
   * All AC output of apparent power in VA
   * Integer
   */
  apparentOutput: number;

  /**
   * Backup-buffer in percentage that is set on the system
   * Integer
   */
  backupBuffer: number;

  /**
   * Boolean that indicates the charge status. True if charging
   * Boolean
   */
  batteryCharging: boolean;

  /**
   * Boolean that indicates the discharge status. True if discharging
   * Boolean
   */
  batteryDischarging: boolean;

  /**
   * House consumption in watts, average over the last 60s
   * Integer
   */
  consumptionAvg: number;

  /**
   * House consumption in watts, direct measurement
   * Integer
   */
  consumptionW: number;

  /**
   * AC frequency in hertz
   * Float
   */
  fac: number;

  /**
   * Boolean that indicates the energy flow at the installation site. True if battery feeds the consumption
   * Boolean
   */
  flowConsumptionBattery: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if grid feeds the consumption
   * Boolean
   */
  flowConsumptionGrid: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if production feeds the consumption
   * Boolean
   */
  flowConsumptionProduction: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if battery is charging from grid
   * Boolean
   */
  flowGridBattery: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if production is charging the battery
   * Boolean
   */
  flowProductionBattery: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if production feeds into the grid
   * Boolean
   */
  flowProductionGrid: boolean;

  /**
   * Grid Feed in watts. Negative is consumption and positive is feed in
   * Integer
   */
  gridFeedInW: number;

  /**
   * System is installed or not
   * Boolean
   */
  isSystemInstalled: boolean;

  /**
   * Operating mode that is set on the system: 1: Manual charging or discharging via API; 2: Automatic Self Consumption. Default.
   * OperatingMode enum
   */
  operatingMode: OperatingMode;

  /**
   * AC Power in watts. Greater than ZERO is discharging, less than ZERO is charging
   * Signed Integer
   */
  pacTotalW: number;

  /**
   * PV production in watts
   * Integer
   */
  productionW: number;

  /**
   * Relative state of charge in percentage
   * Integer
   */
  rsoc: number;

  /**
   * Remaining capacity based on RSOC in Wh
   * Integer
   */
  remainingCapacityWh: number;

  /**
   * Output of apparent power in VA on Phase 1
   * Integer
   */
  sac1: number;

  /**
   * Output of apparent power in VA on Phase 2
   * Integer
   */
  sac2: number | null;

  /**
   * Output of apparent power in VA on Phase 3
   * Integer
   */
  sac3: number | null;

  /**
   * String that indicates if the system is connected to the grid ("OnGrid") or disconnected ("OffGrid")
   * SystemStatus enum
   */
  systemStatus: SystemStatus;

  /**
   * Local system time
   * Date
   */
  timestamp: Date;

  /**
   * User state of charge in percentage
   * Integer
   */
  usoc: number;

  /**
   * AC voltage in volts
   * Float
   */
  uac: number;

  /**
   * Battery voltage in volts
   * Float
   */
  ubat: number;

  /**
   * Boolean that indicates the discharge status. True if no discharge allowed, based on battery maintenance
   * Boolean
   */
  dischargeNotAllowed: boolean;

  /**
   * Boolean that indicates the autostart setting of the generator
   * Boolean
   */
  generatorAutostart: boolean;
}
