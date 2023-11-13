import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { Car } from './car.schema';

// Create the same schema for the car-to-jazmakki collection as for the car collection

@Schema()
export class CarToJazmakki extends Car {}

export const CarToJazmakkiSchema = SchemaFactory.createForClass(CarToJazmakki);

