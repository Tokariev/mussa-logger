import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestLogDocument = RequestLog & Document;

@Schema({ timestamps: true })
export class RequestLog {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  requestBody?: any;

  @Prop()
  responseStatus?: number;

  @Prop()
  responseBody?: any;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);
