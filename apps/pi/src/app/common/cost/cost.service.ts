import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';

import type { Cost } from './cost.model';

type ElpriserligenuEntry = {
  DKK_per_kWh: number;
  time_start: string;
  time_end: string;
};

function mapToCost(raw: ElpriserligenuEntry): Cost {
  return {
    kWh: raw.DKK_per_kWh,
    from: DateTime.fromISO(raw.time_start),
    to: DateTime.fromISO(raw.time_end),
  };
}

@Injectable()
export class CostService {

  constructor(private http: HttpService) {
  }

  getPrices(date: DateTime = DateTime.now(), region: 'DK2' | 'DK1' = 'DK2'): Observable<Cost[]> {
    const year = date.toFormat('yyyy');
    const month = date.toFormat('MM');
    const day = date.toFormat('dd');
    return this.http.get<ElpriserligenuEntry[]>(`https://elprisenligenu.dk/api/v1/prices/${year}/${month}-${day}_${region}.json`).pipe(
      map(response => response.data),
      map(data => data.map(mapToCost)),
    );
  }
}
