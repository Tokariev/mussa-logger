import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarService } from './car.service';
import { CarDto } from '../dto/car-dto';
import { UpdatePriceType } from './types/update-price.type';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

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

  @Get(':documentId')
  async findOne(@Param('documentId') documentId: string) {
    return this.carService.findOne(documentId);
  }

  // Update price
  @Post('/update-price')
  async updatePrice(@Body() newPrice: UpdatePriceType) {
    return this.carService.updatePrice(newPrice);
  }
}
