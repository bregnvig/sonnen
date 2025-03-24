import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { SONNEN_API_KEY } from './api-key';
import { sonnenStatus } from './sonnen-mapper';
import { SonnenEnergySystemStatus } from './sonnen.model';

@Injectable()
export class SonnenService {

  constructor(
    private http: HttpService,
    @Inject(SONNEN_API_KEY) private readonly apiKey: string) {
  }

  getBatteryData() {
    return this.http.get('battery');
  }

  getLatestData() {
    return this.http.get<SonnenEnergySystemStatus>('latestdata').pipe(
      map(response => response.data),
      map(response => sonnenStatus(response)),
    );
  }

  charge(watts = 2000) {
    return this.http.post<boolean>(`setpoint/charge/${watts}`).pipe(
      map(response => response.data),
    );
  }

  stop() {
    return this.charge(0);
  }
}
