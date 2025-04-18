import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OperationMode, Status } from '@sonnen/data';
import { shareLatest } from '@sonnen/utils';
import { BehaviorSubject, catchError, map, Observable, switchMap, timer } from 'rxjs';
import { SonnenConfiguration } from './sonnen-configuration.model';
import { SonnenLatestData } from './sonnen-latest-data.model';
import { sonnenMapper } from './sonnen-mapper';
import { SonnenStatus } from './sonnen-status.model';

@Injectable()
export class SonnenService {

  #logger = new Logger(SonnenService.name);

  chargeStatus = new BehaviorSubject<boolean>(false);

  readonly status$: Observable<Status> = timer(0, 60000).pipe(
    switchMap(() => this.#getStatus()),
    shareLatest(),
  );

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

  charge(watts = 2300) {
    this.chargeStatus.next(true);
    return this.manualMode().pipe(
      switchMap(() => this.http.post<boolean>(`setpoint/charge/${watts}`)),
      map(response => response.data),
      catchError(error => {
        this.chargeStatus.next(false);
        throw error;
      }),
    );
  }

  stop() {
    this.chargeStatus.next(false);
    return this.automaticMode();
  }

  isManual() {
    return this.#getConfiguration().pipe(
      map(configuration => configuration.emOperatingMode === OperationMode.Manual),
    );
  }

  isAutomatic() {
    return this.#getConfiguration().pipe(
      map(configuration => configuration.emOperatingMode === OperationMode.Automatic),
    );
  }

  manualMode() {
    return this.#updateConfiguration({EM_OperatingMode: '1'});
  }

  automaticMode() {
    return this.#updateConfiguration({EM_OperatingMode: '2'});
  }

  #updateConfiguration(configuration: Partial<SonnenConfiguration>) {
    const data = Object.entries(configuration).reduce((acc, [key, value]) => {
      acc.append(key, value);
      return acc;
    }, new URLSearchParams());
    this.#logger.debug('Updating configuration', data.toString());
    return this.http.put<Pick<SonnenConfiguration, keyof typeof configuration>>('configurations', data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).pipe(
      map(response => response.data),
    );
  }

  #getConfiguration() {
    return this.http.get<SonnenConfiguration>('configurations').pipe(
      map(response => response.data),
      map(response => sonnenMapper.configuration(response)),
    );
  }

  #getStatus() {
    return this.http.get<SonnenStatus>('status').pipe(
      map(response => response.data),
      map(response => sonnenMapper.status(response)),
    );
  }

}
