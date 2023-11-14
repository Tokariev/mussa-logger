import { Module } from '@nestjs/common';
import { PriceRatingService } from './price-rating.service';
import { PriceRatingController } from './price-rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceRatingSchema } from '../schemas/price-rating.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017', {
      dbName: 'logs',
      auth: {
        username: 'root',
        password: 'example',
      },
    }),
    MongooseModule.forFeature([
      { name: 'PriceRating', schema: PriceRatingSchema },
    ]),
  ],
  controllers: [PriceRatingController],
  providers: [PriceRatingService],
})
export class PriceRatingModule {}
