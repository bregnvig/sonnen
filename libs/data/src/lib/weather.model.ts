import { DateTime } from 'luxon';

export interface Weather {
  timestamp: DateTime;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  rain: number;
  uv?: number;
  cloud: number;
  weatherCode: number;
}
