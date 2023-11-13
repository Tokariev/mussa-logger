import { Injectable } from '@nestjs/common';
import { ErrorDto } from 'src/dto/error-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Error } from '../schemas/error.schema';

@Injectable()
export class ErrorService {
  constructor(
    @InjectModel(Error.name)
    private errorModel: Model<Error>,
  ) {}

  createError(error: ErrorDto) {
    const createError = new this.errorModel(error);
    return createError.save();
  }
}
