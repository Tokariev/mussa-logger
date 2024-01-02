import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarDetailsService } from './car-details.service';
import { CarDetailsDto } from '../dto/car-details-dto';

@Controller('car-details')
export class CarDetailsController {
  constructor(private readonly carDetailsService: CarDetailsService) {}

  @Post('/create')
  async create(@Body() carDetails: CarDetailsDto) {
    return this.carDetailsService.create(carDetails);
  }

  @Post('/create-emited-car-details')
  async createEmitedCarDetails(@Body() carDetails: CarDetailsDto) {
    return this.carDetailsService.createEmitedCarDetails(carDetails);
  }

  // Get car details by id
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.carDetailsService.findById(id);
  }

  // Get emited car details by id
  @Get('/emited/:id')
  async findEmitedById(@Param('id') id: string) {
    return this.carDetailsService.findEmitedById(id);
  }
}
