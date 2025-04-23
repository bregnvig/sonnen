import { readFile } from 'fs/promises';
import { DateTime } from 'luxon';

interface HistoricalProduction {
  timestamp: DateTime;
  production: number;
  consumption: number;
}

interface HistoricalWeather {
  timestamp: DateTime;
  temperature: number;
  cloud: number;
}

interface HistoricalSunset {
  timestamp: DateTime;
  wmo: number;
  sunrise: DateTime;
  sunset: DateTime;
  duration: number;
}

const productionHours = [0, 3, 6, 9, 12, 15, 18, 21];

export const historicalProduction = async (productionFilename: string, weatherFilename: string, sunsetFilename: string) => {

  const production = await readFile(productionFilename, 'utf-8')
    .then(data => data.split('\n'))
    .then(lines => lines.map(line => line.split(',')))
    .then(lines => lines.map(line => ({
      timestamp: DateTime.fromISO(line[0]),
      production: parseInt(line[1]),
      consumption: parseInt(line[1]),
    }) as HistoricalProduction));

  const weather = await readFile(weatherFilename, 'utf-8')
    .then(data => data.split('\n'))
    .then(lines => lines.map(line => line.split(',')))
    .then(lines => lines.map(line => ({
      timestamp: DateTime.fromISO(line[0]),
      temperature: parseFloat(line[1]),
      cloud: parseInt(line[2]),
    }) as HistoricalWeather))
    .then(weather => weather.filter(({timestamp}) => productionHours.includes(timestamp.hour)));


  const sunset = await readFile(sunsetFilename, 'utf-8')
    .then(data => data.split('\n'))
    .then(lines => lines.map(line => line.split(',')))
    .then(lines => lines.map(line => ({
      timestamp: DateTime.fromISO(line[0]),
      wmo: parseInt(line[1]),
      sunrise: DateTime.fromISO(line[2]),
      sunset: DateTime.fromISO(line[3]),
      duration: parseFloat(line[4]),
    }) as HistoricalSunset));

  const merged = production.map(p => {
    const weatherData = weather.find(w => w.timestamp.toISO() === p.timestamp.toISO());
    const sunsetData = sunset.find(s => s.timestamp.toISO() === p.timestamp.toISO());
    return {
      ...p,
      ...(weatherData || {}),
      ...(sunsetData || {}),
    };
  });


};
