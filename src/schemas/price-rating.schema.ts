import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PriceRatingDocument = HydratedDocument<PriceRating>;

@Schema()
export class PriceRating {
  @Prop()
  id: number;
  @Prop({ type: Object })
  price_rating_object: object;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PriceRatingSchema = SchemaFactory.createForClass(PriceRating);
