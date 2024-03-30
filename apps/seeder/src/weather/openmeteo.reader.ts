import { Weather } from '@sonnen/data';
import { DateTime } from 'luxon';
import { fetchWeatherApi } from 'openmeteo';

const params = (latitude: number, longitude: number, start: DateTime, end: DateTime, timezone = 'Europe/Berlin') => ({
  latitude,
  longitude,
  start_date: start.toISODate(),
  end_date: end.toISODate(),
  hourly: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'precipitation', 'weather_code', 'pressure_msl', 'cloud_cover', 'wind_speed_10m', 'wind_direction_10m'],
  timezone: timezone
});
const url = 'https://archive-api.open-meteo.com/v1/archive';
// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export interface HistoricalWeatherParams {
  lat: number;
  lng: number;
  start: string;
  end: string;
}

export const readHistoricalWeather = async ({ lat, lng, start, end }: HistoricalWeatherParams): Promise<any> => {
  const responses = await fetchWeatherApi(url, params(lat, lng, DateTime.fromISO(start), DateTime.fromISO(end)));

// Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

// Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  const latitude = response.latitude();
  const longitude = response.longitude();

  const hourly = response.hourly()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
      (t) => new Date((t + utcOffsetSeconds) * 1000)
    ),
    temperature2m: hourly.variables(0)!.valuesArray()!,
    relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
    apparentTemperature: hourly.variables(2)!.valuesArray()!,
    precipitation: hourly.variables(3)!.valuesArray()!,
    weatherCode: hourly.variables(4)!.valuesArray()!,
    pressureMsl: hourly.variables(5)!.valuesArray()!,
    cloudCover: hourly.variables(6)!.valuesArray()!,
    windSpeed10m: hourly.variables(7)!.valuesArray()!,
    windDirection10m: hourly.variables(8)!.valuesArray()!
  };
  return weatherData.time.map((time, index) => {
    return {
      timestamp: DateTime.fromJSDate(time),
      temperature: weatherData.temperature2m[index],
      humidity: weatherData.relativeHumidity2m[index],
      pressure: weatherData.pressureMsl[index],
      windSpeed: weatherData.windSpeed10m[index],
      windDirection: weatherData.windDirection10m[index],
      rain: weatherData.precipitation[index],
      cloud: weatherData.cloudCover[index],
      weatherCode: weatherData.weatherCode[index]
    } as Weather;
  });
};

