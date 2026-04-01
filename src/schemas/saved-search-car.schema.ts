import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Car } from './car.schema';

export type SavedSearchCarDocument = HydratedDocument<SavedSearchCar>;

@Schema()
export class SavedSearchCar extends Car {
  @Prop({ type: String })
  user: string;

  @Prop({ type: String })
  savedSearchUrl: string;
}

export const SavedSearchCarSchema =
  SchemaFactory.createForClass(SavedSearchCar);

// Compound index: covers findOne({ externalCarId }).sort({ createdAt: -1 }) without in-memory sort.
SavedSearchCarSchema.index({ externalCarId: 1, createdAt: -1 });
