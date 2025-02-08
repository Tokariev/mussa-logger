import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { CronJobsController } from './cron-jobs.controller';
import { CarModule } from 'src/car/car.module';
import { CarDetailsModule } from 'src/car-details/car-details.module';
import { CarToJazmakkiModule } from 'src/car-to-jazmakki/car-to-jazmakki.module';

@Module({
  imports: [CarModule, CarDetailsModule, CarToJazmakkiModule],
  controllers: [CronJobsController],
  providers: [CronJobsService],
})
export class CronJobsModule {}
