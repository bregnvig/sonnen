import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SonnenService } from './';

@Module({
  imports: [HttpModule.register({
    baseURL: `http://${process.env.SONNEN_API_BASE_URL}/api/v2`,
    headers: {
      'Auth-Token': process.env.SONNEN_API_KEY,
    },
  })],
  providers: [SonnenService],
  exports: [SonnenService],
})
export class CommonModule {}
