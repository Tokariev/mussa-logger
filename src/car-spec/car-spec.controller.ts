import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CarSpecService } from './car-spec.service';
import {
  CarSpecSearchResponseDto,
  CreateCarSpecDto,
  SearchCriteriaDto,
} from '@shared/types';
import { CarSpecDocument } from 'src/schemas/car-spec.schema';

@Controller('car-spec')
export class CarSpecController {
  constructor(private readonly carSpecService: CarSpecService) {}

  @Post()
  async createCarSpec(
    @Body() carSpecData: CreateCarSpecDto,
  ): Promise<CarSpecDocument> {
    return this.carSpecService.createCarSpec(carSpecData);
  }

  @Get()
  async findCarSpecByExternalId(
    @Query('externalCarId') externalCarId: string,
  ): Promise<CarSpecDocument | null> {
    return this.carSpecService.findCarSpecByExternalCarId(externalCarId);
  }

  @Post('search-cars-by-spec-range')
  async findCarsBySpecifications(
    @Body() carSpecRangeDto: SearchCriteriaDto,
  ): Promise<any> {
    return this.carSpecService.findCarsBySpecifications(carSpecRangeDto);
  }
}
