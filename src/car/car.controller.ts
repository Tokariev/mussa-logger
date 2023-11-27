import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarService } from './car.service';
import { CarDto } from '../dto/car-dto';
import { UpdatePriceType } from './types/update-price.type';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('count')
  async count() {
    return this.carService.count();
  }

  @Get('/data-in-batches/:skip/:limit')
  async findAllInBatches(
    @Param('skip') skip: number,
    @Param('limit') limit: number,
  ) {
    return this.carService.findAllInBatches(skip, limit);
  }

  @Post('/create')
  async create(@Body() car: CarDto) {
    return this.carService.create(car);
  }

  @Post('/find-all-by-url')
  async findAllByUrl(@Body() car: CarDto) {
    return this.carService.findAllByUrl(car);
  }

  @Post('/find-last-by-url')
  async findLastByUrl(@Body() car: CarDto) {
    return this.carService.findLastByUrl(car);
  }

  // Update price
  @Post('/update-price')
  async updatePrice(@Body() newPrice: UpdatePriceType) {
    return this.carService.updatePrice(newPrice);
  }
}
