import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CarDetailsService } from '../car-details/car-details.service';
import { CarService } from '../car/car.service';

@Injectable()
export class CronJobsService {
  constructor(
    private readonly carService: CarService,
    private readonly carDetailsService: CarDetailsService,
  ) {}

  // One per day at 00:00 remove all cars older then 60 days
  @Cron('0 0 0 * * *')
  removeOldCars(): void {
    this.carService.removeOldCars();
    this.carDetailsService.removeOldCarDetails();
  }

  // One per day at 10:00 get all cars from yestarday that doesnt have car details
  @Cron('0 0 10 * * *')
  getNewCars(): void {
    this.carService.findAllCarsWithoutCarDetails();
  }
}
