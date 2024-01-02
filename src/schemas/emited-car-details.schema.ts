import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CarDetails } from './car-details.schema';

export type EmitedCarDetailsDocument = HydratedDocument<EmitedCarDetails>;

@Schema()
export class EmitedCarDetails extends CarDetails {}

export const EmitedCarDetailsSchema =
  SchemaFactory.createForClass(EmitedCarDetails);
