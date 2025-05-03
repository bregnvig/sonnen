import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase';
import { CostService, EventService, SonnenCollectionService, SonnenService } from './';
import { WeatherService } from './weather/weather.service';

const publicServices = [SonnenService, SonnenCollectionService, EventService, CostService, WeatherService];

@Module({
  imports: [
    HttpModule.register({
      baseURL: `http://${process.env.SONNEN_API_BASE_URL}/api/v2`,
      headers: {
        'Auth-Token': process.env.SONNEN_API_KEY,
      },
    }),
    FirebaseModule,
  ],
  providers: publicServices,
  exports: publicServices,
})
export class CommonModule {}
