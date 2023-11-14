import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CarDto } from '../dto/car-dto';
import { Car } from '../schemas/car.schema';
import { UpdatePriceType } from './types/update-price.type';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
  ) {}

  async create(car: CarDto) {
    const createdCar = new this.carModel(car);
    return createdCar.save();
  }
  async findAllByUrl(car: CarDto) {
    return this.carModel.find({ source: car.source }).sort({ createdAt: -1 });
  }

  async findLastByUrl(car: CarDto) {
    return this.carModel
      .findOne({ source: car.source })
      .sort({ createdAt: -1 });
  }

  async findOne(documentId: string) {
    return this.carModel.findById(documentId);
  }

  async updatePrice(price: UpdatePriceType) {
    const { documentId, newPrice } = price;

    const car = await this.carModel.findById(documentId);

    const currentPrice = {
      price: newPrice,
      timestamp: new Date().toISOString(),
    };

    car.price = newPrice;
    car.price_history.push(currentPrice);

    return car.save();
  }
}
