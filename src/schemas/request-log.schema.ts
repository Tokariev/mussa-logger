import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestLogDocument = RequestLog & Document;

@Schema()
export class RequestLog {
  @Prop({ index: true })
  url: string;

  @Prop()
  route: string;

  @Prop({ type: Object })
  requestBody: object;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);
