import { Module } from '@nestjs/common';
import { CarSpecService } from './car-spec.service';
import { CarSpecController } from './car-spec.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSpecSchema } from 'src/schemas/car-spec.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Car', schema: CarSpecSchema },
      { name: 'CarSpec', schema: CarSpecSchema },
    ]),
  ],
  controllers: [CarSpecController],
  providers: [CarSpecService],
  exports: [CarSpecService],
})
export class CarSpecModule {}
