import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CarDetailsService } from '../car-details/car-details.service';
import { CarService } from '../car/car.service';
import { CarToJazmakkiService } from 'src/car-to-jazmakki/car-to-jazmakki.service';
import { CarSpecService } from 'src/car-spec/car-spec.service';
import { RequestLoggerService } from 'src/request-logger/request-logger.service';

@Injectable()
export class CronJobsService {
  constructor(
    private readonly carService: CarService,
    private readonly carDetailsService: CarDetailsService,
    private readonly carToJazmakkiService: CarToJazmakkiService,
    private readonly carSpecService: CarSpecService,
    private readonly requestLoggerService: RequestLoggerService,
  ) {}

  @Cron('0 0 0 * * *')
  removeOldCars(): void {
    const OLDER_THAN_DAYS = 90;

    this.carService.removeOldCars(OLDER_THAN_DAYS);
    this.carDetailsService.removeOldCarDetails(OLDER_THAN_DAYS);
    this.carDetailsService.removeOldCarDetailsRequests(OLDER_THAN_DAYS);
    this.carDetailsService.removeOldEmitedCarDetails(OLDER_THAN_DAYS);
    this.carToJazmakkiService.removeOldCarToJazmakki(OLDER_THAN_DAYS);
    this.carSpecService.removeOldCarSpecs(OLDER_THAN_DAYS);
    this.requestLoggerService.removeOldRequestLogs(10);
  }

  // One per day at 10:00 get all cars from yestarday that doesnt have car details
  @Cron('0 0 10 * * *')
  getNewCars(): void {
    this.carService.findAllCarsWithoutCarDetails();
  }
}
