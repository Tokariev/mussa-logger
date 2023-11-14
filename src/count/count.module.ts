import { Module } from '@nestjs/common';
import { CountService } from './count.service';
import { CountController } from './count.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from '../schemas/car.schema';
import { ErrorSchema } from 'src/schemas/error.schema';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017', {
      dbName: 'logs',
      auth: {
        username: 'root',
        password: 'example',
      },
    }),
    MongooseModule.forFeature([
      { name: 'Car', schema: CarSchema },
      { name: 'Error', schema: ErrorSchema },
    ]),
  ],
  controllers: [CountController],
  providers: [CountService],
})
export class CountModule {}
