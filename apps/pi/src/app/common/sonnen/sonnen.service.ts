import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { SonnenLatestData } from './sonnen-latest-data.model';
import { sonnenMapper } from './sonnen-mapper';
import { SonnenStatus } from './sonnen-status.model';

@Injectable()
export class SonnenService {

  constructor(private http: HttpService) {
  }

  getBatteryData() {
    return this.http.get('battery').pipe(
      map(response => response.data),
      map(response => sonnenMapper.batteryModule(response)),
    );
  }

  getLatestData() {
    return this.http.get<SonnenLatestData>('latestdata').pipe(
      map(response => response.data),
      map(response => sonnenMapper.latestData(response)),
    );
  }

  getStatus() {
    return this.http.get<SonnenStatus>('status').pipe(
      map(response => response.data),
      map(response => sonnenMapper.status(response)),
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
