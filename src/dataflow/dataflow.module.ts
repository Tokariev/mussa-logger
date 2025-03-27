import { Module } from '@nestjs/common';
import { DataflowService } from './dataflow.service';
import { DataflowController } from './dataflow.controller';
import { DataflowSchema } from 'src/schemas/dataflow.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dataflow', schema: DataflowSchema }]),
  ],

  controllers: [DataflowController],
  providers: [DataflowService],
})
export class DataflowModule {}
