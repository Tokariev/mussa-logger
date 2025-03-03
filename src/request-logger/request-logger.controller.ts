import { Body, Controller, Post } from '@nestjs/common';
import { RequestLoggerService } from './request-logger.service';
import { CreateRequestLogDto } from '../dto/create-log-dto';

@Controller('request-logger')
export class RequestLoggerController {
  constructor(private readonly loggerService: RequestLoggerService) {}

  @Post()
  async create(@Body() createRequestLogDto: CreateRequestLogDto) {
    return this.loggerService.create(createRequestLogDto);
  }
}
