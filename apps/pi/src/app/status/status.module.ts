import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { FirestoreModule } from '../firestore';
import { StatusCronService } from './status.cron';

@Module({
  imports: [CommonModule, FirestoreModule],
  providers: [StatusCronService],
})
export class StatusModule {}
