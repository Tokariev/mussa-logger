import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Car } from './car.schema';

export type CarDetailsRequestDocument = HydratedDocument<CarDetailsRequest>;

@Schema()
export class CarDetailsRequest extends Car {}

export const CarDetailsRequestSchema =
  SchemaFactory.createForClass(CarDetailsRequest);
