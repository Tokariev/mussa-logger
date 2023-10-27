import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema } from './schemas/car.schema';
import { CarDetailsSchema } from './schemas/car-details.schema';
import { ErrorSchema } from './schemas/error.schema';
import { TracebackErrorSchema } from './schemas/traceback-error.schema';
import { PriceRatingSchema } from './schemas/price-rating.schema';

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
      { name: 'Car', schema: CarSchema },
      {name : 'CarToJazmakki', schema: CarSchema },
      { name: 'CarDetails', schema: CarDetailsSchema },
      { name: 'PriceRating', schema: PriceRatingSchema },
      { name: 'Error', schema: ErrorSchema },
      { name: 'TracebackError', schema: TracebackErrorSchema },

    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
