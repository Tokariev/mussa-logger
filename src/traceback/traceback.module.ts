import { Module } from '@nestjs/common';
import { TracebackService } from './traceback.service';
import { TracebackController } from './traceback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TracebackErrorSchema } from '../schemas/traceback-error.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TracebackError', schema: TracebackErrorSchema },
    ]),
  ],
  controllers: [TracebackController],
  providers: [TracebackService],
})
export class TracebackModule {}
