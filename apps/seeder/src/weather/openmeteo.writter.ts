import { Weather } from '@sonnen/data';
import { getFirestore } from 'firebase-admin/firestore';
import { converter } from '@sonnen/firebase';

export const writeHistoricalWeather = async (
  weather: Weather[]
): Promise<number> => {
  // Write the weather data to the database
  console.log('Writing historical weather data to the database');
  const db = getFirestore();

  return db.runTransaction((transaction) => {
    const weatherCollection = db.collection('weather');
    weather.forEach((w) =>
      transaction.set(
        weatherCollection.doc(w.timestamp.toISO()).withConverter(converter),
        w
      )
    );
    return Promise.resolve(weather.length);
  });
};
