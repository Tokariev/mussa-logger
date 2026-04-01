import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog, RequestLogDocument } from '../schemas/request-log.schema';
// import { CreateRequestLogDto } from '../dto/create-request-log-dto';
import { CreateRequestLogDto } from '@shared/types';
import { SearchRequestLogsDto } from 'src/dto/search-request-logs-dto';

@Injectable()
export class RequestLoggerService {
  constructor(
    @InjectModel(RequestLog.name) private logModel: Model<RequestLogDocument>,
  ) {}

  async create(createLogEntryDto: CreateRequestLogDto): Promise<RequestLog> {
    const createdLog = new this.logModel(createLogEntryDto);
    return createdLog.save();
  }

  async search(search: SearchRequestLogsDto) {
    let filter = {};

    if (search.url && search.route) {
      filter = { url: search.url, route: search.route };
    } else if (search.url) {
      filter = { url: search.url };
    } else if (search.route) {
      filter = { route: search.route };
    }

    return this.logModel
      .find(filter, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  removeOldRequestLogs(olderThanDays: number) {
    const olderThanDate = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );
    return this.logModel
      .deleteMany({
        createdAt: { $lte: olderThanDate },
      })
      .exec();
  }
}
