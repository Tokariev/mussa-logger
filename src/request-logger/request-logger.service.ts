import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog, RequestLogDocument } from '../schemas/request-log.schema';
import { CreateRequestLogDto } from '../dto/create-log-dto';

@Injectable()
export class RequestLoggerService {
  constructor(
    @InjectModel(RequestLog.name) private logModel: Model<RequestLogDocument>,
  ) {}

  async create(createLogEntryDto: CreateRequestLogDto): Promise<RequestLog> {
    const createdLog = new this.logModel(createLogEntryDto);
    return createdLog.save();
  }
}
