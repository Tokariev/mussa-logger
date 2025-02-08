import { Controller, Post } from '@nestjs/common';
import { TracebackService } from './traceback.service';
import { TracebackErrorDto } from '../dto/traceback-error-dto';

@Controller('traceback')
export class TracebackController {
  constructor(private readonly tracebackService: TracebackService) {}

  @Post('/create')
  async createTraceback(traceback: TracebackErrorDto) {
    console.log('TracebackController.createTraceback ~ ~~ ~ ~', traceback);
    return this.tracebackService.createTraceback(traceback);
  }
}
