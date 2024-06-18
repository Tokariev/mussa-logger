import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CarDto } from '../dto/car-dto';
import { UpdatePriceType } from './types/update-price.type';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../schemas/car.schema';
import { CarDetailsRequest } from 'src/schemas/car-details-request.schema';

// The exec method executes the query asynchronously and returns a promise.
@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
    @InjectModel(CarDetailsRequest.name)
    private readonly carDetailsRequestModel: Model<CarDetailsRequest>,
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

  async findCarDetailsRequests(id: string): Promise<CarDetailsRequest[]> {
    return this.carDetailsRequestModel.find({ id: id }).lean().exec();
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

  deleteCar(id: number) {
    console.log('LOGGER: Deleting car with id: ', id);
    this.carModel.deleteMany({ id: id }).exec();
  }

  async updatePriceById(id: number, newPrice: number) {
    const filter = { id: id };

    const carToUpdate = await this.carModel.findOne(filter);

    if (!carToUpdate) {
      return;
    }

    console.log(`Updating car with id: ${id} to ${newPrice}`);

    if (carToUpdate.price_history.length === 0) {
      const prevPrice = {
        price: carToUpdate.price,
        timestamp: carToUpdate.createdAt,
      };
      carToUpdate.price_history.push(prevPrice);

      const currentPrice = {
        price: newPrice,
        timestamp: new Date(),
      };
      carToUpdate.price_history.unshift(currentPrice);
    }

    const currentPrice = {
      price: newPrice,
      timestamp: new Date(),
    };
    carToUpdate.price_history.unshift(currentPrice);
    carToUpdate.price = newPrice;

    await carToUpdate.save();
  }

  async updateCarStatus(id: number, status: string) {
    console.log(`Updating car status with id: ${id} to ${status}`);
    this.carModel.updateMany({ id: id }, { ad_status: status }).exec();
  }
}
