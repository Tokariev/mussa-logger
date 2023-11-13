import { Controller, Post } from '@nestjs/common';
import { ErrorService } from './error.service';
import { ErrorDto } from '../dto/error-dto';

@Controller('error')
export class ErrorController {
  constructor(private readonly errorsService: ErrorService) {}
  @Post('/create')
  async createError(error: ErrorDto) {
    return this.errorsService.createError(error);
  }
}
