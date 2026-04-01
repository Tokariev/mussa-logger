import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from '../schemas/car.schema';
import { Error } from '../schemas/error.schema';

@Injectable()
export class CountService {
  constructor(
    @InjectModel(Car.name)
    private carModel: Model<Car>,
    @InjectModel(Error.name)
    private errorModel: Model<Error>,
  ) {}

  async readCountOfCars(): Promise<number> {
    return this.carModel.countDocuments().exec();
  }

  async readCountOfCarsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.carModel.countDocuments({ createdAt: { $gte: today } }).exec();
  }

  async readCountOfErrors(): Promise<number> {
    return this.errorModel.countDocuments().exec();
  }

  async readCountOfErrorsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.errorModel.countDocuments({ createdAt: { $gte: today } }).exec();
  }
}
