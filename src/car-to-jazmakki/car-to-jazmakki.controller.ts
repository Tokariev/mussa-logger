import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarToJazmakkiService } from './car-to-jazmakki.service';
import { CarDto } from '../dto/car-dto';

@Controller('car-to-jazmakki')
export class CarToJazmakkiController {
  constructor(private readonly carToJazmakkiService: CarToJazmakkiService) {}

  @Post('/create')
  async createCarToJazmakki(@Body() carToJazmakki: CarDto) {
    return this.carToJazmakkiService.createCarToJazmakki(carToJazmakki);
  }

  @Get('/:externalCarId')
  async findById(@Param('externalCarId') externalCarId: string) {
    return this.carToJazmakkiService.findByExternalCarId(externalCarId);
  }
}
