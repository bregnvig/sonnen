import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { isNullish } from '@sonnen/utils';
import { of, switchMap } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule, SonnenService } from './common';
import { SimpleBatteryCheckModule } from './simple-battery-check';
import { StatusModule } from './status';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    SimpleBatteryCheckModule,
    StatusModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  constructor(service: SonnenService) {
    const logger = new Logger(AppModule.name);
    service.isManual().pipe(
      switchMap(isManual => isManual ? service.automaticMode() : of(undefined)),
    ).subscribe(value => logger.log(isNullish(value) ? 'Already in automatic mode' : 'Changed to automatic mode'));
  }
}
