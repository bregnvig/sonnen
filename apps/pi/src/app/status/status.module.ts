import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { StatusCronService } from './status.cron';

@Module({
  imports: [CommonModule],
  providers: [StatusCronService],
})
export class StatusModule {}
