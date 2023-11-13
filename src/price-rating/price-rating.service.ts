import { Injectable } from '@nestjs/common';
import { PriceRatingDto } from '../dto/price-rating.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceRating } from '../schemas/price-rating.schema';

@Injectable()
export class PriceRatingService {
  constructor(
    @InjectModel(PriceRating.name)
    private priceRatingModel: Model<PriceRating>,
  ) {}

  create(priceRating: PriceRatingDto) {
    const createPriceRating = new this.priceRatingModel(priceRating);
    return createPriceRating.save();
  }
}
