import { Module } from '@nestjs/common';
import { SavedSearchService } from './saved-search.service';
import { SavedSearchController } from './saved-search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SavedSearchCar,
  SavedSearchCarSchema,
} from 'src/schemas/saved-search-car.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedSearchCar.name, schema: SavedSearchCarSchema },
    ]),
  ],
  controllers: [SavedSearchController],
  providers: [SavedSearchService],
})
export class SavedSearchModule {}
