import { SonnenMeasurement, SonnenDay } from '@sonnen/data';
import { converter } from '@sonnen/firebase';
import { getFirestore } from 'firebase-admin/firestore';

export const writeMeasurements = async (
  measurements: SonnenMeasurement[]
): Promise<number> => {
  const db = getFirestore();

  const sonnen = db.collection('sonnen/measurement/entries');
  return db.runTransaction((transaction) => {
    measurements.forEach((set) =>
      transaction.set(
        sonnen.doc(set.timestamp.toISO()).withConverter(converter),
        set
      )
    );
    return Promise.resolve(measurements.length);
  });
};

export const writeStatistics = async (
  measurements: SonnenDay[]
): Promise<number> => {
  const db = getFirestore();

  const sonnen = db.collection('sonnen/statistics/entries');
  return db.runTransaction((transaction) => {
    measurements.forEach((set) =>
      transaction.set(
        sonnen.doc(set.timestamp.toISO()).withConverter(converter),
        set
      )
    );
    return Promise.resolve(measurements.length);
  });
};
