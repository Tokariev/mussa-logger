import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CarDetailsDocument = HydratedDocument<CarDetails>;

@Schema()
export class CarDetails {
  @Prop()
  id: number;
  @Prop()
  searchUrl: string;
  @Prop()
  sourceUrl: string;
  @Prop()
  model: string;
  @Prop()
  brand: string;
  @Prop()
  package: string;
  @Prop()
  bodyType: string;
  @Prop()
  seatsCount: string;
  @Prop()
  prices: object[];
  @Prop()
  numResultsTotal: number;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CarDetailsSchema = SchemaFactory.createForClass(CarDetails);
