import { Module } from '@nestjs/common';
import { CarToJazmakkiService } from './car-to-jazmakki.service';
import { CarToJazmakkiController } from './car-to-jazmakki.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from '../schemas/car.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CarToJazmakki', schema: CarSchema }]),
  ],

  controllers: [CarToJazmakkiController],
  providers: [CarToJazmakkiService],
  exports: [CarToJazmakkiService],
})
export class CarToJazmakkiModule {}
