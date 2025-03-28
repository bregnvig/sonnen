export enum OperationMode { // If you have a list of possible values.
  Automatic = 2,
  Manual = 1,
  BatteryModuleExtension = 6,
  TimeOfUse = 10
}

export interface Configuration {
  cmMarketingModuleCapacity: string;
  cnCascadingRole: string;
  deSoftware: string;
  emChpMaxSoc: string;
  emChpMinSoc: string | null;
  emOperatingMode: OperationMode;
  emPrognosisCharging: string;
  emReEnableMicrogrid: string;
  emToUSchedule: string;
  emUserInputTimeOne: string;
  emUserInputTimeTwo: string;
  emUsoc: string;
  emUsGenratorType: string;
  emUsGenPowerSetPoint: string;
  icBatteryModules: string;
  icInverterMaxPowerW: string;
  nvmPfcFixedCosPhi: string;
  nvmPfcIsFixedCosPhiActive: string;
  nvmPfcIsFixedCosPhiLagging: string;
  shHeaterOperatingMode: string;
  shHeaterTemperatureMax: string;
  shHeaterTemperatureMin: string;
}
