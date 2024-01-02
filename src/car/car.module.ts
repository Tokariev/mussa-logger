import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from '../schemas/car.schema';
import { CarDetailsRequestSchema } from 'src/schemas/car-details-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Car', schema: CarSchema },
      { name: 'CarDetailsRequest', schema: CarDetailsRequestSchema },
    ]),
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
