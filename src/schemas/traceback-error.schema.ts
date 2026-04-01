import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TracebackErrorDocument = HydratedDocument<TracebackError>;

@Schema()
export class TracebackError {
  @Prop({ index: true })
  externalCarId: string;
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

// Compound index: covers countDocuments({ service: 'mobile', createdAt: { $gte, $lt } })
// which runs on every call to getCountOfFailedParseRequests().
TracebackErrorSchema.index({ service: 1, createdAt: 1 });
