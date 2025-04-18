import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarModule } from './car/car.module';
import { CarDetailsModule } from './car-details/car-details.module';
import { PriceRatingModule } from './price-rating/price-rating.module';
import { CarToJazmakkiModule } from './car-to-jazmakki/car-to-jazmakki.module';
import { ErrorModule } from './error/error.module';
import { TracebackModule } from './traceback/traceback.module';
import { CountModule } from './count/count.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { SocketModule } from './socket/socket.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLoggerModule } from './request-logger/request-logger.module';
import { DataflowModule } from './dataflow/dataflow.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017', {
      dbName: 'logs',
      auth: {
        username: 'root',
        password: 'example',
      },
    }),
    CarModule,
    CarDetailsModule,
    PriceRatingModule,
    CarToJazmakkiModule,
    ErrorModule,
    TracebackModule,
    CountModule,
    CronJobsModule,
    ScheduleModule.forRoot(),
    SocketModule,
    RequestLoggerModule,
    DataflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
