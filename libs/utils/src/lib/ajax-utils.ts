import { DateTime } from 'luxon';
import { isRecord } from './utils';

const regexISODateTime = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const isoToDateTime = new Map<string, DateTime>();

export const ajaxUtils = {
  convertJSONDate(value: string): DateTime | unknown {
    if (regexISODateTime.test(value)) {
      return isoToDateTime.has(value)
        ? isoToDateTime.get(value)!
        : isoToDateTime.set(value, DateTime.fromISO(value)!).get(value)!;
    }
    return value;
  },
  convertJSONDates(input: unknown): unknown {
    if (typeof input === 'string') {
      return this.convertJSONDate(input);
    }
    if (isRecord(input)) {
      Object.keys(input).map(key => input[key] = this.convertJSONDates(input[key]));
    }
    return input;
  },
};
