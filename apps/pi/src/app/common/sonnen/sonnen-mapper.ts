import { BatteryModule, LatestData, OperatingMode, Status, SystemStatus } from '@sonnen/data';
import { DateTime } from 'luxon';
import { SonnenBatteryModule } from './sonnen-battery-module.model';
import { SonnenLatestData } from './sonnen-latest-data.model';
import { SonnenStatus } from './sonnen-status.model';

function latestData(input: SonnenLatestData): LatestData {
  return {
    apparentOutput: input.Apparent_output,
    backupBuffer: input.BackupBuffer,
    batteryCharging: input.BatteryCharging,
    batteryDischarging: input.BatteryDischarging,
    consumptionAvg: input.Consumption_Avg,
    consumptionW: input.Consumption_W,
    fac: input.Fac,
    flowConsumptionBattery: input.FlowConsumptionBattery,
    flowConsumptionGrid: input.FlowConsumptionGrid,
    flowConsumptionProduction: input.FlowConsumptionProduction,
    flowGridBattery: input.FlowGridBattery,
    flowProductionBattery: input.FlowProductionBattery,
    flowProductionGrid: input.FlowProductionGrid,
    gridFeedInW: input.GridFeedIn_W,
    isSystemInstalled: input.IsSystemInstalled,
    operatingMode: input.OperatingMode,
    pacTotalW: input.Pac_total_W,
    productionW: input.Production_W,
    rsoc: input.RSOC,
    remainingCapacityW: input.RemainingCapacity_W,
    sac1: input.Sac1,
    sac2: input.Sac2,
    sac3: input.Sac3,
    systemStatus: input.SystemStatus,
    timestamp: input.Timestamp,
    usoc: input.USOC,
    uac: input.Uac,
    ubat: input.Ubat,
    dischargeNotAllowed: input.dischargeNotAllowed,
    generatorAutostart: input.generator_autostart,
  };
}


function status(data: SonnenStatus): Status {
  try {
    return {
      apparentOutput: data.Apparent_output,
      backupBuffer: parseInt(data.BackupBuffer, 10),
      batteryCharging: data.BatteryCharging,
      batteryDischarging: data.BatteryDischarging,
      consumptionAvg: data.Consumption_Avg, // Added
      consumptionW: data.Consumption_W,
      fac: data.Fac,
      flowConsumptionBattery: data.FlowConsumptionBattery,
      flowConsumptionGrid: data.FlowConsumptionGrid,
      flowConsumptionProduction: data.FlowConsumptionProduction,
      flowGridBattery: data.FlowGridBattery,
      flowProductionBattery: data.FlowProductionBattery,
      flowProductionGrid: data.FlowProductionGrid,
      gridFeedInW: data.GridFeedIn_W,
      isSystemInstalled: data.IsSystemInstalled === 1,
      operatingMode: data.OperatingMode as OperatingMode, //Type assertion
      pacTotalW: data.Pac_total_W,
      productionW: data.Production_W,
      rsoc: data.RSOC,
      remainingCapacityW: data.RemainingCapacity_W,
      sac1: data.Sac1,
      sac2: data.Sac2,
      sac3: data.Sac3,
      systemStatus: data.SystemStatus as SystemStatus, //Type assertion
      timestamp: new Date(data.Timestamp),
      usoc: data.USOC,
      uac: data.Uac,
      ubat: data.Ubat,
      dischargeNotAllowed: data.dischargeNotAllowed,
      generatorAutostart: data.generator_autostart,
    };
  } catch (error) {
    console.error('Error parsing inverter data:', error);
    throw error; // Or return null
  }
}


function batteryModule(data: SonnenBatteryModule): BatteryModule {
  try {
    return {
      balanceChargeRequest: data.balancechargerequest,
      chargeCurrentLimit: data.chargecurrentlimit,
      cycleCount: data.cyclecount,
      dischargeCurrentLimit: data.dischargecurrentlimit,
      fullChargeCapacity: data.fullchargecapacity,
      maximumCellTemperature: data.maximumcelltemperature,
      maximumCellVoltage: data.maximumcellvoltage,
      maximumCellVoltageNum: data.maximumcellvoltagenum,
      maximumModuleCurrent: data.maximummodulecurrent,
      maximumModuleDcVoltage: data.maximummoduledcvoltage,
      maximumModuleTemperature: data.maximummoduletemperature,
      minimumCellTemperature: data.minimumcelltemperature,
      minimumCellVoltage: data.minimumcellvoltage,
      minimumCellVoltageNum: data.minimumcellvoltagenum,
      minimumModuleCurrent: data.minimummodulecurrent,
      minimumModuleDcVoltage: data.minimummoduledcvoltage,
      minimumModuleTemperature: data.minimummoduletemperature,
      relativeStateOfCharge: data.relativestateofcharge,
      remainingCapacity: data.remainingcapacity,
      systemAlarm: data.systemalarm,
      systemCurrent: data.systemcurrent,
      systemDcVoltage: data.systemdcvoltage,
      systemStatus: data.systemstatus, //No casting if the enum works with the numbers
      systemTime: DateTime.fromMillis(data.systemtime), // Parse to Date!
      systemWarning: data.systemwarning,
    };
  } catch (error) {
    console.error('Error parsing battery module data:', error);
    throw error; // Or return null/default
  }
}


export const sonnenMapper = {
  latestData,
  status,
  batteryModule,
};
