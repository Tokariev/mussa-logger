import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { Car } from './car.schema';

// Create the same schema for the car-to-jazmakki collection as for the car collection

@Schema()
export class CarToJazmakki extends Car {
  @Prop({ type: String })
  observableDataHash: string;

  @Prop({ type: Object })
  jazmakkiResponse: any;
}

export const CarToJazmakkiSchema = SchemaFactory.createForClass(CarToJazmakki);

// Covered query index: find({ createdAt: { $gte, $lt } }).select('externalCarId')
// With both fields in the index, MongoDB can satisfy the query entirely from the index
// without loading full documents from the collection.
CarToJazmakkiSchema.index({ createdAt: 1, externalCarId: 1 });
