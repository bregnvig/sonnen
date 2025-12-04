import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OperationMode, Status } from '@sonnen/data';
import { shareLatest } from '@sonnen/utils';
import { BehaviorSubject, catchError, map, Observable, retry, switchMap, tap, timer } from 'rxjs';
import { EventService } from '../event';
import { SonnenConfiguration } from './sonnen-configuration.model';
import { SonnenLatestData } from './sonnen-latest-data.model';
import { sonnenMapper } from './sonnen-mapper';
import { SonnenStatus } from './sonnen-status.model';

@Injectable()
export class SonnenService {

  #logger = new Logger(SonnenService.name);

  chargeStatus = new BehaviorSubject<'charging' | 'automatic' | 'manuel'>('automatic');

  readonly status$: Observable<Status> = timer(0, 60000).pipe(
    switchMap(() => this.#getStatus()),
    shareLatest(),
  );

  readonly usoc$ = this.status$.pipe(
    map(status => status.usoc),
  );

  constructor(private http: HttpService, private event: EventService) {
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

  charge(watts = process.env.SONNEN_BATTERY_CHARGE_WATTS) {
    return this.manualMode().pipe(
      switchMap(() => this.http.post<boolean>(`setpoint/charge/${ watts }`)),
      tap(() => this.chargeStatus.next('charging')),
      map(response => response.data),
      catchError(async error => {
        this.#logger.warn('Charge issues', error);
        await this.event.add({
          title: 'Lade problemer',
          source: `${ SonnenService.name }:ChargeError`,
          type: 'error',
          message: error.message,
        });
        return this.automaticMode().pipe(
          map(() => false),
        );
      }),
    );
  }

  stop() {
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

  getCapacity(): Observable<number> {
    return this.#getConfiguration().pipe(
      map(configuration => configuration.icBatteryModules * configuration.cmMarketingModuleCapacity),
    );
  }

  manualMode() {
    this.chargeStatus.next('manuel');
    return this.#updateConfiguration({ EM_OperatingMode: '1' });
  }

  automaticMode() {
    this.chargeStatus.next('automatic');
    return this.#updateConfiguration({ EM_OperatingMode: '2' });
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
      retry({
        count: 3,
        delay: 2000,
      }),
      map(response => response.data),
      map(response => sonnenMapper.status(response)),
    );
  }

}
