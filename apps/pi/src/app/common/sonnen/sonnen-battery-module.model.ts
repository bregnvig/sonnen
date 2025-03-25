export interface SonnenBatteryModule {
  /**
   * Module request for balance charge, 0 for false, 1 for true
   * Boolean
   */
  balancechargerequest: boolean;

  /**
   * Module charge current limit
   * Float
   */
  chargecurrentlimit: number;

  /**
   * Number of charge/discharge cycles
   * Integer
   */
  cyclecount: number;

  /**
   * Module discharge current limit
   * Float
   */
  dischargecurrentlimit: number;

  /**
   * Fullcharge capacity
   * Float
   */
  fullchargecapacity: number;

  /**
   * Max cell temperature
   * Float
   */
  maximumcelltemperature: number;

  /**
   * Max cell voltage
   * Float
   */
  maximumcellvoltage: number;

  /**
   * Enum
   */
  maximumcellvoltagenum: number; //  Consider creating an enum if values are known

  /**
   * Max module DC current
   * Float
   */
  maximummodulecurrent: number;

  /**
   * Max module DC voltage
   * Float
   */
  maximummoduledcvoltage: number;

  /**
   * Max module DC temperature
   * Float
   */
  maximummoduletemperature: number;

  /**
   * Min cell temperature
   * Float
   */
  minimumcelltemperature: number;

  /**
   * Min cell voltage
   * Float
   */
  minimumcellvoltage: number;

  /**
   * Enum
   */
  minimumcellvoltagenum: number; // Consider creating an enum if values are known

  /**
   * Min module current
   * Float
   */
  minimummodulecurrent: number;

  /**
   * Min module voltage
   * Float
   */
  minimummoduledcvoltage: number;

  /**
   * Min module temperature
   * Float
   */
  minimummoduletemperature: number;

  /**
   * Relative state of charge
   * Float
   */
  relativestateofcharge: number;

  /**
   * Remaining capacity in Ah
   * Float
   */
  remainingcapacity: number;

  /**
   * System alarm, 0 for false, 1 for true
   * Boolean
   */
  systemalarm: boolean;

  /**
   * System current
   * Float
   */
  systemcurrent: number;

  /**
   * System battery voltage
   * Float
   */
  systemdcvoltage: number;

  /**
   * System status
   * Integer
   */
  systemstatus: number; // Consider creating an enum if status codes are well-defined

  /**
   * System time epoch
   * number
   */
  systemtime: number;

  /**
   * System warning, 0 for false, 1 for true
   * Boolean
   */
  systemwarning: boolean;
}
