import { Injectable } from '@nestjs/common';
import { TracebackErrorDto } from '../dto/traceback-error-dto';
import { Model } from 'mongoose';
import { TracebackError } from '../schemas/traceback-error.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TracebackService {
  constructor(
    @InjectModel(TracebackError.name)
    private tracebackErrorModel: Model<TracebackError>,
  ) {}
  createTraceback(traceback: TracebackErrorDto) {
    const createTraceback = new this.tracebackErrorModel(traceback);
    return createTraceback.save();
  }
}
