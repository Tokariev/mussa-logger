import { Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { ErrorController } from './error.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorSchema } from '../schemas/error.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Error', schema: ErrorSchema }]),
  ],
  controllers: [ErrorController],
  providers: [ErrorService],
})
export class ErrorModule {}
