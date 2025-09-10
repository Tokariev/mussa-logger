import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';

export type CarSpecDocument = HydratedDocument<CarSpec>;

@Schema()
export class CarSpec {
  // Verknüpfung zum Haupt-Auto
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true, index: true })
  carUUID: Types.ObjectId;

  @Prop({ required: true, index: true })
  externalCarId: string;

  // Grunddaten (für schnelle Filterung)
  @Prop({ index: true })
  brand: string;

  @Prop({ index: true })
  model: string;

  @Prop({ index: true })
  price: number;

  @Prop({ index: true })
  year: number;

  // Technische Specs
  @Prop({ index: true })
  mileageInKm: number;

  @Prop({ index: true })
  powerInHp: number;

  @Prop({ index: true })
  transmissionType: string; // 'manual' | 'automatic' |

  @Prop({ index: true })
  allWheelDrive: boolean;

  @Prop({ index: true })
  hasNavigation: boolean;

  @Prop({ index: true })
  interiorMaterial: string; // Volleder, Teilleder, Allcantara

  @Prop({ index: true })
  bodyType: string;

  @Prop()
  extractorVersion: string;

  @Prop({ type: Object })
  extractionMeta: {
    source: string;
    fieldsMissing: string[];
  };

  @Prop({ type: Date, default: now })
  createdAt: Date;
}

export const CarSpecSchema = SchemaFactory.createForClass(CarSpec);
