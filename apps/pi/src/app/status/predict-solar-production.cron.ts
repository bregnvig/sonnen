import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { requiredValue } from '@sonnen/utils';
import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import SunCalc from 'suncalc';
import { EventService, SonnenService, WeatherService } from '../common';

const predictedSolarProduction = (
  date: DateTime,
  temperatureCelsius: number,
  cloudCoverPercent: number,
  latitude: number,
  longitude: number,
): number => {
  const temperatureCoefficient = 36.92;
  const cloudCoverCoefficient = -3.61;
  const intercept = 404.28;

  // Beregn solens højde baseret på geografisk position
  const sunPosition = SunCalc.getPosition(date.toJSDate(), latitude, longitude);
  const solarElevationFactor = Math.max(Math.sin(sunPosition.altitude), 0);

  // Juster intercept baseret på dato (højere om sommeren, lavere om vinteren)
  const dayOfYear = date.ordinal;
  const seasonalAdjustment = Math.cos((2 * Math.PI * (dayOfYear - 172)) / 365) * 500;

  const adjustedIntercept = intercept + seasonalAdjustment;

  const predictedProduction =
    solarElevationFactor *
    ((temperatureCoefficient * temperatureCelsius) + (cloudCoverCoefficient * cloudCoverPercent) + adjustedIntercept);

  return Math.max(predictedProduction, 0);
};


@Injectable()
export class PredictSolarProductionService {

  #logger = new Logger(PredictSolarProductionService.name);
  latitude = requiredValue(parseFloat(process.env.SONNEN_LATITUDE), 'Latitude');
  longitude = requiredValue(parseFloat(process.env.SONNEN_LONGITUDE), 'Longitude');

  constructor(private event: EventService, private sonnen: SonnenService, private weatherService: WeatherService) {
    this.#logger.debug('PredictSolarProductionService started', this.latitude, this.longitude);
  }

  @Cron('0 5-17 * * *')
  async predictSolarProduction() {
    const now = DateTime.now();
    const weatherPrediction = await this.weatherService.findPredictionForHour(now, this.latitude, this.longitude);
    const production = (await firstValueFrom(this.sonnen.status$)).productionW;

    if (!weatherPrediction) {
      await this.event.add({
        source: `${PredictSolarProductionService.name}:WeatherPrediction`,
        type: 'error',
        message: 'Kunne ikke finde vejrprognose',
        data: {
          latitude: this.latitude,
          longitude: this.longitude,
          date: now.toISO(),
        },
      });
    }

    const aiPredicted = predictedSolarProduction(now, weatherPrediction.temperature, weatherPrediction.cloud, this.latitude, this.longitude);

    const diff = Math.abs(aiPredicted - production);
    await this.event.add({
      type: 'info',
      source: `${PredictSolarProductionService.name}:Prediction`,
      message: `AI forudsiger ${aiPredicted} W produktion, faktisk produktion ${production} W. Forskel ${diff} W`,
      data: {
        aiPredicted,
        production,
        diff,
        weatherPrediction,
      },
    });
    await this.event.sendToUsers('Forudsigelse af solproduktion', `AI forudsiger ${aiPredicted} W produktion, faktisk produktion ${production} W. Forskel ${diff} W`);
  }
}
