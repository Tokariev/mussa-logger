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
    const olderThanDate = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );

    return this.carToJazmakkiModel
      .deleteMany({
        createdAt: { $lte: olderThanDate },
      })
      .exec();
  }
}
