import { Injectable } from '@nestjs/common';
import { TracebackErrorDto } from '../dto/traceback-error-dto';
import { Model } from 'mongoose';
import { TracebackError } from '../schemas/traceback-error.schema';

@Injectable()
export class TracebackService {
  constructor(private tracebackErrorModel: Model<TracebackError>) {}
  createTraceback(traceback: TracebackErrorDto) {
    const createTraceback = new this.tracebackErrorModel(traceback);
    return createTraceback.save();
  }
}
