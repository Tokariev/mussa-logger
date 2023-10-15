import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CarDto } from './dto/car-dto';
import { CarDetailsDto } from './dto/car-details-dto';
import { ErrorDto } from './dto/error-dto';
import { TracebackErrorDto } from './dto/traceback-error-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/log-car')
  async logCar(@Body() car: CarDto) {
    this.appService.logCar(car);
  }

  @Post('/log-car-details')
  async logCarDetails(@Body() carDetails: CarDetailsDto) {
    this.appService.logCarDetails(carDetails);
  }

  @Post('/car-by-url')
  async readDataByUrl(@Body()  car: CarDto) {
    return this.appService.readDataByUrl(car.url);
  }
 
  @Post('/log-error')
  async logError(@Body() error: ErrorDto) {
    this.appService.logError(error);
  }

  @Post('/log-traceback-error')
  async logTracebackError(@Body() tracebackError: TracebackErrorDto) {
    this.appService.logTracebackError(tracebackError);
  }

  // Counters
  @Get('/count-of-cars')
  async readCountOfCars(): Promise<number> {
    return this.appService.readCountOfCars();
  }

  @Get('/count-of-cars-today')
  async readCountOfCarsToday(): Promise<number> {
    return this.appService.readCountOfCarsToday();
  }

  @Get('/count-of-errors')
  async readCountOfErrors(): Promise<number> {
    return this.appService.readCountOfErrors();
  }

  @Get('/count-of-errors-today')
  async readCountOfErrorsToday(): Promise<number> {
    return this.appService.readCountOfErrorsToday();
  }
}
