import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CarDto } from './dto/car-dto';
import { CarDetailsDto } from './dto/car-details-dto';
import { ErrorDto } from './dto/error-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/logCar')
  async logCar(@Body() car: CarDto) {
    this.appService.logCar(car);
  }

  @Post('/logCarDetails')
  async logCarDetails(@Body() carDetails: CarDetailsDto) {
    this.appService.logCarDetails(carDetails);
  }

  @Post('/logError')
  async logError(@Body() error: ErrorDto) {
    this.appService.logError(error);
  }

  // Counters
  @Get('/countOfCars')
  async readCountOfCars(): Promise<number> {
    return this.appService.readCountOfCars();
  }

  @Get('/countOfCarsToday')
  async readCountOfCarsToday(): Promise<number> {
    return this.appService.readCountOfCarsToday();
  }

  @Get('/countOfErrors')
  async readCountOfErrors(): Promise<number> {
    return this.appService.readCountOfErrors();
  }

  @Get('/countOfErrorsToday')
  async readCountOfErrorsToday(): Promise<number> {
    return this.appService.readCountOfErrorsToday();
  }
}
