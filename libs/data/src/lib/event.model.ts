import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import Timestamp = firestore.Timestamp;

export interface SonnenEvent<T = DateTime | Timestamp> {
  timestamp?: T;
  source: `${string}:${string}`;
  type: 'warn' | 'error' | 'info' | 'debug';
  message: string;
  data?: any;
}
