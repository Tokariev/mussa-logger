import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { CronJobsController } from './cron-jobs.controller';
import { CarModule } from 'src/car/car.module';
import { CarDetailsModule } from 'src/car-details/car-details.module';

@Module({
  imports: [CarModule, CarDetailsModule],
  controllers: [CronJobsController],
  providers: [CronJobsService],
})
export class CronJobsModule {}
