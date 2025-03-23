export interface SonnenEnergySystemStatus {
  Apparent_output: number; // VA - All AC output of apparent power
  BackupBuffer: number; // % - Backup-buffer in percentage
  BatteryCharging: boolean; // True if charging
  BatteryDischarging: boolean; // True if discharging
  Consumption_Avg: number; // W - House consumption (60s average)
  Consumption_W: number; // W - House consumption (direct)
  Fac: number; // Hz - AC frequency
  FlowConsumptionBattery: boolean; // True if battery feeds consumption
  FlowConsumptionGrid: boolean; // True if grid feeds consumption
  FlowConsumptionProduction: boolean; // True if production feeds consumption
  FlowGridBattery: boolean; // True if battery is charging from grid
  FlowProductionBattery: boolean; // True if production is charging battery
  FlowProductionGrid: boolean; // True if production feeds into grid
  GridFeedIn_W: number; // W - Negative = consumption, Positive = feed-in
  IsSystemInstalled: number; // 0 or 1 - Indicates if system is installed
  OperatingMode: number; // Operating mode: 1 = Manual, 2 = Auto
  Pac_total_W: number; // W - Inverter AC Power (+ = discharge, - = charge)
  Production_W: number; // W - PV production
  RSOC: number; // % - Relative state of charge
  RemainingCapacity_W: number; // Wh - Remaining capacity based on RSOC
  Sac1: number; // VA - Apparent power on Phase 1
  Sac2: number; // VA - Apparent power on Phase 2
  Sac3: number; // VA - Apparent power on Phase 3
  SystemStatus: 'OnGrid' | 'OffGrid' | string; // Grid connection status
  Timestamp: string; // Local time (e.g. "2020-12-10 11:26:01")
  USOC: number; // % - User state of charge
  Uac: number; // V - AC voltage
  Ubat: number; // V - Battery voltage
  dischargeNotAllowed: boolean; // True if discharge not allowed
  generator_autostart: boolean; // True if generator autostart is enabled
}

export interface EnergySystemStatus {
  apparentOutput: number;
  backupBuffer: number;
  batteryCharging: boolean;
  batteryDischarging: boolean;
  consumptionAvg: number;
  consumptionW: number;
  fac: number;
  flowConsumptionBattery: boolean;
  flowConsumptionGrid: boolean;
  flowConsumptionProduction: boolean;
  flowGridBattery: boolean;
  flowProductionBattery: boolean;
  flowProductionGrid: boolean;
  gridFeedInW: number;
  isSystemInstalled: number;
  operatingMode: number;
  pacTotalW: number;
  productionW: number;
  rsoc: number;
  remainingCapacityW: number;
  sac1: number;
  sac2: number;
  sac3: number;
  systemStatus: string; // or 'OnGrid' | 'OffGrid'
  timestamp: string;
  usoc: number;
  uac: number;
  ubat: number;
  dischargeNotAllowed: boolean;
  generatorAutostart: boolean;
}
