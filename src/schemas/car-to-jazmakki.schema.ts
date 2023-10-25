import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type CarToJazmakkiDocument = HydratedDocument<CarToJazmakki>;

@Schema()
export class CarToJazmakki {
  @Prop()
  id: number;
  @Prop()
  url: string;
  @Prop()
  title: string;
  @Prop()
  ad_status: string;
  @Prop()
  source: string;
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
  contact_name: string;
  
  @Prop()
  price: number;
  @Prop({ type: Object })
  price_rating_object: object;
  @Prop()
  has_value_added_tax: boolean;
  @Prop()
  is_negotiation_basis: boolean;
  @Prop()
  seller_type: string;
  @Prop()
  postal_code: string;
  @Prop()
  city: string;
  @Prop()
  photo_urls: string[];
  @Prop()
  has_full_service_history: string;
  @Prop()
  has_car_accident: boolean;
  @Prop()
  engine_power: string[];
  // @Prop()
  // published_at: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CarToJazmakkiSchema = SchemaFactory.createForClass(CarToJazmakki);
