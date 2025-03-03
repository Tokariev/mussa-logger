import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLoggerController } from './request-logger.controller';
import { RequestLoggerService } from './request-logger.service';
import { RequestLog, RequestLogSchema } from '../schemas/request-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestLog.name, schema: RequestLogSchema },
    ]),
  ],
  controllers: [RequestLoggerController],
  providers: [RequestLoggerService],
})
export class RequestLoggerModule {}
