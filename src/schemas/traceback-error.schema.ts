import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TracebackErrorDocument = HydratedDocument<TracebackError>;

@Schema()
export class TracebackError {
  @Prop()
  id: number;
  @Prop()
  url: string;
  @Prop()
  service: string;
  @Prop()
  error: string;
  @Prop()
  traceback: string;
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TracebackErrorSchema =
  SchemaFactory.createForClass(TracebackError);
