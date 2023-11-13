import { Module } from '@nestjs/common';
import { CarDetailsService } from './car-details.service';
import { CarDetailsController } from './car-details.controller';

@Module({
  controllers: [CarDetailsController],
  providers: [CarDetailsService]
})
export class CarDetailsModule {}
