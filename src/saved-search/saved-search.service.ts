import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavedSearchCar } from 'src/schemas/saved-search-car.schema';

@Injectable()
export class SavedSearchService {
  constructor(
    @InjectModel(SavedSearchCar.name)
    private savedSearchCarModel: Model<SavedSearchCar>,
  ) {}

  //   save car
  async saveCar(car: SavedSearchCar) {
    const createdCar = new this.savedSearchCarModel(car);
    return createdCar.save();
  }

  async findLastCar(externalCarId: string) {
    // Return last car by externalCarId without mongodb fields _id, __v
    // and createdAt
    // and updatedAt
    return this.savedSearchCarModel
      .findOne(
        { externalCarId },
        {
          _id: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      )
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
