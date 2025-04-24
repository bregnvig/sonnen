import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase';
import { EventService, SonnenCollectionService, SonnenService } from './';
import { CostService } from './cost/cost.service';

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
  providers: [SonnenService, SonnenCollectionService, EventService, CostService],
  exports: [SonnenService, SonnenCollectionService, EventService, CostService],
})
export class CommonModule {}
