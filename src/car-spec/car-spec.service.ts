import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from '../schemas/car.schema';
import { CarSpec, CarSpecDocument } from '../schemas/car-spec.schema';
import { Model } from 'mongoose';
import {
  CarSpecSearchResponseDto,
  CreateCarSpecDto,
  RangeFilterDto,
  SearchCriteriaDto,
} from '@shared/types';

@Injectable()
export class CarSpecService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(CarSpec.name) private carSpecsModel: Model<CarSpecDocument>,
  ) {}

  async createCarSpec(
    createCarSpecDto: CreateCarSpecDto,
  ): Promise<CarSpecDocument> {
    const car = await this.carModel.findById(createCarSpecDto.carUUID).exec();
    if (!car) {
      throw new Error(`Car with ID ${createCarSpecDto.carUUID} not found`);
    }

    const existingSpecs = await this.carSpecsModel
      .findOne({ carUUID: createCarSpecDto.carUUID })
      .exec();
    if (existingSpecs) {
      console.log(
        `✅ CarSpecs for ${existingSpecs.brand} ${existingSpecs.model} already exist for car ${existingSpecs.carUUID}`,
      );
      return existingSpecs;
    }

    const carSpecs: CarSpecDocument = new this.carSpecsModel(createCarSpecDto);

    const savedSpecs = await carSpecs.save();
    console.log(
      `✅ CarSpecs for ${createCarSpecDto.brand}  ${createCarSpecDto.model}created successfully for car ${createCarSpecDto.carUUID}`,
    );

    return savedSpecs;
  }

  async findCarSpecByExternalCarId(
    externalCarId: string,
  ): Promise<CarSpecDocument | null> {
    console.log(`🔍 Searching CarSpecs for externl ID ${externalCarId}`);

    const response = await this.carSpecsModel
      .findOne({ externalCarId })
      .lean()
      .sort({ createdAt: -1 })
      .exec();
    return response;
  }

  private buildEnumMatch(value?: string | string[]) {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) {
      return value.length ? { $in: value } : undefined;
    }
    return value;
  }

  async findCarsBySpecifications(
    carSpecRangeDto: SearchCriteriaDto,
  ): Promise<any> {
    try {
      // Build the MongoDB aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: Match CarSpecs based on filters
      const matchStage: any = {};

      if (carSpecRangeDto.brand) {
        matchStage.brand = {
          $regex: carSpecRangeDto.brand,
          $options: 'i', // case-insensitive
        };
      }

      if (carSpecRangeDto.model) {
        matchStage.model = {
          $regex: carSpecRangeDto.model,
          $options: 'i',
        };
      }

      // Enum(s) – support single or multiple values
      const bodyTypeMatch = this.buildEnumMatch(carSpecRangeDto.bodyType);
      if (bodyTypeMatch !== undefined) matchStage.bodyType = bodyTypeMatch;

      const interiorMaterialMatch = this.buildEnumMatch(
        carSpecRangeDto.interiorMaterial,
      );
      if (interiorMaterialMatch !== undefined)
        matchStage.interiorMaterial = interiorMaterialMatch;

      const transmissionTypeMatch = this.buildEnumMatch(
        carSpecRangeDto.transmissionType,
      );
      if (transmissionTypeMatch !== undefined)
        matchStage.transmissionType = transmissionTypeMatch;

      // Apply boolean filters
      if (carSpecRangeDto.hasNavigation !== undefined) {
        matchStage.hasNavigation = carSpecRangeDto.hasNavigation;
      }

      // Apply range filters
      this.applyRangeFilter(matchStage, 'price', carSpecRangeDto.priceRange);
      this.applyRangeFilter(matchStage, 'year', carSpecRangeDto.yearRange);
      this.applyRangeFilter(
        matchStage,
        'mileageInKm',
        carSpecRangeDto.mileageInKmRange,
      );
      this.applyRangeFilter(
        matchStage,
        'powerInHp',
        carSpecRangeDto.powerInHpRange,
      );

      // Add match stage if we have filters
      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      console.log('Aggregation Pipeline:', JSON.stringify(pipeline, null, 2));

      // Create query to find all cars matching the criteria
      const query = this.carSpecsModel.aggregate(pipeline);

      // Execute the query to get all matching cars
      const allMatchingCars = await query.limit(100).exec(); // Limit to 100 for performance

      console.log(`Found ${allMatchingCars.length} cars matching the criteria`);

      // Find car by carUUIDs
      const carUUIDs = allMatchingCars.map((spec) => spec.carUUID);

      const cars = await this.carModel
        .find({ _id: { $in: carUUIDs } })
        .select('-_id -__v') // remove _id and __v
        .lean()
        .exec();

      return {
        total: cars.length,
        cars,
      };
    } catch (error) {}
  }

  private applyRangeFilter(
    matchStage: any,
    fieldName: string,
    rangeFilter?: RangeFilterDto,
  ): void {
    if (!rangeFilter) return;

    const conditions: any = {};
    // Handle explicit min/max range
    if (rangeFilter.min !== undefined || rangeFilter.max !== undefined) {
      if (rangeFilter.min !== undefined) {
        conditions.$gte = rangeFilter.min;
      }
      if (rangeFilter.max !== undefined) {
        conditions.$lte = rangeFilter.max;
      }
    }
    // Handle exact value only
    else if (rangeFilter.exact !== undefined) {
      conditions.$eq = rangeFilter.exact;
    }

    // Apply the conditions if any were set
    if (Object.keys(conditions).length > 0) {
      matchStage[fieldName] = conditions;
    }
  }

  removeOldCarSpecs(olderThanDays: number) {
    const today = new Date();
    const olderThanDate = new Date(
      today.setDate(today.getDate() - olderThanDays),
    );
    return this.carSpecsModel.deleteMany({
      createdAt: { $lte: olderThanDate },
    });
  }
}
