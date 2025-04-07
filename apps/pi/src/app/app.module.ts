import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { collectionPath, SonnenEvent } from '@sonnen/data';
import { isNullish } from '@sonnen/utils';
import { firestore } from 'firebase-admin';
import { of, switchMap } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule, SonnenService } from './common';
import { FirestoreModule, FirestoreService } from './firestore';
import { SimpleBatteryCheckModule } from './simple-battery-check';
import { StatusModule } from './status';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    FirestoreModule,
    SimpleBatteryCheckModule,
    StatusModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(service: SonnenService, private firestore: FirestoreService) {
    const logger = new Logger(AppModule.name);
    service.isManual().pipe(
      switchMap(isManual => isManual ? service.automaticMode() : of(undefined)),
    ).subscribe(value => logger.log(isNullish(value) ? 'Already in automatic mode' : 'Changed to automatic mode'));
  }

  async onModuleInit() {
    const db = this.firestore.db;
    await db.collection(collectionPath.events).add({
      message: `Sonnen PI has started successfully`,
      timestamp: firestore.Timestamp.now(),
      source: `AppModule:Ready`,
      type: 'info',
    } as SonnenEvent);
  }

  async onModuleDestroy() {
    const db = this.firestore.db;
    await db.collection(collectionPath.events).add({
      message: `Sonnen PI is shutting down`,
      timestamp: firestore.Timestamp.now(),
      source: `AppModule:Destroy`,
      type: 'info',
    } as SonnenEvent);
  }
}
