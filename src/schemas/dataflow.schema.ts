import { Schema, HydratedDocument } from 'mongoose';

export type DataflowDocument = HydratedDocument<any>;

export const DataflowSchema = new Schema({}, { strict: false });
