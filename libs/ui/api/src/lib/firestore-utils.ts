import { Timestamp } from '@angular/fire/firestore';
import { DateTime } from 'luxon';

export const regexISODate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export const firestoreWebUtils = {
  convertJSONDate(value: any): any {
    const reMsAjax = /^\/Date\((d|-|.*)\)[/|\\]$/;
    if (typeof value === 'string') {
      let result = regexISODate.exec(value);
      if (result) {
        return DateTime.fromISO(value);
      } else {
        result = reMsAjax.exec(value);
        if (result) {
          const msResult = result[1].split(/[-+,.]/);
          return DateTime.fromMillis(msResult[0] ? +msResult[0] : 0 - +msResult[1]);
        }
      }
    }
    return value;
  },
  convertJSONDates(input: any): any {
    // Ignore things that aren't objects.
    if (!input || typeof input !== 'object') {
      return firestoreWebUtils.convertJSONDate(input);
    }
    Object.keys(input).map(key => {
      const value = input[key];
      // Check for string properties which look like dates.
      if (typeof value === 'string') {
        input[key] = firestoreWebUtils.convertJSONDate(value);
      } else if (typeof value === 'object') {
        firestoreWebUtils.convertJSONDates(value);
      }
    });
    return input;
  },
  convertTimestamp(input: Timestamp | unknown): DateTime | any {
    if (input instanceof Timestamp) {
      return DateTime.fromJSDate(input.toDate());
    }
    return input;
  },
  convertTimestamps<T>(input: any): T {
    if (!input || typeof input !== 'object') {
      return input;
    }
    Object.keys(input).map(key => {
      const value = input[key];
      if (value instanceof Timestamp) {
        input[key] = firestoreWebUtils.convertTimestamp(value);
      } else if (typeof value === 'object') {
        firestoreWebUtils.convertTimestamps(value);
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
        input[key] = firestoreWebUtils.convertDateTime(value);
      } else if (typeof value === 'object' && value) {
        firestoreWebUtils.convertDateTimes(value);
      }
    });
    return input;
  },
  convertToJSON(input: any) {
    if (!input || typeof input !== 'object') {
      return input;
    }
    Object.keys(input).map(key => {
      const value = input[key];
      if (value instanceof DateTime) {
        input[key] = value.toJSON();
      } else if (typeof value === 'object' && value) {
        firestoreWebUtils.convertToJSON(value);
      }
    });
    return input;

  },
};
