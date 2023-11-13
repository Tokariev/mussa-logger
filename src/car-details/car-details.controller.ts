import { Controller, Post } from '@nestjs/common';
import { CarDetailsService } from './car-details.service';
import { CarDetailsDto } from '../dto/car-details-dto';

@Controller('car-details')
export class CarDetailsController {
  constructor(private readonly carDetailsService: CarDetailsService) {}

  @Post('/create')
  async create(carDetails: CarDetailsDto) {
    return this.carDetailsService.create(carDetails);
  }
}
