import { Injectable } from '@nestjs/common';
import { converter } from '@sonnen/backend/firebase';
import { AverageConsumption, AverageConsumptionDay, BatteryDay, collectionPath, ProductionDay } from '@sonnen/data';
import { DateTime } from 'luxon';
import { FirebaseService } from '../../firebase';


@Injectable()
export class SonnenCollectionService {

  constructor(private firebase: FirebaseService) {}

  async updateAverageConsumption(consumption: number) {
    await this.firebase.writeDayData(collectionPath.averageConsumption, {consumption});
  }

  async updateBatteryLevel(usoc: number) {
    await this.firebase.writeDayData('battery', {usoc});
  }

  async updateProduction(production: number) {
    await this.firebase.writeDayData(collectionPath.production, {production});
  }

  async updatePrediction(params: { production: number, prediction: number, difference: number, cloud: number, temperature: number }) {
    await this.firebase.writeDayData(collectionPath.prediction, params);
  }

  /**
   * Will look for the production for the given date. If not found go to the previous date. Max 7 days
   * @param date
   */
  async getProduction(date: DateTime): Promise<ProductionDay> {
    return this.#getDay<ProductionDay>(collectionPath.production, date);
  }

  /**
   * Will look for the average consumption for the given date. If not found go to the previous date. Max 7 days
   * @param date
   */
  async getAverageConsumption(date: DateTime): Promise<AverageConsumptionDay> {
    const result = await this.#getDay<{ day: DateTime, 'average-consumption': AverageConsumption[] }>(collectionPath.averageConsumption, date);
    const {'average-consumption': consumption, ...rest} = result;
    return {
      ...rest,
      consumption,
    };
  }

  /**
   * Will look for the average consumption for the given date. If not found go to the previous date. Max 7 days
   * @param date
   */
  async getBattery(date: DateTime): Promise<BatteryDay> {
    return await this.#getDay<BatteryDay>(collectionPath.battery, date);
  }

  async #getDay<T>(collection: string, date: DateTime): Promise<T> {

    let result: T | undefined;
    let queryDate = date;

    while (!result && queryDate > date.minus({days: 7})) {
      const doc = this.firebase.db.collection(collection).doc(queryDate.toFormat('yyyy-MM-dd')).withConverter<T>(converter);
      result = await doc.get().then(snapshot => snapshot.exists ? snapshot.data() : undefined);
      queryDate = queryDate.minus({days: 1});
    }
    if (!result) {
      throw new Error(`No data found for ${collection} @${date.toFormat('yyyy-MM-dd')}`);
    }
    return result;
  }

}
