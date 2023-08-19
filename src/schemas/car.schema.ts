import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type CarDocument = HydratedDocument<Car>;

@Schema()
export class Car {
  @Prop()
  id: number;
  @Prop()
  url: string;
  @Prop()
  source: string;
  @Prop()
  title: string;
  @Prop()
  brand: string;
  @Prop()
  model: string;
  @Prop()
  year: string;
  @Prop()
  body_type: string;
  @Prop()
  fuel_type: string;
  @Prop()
  model_variant: string;
  @Prop()
  description: string;
  @Prop()
  technical_data: object[];
  @Prop()
  seller_phone: string[];
  @Prop()
  equipment: string[];
  @Prop()
  price: number;
  @Prop()
  price_rating: string;
  @Prop()
  price_history: object[];
  @Prop()
  has_value_added_tax: boolean;
  @Prop()
  is_negotiating_basis: boolean;
  @Prop()
  seller_type: string;
  @Prop()
  postal_code: string;
  @Prop()
  city: string;
  @Prop()
  photo_urls: string[];
  @Prop()
  air_conditioning: string;
  @Prop()
  has_full_service_history: boolean;
  @Prop()
  has_car_accident: boolean;
  @Prop()
  engine_power: string[];
  @Prop()
  published_at: string;
  // ------------------------
  @Prop({ required: true, default: now() })
  parsedAt: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);
