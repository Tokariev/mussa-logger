import { Body, Controller, Get, Post } from '@nestjs/common';
import { CountService } from './count.service';

@Controller('count')
export class CountController {
  constructor(private readonly countService: CountService) {}

  @Get('/cars')
  async readCountOfCars(): Promise<number> {
    return this.countService.readCountOfCars();
  }

  @Get('/cars-today')
  async readCountOfCarsToday(): Promise<number> {
    return this.countService.readCountOfCarsToday();
  }

  @Get('/errors')
  async readCountOfErrors(): Promise<number> {
    return this.countService.readCountOfErrors();
  }

  @Get('/errors-today')
  async readCountOfErrorsToday(): Promise<number> {
    return this.countService.readCountOfErrorsToday();
  }
}
