import { firestore } from 'firebase-admin';
import { DateTime } from 'luxon';
import Timestamp = firestore.Timestamp;

export interface SonnenEvent<T = DateTime | Timestamp> {
  timestamp?: T;
  source: `${string}:${string}`;
  type: 'warn' | 'error' | 'info' | 'debug';
  title: string;
  message: string;
  data?: any;
}
