import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { firstValueFrom, map } from 'rxjs';

// Interface for det ønskede output-objekt
export interface WeatherPrediction {
  timestamp: DateTime;
  temperature: number; // Temperaturen i grader Celsius
  cloud: number; // Skydække i procent
}

// Interfaces til at repræsentere strukturen af input JSON-data
interface HourlyUnits {
  time: string;
  temperature_2m: string;
  cloud_cover: string;
}

interface HourlyData {
  time: string[];
  temperature_2m: number[];
  cloud_cover: number[];
}

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: HourlyData;
}

/**
 * Parser rå vejrdata til et array af WeatherPrediction-objekter ved hjælp af en funktionel tilgang (map).
 * @param data - Objektet indeholdende vejrdata, der matcher WeatherData-interfacet.
 * @returns Et array af WeatherPrediction-objekter.
 * @throws Error hvis input data arrays (time, temperature_2m, cloud_cover) ikke har samme længde.
 */
function parseWeatherDataFunctional(data: WeatherData): WeatherPrediction[] {
  // Hent de relevante arrays fra input data
  const times = data.hourly.time;
  const temperatures = data.hourly.temperature_2m;
  const cloudCovers = data.hourly.cloud_cover;

  // Validering: Sikrer at alle arrays har samme længde
  if (!(times.length === temperatures.length && times.length === cloudCovers.length)) {
    throw new Error('Input data arrays (time, temperature, cloud cover) must have the same length.');
  }

  return times.map((currentTime, index) => {
    return {
      timestamp: DateTime.fromISO(currentTime),        // Tidspunktet fra det aktuelle element i 'times'
      temperature: temperatures[index], // Find temperatur ved samme index
      cloud: cloudCovers[index],      // Find skydække ved samme index
    };
  }) as WeatherPrediction[];
}

@Injectable()
export class WeatherService {

  constructor(private http: HttpService) {
  }

  async findPredictionForHour(date: DateTime, latitude: number, longitude: number): Promise<WeatherPrediction | undefined> {
    return this.getForecast(date, latitude, longitude).then(
      predictions => predictions.find(prediction => prediction.timestamp.hasSame(date, 'hour')),
    );
  }

  async getForecast(date: DateTime, latitude: number, longitude: number): Promise<WeatherPrediction[]> {
    const isoDate = date.toISODate();
    return firstValueFrom(this.http.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,cloud_cover&start_date=${isoDate}&end_date=${isoDate}`, {headers: {'Auth-Token': undefined}}).pipe(
      map(response => response.data),
      map(data => parseWeatherDataFunctional(data))),
    );
  }
}

