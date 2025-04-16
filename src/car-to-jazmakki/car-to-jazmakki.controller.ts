import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarToJazmakkiService } from './car-to-jazmakki.service';
import { Logger } from '@nestjs/common';

@Controller('car-to-jazmakki')
export class CarToJazmakkiController {
  constructor(private readonly carToJazmakkiService: CarToJazmakkiService) {}

  private logger = new Logger(CarToJazmakkiController.name);

  @Post('/create')
  async createCarToJazmakki(@Body() carToJazmakki: any) {
    return this.carToJazmakkiService.createCarToJazmakki(carToJazmakki);
  }

  @Get('/:externalCarId')
  async findById(@Param('externalCarId') externalCarId: string) {
    return this.carToJazmakkiService.findByExternalCarId(externalCarId);
  }
}
