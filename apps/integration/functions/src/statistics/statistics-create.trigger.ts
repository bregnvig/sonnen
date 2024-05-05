import { SonnenDay, Weather } from '@sonnen/data';
import { firestoreUtils } from '@sonnen/firebase';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

import { onDocumentCreated } from 'firebase-functions/v2/firestore';

export const newStatistic = onDocumentCreated({
    document: 'sonnen/statistics/entries/{date}',
    region: 'europe-west1'
  },
  async event => {
    event
    const data = firestoreUtils.convertTimestamps(event.data.data()) as SonnenDay;
    const db = getFirestore();

    const start = firestoreUtils.convertDateTime(data.timestamp.startOf('day').set({ 'hour': 6 })) as Timestamp;
    const end = firestoreUtils.convertDateTime(data.timestamp.startOf('day').set({ hour: 20, minute: 0 })) as Timestamp;

    const avgCloud = await db.collection(`weather`).where(`timestamp`, '>=', start).where(`timestamp`, '<=', end).get().then((snapshot) => {
      const weather = snapshot.docs.map(doc => doc.data()) as Weather[];
      return weather.reduce((acc, cur) => acc + cur.cloud, 0) / weather.length;
    });

  }
);

