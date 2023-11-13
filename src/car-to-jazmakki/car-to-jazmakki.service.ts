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

  createCarToJazmakki(carToJazmakki: CarDto) {
    const createCarToJazmakki = new this.carToJazmakkiModel(carToJazmakki);
    return createCarToJazmakki.save();
  }
}
