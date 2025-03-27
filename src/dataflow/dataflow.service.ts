import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataflowDocument } from '../schemas/dataflow.schema';

@Injectable()
export class DataflowService {
  constructor(
    @InjectModel('Dataflow') // Use string-based injection for fully dynamic schemas
    private readonly dataflowModel: Model<DataflowDocument>,
  ) {}

  async createDataflow(dataflow: any) {
    return this.dataflowModel.create({ ...dataflow, createdAt: new Date() });
  }
}
