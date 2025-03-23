import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SONNEN_API_KEY } from './api-key';
import { SonnenService } from './sonnen.service';

@Module({
  imports: [HttpModule.register({
    baseURL: `http://${process.env.SONNEN_API_BASE_URL}/api/v2`,
    headers: {
      'Auth-Token': process.env.SONNEN_API_KEY,
    },
  })],
  providers: [
    {
      provide: SONNEN_API_KEY,
      useValue: process.env.SONNEN_API_KEY,
    },
    SonnenService,
  ],
  exports: [SonnenService],
})
export class CommonModule {}
