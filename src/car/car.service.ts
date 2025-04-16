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

  /**
   * Retrieves up to 20 cars created yesterday that do not have associated car details.
   *
   * This method performs the following steps:
   * 1. Calculates the start of yesterday and the start of today based on the current date.
   * 2. Queries the car collection for cars created within the defined period,
   *    selecting only the `externalCarId` and `createdAt` fields.
   * 3. For each retrieved car, checks if there's a corresponding car detail entry
   *    in the car details collection whose `createdAt` timestamp is within one minute
   *    (i.e., from the car's creation time to one minute after).
   * 4. Collects cars for which no matching car detail entry exists, stopping after 20 results.
   *
   * @returns {Promise<any[]>} A promise that resolves to an array of car objects lacking associated car details.
   */
  async findAllCarsWithoutCarDetails(): Promise<any[]> {
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

    // Schritt 1: Hole alle relevanten Autos
    const cars = await this.carToJazmakkiModel
      .find({
        createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
      })
      .select('externalCarId createdAt')
      .lean()
      .exec();

    if (cars.length === 0) {
      return [];
    }

    const results: any[] = [];

    for (const car of cars) {
      // const startTime = new Date(car.createdAt);
      // Start time is the createdAt of the car minus 10 seconds
      const startTime = new Date(car.createdAt);
      startTime.setSeconds(startTime.getSeconds() - 10);
      const endTime = new Date(startTime.getTime() + 60 * 1000); // +1 Minute

      const detailExists = await this.carDetailsModel.exists({
        externalCarId: car.externalCarId,
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
      });

      if (!detailExists) {
        results.push(car);
      }

      if (results.length >= 20) {
        break;
      }
    }

    return results;
  }

  async countCarsWithoutCarDetails(): Promise<number> {
    const carsWithoutCarDetails = await this.findAllCarsWithoutCarDetails();
    return carsWithoutCarDetails.length;
  }
}
