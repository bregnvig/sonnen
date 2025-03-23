import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimpleBatteryCheckModule } from './simple-battery-check';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    SimpleBatteryCheckModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  readonly #logger = new Logger(AppModule.name);

  constructor() {
    this.#logger.debug('AppModule constructor');
  }
}
