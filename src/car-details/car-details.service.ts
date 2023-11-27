import { CarDetailsDto } from '../dto/car-details-dto';
import { CarDetails } from '../schemas/car-details.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CarDetailsService {
  constructor(
    @InjectModel(CarDetails.name)
    private carDetailsModel: Model<CarDetails>,
  ) {}

  create(carDetails: CarDetailsDto) {
    const createCarDetails = new this.carDetailsModel(carDetails);
    return createCarDetails.save();
  }

  removeOldCarDetails() {
    const today = new Date();
    const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 60));
    return this.carDetailsModel.deleteMany({
      createdAt: { $lte: sixtyDaysAgo },
    });
  }
}
