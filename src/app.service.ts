import { Injectable } from '@nestjs/common';
import { CarDto } from './dto/car-dto';
import { CarDetailsDto } from './dto/car-details-dto';
import { ErrorDto } from './dto/error-dto';
import { TracebackErrorDto } from './dto/traceback-error-dto';

import { Car } from './schemas/car.schema';
import { Error } from './schemas/error.schema';
import { CarDetails } from './schemas/car-details.schema';
import { TracebackError } from './schemas/traceback-error.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceRating } from './schemas/price-rating.schema';

@Injectable()
export class AppService {


  constructor(
    @InjectModel(Error.name)
    private errorModel: Model<Error>,
    @InjectModel(TracebackError.name)
    private tracebackErrorModel: Model<TracebackError>,
    @InjectModel(CarDetails.name)
    private carDetailsModel: Model<CarDetails>,
    @InjectModel(Car.name)
    private carModel: Model<Car>,
    @InjectModel(Car.name)
    private carToJazmakkiModel: Model<Car>,
    @InjectModel(PriceRating.name)
    private priceRatingModel: Model<PriceRating>,
  ) {}

  async logError(error: ErrorDto) {
    console.log('Log error');
    const createError = new this.errorModel(error);
    createError.save();
  }

  async logTracebackError(tracebackError: TracebackErrorDto) {
    console.log('Log traceback error');
    const createTracebackError = new this.tracebackErrorModel(tracebackError);
    createTracebackError.save();
  }

  async logCarDetails(carDetails: CarDetailsDto) : Promise<CarDetails> {
    console.log('Log car details');
    const createCarDetails = new this.carDetailsModel(carDetails);
    return createCarDetails.save();
  }

  async logCar(car: CarDto) : Promise<Car> {
    const createCar = new this.carModel(car);
    return createCar.save();
  }

  async logPriceRating(priceRating: PriceRating) : Promise<PriceRating> {
    const createPriceRating = new this.priceRatingModel(priceRating);
    return createPriceRating.save();
  }

  async logCarToJazmakki(car: CarDto) : Promise<Car> {
    const createCarToJazmakki = new this.carToJazmakkiModel(car);
    return createCarToJazmakki.save();
    
  }

  readDataByUrl(url: string) {
    return this.carModel.findOne({ url: url }).sort({ createdAt: -1 }).exec();
  }

  findAllCarsBySourceUrl(sourceUrl: string) {
    return this.carModel.find({ sourceUrl: sourceUrl }).sort({ createdAt: -1 }).exec();
  }

  readCountOfCars(): Promise<number> {
    return this.carModel.countDocuments().exec();
  }

  readCountOfCarsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.carModel
      .find({
        createdAt: {
          $gte: today,
        },
      })
      .countDocuments()
      .exec();
  }

  readCountOfErrors(): Promise<number> {
    return this.errorModel.countDocuments().exec();
  }

  readCountOfErrorsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.errorModel
      .find({
        createdAt: {
          $gte: today,
        },
      })
      .countDocuments()
      .exec();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
