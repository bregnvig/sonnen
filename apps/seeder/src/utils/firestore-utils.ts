import { Timestamp } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';


export const firestoreUtils = {
  convertTimestamp(input: Timestamp): DateTime {
    if (input instanceof Timestamp) {
      return DateTime.fromJSDate(input.toDate());
    }
    return input;
  },
  convertTimestamps(input: any): any {
    if (!input || typeof input !== 'object') {
      return input;
    }
    Object.keys(input).map(key => {
      const value = input[key];
      if (value instanceof Timestamp) {
        input[key] = firestoreUtils.convertTimestamp(value);
      } else if (typeof value === 'object') {
        firestoreUtils.convertTimestamps(value);
      }
    });
    return input;
  },
  convertDateTime(input: any): any | Timestamp {
    if (input instanceof DateTime) {
      return Timestamp.fromMillis(input.toMillis());
    }
    return input;
  },
  convertDateTimes(input: any): any {
    if (!input || typeof input !== 'object') {
      return input;
    }
    Object.keys(input).map(key => {
      const value = input[key];
      if (value instanceof DateTime) {
        input[key] = firestoreUtils.convertDateTime(value);
      } else if (typeof value === 'object' && value) {
        firestoreUtils.convertDateTimes(value);
      }
    });
    return input;
  }
};
