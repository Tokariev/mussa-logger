import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CarDto } from '../dto/car-dto';
import { UpdatePriceType } from './types/update-price.type';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../schemas/car.schema';
import { CarDetailsRequest } from 'src/schemas/car-details-request.schema';
import { CarDetails } from 'src/schemas/car-details.schema';
import { CarToJazmakki } from 'src/schemas/car-to-jazmakki.schema';
import { RequestLog } from 'src/schemas/request-log.schema';

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
    @InjectModel(RequestLog.name)
    private readonly requestLogModel: Model<RequestLog>,
  ) {}

  async count() {
    return this.carModel.countDocuments().exec();
  }

  async findLastRequestFromParser() {
    const filter = {
      route: '/parser',
    };
    return this.requestLogModel
      .findOne(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();
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

    // Step 1: Get all cars created yesterday (limited to a reasonable number to process)
    const cars = await this.carToJazmakkiModel
      .find({
        createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
      })
      .select('externalCarId')
      .lean()
      .exec();

    if (cars.length === 0) {
      return [];
    }

    // Step 2: Extract the external car IDs
    const externalCarIds = cars.map((car) => car.externalCarId);

    // Step 3: Find all car details that exist for these IDs
    const carDetails = await this.carDetailsModel
      .find({
        externalCarId: { $in: externalCarIds },
      })
      .select('externalCarId')
      .lean()
      .exec();

    // Step 4: Create a set of externalCarIds that have details for faster lookup
    const carIdsWithDetails = new Set(
      carDetails.map((detail) => detail.externalCarId),
    );

    // Step 5: Filter the original cars to find those without details
    const carsWithoutDetails = cars
      .filter((car) => !carIdsWithDetails.has(car.externalCarId))
      .slice(0, 20); // Apply the limit of 20

    return carsWithoutDetails;
  }

  async countCarsWithoutCarDetails(): Promise<number> {
    const carsWithoutCarDetails = await this.findAllCarsWithoutCarDetails();
    return carsWithoutCarDetails.length;
  }

  async findOneByExternalCarId(externalCarId: string) {
    // Return last car by externalCarId without mongodb fields
    return this.carModel
      .findOne({ externalCarId: externalCarId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
