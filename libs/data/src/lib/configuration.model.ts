export enum OperationMode { // If you have a list of possible values.
  Automatic = 2,
  Manual = 1,
  BatteryModuleExtension = 6,
  TimeOfUse = 10
}

export interface Configuration {
  /**
   * Marketing module capacity in Wh
   * Number
   */
  cmMarketingModuleCapacity: number;

  /**
   * Cascading role (e.g., "secondary", "primary")
   * String
   */
  cnCascadingRole: string;

  /**
   * Software version (e.g., "1.8.3")
   * String
   */
  deSoftware: string;

  /**
   * CHP (Combined Heat and Power) maximum state of charge
   * String
   */
  emChpMaxSoc: string;

  /**
   * CHP (Combined Heat and Power) minimum state of charge
   * String or null
   */
  emChpMinSoc: string | null;

  /**
   * Operating mode: 1 = Manual charging/discharging via API, 2 = Automatic Self Consumption (Default)
   * OperationMode enum
   * Note: Cannot be changed if VPP is active
   */
  emOperatingMode: OperationMode;

  /**
   * Prognosis charging setting: "0" = disabled, "1" = enabled
   * String
   */
  emPrognosisCharging: string;

  /**
   * Re-enable microgrid: "0" = disabled, "1" = enabled
   * String
   */
  emReEnableMicrogrid: string;

  /**
   * Time of Use Schedule in JSON format
   * Example: "[{\"grid\":\"1\",\"start\":\"07:00\",\"stop\":\"08:00\",\"charge\":\"07:31\"}]"
   * String (JSON)
   */
  emToUSchedule: string;

  /**
   * User input time one (format: "HH:MM", e.g., "00:00")
   * String
   */
  emUserInputTimeOne: string;

  /**
   * User input time two (format: "HH:MM", e.g., "00:00")
   * String
   */
  emUserInputTimeTwo: string;

  /**
   * User state of charge / Backup buffer
   * "0" = disable backup buffer, "5"-"100" = backup buffer percentage
   * String
   */
  emUsoc: string;

  /**
   * Generator type (e.g., "automatic")
   * String
   */
  emUsGenratorType: string;

  /**
   * Generator power set point
   * String
   */
  emUsGenPowerSetPoint: string;

  /**
   * Number of battery modules
   * Number
   */
  icBatteryModules: number;

  /**
   * Inverter maximum power in watts
   * String
   */
  icInverterMaxPowerW: string;

  /**
   * Fixed power factor cos φ value
   * String
   */
  nvmPfcFixedCosPhi: string;

  /**
   * Whether fixed cos φ is active: "0" = inactive, "1" = active
   * String
   */
  nvmPfcIsFixedCosPhiActive: string;

  /**
   * Whether fixed cos φ is lagging: "0" = leading, "1" = lagging
   * String
   */
  nvmPfcIsFixedCosPhiLagging: string;

  /**
   * Heater operating mode: "0" = off
   * String
   */
  shHeaterOperatingMode: string;

  /**
   * Heater maximum temperature in °C
   * String
   */
  shHeaterTemperatureMax: string;

  /**
   * Heater minimum temperature in °C
   * String
   */
  shHeaterTemperatureMin: string;
}
