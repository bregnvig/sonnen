export interface SonnenLatestData {
  /**
   * All AC output of apparent power in VA
   * Integer
   */
  Apparent_output: number;

  /**
   * Backup-buffer in percentage that is set on the system
   * Integer
   */
  BackupBuffer: number;

  /**
   * Boolean that indicates the charge status. True if charging
   * Boolean
   */
  BatteryCharging: boolean;

  /**
   * Boolean that indicates the discharge status. True if discharging
   * Boolean
   */
  BatteryDischarging: boolean;

  /**
   * House consumption in watts, average over the last 60s
   * Integer
   */
  Consumption_Avg: number;

  /**
   * House consumption in watts, direct measurement
   * Integer
   */
  Consumption_W: number;

  /**
   * AC frequency in hertz
   * Float
   */
  Fac: number;

  /**
   * Boolean that indicates the energy flow at the installation site. True if battery feeds the consumption
   * Boolean
   */
  FlowConsumptionBattery: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if grid feeds the consumption
   * Boolean
   */
  FlowConsumptionGrid: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if production feeds the consumption
   * Boolean
   */
  FlowConsumptionProduction: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if battery is charging from grid
   * Boolean
   */
  FlowGridBattery: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if production is charging the battery
   * Boolean
   */
  FlowProductionBattery: boolean;

  /**
   * Boolean that indicates the energy flow at the installation site. True if production feeds into the grid
   * Boolean
   */
  FlowProductionGrid: boolean;

  /**
   * Grid Feed in watts. Negative is consumption and positive is feed in
   * Integer
   */
  GridFeedIn_W: number;

  /**
   * System is installed or not
   * Integer
   */
  IsSystemInstalled: number;

  /**
   * Operating mode that is set on the system: 1: Manual charging or discharging via API; 2: Automatic Self Consumption. Default.
   * Integer
   */
  OperatingMode: number;

  /**
   * AC Power in watts. Greater than ZERO is discharging, less than ZERO is charging
   * Signed Integer
   */
  Pac_total_W: number;

  /**
   * PV production in watts
   * Integer
   */
  Production_W: number;

  /**
   * Relative state of charge in percentage
   * Integer
   */
  RSOC: number;

  /**
   * Remaining capacity based on RSOC in Wh
   * Integer
   */
  RemainingCapacity_W: number;

  /**
   * Output of apparent power in VA on Phase 1
   * Integer
   */
  Sac1: number;

  /**
   * Output of apparent power in VA on Phase 2
   * Integer
   */
  Sac2: number;

  /**
   * Output of apparent power in VA on Phase 3
   * Integer
   */
  Sac3: number;

  /**
   * String that indicates if the system is connected to the grid ("OnGrid") or disconnected ("OffGrid")
   * String
   */
  SystemStatus: 'OnGrid' | 'OffGrid' | string;

  /**
   * Local system time
   * String
   */
  Timestamp: string;

  /**
   * User state of charge in percentage
   * Integer
   */
  USOC: number;

  /**
   * AC voltage in volts
   * Float
   */
  Uac: number;

  /**
   * Battery voltage in volts
   * Float
   */
  Ubat: number;

  /**
   * Boolean that indicates the discharge status. True if no discharge allowed, based on battery maintenance
   * Boolean
   */
  dischargeNotAllowed: boolean;

  /**
   * Boolean that indicates the autostart setting of the generator
   * Boolean
   */
  generator_autostart: boolean;
}
