import { Module } from '@nestjs/common';
import { CarToJazmakkiService } from './car-to-jazmakki.service';
import { CarToJazmakkiController } from './car-to-jazmakki.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from '../schemas/car.schema';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017', {
      dbName: 'logs',
      auth: {
        username: 'root',
        password: 'example',
      },
    }),
    MongooseModule.forFeature([{ name: 'CarToJazmakki', schema: CarSchema }]),
  ],

  controllers: [CarToJazmakkiController],
  providers: [CarToJazmakkiService],
})
export class CarToJazmakkiModule {}
