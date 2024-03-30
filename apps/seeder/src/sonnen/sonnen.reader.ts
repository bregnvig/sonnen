import { SonnenMeasurement, SonnenDay } from '@sonnen/data';
import { readFile } from 'fs/promises';
import { DateTime } from 'luxon';

const filterMeasurement = (line: string): boolean => filterRow(8, line);

const filterDay = (line: string): boolean => filterRow(6, line);

const filterRow = (length: number, line: string): boolean => {
  const [timestamp, ...numbers] = line.split(',');
  return [
    DateTime.fromISO(timestamp).isValid,
    numbers.length === length,
    numbers.every(n => !isNaN(parseFloat(n)))
  ].every(Boolean);
};

const parseMeasurement = (line: string): SonnenMeasurement => {
  const [timestamp, production, consumption, batteryCharge, batteryDischarge, gridFeedIn, gridConsumption, batteryStateOfCharge, directConsumption] = line.split(',');
  return {
    timestamp: DateTime.fromISO(timestamp),
    production: parseFloat(production),
    consumption: parseFloat(consumption),
    batteryCharge: parseFloat(batteryCharge),
    batteryDischarge: parseFloat(batteryDischarge),
    gridFeedIn: parseFloat(gridFeedIn),
    gridConsumption: parseFloat(gridConsumption),
    batteryStateOfCharge: parseFloat(batteryStateOfCharge),
    directConsumption: parseFloat(directConsumption)
  };
};

const parseDay = (line: string): SonnenDay => {
  const [timestamp,
    producedEnergy,
    consumedEnergy,
    batteryChargedEnergy,
    batteryDischargedEnergy,
    gridFeedinEnergy,
    gridPurchaseEnergy
  ] = line.split(',');
  return {
    timestamp: DateTime.fromISO(timestamp),
    producedEnergy: parseFloat(producedEnergy),
    consumedEnergy: parseFloat(consumedEnergy),
    batteryChargedEnergy: parseFloat(batteryChargedEnergy),
    batteryDischargedEnergy: parseFloat(batteryDischargedEnergy),
    gridFeedinEnergy: parseFloat(gridFeedinEnergy),
    gridPurchaseEnergy: parseFloat(gridPurchaseEnergy),
  };
};

export const readMeasurements = async (filename: string): Promise<SonnenMeasurement[]> => {

  return readFile(filename, 'utf8')
    .then(content => content.split('\n'))
    .then(lines => lines.filter(filterMeasurement))
    .then(lines => lines.map(parseMeasurement))
    .catch(error => {
      console.error(`Error reading file ${filename}`, error);
      throw error;
    });
};

export const readStatistics = async (filename: string): Promise<SonnenDay[]> => {

  return readFile(filename, 'utf8')
    .then(content => content.split('\n'))
    .then(lines => lines.filter(filterDay))
    .then(lines => lines.map(parseDay))
    .catch(error => {
      console.error(`Error reading file ${filename}`, error);
      throw error;
    });
};
