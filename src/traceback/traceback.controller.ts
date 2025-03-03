import { Body, Controller, Get, Post } from '@nestjs/common';
import { TracebackService } from './traceback.service';
import { TracebackErrorDto } from '../dto/traceback-error-dto';

@Controller('traceback')
export class TracebackController {
  constructor(private readonly tracebackService: TracebackService) {}

  @Post('/create')
  async createTraceback(@Body() traceback: TracebackErrorDto) {
    return this.tracebackService.createTraceback(traceback);
  }

  @Get('/failed-parse-requests')
  async failedParseRequests() {
    return await this.tracebackService.getCountOfFailedParseRequests();
  }
}
