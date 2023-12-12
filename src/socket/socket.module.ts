import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

import { CarModule } from 'src/car/car.module';

@Module({
  imports: [CarModule],
  providers: [SocketGateway],
})
export class SocketModule {}
