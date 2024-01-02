import { Module } from '@nestjs/common';
import { CarDetailsService } from './car-details.service';
import { CarDetailsController } from './car-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarDetailsSchema } from '../schemas/car-details.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CarDetails', schema: CarDetailsSchema },
      { name: 'EmitedCarDetails', schema: CarDetailsSchema },
    ]),
  ],
  controllers: [CarDetailsController],
  providers: [CarDetailsService],
  exports: [CarDetailsService],
})
export class CarDetailsModule {}
