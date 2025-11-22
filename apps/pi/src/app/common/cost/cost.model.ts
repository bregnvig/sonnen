import { DateTime } from 'luxon';

export interface Cost {
  total: number;
  electricity?: number;
  surcharge?: number;
  transmission?: number;
  electricityTax?: number;
  distribution?: number;
  date: DateTime;
}
