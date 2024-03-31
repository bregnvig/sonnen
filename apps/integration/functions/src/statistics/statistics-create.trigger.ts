import { SonnenDay, Weather } from '@sonnen/data';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { region } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
import { firestoreUtils } from '@sonnen/firebase';

export const newStatistic = region('europe-west1').firestore.document('sonnen/statistics/entries/{date}')
  .onCreate(async (snapshot: DocumentSnapshot) => {
    const data = firestoreUtils.convertTimestamps(snapshot.data()) as SonnenDay;
    const db = getFirestore();

    const start = firestoreUtils.convertDateTime(data.timestamp.startOf('day').set({ 'hour': 6 })) as Timestamp;
    const end = firestoreUtils.convertDateTime(data.timestamp.startOf('day').set({ hour: 20, minute: 0 })) as Timestamp;

    const avgCloud = await db.collection(`weather`).where(`timestamp`, '>=', start).where(`timestamp`, '<=', end).get().then((snapshot) => {
      const weather = snapshot.docs.map(doc => doc.data()) as Weather[];
      return weather.reduce((acc, cur) => acc + cur.cloud, 0) / weather.length;
    });


  });

