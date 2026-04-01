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

  @Prop({ default: Date.now, index: true })
  createdAt: Date;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);

// Compound index: covers find/findOne({ route }).sort({ createdAt: -1 }) without in-memory sort.
// The compound prefix {route} also serves route-only equality queries,
// so no separate single-field route index is needed.
RequestLogSchema.index({ route: 1, createdAt: -1 });
