import { WebSocketGateway } from '@nestjs/websockets';
import { Socket, io } from 'socket.io-client';
import { EventPayload } from './event';
import { CarService } from '../car/car.service';
import { CarDto } from 'src/dto/car-dto';

const socketUrl = io('http://central-api:3000');

@WebSocketGateway({
  cors: '*',
})
@WebSocketGateway()
export class SocketGateway {
  public socketClient: Socket;

  constructor(private readonly carService: CarService) {
    this.socketClient = socketUrl;
  }

  onModuleInit() {
    this.registerConsumerEvents();
  }

  private registerConsumerEvents() {
    this.socketClient.on('fragment', (payload: EventPayload) => {
      switch (payload.type) {
        case 'ad_status.inactive':
          this.carService.updateCarStatus(
            payload.data.externalCarId,
            'INACTIVE',
          );
          break;
        case 'price.too_low':
          this.carService.deleteCar(payload.data.externalCarId);
          break;
        case 'price.updated':
          this.carService.updatePriceById(payload.data as CarDto);
          break;
        default:
          break;
      }
    });
  }
}
