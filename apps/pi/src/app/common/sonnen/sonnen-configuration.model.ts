export interface SonnenConfiguration {
  /**
   * Marketing module capacity in Wh (e.g., "5500")
   * String
   */
  CM_MarketingModuleCapacity: string;

  /**
   * Cascading role (e.g., "secondary", "primary")
   * String
   */
  CN_CascadingRole: string;

  /**
   * Software version (e.g., "1.8.3")
   * String
   */
  DE_Software: string;

  /**
   * CHP (Combined Heat and Power) maximum state of charge (e.g., "90")
   * String
   */
  EM_CHP_Max_SOC: string;

  /**
   * CHP (Combined Heat and Power) minimum state of charge
   * String or null
   */
  EM_CHP_Min_SOC: string | null;

  /**
   * Operating mode: "1" = Manual charging/discharging via API, "2" = Automatic Self Consumption (Default)
   * String
   * Note: Cannot be changed if VPP is active
   */
  EM_OperatingMode: string;

  /**
   * Prognosis charging setting: "0" = disabled, "1" = enabled
   * String
   */
  EM_Prognosis_Charging: string;

  /**
   * Re-enable microgrid: "0" = disabled, "1" = enabled
   * String
   */
  EM_RE_ENABLE_MICROGRID: string;

  /**
   * Time of Use Schedule in JSON format
   * Example: "[{\"grid\":\"1\",\"start\":\"07:00\",\"stop\":\"08:00\",\"charge\":\"07:31\"}]"
   * String (JSON)
   */
  EM_ToU_Schedule: string;

  /**
   * User input time one (format: "HH:MM", e.g., "00:00")
   * String
   */
  EM_USER_INPUT_TIME_ONE: string;

  /**
   * User input time two (format: "HH:MM", e.g., "00:00")
   * String
   */
  EM_USER_INPUT_TIME_TWO: string;

  /**
   * User state of charge / Backup buffer
   * "0" = disable backup buffer, "5"-"100" = backup buffer percentage
   * String
   */
  EM_USOC: string;

  /**
   * Generator type (e.g., "automatic")
   * String
   */
  EM_US_GENRATOR_TYPE: string;

  /**
   * Generator power set point (e.g., "0")
   * String
   */
  EM_US_GEN_POWER_SET_POINT: string;

  /**
   * Number of battery modules (e.g., "4")
   * String
   */
  IC_BatteryModules: string;

  /**
   * Inverter maximum power in watts (e.g., "3300")
   * String
   */
  IC_InverterMaxPower_w: string;

  /**
   * Fixed power factor cos φ value (e.g., "1")
   * String
   */
  NVM_PfcFixedCosPhi: string;

  /**
   * Whether fixed cos φ is active: "0" = inactive, "1" = active
   * String
   */
  NVM_PfcIsFixedCosPhiActive: string;

  /**
   * Whether fixed cos φ is lagging: "0" = leading, "1" = lagging
   * String
   */
  NVM_PfcIsFixedCosPhiLagging: string;

  /**
   * Heater operating mode: "0" = off
   * String
   */
  SH_HeaterOperatingMode: string;

  /**
   * Heater maximum temperature in °C (e.g., "65")
   * String
   */
  SH_HeaterTemperatureMax: string;

  /**
   * Heater minimum temperature in °C (e.g., "42")
   * String
   */
  SH_HeaterTemperatureMin: string;
}
