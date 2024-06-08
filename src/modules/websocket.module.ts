import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './websocket.gateway';
import { SocketService } from './websocket.service';

@Global()
@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class WebSocketModule {}
