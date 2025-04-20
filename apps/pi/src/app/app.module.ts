import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { isNullish } from '@sonnen/utils';
import { firestore } from 'firebase-admin';
import { of, switchMap } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule, EventService, SonnenService } from './common';
import { FirebaseModule } from './firebase';
import { BatteryChargeModule } from './simple-battery-charge';
import { StatusModule } from './status';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    CommonModule,
    BatteryChargeModule,
    StatusModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  #logger = new Logger(AppModule.name);

  constructor(service: SonnenService, private event: EventService) {
    service.isManual().pipe(
      switchMap(isManual => isManual ? service.automaticMode() : of(undefined)),
    ).subscribe(value => this.#logger.log(isNullish(value) ? 'Already in automatic mode' : 'Changed to automatic mode'));
  }

  async onModuleInit() {
    await this.event.add({
      message: `Sonnen PI er startet`,
      timestamp: firestore.Timestamp.now(),
      source: `AppModule:Ready`,
      type: 'info',
    }).catch(error => {
      this.#logger.error('Failed to start sonnen', error);
    });
  }

  async onModuleDestroy() {
    await this.event.add({
      message: `Sonnen PI er lukket ned`,
      timestamp: firestore.Timestamp.now(),
      source: `AppModule:Destroy`,
      type: 'info',
    });
  }
}
