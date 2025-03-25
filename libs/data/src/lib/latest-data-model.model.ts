export interface LatestData {
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
