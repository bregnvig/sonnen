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
  apparentOutput: number;
  backupBuffer: number;
  batteryCharging: boolean;
  batteryDischarging: boolean;
  consumptionAvg: number; // Added
  consumptionW: number;
  fac: number;
  flowConsumptionBattery: boolean;
  flowConsumptionGrid: boolean;
  flowConsumptionProduction: boolean;
  flowGridBattery: boolean;
  flowProductionBattery: boolean;
  flowProductionGrid: boolean;
  gridFeedInW: number;
  isSystemInstalled: boolean;
  operatingMode: OperatingMode;
  pacTotalW: number;
  productionW: number;
  rsoc: number;
  remainingCapacityWh: number; // Added
  sac1: number;
  sac2: number | null;
  sac3: number | null;
  systemStatus: SystemStatus;
  timestamp: Date;
  usoc: number;
  uac: number;
  ubat: number;
  dischargeNotAllowed: boolean;
  generatorAutostart: boolean;
}
