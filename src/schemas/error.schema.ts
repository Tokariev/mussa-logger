import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ErrorDocument = HydratedDocument<Error>;

@Schema()
export class Error {
  @Prop()
  id: number;
  @Prop()
  url: string;
  @Prop()
  service: string;
  @Prop()
  traceback: string;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ErrorSchema = SchemaFactory.createForClass(Error);
