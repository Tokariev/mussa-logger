import { Module } from '@nestjs/common';
import { PriceRatingService } from './price-rating.service';
import { PriceRatingController } from './price-rating.controller';

@Module({
  controllers: [PriceRatingController],
  providers: [PriceRatingService]
})
export class PriceRatingModule {}
