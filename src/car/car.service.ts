import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CarDto } from '../dto/car-dto';
import { UpdatePriceType } from './types/update-price.type';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../schemas/car.schema';
import { CarDetailsRequest } from 'src/schemas/car-details-request.schema';
import { CarDetails } from 'src/schemas/car-details.schema';
import { CarToJazmakki } from 'src/schemas/car-to-jazmakki.schema';

// The exec method executes the query asynchronously and returns a promise.
@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
    @InjectModel(CarDetails.name)
    private readonly carDetailsModel: Model<CarDetails>,
    @InjectModel(CarDetailsRequest.name)
    private readonly carDetailsRequestModel: Model<CarDetailsRequest>,
    @InjectModel(CarToJazmakki.name)
    private readonly carToJazmakkiModel: Model<CarToJazmakki>,
  ) {}

  async count() {
    return this.carModel.countDocuments().exec();
  }

  async findLast() {
    return this.carModel.findOne().sort({ createdAt: -1 }).lean().exec();
  }

  async create(car: CarDto) {
    const createdCar = new this.carModel(car);
    return createdCar.save();
  }

  async createCarDetailsRequest(car: CarDto) {
    const createdCarDetailsRequest = new this.carDetailsRequestModel(car);
    return createdCarDetailsRequest.save();
  }

  async findCarDetailsRequests(
    externalCarId: string,
  ): Promise<CarDetailsRequest[]> {
    return this.carDetailsRequestModel.find({ externalCarId }).lean().exec();
  }

  async findAllByUrl(car: CarDto) {
    return this.carModel.find({ source: car.source }).sort({ createdAt: -1 });
  }

  async findLastByUrl(car: CarDto) {
    return this.carModel
      .findOne({ source: car.source })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(documentId: string) {
    return this.carModel.findById(documentId).lean().exec();
  }

  async updatePrice(price: UpdatePriceType) {
    const { documentId, newPrice } = price;

    const car = await this.carModel.findById(documentId);

    const currentPrice = {
      price: newPrice,
      timestamp: new Date(),
    };

    car.price = newPrice;
    car.price_history.push(currentPrice);

    return car.save();
  }

  async removeOldCars() {
    const today = new Date();
    const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 60));
    return this.carModel
      .deleteMany({ createdAt: { $lte: sixtyDaysAgo } })
      .exec();
  }

  deleteCar(externalCarId: string) {
    console.log('LOGGER: Deleting car with external car id: ', externalCarId);
    this.carModel.deleteMany({ externalCarId }).exec();
  }

  async updatePriceById(data: CarDto) {
    const carWithUpdatedPrice = await this.carModel.create(data);
    await carWithUpdatedPrice.save();
  }

  async updateCarStatus(externalCarId: string, status: string) {
    console.log(`Updating car status with id: ${externalCarId} to ${status}`);
    this.carModel.updateMany({ externalCarId }, { ad_status: status }).exec();
  }

  async findAllCarsWithoutCarDetails() {
    const today = new Date();
    const yesterdayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    );
    const yesterdayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // Aggregate in carToJazmakkiModel to find all car IDs created yesterday that do not have corresponding entries in the CarDetails collection
    const carsWithoutDetails = await this.carToJazmakkiModel
      .aggregate([
        {
          $match: {
            createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
          },
        },
        {
          $lookup: {
            from: 'cardetails', // The name of the CarDetails collection
            localField: 'externalCarId',
            foreignField: 'externalCarId',
            as: 'carDetail',
          },
        },
        {
          $match: {
            carDetail: { $size: 0 }, // Filter out cars that have no matching carDetail
          },
        },
        {
          $project: {
            externalCarId: 1, // Only select the id field to minimize data transfer
          },
        },
        {
          $limit: 20, // Limit the result to 20 records
        },
      ])
      .exec();

    return carsWithoutDetails;
  }

  async countCarsWithoutCarDetails(): Promise<number> {
    const today = new Date();
    const yesterdayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    );
    const yesterdayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    // Aggregate in carToJazmakkiModel to count all car IDs created yesterday that do not have corresponding entries in the CarDetails collection
    const result = await this.carToJazmakkiModel
      .aggregate([
        {
          $match: {
            createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
          },
        },
        {
          $lookup: {
            from: 'cardetails', // The name of the CarDetails collection
            localField: 'externalCarId',
            foreignField: 'externalCarId',
            as: 'carDetail',
          },
        },
        {
          $match: {
            carDetail: { $size: 0 }, // Filter out cars that have no matching carDetail
          },
        },
        {
          $count: 'count', // Count the number of documents that match the criteria
        },
      ])
      .exec();

    // Return the count or 0 if no results were found
    return result.length > 0 ? result[0].count : 0;
  }
}
