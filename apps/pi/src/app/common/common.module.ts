import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FirestoreModule } from '../firestore';
import { EventService, SonnenService } from './';

@Module({
  imports: [
    HttpModule.register({
      baseURL: `http://${process.env.SONNEN_API_BASE_URL}/api/v2`,
      headers: {
        'Auth-Token': process.env.SONNEN_API_KEY,
      },
    }),
    FirestoreModule,
  ],
  providers: [SonnenService, EventService],
  exports: [SonnenService, EventService],
})
export class CommonModule {}
