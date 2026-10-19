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
    // Newest first: a failed price lookup is saved too, so the latest one must win.
    return this.emitedCarDetailsModel
      .findOne({ observableDataHash: hash }, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
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
    return this.carDetailsModel.find({ externalCarId }).lean().exec();
  }

  async findEmitedByExternalCarId(externalCarId: string) {
    return this.emitedCarDetailsModel.find({ externalCarId }).lean().exec();
  }

  async findLatestEmitedWithPrices(externalCarId: string) {
    // A failed price lookup is saved with empty prices, so it must not count.
    return this.emitedCarDetailsModel
      .findOne(
        { externalCarId, 'prices.0': { $exists: true } },
        { _id: 0, __v: 0 },
      )
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  removeOldCarDetails(olderThanDays: number) {
    const olderThanDate = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );
    return this.carDetailsModel
      .deleteMany({
        createdAt: { $lte: olderThanDate },
      })
      .exec();
  }

  removeOldCarDetailsRequests(olderThanDays: number) {
    const olderThanDate = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );
    return this.carDetailsRequestModel.deleteMany({
      createdAt: { $lte: olderThanDate },
    });
  }

  removeOldEmitedCarDetails(olderThanDays: number) {
    const olderThanDate = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );
    return this.emitedCarDetailsModel.deleteMany({
      createdAt: { $lte: olderThanDate },
    });
  }
}
