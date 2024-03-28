import { getFirestore } from 'firebase-admin/firestore';
import { converter } from '../utils/timestamp.converter';
import { ProductionSet } from './sonnen.model';

export const writeProductSet = async (productionSet: ProductionSet[]): Promise<number> => {

  const db = getFirestore();

  return db.runTransaction(transaction => {
    const sonnen = db.collection('sonnen');
    productionSet.forEach(set => transaction.set(sonnen.doc(set.timestamp.toISO()).withConverter(converter), set));
    return Promise.resolve(productionSet.length);
  });
};
