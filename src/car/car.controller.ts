import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CarService } from './car.service';
import { CarDto } from '../dto/car-dto';
import { UpdatePriceType } from './types/update-price.type';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('/count')
  async count() {
    return this.carService.count();
  }

  @Get('/last')
  async findAll() {
    return this.carService.findLast();
  }

  @Post('/create')
  async create(@Body() car: CarDto) {
    return this.carService.create(car);
  }

  @Post('/create-car-details-request')
  async createCarDetailsRequest(@Body() car: CarDto) {
    return this.carService.createCarDetailsRequest(car);
  }

  @Get('car-details-request/:id')
  async findCarDetailsRequests(@Param('id') id: string) {
    return this.carService.findCarDetailsRequests(id);
  }

  @Post('/find-all-by-url')
  async findAllByUrl(@Body() car: CarDto) {
    return this.carService.findAllByUrl(car);
  }

  @Post('/find-last-by-url')
  async findLastByUrl(@Body() car: CarDto) {
    return this.carService.findLastByUrl(car);
  }

  @Post('/update-price')
  async updatePrice(@Body() newPrice: UpdatePriceType) {
    return this.carService.updatePrice(newPrice);
  }
}
