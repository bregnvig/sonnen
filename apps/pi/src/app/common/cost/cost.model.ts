import { DateTime } from 'luxon';

export interface Cost {
  kWh: number;
  from: DateTime;
  to: DateTime;
}
