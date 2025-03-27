import { Body, Controller, Post } from '@nestjs/common';
import { DataflowService } from './dataflow.service';

// Dataflow should accept any data

@Controller('dataflow')
export class DataflowController {
  constructor(private readonly dataflowService: DataflowService) {}

  @Post()
  async createDataflow(@Body() dataflow: any) {
    return this.dataflowService.createDataflow(dataflow);
  }
}
