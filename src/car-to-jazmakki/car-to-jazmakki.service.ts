import { CarDto } from '../dto/car-dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarToJazmakki } from '../schemas/car-to-jazmakki.schema';

@Injectable()
export class CarToJazmakkiService {
  constructor(
    @InjectModel(CarToJazmakki.name)
    private carToJazmakkiModel: Model<CarToJazmakki>,
  ) {}

  createCarToJazmakki(carToJazmakki: any) {
    const createCarToJazmakki = new this.carToJazmakkiModel(carToJazmakki);
    return createCarToJazmakki.save();
  }

  findByExternalCarId(externalCarId: string) {
    return this.carToJazmakkiModel.find({ externalCarId });
  }

  async removeOldCarToJazmakki(olderThanDays: number) {
    // Find all cars older then 60 days and remove them
    const date = new Date();
    date.setDate(date.getDate() - olderThanDays);
    return this.carToJazmakkiModel.deleteMany({ createdAt: { $lt: date } });
  }
}
