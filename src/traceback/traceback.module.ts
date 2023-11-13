import { Module } from '@nestjs/common';
import { TracebackService } from './traceback.service';
import { TracebackController } from './traceback.controller';

@Module({
  controllers: [TracebackController],
  providers: [TracebackService]
})
export class TracebackModule {}
