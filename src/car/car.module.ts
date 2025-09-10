import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from '../schemas/car.schema';
import { CarDetailsRequestSchema } from 'src/schemas/car-details-request.schema';
import { CarDetailsSchema } from 'src/schemas/car-details.schema';
import { CarToJazmakkiSchema } from 'src/schemas/car-to-jazmakki.schema';
import { RequestLogSchema } from 'src/schemas/request-log.schema';
import { CarSpecModule } from 'src/car-spec/car-spec.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Car', schema: CarSchema },
      { name: 'CarDetails', schema: CarDetailsSchema },
      { name: 'CarDetailsRequest', schema: CarDetailsRequestSchema },
      { name: 'CarToJazmakki', schema: CarToJazmakkiSchema },
      { name: 'RequestLog', schema: RequestLogSchema },
    ]),
    CarSpecModule,
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
