import { Controller, Post } from '@nestjs/common';
import { PriceRatingService } from './price-rating.service';
import { PriceRatingDto } from 'src/dto/price-rating.dto';

@Controller('price-rating')
export class PriceRatingController {
  constructor(private readonly priceRatingService: PriceRatingService) {}

  @Post('/create')
  async create(priceRating: PriceRatingDto) {
    return this.priceRatingService.create(priceRating);
  }
}
