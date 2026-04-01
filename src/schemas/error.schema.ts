import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ErrorDocument = HydratedDocument<Error>;

@Schema()
export class Error {
  @Prop()
  url: string;
  @Prop({ default: Date.now, index: true })
  createdAt: Date;
}

export const ErrorSchema = SchemaFactory.createForClass(Error);
