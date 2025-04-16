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
  @Get('/:externalCarId')
  async findById(@Param('externalCarId') externalCarId: string) {
    return this.carDetailsService.findByExternalCarId(externalCarId);
  }

  // Get emited car details by id
  @Get('/emited/:externalCarId')
  async findEmitedById(@Param('externalCarId') externalCarId: string) {
    return this.carDetailsService.findEmitedByExternalCarId(externalCarId);
  }

  // Find car by observable data hash
  @Get('/observable-data-hash/:hash')
  async findByObservableDataHash(@Param('hash') hash: string) {
    return this.carDetailsService.findByObservableDataHash(hash);
  }
}
