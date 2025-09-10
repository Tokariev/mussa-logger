import { CarDetailsDto } from '../dto/car-details-dto';
import { CarDetails } from '../schemas/car-details.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarDetailsRequest } from 'src/schemas/car-details-request.schema';
import { EmitedCarDetails } from 'src/schemas/emited-car-details.schema';

@Injectable()
export class CarDetailsService {
  constructor(
    @InjectModel(CarDetails.name)
    private carDetailsModel: Model<CarDetails>,
    @InjectModel(CarDetailsRequest.name)
    private readonly carDetailsRequestModel: Model<CarDetailsRequest>,
    @InjectModel(EmitedCarDetails.name)
    private emitedCarDetailsModel: Model<EmitedCarDetails>,
  ) {}

  async findByObservableDataHash(hash: string) {
    return this.emitedCarDetailsModel.findOne(
      { observableDataHash: hash },
      { _id: 0, __v: 0 }, // This projection excludes _id and __v fields
    );
  }

  async create(carDetails: CarDetailsDto) {
    const createCarDetails = new this.carDetailsModel(carDetails);
    return createCarDetails.save();
  }

  async createEmitedCarDetails(carDetails: CarDetailsDto) {
    const emitedCarDetails = new this.emitedCarDetailsModel(carDetails);
    return emitedCarDetails.save();
  }

  async findByExternalCarId(externalCarId: string) {
    return this.carDetailsModel.find({ externalCarId });
  }

  async findEmitedByExternalCarId(externalCarId: string) {
    return this.emitedCarDetailsModel.find({ externalCarId });
  }

  removeOldCarDetails(olderThanDays: number) {
    const today = new Date();
    const olderThanDate = new Date(
      today.setDate(today.getDate() - olderThanDays),
    );
    return this.carDetailsModel.deleteMany({
      createdAt: { $lte: olderThanDate },
    });
  }

  removeOldCarDetailsRequests(olderThanDays: number) {
    const today = new Date();
    const olderThanDate = new Date(
      today.setDate(today.getDate() - olderThanDays),
    );
    return this.carDetailsRequestModel.deleteMany({
      createdAt: { $lte: olderThanDate },
    });
  }

  removeOldEmitedCarDetails(olderThanDays: number) {
    const today = new Date();
    const olderThanDate = new Date(
      today.setDate(today.getDate() - olderThanDays),
    );
    return this.emitedCarDetailsModel.deleteMany({
      createdAt: { $lte: olderThanDate },
    });
  }
}
