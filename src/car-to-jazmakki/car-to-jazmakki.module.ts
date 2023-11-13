import { Module } from '@nestjs/common';
import { CarToJazmakkiService } from './car-to-jazmakki.service';
import { CarToJazmakkiController } from './car-to-jazmakki.controller';

@Module({
  controllers: [CarToJazmakkiController],
  providers: [CarToJazmakkiService]
})
export class CarToJazmakkiModule {}
