import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PriceRatingDocument = HydratedDocument<PriceRating>;

@Schema()
export class PriceRating {
  @Prop({ index: true })
  externalCarId: string;
  @Prop({ type: Object })
  price_rating: object;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PriceRatingSchema = SchemaFactory.createForClass(PriceRating);
