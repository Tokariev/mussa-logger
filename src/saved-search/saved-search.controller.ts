import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SavedSearchService } from './saved-search.service';
import { SavedSearchCar } from 'src/schemas/saved-search-car.schema';

@Controller('saved-search')
export class SavedSearchController {
  constructor(private readonly savedSearchService: SavedSearchService) {}

  @Post('/car')
  async saveCar(@Body() car: SavedSearchCar) {
    return this.savedSearchService.saveCar(car);
  }

  @Get('/last-car/:externalCarId')
  async findLastByExternalCarIds(
    @Param('externalCarId') externalCarId: string,
  ) {
    return this.savedSearchService.findLastCar(externalCarId);
  }
}
