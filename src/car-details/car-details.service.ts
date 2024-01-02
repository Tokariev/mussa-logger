import { CarDetailsDto } from '../dto/car-details-dto';
import { CarDetails } from '../schemas/car-details.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmitedCarDetails } from 'src/schemas/emited-car-details.schema';

@Injectable()
export class CarDetailsService {
  constructor(
    @InjectModel(CarDetails.name)
    private carDetailsModel: Model<CarDetails>,
    @InjectModel(EmitedCarDetails.name)
    private emitedCarDetailsModel: Model<EmitedCarDetails>,
  ) {}

  async create(carDetails: CarDetailsDto) {
    const createCarDetails = new this.carDetailsModel(carDetails);
    return createCarDetails.save();
  }

  async createEmitedCarDetails(carDetails: CarDetailsDto) {
    const emitedCarDetails = new this.emitedCarDetailsModel(carDetails);
    return emitedCarDetails.save();
  }

  async findById(id: string) {
    return this.carDetailsModel.find({ id: id });
  }

  async findEmitedById(id: string) {
    return this.emitedCarDetailsModel.find({ id: id });
  }

  removeOldCarDetails() {
    const today = new Date();
    const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 60));
    return this.carDetailsModel.deleteMany({
      createdAt: { $lte: sixtyDaysAgo },
    });
  }
}
