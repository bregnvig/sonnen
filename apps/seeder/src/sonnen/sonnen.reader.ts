import { readFile } from 'fs/promises';
import { DateTime } from 'luxon';
import { ProductionSet } from './sonnen.model';

const filterProductSet = (line: string): boolean => {
  const [timestamp, ...numbers] = line.split(',');
  return [
    DateTime.fromISO(timestamp).isValid,
    numbers.length === 8,
    numbers.every(n => !isNaN(parseFloat(n)))
  ].every(Boolean)
}

const parseProductSet = (line: string): ProductionSet => {
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

export const readProductSet = async (filename: string): Promise<ProductionSet[]> => {

  return readFile(filename, 'utf8')
    .then(content => content.split('\n'))
    .then(lines => lines.filter(filterProductSet))
    .then(lines => lines.map(parseProductSet))
    .catch(error => {
      console.error(`Error reading file ${filename}`, error);
      throw error;
    });
};
